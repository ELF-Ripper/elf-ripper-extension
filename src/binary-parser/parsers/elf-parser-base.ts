import { DictionaryType, FileInfo } from "../types";
import * as ElfStruct from "../types/elf/elf-structures";
import { getElfClass, getElfEndianess } from "../utils/dictionary/mapping-functions";
import { checkMachineType } from "../utils/parser-utils";

export abstract class ELF_ParserBase {
  protected elfData: FileInfo;
  protected _class: DictionaryType;
  protected _endianess: DictionaryType;
  protected _machine: DictionaryType;
  protected e_ident!: ElfStruct.Elf_Eident;

  constructor(elfData: FileInfo) {
    this.elfData = elfData;

    const { Properties } = this.extractProperties(this.elfData.fileContent!);
    this._class = Properties.Class;
    this._endianess = Properties.Endianess;
    this._machine = Properties.Machine;
  }

  private extractProperties(fileContent: Buffer): {
    Properties: {
      Class: DictionaryType;
      Endianess: DictionaryType;
      Machine: DictionaryType;
    };
    e_ident: ElfStruct.Elf_Eident;
  } {
    const e_ident = this.parseEIdent(fileContent);
    this.e_ident = e_ident;

    const classProperty = getElfClass(e_ident.EI_CLASS);
    const endianessProperty = getElfEndianess(e_ident.EI_DATA);
    const machineProperty = checkMachineType(fileContent, endianessProperty);

    const Properties = {
      Class: classProperty,
      Endianess: endianessProperty,
      Machine: machineProperty,
    };

    return { Properties, e_ident };
  }

  private parseEIdent(fileContent: Buffer): ElfStruct.Elf_Eident {
    try {
      // Ensure the buffer has enough data to contain the e_ident section
      if (fileContent.length < ElfStruct.EI_NIDENT) {
        throw new Error("File too short.");
      }

      // Extract the e_ident buffer from the ELF header
      const e_identBuffer = fileContent.slice(0, ElfStruct.EI_NIDENT);

      // Parse the e_ident fields
      const e_ident: ElfStruct.Elf_Eident = {
        EI_MAG0: e_identBuffer.readUInt8(0),
        EI_MAG1: e_identBuffer.readUInt8(1),
        EI_MAG2: e_identBuffer.readUInt8(2),
        EI_MAG3: e_identBuffer.readUInt8(3),
        EI_CLASS: e_identBuffer.readUInt8(4),
        EI_DATA: e_identBuffer.readUInt8(5),
        EI_VERSION: e_identBuffer.readUInt8(6),
        EI_OSABI: e_identBuffer.readUInt8(7),
        EI_ABIVERSION: e_identBuffer.readUInt8(8),
        EI_PAD: [...e_identBuffer.slice(9, 16)],
      };

      // Check if the file starts with the ELF magic number
      const ELF_MAGIC_NUMBER = Buffer.from([0x7f, 0x45, 0x4c, 0x46]); // [127, 69, 76, 70]
      if (!ELF_MAGIC_NUMBER.equals(e_identBuffer.slice(0, 4))) {
        throw new Error("Magic number mismatch.");
      }

      return e_ident;
    } catch (error) {
      throw new Error(`Not a valid ELF file: ${error.message}`);
    }
  }

  abstract parse(...args: any[]): unknown;
}
