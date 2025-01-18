import { ELF_ParserBase } from "../elf-parser-base";
import { FileInfo } from "../../types";
import { SectionHeaders_ } from "../../types/elf/elf-parsers-returns";
import * as ElfStruct from "../../types/elf/elf-structures";
import { readUInt32, readUInt64, readNullTerminatedStrings } from "../../utils/parser-utils";
import { defaultShdrOffsets } from "../../utils/elf-offset-values";

export class SectionHeaders extends ELF_ParserBase {
  private output!: SectionHeaders_;

  constructor(elfData: FileInfo) {
    super(elfData);
  }

  parse(
    e_shoff: number,
    e_shentsize: number,
    e_shnum: number,
    e_shstrndx: number,
  ): SectionHeaders_ {
    // Access shared properties and methods from the parent class
    const fileContent = this.elfData.fileContent!;
    const sectionHeaderOffset = e_shoff;
    const sectionHeaderEntrySize = e_shentsize;
    const sectionHeaderEntryCount = e_shnum;
    const sectionHeaderStrTabIndex = e_shstrndx;

    // Create and initiate an empty object with the output lookalike
    const sections: SectionHeaders_ = [];

    // Iterate over each section header entry to parse its details
    for (let i = 0; i < sectionHeaderEntryCount; i++) {
      const entryOffset = sectionHeaderOffset + i * sectionHeaderEntrySize;

      // Parse the section header entry
      const sectionHeader = this.parseSectionHeader(fileContent, entryOffset);

      // Push the parsed section header into the sections array
      sections.push({ Header: sectionHeader, Name: "" });
    }

    // Retrieve the offset for the Section Header String Table
    const sectionHeaderStrTabOffset = this.findSectionHeaderStringTable(
      sections,
      sectionHeaderStrTabIndex,
    );

    // Populate the Name property for each section header
    for (let i = 0; i < sections.length; i++) {
      const sectionName = readNullTerminatedStrings(
        fileContent,
        sectionHeaderStrTabOffset + sections[i].Header.sh_name,
      );
      sections[i].Name = sectionName;
    }

    this.output = sections;
    return this.output;
  }

  private parseSectionHeader(
    fileContent: Buffer,
    entryOffset: number,
  ): ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr {
    // Access shared properties and methods from the parent class
    const classType = this._class as "ELF32" | "ELF64";

    if (this._class === "ELF32") {
      return {
        sh_name: readUInt32(fileContent, entryOffset + defaultShdrOffsets.sh_name, this._endianess),
        sh_type: readUInt32(fileContent, entryOffset + defaultShdrOffsets.sh_type, this._endianess),
        sh_flags: readUInt32(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_flags,
          this._endianess,
        ),
        sh_addr: readUInt32(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_addr[classType],
          this._endianess,
        ),
        sh_offset: readUInt32(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_offset[classType],
          this._endianess,
        ),
        sh_size: readUInt32(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_size[classType],
          this._endianess,
        ),
        sh_link: readUInt32(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_link[classType],
          this._endianess,
        ),
        sh_info: readUInt32(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_info[classType],
          this._endianess,
        ),
        sh_addralign: readUInt32(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_addralign[classType],
          this._endianess,
        ),
        sh_entsize: readUInt32(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_entsize[classType],
          this._endianess,
        ),
      };
    } else {
      return {
        sh_name: readUInt32(fileContent, entryOffset + defaultShdrOffsets.sh_name, this._endianess),
        sh_type: readUInt32(fileContent, entryOffset + defaultShdrOffsets.sh_type, this._endianess),
        sh_flags: readUInt64(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_flags,
          this._endianess,
        ),

        sh_addr: readUInt64(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_addr[classType],
          this._endianess,
        ),
        sh_offset: readUInt64(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_offset[classType],
          this._endianess,
        ),
        sh_size: readUInt64(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_size[classType],
          this._endianess,
        ),
        sh_link: readUInt32(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_link[classType],
          this._endianess,
        ),
        sh_info: readUInt32(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_info[classType],
          this._endianess,
        ),
        sh_addralign: readUInt64(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_addralign[classType],
          this._endianess,
        ),
        sh_entsize: readUInt64(
          fileContent,
          entryOffset + defaultShdrOffsets.sh_entsize[classType],
          this._endianess,
        ),
      };
    }
  }

  private findSectionHeaderStringTable(
    sections: SectionHeaders_,
    sectionHeaderStrTabIndex: number,
  ): number {
    // Retrieve the sh_offset corresponding to the index of sectionHeaderStrTabIndex
    if (sectionHeaderStrTabIndex < 0 || sectionHeaderStrTabIndex >= sections.length) {
      throw new Error("Invalid e_shstrndx (Section Header String Table Index). Cannot Procced! ");
    }

    const sectionHeaderStrTabOffset = sections[sectionHeaderStrTabIndex].Header.sh_offset;

    return sectionHeaderStrTabOffset;
  }
}
