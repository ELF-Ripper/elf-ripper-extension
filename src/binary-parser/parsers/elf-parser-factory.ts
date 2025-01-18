import { FileInfo, SuperELF } from "../types";
import {
  ElfHeader,
  ProgramHeaders,
  SectionHeaders,
  SymbolTables,
  RelocationTables,
  DynamicTags,
  Notes,
} from "./elf";

/**
 * Factory class for creating and managing ELF parsers.
 * This class encapsulates the logic to initialize and use various ELF parsers,
 * and provides a method to parse ELF metadata into a structured object.
 */
class ELF_ParserFactory {
  // The ELF file metadata to be parsed
  private elfData: FileInfo;

  /**
   * Constructs an instance of ELF_ParserFactory.
   * @param elfData The ELF file data to be parsed.
   */
  constructor(elfData: FileInfo) {
    this.elfData = elfData;
  }

  /**
   * Creates and initializes all the necessary ELF parsers.
   * This method instantiates each specific parser class with the ELF metadata.
   * @returns An object containing all initialized ELF parsers.
   */
  private createParsers() {
    return {
      ElfHeader: new ElfHeader(this.elfData),
      ProgramHeaders: new ProgramHeaders(this.elfData),
      SectionHeaders: new SectionHeaders(this.elfData),
      SymbolTables: new SymbolTables(this.elfData),
      RelocationTables: new RelocationTables(this.elfData),
      DynamicTags: new DynamicTags(this.elfData),
      Notes: new Notes(this.elfData),
    };
  }

  /**
   * Parses the ELF metadata using the initialized parsers and returns a structured ELF object.
   * This method sequentially uses each parser to extract different components of the ELF file.
   * @returns An object of type SuperELF containing all parsed ELF data.
   */
  public parseElf(): SuperELF {
    const parsers = this.createParsers();

    // Parse each component of the ELF file
    const header = parsers.ElfHeader.parse();
    const programHeaders = parsers.ProgramHeaders.parse(
      header.e_phoff,
      header.e_phentsize,
      header.e_phnum,
    );
    const sections = parsers.SectionHeaders.parse(
      header.e_shoff,
      header.e_shentsize,
      header.e_shnum,
      header.e_shstrndx,
    );
    const symbols = parsers.SymbolTables.parse(sections);
    const relocations = parsers.RelocationTables.parse(sections);
    const dynamicTags = parsers.DynamicTags.parse(sections, programHeaders);
    const notes = parsers.Notes.parse(sections);

    // Return a structured ELF object containing all parsed data
    return {
      Header: header,
      ProgramHeaders: programHeaders,
      Sections: sections,
      Symbols: symbols,
      Relocs: relocations,
      DynTags: dynamicTags,
      Notes: notes,
    };
  }
}

export { ELF_ParserFactory };
