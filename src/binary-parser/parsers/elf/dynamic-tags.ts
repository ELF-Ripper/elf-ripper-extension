import { ELF_ParserBase } from "../elf-parser-base";
import { FileInfo } from "../../types";
import {
  SectionHeaders_,
  ProgramHeaders_,
  DynamicTags_,
} from "../../types/elf/elf-parsers-returns";
import * as ElfStruct from "../../types/elf/elf-structures";
import { readUInt32, readUInt64 } from "../../utils/parser-utils";
import { defaultDynTagsOffsets } from "../../utils/elf-offset-values";

export class DynamicTags extends ELF_ParserBase {
  private output!: DynamicTags_;

  constructor(elfData: FileInfo) {
    super(elfData);
  }

  parse(sections: SectionHeaders_, programHeaders: ProgramHeaders_): DynamicTags_ {
    // Access shared properties and methods from the parent class
    const fileContent = this.elfData.fileContent!;

    // Create and initiate an empty object with the output lookalike
    const dynamicTags: DynamicTags_ = [];

    // Retrieve the offset and size of the Dynamic Tags Table (.dynamic section)
    const { dynamicTabOffset, dynamicTabSize } = this.findDynamicTagsTable(
      sections,
      programHeaders,
    );
    if (dynamicTabOffset === -1 || dynamicTabSize === 0) {
      console.warn("There is no dynamic section in this file.");
    }

    // Calculate the number of dynamic tag entries based on the size of each entry
    const entrySize = this._class === "ELF32" ? 8 : 16; // Size of each dynamic tag entry
    const numEntries = dynamicTabSize / entrySize;

    // Parse each dynamic tag entry
    let foundNull = false; // Flag to track if the first NULL entry has been found

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = dynamicTabOffset + i * entrySize;
      const dynamicTag = this.parseDynamicTag(fileContent, entryOffset);

      // Check if the dynamic tag is NULL (d_tag = 0)
      if (dynamicTag.d_tag === 0 && foundNull) {
        break; // Break out of the loop if the tag is NULL and the first NULL entry has been found
      }

      if (dynamicTag.d_tag === 0) {
        foundNull = true; // Set the flag to true if the first NULL entry is found
      }

      dynamicTags.push(dynamicTag);
    }

    this.output = dynamicTags;
    return this.output;
  }

  private parseDynamicTag(
    fileContent: Buffer,
    offset: number,
  ): ElfStruct.Elf32_Dyn | ElfStruct.Elf64_Dyn {
    // Access shared properties and methods from the parent class
    const classType = this._class as "ELF32" | "ELF64";

    if (this._class === "ELF32") {
      return {
        d_tag: readUInt32(fileContent, offset + defaultDynTagsOffsets.d_tag, this._endianess),
        d_un: readUInt32(
          fileContent,
          offset + defaultDynTagsOffsets.d_un[classType],
          this._endianess,
        ),
      };
    } else {
      return {
        d_tag: readUInt64(fileContent, offset + defaultDynTagsOffsets.d_tag, this._endianess),
        d_un: readUInt64(
          fileContent,
          offset + defaultDynTagsOffsets.d_un[classType],
          this._endianess,
        ),
      };
    }
  }

  private findDynamicTagsTable(
    Sections: SectionHeaders_,
    ProgramHeaders: ProgramHeaders_,
  ): { dynamicTabOffset: number; dynamicTabSize: number } {
    let dynamicTabOffset = -1;
    let dynamicTabSize = 0;

    // Search in section headers
    for (let i = 0; i < Sections.length; i++) {
      const sectionName = Sections[i].Name;
      if (sectionName === ".dynamic") {
        dynamicTabOffset = Sections[i].Header.sh_offset;
        dynamicTabSize = Sections[i].Header.sh_size;
        break; // Found the dynamic tags table in section headers
      }
    }

    // If not found in section headers, search in program headers
    if (dynamicTabOffset === -1) {
      for (let i = 0; i < ProgramHeaders.length; i++) {
        if (ProgramHeaders[i].p_type === 2) {
          // PT_DYNAMIC
          dynamicTabOffset = ProgramHeaders[i].p_offset;
          dynamicTabSize = ProgramHeaders[i].p_filesz;
          break; // Found the dynamic tags table in program headers
        }
      }
    }

    return { dynamicTabOffset, dynamicTabSize };
  }
}
