import { ELF_ParserBase } from "../elf-parser-base";
import { FileInfo } from "../../types";
import { SectionHeaders_, SymbolTables_ } from "../../types/elf/elf-parsers-returns";
import * as ElfStruct from "../../types/elf/elf-structures";
import {
  readUInt16,
  readUInt32,
  readUInt64,
  readNullTerminatedStrings,
} from "../../utils/parser-utils";
import { defaultSymOffsets } from "../../utils/elf-offset-values";

export class SymbolTables extends ELF_ParserBase {
  private output!: SymbolTables_;

  constructor(elfData: FileInfo) {
    super(elfData);
  }

  parse(sections: SectionHeaders_): SymbolTables_ {
    // Access shared properties and methods from the parent class
    const fileContent = this.elfData.fileContent!;

    // Create and initiate an empty object with the output lookalike
    const symbolsTables: SymbolTables_ = {
      dynsym: [],
      symtab: [],
    };

    // Calculate the offset of the String Table (.strtab) and Dynamic String Table (.dynstr)
    const { dynsymStrTabOffset, symtabStrTabOffset } = this.findStringTables(sections);

    if (symtabStrTabOffset === -1) {
      throw new Error("String Table (.strtab) not found. Cannot proceed.");
    }

    for (const section of sections) {
      if (section.Header.sh_type === 2) {
        // SHT_SYMTAB
        const symbolTableEntries = this.parseSymbol(fileContent, section, symtabStrTabOffset);
        symbolsTables.symtab.push(...symbolTableEntries);
      } else if (section.Header.sh_type === 11) {
        // SHT_DYNSYM
        const symbolTableEntries = this.parseSymbol(fileContent, section, dynsymStrTabOffset);
        symbolsTables.dynsym.push(...symbolTableEntries);
      }
    }

    this.output = symbolsTables;
    return this.output;
  }

  private parseSymbol(
    fileContent: Buffer,
    section: { Header: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr; Name: string },
    strTabOffset: number,
  ): { Header: ElfStruct.Elf32_Sym | ElfStruct.Elf64_Sym; Name: string }[] {
    const symbolTable: { Header: ElfStruct.Elf32_Sym | ElfStruct.Elf64_Sym; Name: string }[] = [];
    const entrySize = this._class === "ELF32" ? 16 : 24;
    const numEntries = section.Header.sh_size / entrySize;

    for (let i = 0; i < numEntries; i++) {
      const offset = section.Header.sh_offset + i * entrySize;
      const symbol = this.parseSymbolHeaderEntry(fileContent, offset);
      const name = readNullTerminatedStrings(fileContent, strTabOffset + symbol.st_name);
      symbolTable.push({ Header: symbol, Name: name });
    }

    return symbolTable;
  }

  private parseSymbolHeaderEntry(
    fileContent: Buffer,
    offset: number,
  ): ElfStruct.Elf32_Sym | ElfStruct.Elf64_Sym {
    // Access shared properties and methods from the parent class
    const classType = this._class as "ELF32" | "ELF64";

    if (this._class === "ELF32") {
      return {
        st_name: readUInt32(fileContent, offset + defaultSymOffsets.st_name, this._endianess),
        st_value: readUInt32(
          fileContent,
          offset + defaultSymOffsets.st_value[classType],
          this._endianess,
        ),
        st_size: readUInt32(
          fileContent,
          offset + defaultSymOffsets.st_size[classType],
          this._endianess,
        ),
        st_info: fileContent.readUInt8(offset + defaultSymOffsets.st_info[classType]),
        st_other: fileContent.readUInt8(offset + defaultSymOffsets.st_other[classType]),
        st_shndx: readUInt16(
          fileContent,
          offset + defaultSymOffsets.st_shndx[classType],
          this._endianess,
        ),
      };
    } else {
      return {
        st_name: readUInt32(fileContent, offset + defaultSymOffsets.st_name, this._endianess),
        st_info: fileContent.readUInt8(offset + defaultSymOffsets.st_info[classType]),
        st_other: fileContent.readUInt8(offset + defaultSymOffsets.st_other[classType]),
        st_shndx: readUInt16(
          fileContent,
          offset + defaultSymOffsets.st_shndx[classType],
          this._endianess,
        ),
        st_value: readUInt64(
          fileContent,
          offset + defaultSymOffsets.st_value[classType],
          this._endianess,
        ),
        st_size: readUInt64(
          fileContent,
          offset + defaultSymOffsets.st_size[classType],
          this._endianess,
        ),
      };
    }
  }

  private findStringTables(Sections: SectionHeaders_): {
    dynsymStrTabOffset: number;
    symtabStrTabOffset: number;
  } {
    let dynsymStrTabOffset = -1;
    let symtabStrTabOffset = -1;

    // Iterate through section headers to find ".strtab" and ".dynstr"
    for (let i = 0; i < Sections.length; i++) {
      const section = Sections[i].Header;
      const sectionName = Sections[i].Name;

      // Check if the section is ".strtab" or ".dynstr"
      if (sectionName === ".strtab") {
        symtabStrTabOffset = section.sh_offset;
      } else if (sectionName === ".dynstr") {
        dynsymStrTabOffset = section.sh_offset;
      }

      // Break the loop if both string tables are found
      if (dynsymStrTabOffset !== -1 && symtabStrTabOffset !== -1) {
        break;
      }
    }

    return { dynsymStrTabOffset, symtabStrTabOffset };
  }
}
