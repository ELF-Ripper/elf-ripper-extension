import fs from "fs";
import { samples } from "./sampleFiles";
import { FileInfo } from "../../../../src/binary-parser/types";
import * as ElfStruct from "../../../../src/binary-parser/types/elf/elf-structures";
import { Header } from "../../../../src/binary-parser/parsers/elf/header";
import { SectionHeaders } from "../../../../src/binary-parser/parsers/elf/section-headers";
import { Notes } from "../../../../src/binary-parser/parsers/elf/notes";
import { getSlicedBuffer, checkEndianess, writeUInt32 } from "./test-utils";

// Iterate over each sample
samples.forEach(({ filePath, fileName }) => {
  describe(`Integration tests for ${fileName}`, () => {
    let headerParser: Header;
    let sectionHeadersParser: SectionHeaders;
    let notesParser: Notes;
    let elfDataMock: FileInfo;

    beforeEach(() => {
      if (!filePath) {
        throw new Error("File path is not defined.");
      }
      // Load the content of the sample ELF file
      const fileContent = fs.readFileSync(filePath);

      // Create FileInfo object with sample file content
      elfDataMock = {
        filePath,
        fileContent,
        fileName,
      };

      headerParser = new Header(elfDataMock);
      sectionHeadersParser = new SectionHeaders(elfDataMock);
      notesParser = new Notes(elfDataMock);
    });

    test("Notes parsing and reconstruction", () => {
      // Parse header and retrieve required parameters for parsing the section headers from the sample
      const parsedHeader = headerParser.parse();
      const isLittle = checkEndianess(parsedHeader.e_ident.EI_DATA);

      const parsedSections = parseSectionHeaders(parsedHeader);

      // Parse the notes using the parsed sections headers
      const notes = notesParser.parse(parsedSections);

      // Step 1: Retrieve content buffers for the sliced notes
      const slicedNotesBuffers = getSlicedNotes(parsedSections, elfDataMock);

      // Step 2: Reconstruct the notes
      const reconstructedNotesBuffers = notes.map(note => createNoteEntryBuffer(note, isLittle));

      // Step 3: Assertion
      expect(reconstructedNotesBuffers.length).toEqual(slicedNotesBuffers.length);

      for (let i = 0; i < reconstructedNotesBuffers.length; i++) {
        expect(reconstructedNotesBuffers[i]).toEqual(slicedNotesBuffers[i]);
      }
    });

    function parseSectionHeaders(parsedHeader: ElfStruct.Elf_Ehdr): {
      Header: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr;
      Name: string;
    }[] {
      const sectionHeaderOffset = parsedHeader.e_shoff;
      const sectionHeaderEntrySize = parsedHeader.e_shentsize;
      const sectionHeaderEntryCount = parsedHeader.e_shnum;
      const sectionHeaderStrTabOffset = parsedHeader.e_shstrndx;

      const parsedSections = sectionHeadersParser.parse(
        sectionHeaderOffset,
        sectionHeaderEntrySize,
        sectionHeaderEntryCount,
        sectionHeaderStrTabOffset,
      );

      return parsedSections;
    }
  });

  function getSlicedNotes(
    parsedSections: {
      Header: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr;
      Name: string;
    }[],
    elfDataMock: FileInfo,
  ): Buffer[] {
    // Initialize an array to hold the sliced notes buffers
    const slicedNotesBuffers: Buffer[] = [];

    // Iterate through the parsed sections to find the notes section
    for (const section of parsedSections) {
      if (section.Header.sh_type === 7) {
        // SHT_NOTE section found
        // Read the content of the notes section and add it to the sliced notes buffers array
        slicedNotesBuffers.push(getSlicedBuffer(elfDataMock, section));
      }
    }

    return slicedNotesBuffers;
  }

  function createNoteEntryBuffer(
    Note: {
      Table: ElfStruct.Elf32_Nhdr | ElfStruct.Elf64_Nhdr;
      Name: string;
      Description: Buffer;
      Section: string;
    },
    isLE: boolean,
  ): Buffer {
    const entrySize = 12 + Note.Name.length + 1 + Note.Description.length; // Total size of the note entry
    const entryBuffer = Buffer.alloc(entrySize);

    // Write the note entry components into the buffer
    writeUInt32(entryBuffer, Note.Table.n_namesz, 0, isLE);
    writeUInt32(entryBuffer, Note.Table.n_descsz, 4, isLE);
    writeUInt32(entryBuffer, Note.Table.n_type, 8, isLE);

    entryBuffer.write(Note.Name, 12, Note.Name.length, "ascii");

    let descriptOffset = 12 + Note.Name.length + 1;
    Note.Description.copy(entryBuffer, descriptOffset);

    return entryBuffer;
  }
});
