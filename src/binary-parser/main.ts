import { ELF_ParserFactory, LinkerScriptParser, MapFileParser } from "./parsers";
import { FileInfo, Memory, SuperELF } from "./types";

/**
 * Main class to manage parsing of ELF files, linker scripts, and map files.
 * This class provides methods to parse these files and return structured data.
 */
export class Main {
  private elfParser?: ELF_ParserFactory;
  private ldParser?: LinkerScriptParser;
  private mapParser?: MapFileParser;

  /**
   * Parses the ELF file with the given metadata and returns the parsed ELF object.
   * Initializes an ELF parser factory with the provided ELF data and uses it to parse the data.
   * @param elfData The ELF file data to initialize the parser factory and parse.
   * @returns An object containing the parsed ELF data.
   * @throws Error If the ELF file is invalid or if there are issues during parsing within the ELF parser factory.
   */
  public parseElf(elfData: FileInfo): SuperELF {
    try {
      this.elfParser = new ELF_ParserFactory(elfData);
      return this.elfParser.parseElf();
    } catch (error) {
      throw new Error(`Failed to parse ELF file: ${error.message}`);
    }
  }

  /**
   * Parses the linker script file with the given metadata and returns the parsed Memory objects.
   * Initializes a linker script parser with the provided data and uses it to parse the data.
   * @param ldData The linker script file data to initialize the parser and parse.
   * @returns An array of Memory objects parsed from the linker script.
   * @throws Error If there are issues during parsing within the linker script parser.
   */
  public parseLinkerScript(ldData: FileInfo): Memory[] {
    try {
      this.ldParser = new LinkerScriptParser(ldData);
      return this.ldParser.parse();
    } catch (error) {
      throw new Error(`Failed to parse LinkerScript file: ${error.message}`);
    }
  }

  /**
   * Parses the map file with the given metadata and returns the parsed Memory objects.
   * Initializes a map file parser with the provided data and uses it to parse the data.
   * @param mapData The map file data to initialize the parser and parse.
   * @returns An array of Memory objects parsed from the map file.
   * @throws Error If there are issues during parsing within the map file parser.
   */
  public parseMapFile(mapData: FileInfo): Memory[] {
    try {
      this.mapParser = new MapFileParser(mapData);
      return this.mapParser.parse();
    } catch (error) {
      throw new Error(`Failed to parse Map file: ${error.message}`);
    }
  }
}
