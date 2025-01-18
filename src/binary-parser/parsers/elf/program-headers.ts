import { ELF_ParserBase } from "../elf-parser-base";
import { FileInfo } from "../../types";
import { ProgramHeaders_ } from "../../types/elf/elf-parsers-returns";
import * as ElfStruct from "../../types/elf/elf-structures";
import { readUInt32, readUInt64 } from "../../utils/parser-utils";
import { defaultPhdrOffsets } from "../../utils/elf-offset-values";

export class ProgramHeaders extends ELF_ParserBase {
  private output!: ProgramHeaders_;

  constructor(elfData: FileInfo) {
    super(elfData);
  }

  parse(e_phoff: number, e_phentsize: number, e_phnum: number): ProgramHeaders_ {
    // Access shared properties and methods from the parent class
    const fileContent = this.elfData.fileContent!;
    const programHeaderOffset = e_phoff;
    const programHeaderEntrySize = e_phentsize;
    const programHeaderEntryCount = e_phnum;

    // Create and initiate an empty object with the output lookalike
    const programHeaders: ProgramHeaders_ = [];

    // Iterate over each program header entry to parse its details
    for (let i = 0; i < programHeaderEntryCount; i++) {
      const entryOffset = programHeaderOffset + i * programHeaderEntrySize;

      // Parse the program header entry
      const programHeader = this.parseProgramHeader(fileContent, entryOffset);
      programHeaders.push(programHeader);
    }

    // Store the parsed program headers and return the object
    this.output = programHeaders;
    return this.output;
  }

  private parseProgramHeader(
    fileContent: Buffer,
    entryOffset: number,
  ): ElfStruct.Elf32_Phdr | ElfStruct.Elf64_Phdr {
    // Access shared properties and methods from the parent class
    const classType = this._class as "ELF32" | "ELF64";

    if (this._class === "ELF32") {
      return {
        p_type: readUInt32(fileContent, entryOffset + defaultPhdrOffsets.p_type, this._endianess),
        p_offset: readUInt32(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_offset[classType],
          this._endianess,
        ),
        p_vaddr: readUInt32(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_vaddr[classType],
          this._endianess,
        ),
        p_paddr: readUInt32(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_paddr[classType],
          this._endianess,
        ),
        p_filesz: readUInt32(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_filesz[classType],
          this._endianess,
        ),
        p_memsz: readUInt32(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_memsz[classType],
          this._endianess,
        ),
        p_flags: readUInt32(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_flags[classType],
          this._endianess,
        ),
        p_align: readUInt32(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_align[classType],
          this._endianess,
        ),
      };
    } else {
      return {
        p_type: readUInt32(fileContent, entryOffset + defaultPhdrOffsets.p_type, this._endianess),
        p_flags: readUInt32(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_flags[classType],
          this._endianess,
        ),
        p_offset: readUInt64(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_offset[classType],
          this._endianess,
        ),
        p_vaddr: readUInt64(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_vaddr[classType],
          this._endianess,
        ),
        p_paddr: readUInt64(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_paddr[classType],
          this._endianess,
        ),
        p_filesz: readUInt64(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_filesz[classType],
          this._endianess,
        ),
        p_memsz: readUInt64(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_memsz[classType],
          this._endianess,
        ),
        p_align: readUInt64(
          fileContent,
          entryOffset + defaultPhdrOffsets.p_align[classType],
          this._endianess,
        ),
      };
    }
  }
}
