import { ELF_ParserBase } from "../elf-parser-base";
import { FileInfo } from "../../types";
import { SectionHeaders_, Notes_ } from "../../types/elf/elf-parsers-returns";
import * as ElfStruct from "../../types/elf/elf-structures";
import { readUInt32, readNullTerminatedStrings } from "../../utils/parser-utils";
import { defaultNotesOffsets } from "../../utils/elf-offset-values";

export class Notes extends ELF_ParserBase {
  private output!: Notes_;

  constructor(elfData: FileInfo) {
    super(elfData);
  }

  parse(sections: SectionHeaders_): Notes_ {
    // Access shared properties and methods from the parent class
    const fileContent = this.elfData.fileContent!;

    // Create and initiate an empty object with the output lookalike
    const notes: Notes_ = [];

    for (const section of sections) {
      if (section.Header.sh_type === 7) {
        // SHT_NOTE
        const noteSectionOffset = section.Header.sh_offset;
        const noteSectionSize = section.Header.sh_size;
        const noteSectionName = section.Name;

        for (let i = 0; i < noteSectionSize; ) {
          const entry = this.parseNoteEntry(fileContent, noteSectionOffset + i, noteSectionName);
          notes.push(entry);

          // Move the iterator based on the size of the current entry
          i += 12 + entry.Table.n_namesz + entry.Table.n_descsz;
        }
      }
    }

    this.output = notes;
    return this.output;
  }
  private parseNoteEntry(
    fileContent: Buffer,
    offset: number,
    sectionName: string,
  ): {
    Table: ElfStruct.Elf32_Nhdr | ElfStruct.Elf64_Nhdr;
    Name: string;
    Description: Buffer;
    Section: string;
  } {
    const namesz = readUInt32(fileContent, offset + defaultNotesOffsets.n_namesz, this._endianess);
    const descsz = readUInt32(fileContent, offset + defaultNotesOffsets.n_descsz, this._endianess);
    const type = readUInt32(fileContent, offset + defaultNotesOffsets.n_type, this._endianess);

    const nameStartOffset = offset + 12;
    const descStartOffset = nameStartOffset + namesz;

    const ownerName = readNullTerminatedStrings(fileContent, nameStartOffset);
    const desc = fileContent.slice(descStartOffset, descStartOffset + descsz);

    const parsedEntry = {
      Table: { n_namesz: namesz, n_descsz: descsz, n_type: type },
      Name: ownerName,
      Description: desc,
      Section: sectionName,
    };

    return parsedEntry;
  }
}
