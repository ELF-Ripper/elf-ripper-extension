import { ELF_ParserBase } from "../elf-parser-base";
import { FileInfo } from "../../types";
import { SectionHeaders_, RelocationTables_ } from "../../types/elf/elf-parsers-returns";
import * as ElfStruct from "../../types/elf/elf-structures";
import { readUInt32, readUInt64 } from "../../utils/parser-utils";
import { defaultRelocsOffsets } from "../../utils/elf-offset-values";

export class RelocationTables extends ELF_ParserBase {
  private output!: RelocationTables_;

  constructor(elfData: FileInfo) {
    super(elfData);
  }

  parse(sections: SectionHeaders_): RelocationTables_ {
    // Access shared properties and methods from the parent class
    const fileContent = this.elfData.fileContent!;

    // Create and initiate an empty object with the output lookalike
    const relocations: RelocationTables_ = {
      rel: [],
      rela: [],
    };

    for (const section of sections) {
      if (section.Header.sh_type === 9) {
        // Parse `.rel` section -> "SHT_REL"
        const relEntries = this.parseRelSection(fileContent, section.Header);
        relocations.rel.push(...relEntries);
      } else if (section.Header.sh_type === 4) {
        // Parse `.rela` section -> "SHT_RELA"
        const relaEntries = this.parseRelaSection(fileContent, section.Header);
        relocations.rela.push(...relaEntries);
      }
    }
    if (!relocations.rel.length && !relocations.rela.length) {
      console.warn("There are no relocation sections in this file.");
    }

    this.output = relocations;
    return this.output;
  }

  private parseRelSection(
    fileContent: Buffer,
    sectionHeader: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr,
  ): (ElfStruct.Elf32_Rel | ElfStruct.Elf64_Rel)[] {
    // Access shared properties and methods from the parent class
    const classType = this._class as "ELF32" | "ELF64";

    const relEntries: (ElfStruct.Elf32_Rel | ElfStruct.Elf64_Rel)[] = [];
    const entrySize = this._class === "ELF32" ? 8 : 16; // Size of each entry in bytes

    for (let i = 0; i < sectionHeader.sh_size; i += entrySize) {
      const offset = sectionHeader.sh_offset + i;

      if (this._class === "ELF32") {
        // Parse Elf32_Rel entry
        const entry: ElfStruct.Elf32_Rel = {
          r_offset: readUInt32(
            fileContent,
            offset + defaultRelocsOffsets.r_offset[classType],
            this._endianess,
          ),
          r_info: readUInt32(
            fileContent,
            offset + defaultRelocsOffsets.r_info[classType],
            this._endianess,
          ),
        };
        relEntries.push(entry);
      } else {
        // Parse Elf64_Rel entry
        const entry: ElfStruct.Elf64_Rel = {
          r_offset: readUInt64(
            fileContent,
            offset + defaultRelocsOffsets.r_offset[classType],
            this._endianess,
          ),
          r_info: readUInt64(
            fileContent,
            offset + defaultRelocsOffsets.r_info[classType],
            this._endianess,
          ),
        };
        relEntries.push(entry);
      }
    }

    return relEntries;
  }

  private parseRelaSection(
    fileContent: Buffer,
    sectionHeader: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr,
  ): (ElfStruct.Elf32_Rela | ElfStruct.Elf64_Rela)[] {
    // Access shared properties and methods from the parent class
    const classType = this._class as "ELF32" | "ELF64";

    const relaEntries: (ElfStruct.Elf32_Rela | ElfStruct.Elf64_Rela)[] = [];
    const entrySize = this._class === "ELF32" ? 12 : 24; // Size of each entry in bytes

    for (let i = 0; i < sectionHeader.sh_size; i += entrySize) {
      const offset = sectionHeader.sh_offset + i;

      if (this._class === "ELF32") {
        // Parse Elf32_Rela entry
        const entry: ElfStruct.Elf32_Rela = {
          r_offset: readUInt32(
            fileContent,

            offset + defaultRelocsOffsets.r_offset[classType],
            this._endianess,
          ),
          r_info: readUInt32(
            fileContent,
            offset + defaultRelocsOffsets.r_info[classType],
            this._endianess,
          ),
          r_addend: readUInt32(
            fileContent,
            offset + defaultRelocsOffsets.r_addend[classType],
            this._endianess,
          ),
        };
        relaEntries.push(entry);
      } else {
        // Parse Elf64_Rela entry
        const entry: ElfStruct.Elf64_Rela = {
          r_offset: readUInt64(
            fileContent,
            offset + defaultRelocsOffsets.r_offset[classType],
            this._endianess,
          ),
          r_info: readUInt64(
            fileContent,
            offset + defaultRelocsOffsets.r_info[classType],
            this._endianess,
          ),
          r_addend: readUInt64(
            fileContent,
            offset + defaultRelocsOffsets.r_addend[classType],
            this._endianess,
          ),
        };
        relaEntries.push(entry);
      }
    }

    return relaEntries;
  }
}
