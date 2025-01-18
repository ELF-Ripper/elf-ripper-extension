import { ELF_ParserBase } from "../elf-parser-base";
import { FileInfo } from "../../types";
import { elfHeaders_ } from "../../types/elf/elf-parsers-returns";
import { readUInt16, readUInt32, readUInt64 } from "../../utils/parser-utils";
import { defaultEhdrOffsets } from "../../utils/elf-offset-values";

export class Header extends ELF_ParserBase {
  private output!: elfHeaders_;

  constructor(elfData: FileInfo) {
    super(elfData);
  }

  parse(): elfHeaders_ {
    // Access shared properties and methods from the parent class
    const fileContent = this.elfData.fileContent!;
    const classType = this._class as "ELF32" | "ELF64";

    this.output = {
      e_ident: this.e_ident,
      e_type: readUInt16(fileContent, defaultEhdrOffsets.e_type, this._endianess),
      e_machine: readUInt16(fileContent, defaultEhdrOffsets.e_machine, this._endianess),
      e_version: readUInt32(fileContent, defaultEhdrOffsets.e_version, this._endianess),
      e_entry:
        this._class === "ELF32"
          ? readUInt32(fileContent, defaultEhdrOffsets.e_entry, this._endianess)
          : readUInt64(fileContent, defaultEhdrOffsets.e_entry, this._endianess),
      e_phoff:
        this._class === "ELF32"
          ? readUInt32(fileContent, defaultEhdrOffsets.e_phoff[classType], this._endianess)
          : readUInt64(fileContent, defaultEhdrOffsets.e_phoff[classType], this._endianess),
      e_shoff:
        this._class === "ELF32"
          ? readUInt32(fileContent, defaultEhdrOffsets.e_shoff[classType], this._endianess)
          : readUInt64(fileContent, defaultEhdrOffsets.e_shoff[classType], this._endianess),
      e_flags: readUInt32(fileContent, defaultEhdrOffsets.e_flags[classType], this._endianess),
      e_ehsize: readUInt16(fileContent, defaultEhdrOffsets.e_ehsize[classType], this._endianess),
      e_phentsize: readUInt16(
        fileContent,
        defaultEhdrOffsets.e_phentsize[classType],
        this._endianess,
      ),
      e_phnum: readUInt16(fileContent, defaultEhdrOffsets.e_phnum[classType], this._endianess),
      e_shentsize: readUInt16(
        fileContent,
        defaultEhdrOffsets.e_shentsize[classType],
        this._endianess,
      ),
      e_shnum: readUInt16(fileContent, defaultEhdrOffsets.e_shnum[classType], this._endianess),
      e_shstrndx: readUInt16(
        fileContent,
        defaultEhdrOffsets.e_shstrndx[classType],
        this._endianess,
      ),
    };

    return this.output;
  }
}
