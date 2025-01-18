import { FileInfo } from "../types/file-info";
import { Memory } from "../types/memory-structure";
import { parseNumericValue, convertSizeToBytes } from "../utils/parser-utils";

export class LinkerScriptParser {
  private ldData: FileInfo;

  constructor(ldData: FileInfo) {
    this.ldData = ldData;
  }

  parse(): Memory[] {
    const fileContent = this.ldData.fileContent!.toString();

    // Regular expression to match MEMORY definitions
    const memoryRegex = /MEMORY\s*{([^}]*)}/gs;
    const match = memoryRegex.exec(fileContent);
    if (!match) {
      throw new Error("Invalid linker script format: MEMORY section not found.");
    }

    const memoryDefinitions = match[1].trim().split("\n");
    return memoryDefinitions.map(def => this.parseMemoryDefinition(def));
  }

  private parseMemoryDefinition(def: string): Memory {
    const parts = def.trim().split(/\s*:\s*/);
    if (parts.length !== 2) {
      throw new Error("Invalid memory definition: " + def);
    }
    const [namePart, optionsPart] = parts;

    const { name, attributes } = this.extractMemoryNameAndAttributes(namePart);
    const origin = this.extractOptionValue(optionsPart, ["ORIGIN", "org", "o"]);
    const length = this.extractOptionValue(optionsPart, ["LENGTH", "len", "l"]);

    if (origin === undefined || length === undefined) {
      throw new Error("Failed to parse origin or length in memory definition: " + def);
    }

    const fill = this.extractOptionValue(optionsPart, ["FILL", "fill", "f"]);
    const memory: Memory = { Name: name, Origin: origin, Length: length };

    if (fill !== undefined) {
      memory.Fill = fill;
    }

    if (attributes !== undefined) {
      memory.Attributes = attributes;
    }

    return memory;
  }

  private extractMemoryNameAndAttributes(namePart: string): { name: string; attributes?: string } {
    const nameMatch = /^[^\s(]+/.exec(namePart.trim());
    if (!nameMatch) {
      throw new Error("Failed to extract name from memory definition: " + namePart);
    }
    const name = nameMatch[0];
    const attributesMatch = /\(([^)]+)\)/.exec(namePart.trim());
    const attributes = attributesMatch ? attributesMatch[1] : undefined;

    return { name, attributes };
  }

  private extractOptionValue(optionsPart: string, optionSyntaxes: string[]): number | undefined {
    for (const syntax of optionSyntaxes) {
      const optionRegex = new RegExp(`${syntax}\\s*=\\s*(0x[0-9a-fA-F]+|\\d+)([KkMmGgTt]*)`, "i");
      const match = optionRegex.exec(optionsPart);
      if (match) {
        const value = parseNumericValue(match[1]);
        const unit = match[2].toLowerCase();
        const valueInBytes = convertSizeToBytes(value, unit);
        return valueInBytes;
      }
    }
    return undefined;
  }
}
