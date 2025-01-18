// Import processors for different sections of the ELF file
import {
  processHeader,
  processProgramHeaders,
  processSectionHeaders,
  processSymbolTables,
  processDynamicTags,
  processRelocations,
  processNotes,
  processMemory,
} from "./processors";

// Import types for the parsed data and ELF structure
import { ParsedObjects } from "./types";
import { SuperELF } from "../../binary-parser/types/super-elf";
import { Memory } from "../../binary-parser/types/memory-structure";
import { ProcessedData } from "../../app/contexts/data-context";

/**
 * The DataProcessor class handles the processing of parsed ELF and memory objects,
 * organizing them into structured data tables.
 */
export class DataProcessor {
  private elfObject?: SuperELF;
  private memoryObject?: Memory[];
  private elfFileName?: string;
  private memoryFileName?: string;

  /**
   * Constructs the DataProcessor with the given parsed objects.
   * @param parsedObjects - The parsed ELF and memory objects.
   */
  constructor(parsedObjects: ParsedObjects) {
    this.elfObject = parsedObjects.elfObject;
    this.memoryObject = parsedObjects.memoryObject;
    this.elfFileName = parsedObjects.elfFileName;
    this.memoryFileName = parsedObjects.memoryFileName;
  }

  /**
   * Processes the ELF and memory data and returns the result as an object.
   * @returns An object containing the processed data tables.
   */
  public processData(): ProcessedData {
    if (!this.elfObject) {
      throw new Error("ELF object is missing in the parsed raw data.");
    }

    const processedData = {
      ELF_FileName: this.elfFileName || "Unknown ELF File",
      Header_Table: processHeader(this.elfObject.Header),
      ProgramHeaders_Table: processProgramHeaders(this.elfObject.ProgramHeaders),
      SectionHeaders_Table: processSectionHeaders(this.elfObject.Sections),
      Symbols_Table: processSymbolTables(this.elfObject.Symbols),
      DynamicTags_Table: processDynamicTags(this.elfObject.DynTags),
      Relocations_Table: processRelocations(this.elfObject.Relocs, this.elfObject.Header),
      Notes_Table: processNotes(this.elfObject.Notes),
      BuildAnalyzer_Table: processMemory(this.elfObject, this.memoryObject),
    };

    if (this.memoryFileName) {
      return {
        ...processedData,
        Map_FileName: this.memoryFileName,
      };
    }

    return processedData;
  }
}
