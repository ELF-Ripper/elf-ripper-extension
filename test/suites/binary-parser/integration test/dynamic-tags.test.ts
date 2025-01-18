import fs from "fs";
import { samples } from "./sampleFiles";
import { FileInfo } from "../../../../src/binary-parser/types";
import * as ElfStruct from "../../../../src/binary-parser/types/elf/elf-structures";
import { Header } from "../../../../src/binary-parser/parsers/elf/header";
import { SectionHeaders } from "../../../../src/binary-parser/parsers/elf/section-headers";
import { ProgramHeaders } from "../../../../src/binary-parser/parsers/elf/program-headers";
import { DynamicTags } from "../../../../src/binary-parser/parsers/elf/dynamic-tags";
import {
  getSlicedBuffer,
  checkEndianess,
  checkClass,
  writeUInt32,
  writeBigUInt64,
} from "./test-utils";

// Iterate over each sample
samples.forEach(({ filePath, fileName }) => {
  describe(`Integration tests for ${fileName}`, () => {
    let headerParser: Header;
    let sectionHeadersParser: SectionHeaders;
    let programHeadersParser: ProgramHeaders;
    let dynamicTagsParser: DynamicTags;
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
      programHeadersParser = new ProgramHeaders(elfDataMock);
      dynamicTagsParser = new DynamicTags(elfDataMock);
    });

    test("Dynamic Tags parsing and reconstruction", () => {
      // Parse header, section headers, and program headers
      const parsedHeader = headerParser.parse();
      const isLittle = checkEndianess(parsedHeader.e_ident.EI_DATA);
      const isELF32 = checkClass(parsedHeader.e_ident.EI_CLASS);
      const parsedSections = parseSectionHeaders(parsedHeader);
      const parsedProgramHeaders = parseProgramHeaders(parsedHeader);

      // Parse the dynamic tags using the parsed sections headers and program headers
      const dynamicTags = dynamicTagsParser.parse(parsedSections, parsedProgramHeaders);

      // Step 1: Retrieve content buffer for the sliced dynamic tags
      const slicedDynamicTags = getSlicedBuffers(parsedSections, elfDataMock);

      // Step 2: Create a buffer for the reconstructed dynamic tags
      const reconstructedDynamicTagsBuffer = Buffer.alloc(slicedDynamicTags.length);

      // Step 3: Reconstruct the dynamic tags
      reconstructDynamicTags(dynamicTags, reconstructedDynamicTagsBuffer, isLittle, isELF32);

      // Step 4: Assertion
      expect(reconstructedDynamicTagsBuffer).toEqual(slicedDynamicTags);
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

    function parseProgramHeaders(
      parsedHeader: ElfStruct.Elf_Ehdr,
    ): (ElfStruct.Elf32_Phdr | ElfStruct.Elf64_Phdr)[] {
      const programHeaderOffset = parsedHeader.e_phoff;
      const programHeaderEntrySize = parsedHeader.e_phentsize;
      const programHeaderEntryCount = parsedHeader.e_phnum;

      const parsedProgramHeaders = programHeadersParser.parse(
        programHeaderOffset,
        programHeaderEntrySize,
        programHeaderEntryCount,
      );

      return parsedProgramHeaders;
    }
  });

  function getSlicedBuffers(
    parsedSections: {
      Header: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr;
      Name: string;
    }[],
    elfDataMock: FileInfo,
  ): Buffer {
    // Find the section of type SHT_DYNAMIC
    const dynamicSection = parsedSections.find(section => section.Header.sh_type === 6);

    if (!dynamicSection) {
      throw new Error("Dynamic tags section not found.");
    }

    return getSlicedBuffer(elfDataMock, dynamicSection);
  }

  function reconstructDynamicTags(
    dynamicTags: (ElfStruct.Elf32_Dyn | ElfStruct.Elf64_Dyn)[],
    reconstructedBuffer: Buffer,
    isLE: boolean,
    isELF32: boolean,
  ): void {
    const entrySize = isELF32 === true ? 8 : 16;

    // Fill the reconstructed buffer with zeros
    reconstructedBuffer.fill(0);

    // Write dynamic tag entries into the buffer
    dynamicTags.forEach((entry, index) => {
      const offset = index * entrySize;

      // Write dynamic tag entry into buffer
      if (isELF32 === true) {
        writeUInt32(reconstructedBuffer, entry.d_tag, offset, isLE);
        writeUInt32(reconstructedBuffer, entry.d_un, offset + 4, isLE);
      } else {
        writeBigUInt64(reconstructedBuffer, entry.d_tag, offset, isLE);
        writeBigUInt64(reconstructedBuffer, entry.d_un, offset + 8, isLE);
      }
    });
  }
});
