import { FileInfo } from "../types/file-info";
import { Memory } from "../types/memory-structure";
import { parseNumericValue } from "../utils/parser-utils";

export class MapFileParser {
  private mapData: FileInfo;

  constructor(mapData: FileInfo) {
    this.mapData = mapData;
  }

  parse(): Memory[] {
    const fileContent = this.mapData.fileContent!.toString();

    // Regular expression to match Memory Configuration block up to *default* line
    const memoryConfigRegex = /Memory Configuration\s*([\s\S]*?\*default\*.*)/;

    const match = memoryConfigRegex.exec(fileContent);
    if (!match) {
      throw new Error("Memory Configuration block not found in the .map file.");
    }
    const memoryConfig = match[1];
    return this.parseMemoryConfig(memoryConfig);
  }

  private parseMemoryConfig(memoryConfig: string): Memory[] {
    const lines = memoryConfig.trim().split("\n");

    if (lines.length <= 2) {
      throw new Error("Invalid Memory Configuration block.");
    }

    // Check the header line
    const header = lines[0].trim();
    if (!/^Name\s+Origin\s+Length\s+Attributes$/.test(header)) {
      throw new Error("Invalid Memory Configuration header.");
    }

    // Parse each memory definition
    const memories: Memory[] = [];
    for (let i = 1; i < lines.length; i++) {
      const memory = this.parseMemoryDefinition(lines[i]);
      if (memory) {
        memories.push(memory);
      }
    }

    return memories;
  }

  private parseMemoryDefinition(line: string): Memory | undefined {
    const parts = line.trim().split(/\s+/);
    if (parts.length !== 3 && parts.length !== 4) {
      console.warn(`Skipping invalid memory configuration line: ${line}`);
      return undefined;
    }

    const [name, origin, length, attributes] = parts;
    const parsedOrigin = parseNumericValue(origin);
    const parsedLength = parseNumericValue(length);

    if (isNaN(parsedOrigin) || isNaN(parsedLength)) {
      throw new Error(`Invalid Origin or Length value in memory definition: ${line}`);
    }

    if (name === "*default*") {
      return undefined;
    }

    return {
      Name: name,
      Origin: parsedOrigin,
      Length: parsedLength,
      Attributes: attributes,
    };
  }
}
