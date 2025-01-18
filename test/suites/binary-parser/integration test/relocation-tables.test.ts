import fs from "fs";
import { samples } from "./sampleFiles";
import { FileInfo } from "../../../../src/binary-parser/types";
import * as ElfStruct from "../../../../src/binary-parser/types/elf/elf-structures";
import { Header } from "../../../../src/binary-parser/parsers/elf/header";
import { SectionHeaders } from "../../../../src/binary-parser/parsers/elf/section-headers";
import { RelocationTables } from "../../../../src/binary-parser/parsers/elf/relocation-tables";
import {
  checkEndianess,
  checkClass,
  getSlicedBuffer,
  writeUInt32,
  writeBigUInt64,
} from "./test-utils";

// Iterate over each sample
samples.forEach(({ filePath, fileName }) => {
  describe(`Integration tests for ${fileName}`, () => {
    let headerParser: Header;
    let sectionHeadersParser: SectionHeaders;
    let relocationsParser: RelocationTables;
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
      relocationsParser = new RelocationTables(elfDataMock);
    });

    test("Relocations parsing and reconstruction", () => {
      // Parse header and retrieve required parameters for parsing the section headers from the sample
      const parsedHeader = headerParser.parse();
      const isLittle = checkEndianess(parsedHeader.e_ident.EI_DATA);
      const isELF32 = checkClass(parsedHeader.e_ident.EI_CLASS);

      const parsedSections = parseSectionHeaders(parsedHeader);

      // Parse the relocations using the parsed sections headers
      const { rel, rela } = relocationsParser.parse(parsedSections);

      // Step 1: Retrieve content buffers for the sliced relocations
      const { slicedRel, slicedRela } = getSlicedBuffers(parsedSections, elfDataMock);

      // Step 2: Reconstruct the relocations
      const reconstructedRelocations = reconstructRelocations({ rel, rela }, isLittle, isELF32);

      // Step 3: Assertion
      expect(reconstructedRelocations.relBuffer).toEqual(slicedRel);
      expect(reconstructedRelocations.relaBuffer).toEqual(slicedRela);
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

  function getSlicedBuffers(
    parsedSections: {
      Header: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr;
      Name: string;
    }[],
    elfDataMock: FileInfo,
  ): { slicedRel: Buffer; slicedRela: Buffer } {
    let slicedRel: Buffer = Buffer.alloc(0);
    let slicedRela: Buffer = Buffer.alloc(0);

    parsedSections.forEach(section => {
      if (section.Header.sh_type === 9) {
        // SHT_REL section
        slicedRel = Buffer.concat([slicedRel, getSlicedBuffer(elfDataMock, section)]);
      } else if (section.Header.sh_type === 4) {
        // SHT_RELA section
        slicedRela = Buffer.concat([slicedRela, getSlicedBuffer(elfDataMock, section)]);
      }
    });

    return { slicedRel, slicedRela };
  }

  function reconstructRelocations(
    parsedRelocations: {
      rel: (ElfStruct.Elf32_Rel | ElfStruct.Elf64_Rel)[];
      rela: (ElfStruct.Elf32_Rela | ElfStruct.Elf64_Rela)[];
    },
    isLE: boolean,
    isELF32: boolean,
  ): { relBuffer: Buffer; relaBuffer: Buffer } {
    const relBuffer = reconstructBuffer(parsedRelocations.rel, isLE, isELF32);
    const relaBuffer = reconstructBuffer(parsedRelocations.rela, isLE, isELF32);

    return { relBuffer, relaBuffer };
  }

  function reconstructBuffer(
    relocationsEntries: (
      | ElfStruct.Elf32_Rel
      | ElfStruct.Elf64_Rel
      | ElfStruct.Elf32_Rela
      | ElfStruct.Elf64_Rela
    )[],
    isLE: boolean,
    isELF32: boolean,
  ): Buffer {
    let entrySize: number;
    if (isELF32) {
      entrySize = relocationsEntries.some(entry => "r_addend" in entry) ? 12 : 8;
    } else {
      entrySize = relocationsEntries.some(entry => "r_addend" in entry) ? 24 : 16;
    }

    const reconstructedBuffer = Buffer.alloc(relocationsEntries.length * entrySize);

    relocationsEntries.forEach((entry, index) => {
      // Calculate the offset for this entry in the buffer
      const offset = index * entrySize;

      // Write the parsed data back into the buffer
      if (isELF32) {
        if ("r_addend" in entry) {
          const relaEntry = entry as ElfStruct.Elf32_Rela | ElfStruct.Elf64_Rela;
          writeUInt32(reconstructedBuffer, relaEntry.r_offset, offset, isLE);
          writeUInt32(reconstructedBuffer, relaEntry.r_info, offset + 4, isLE);
          writeUInt32(reconstructedBuffer, relaEntry.r_addend, offset + 8, isLE);
        } else {
          const relEntry = entry as ElfStruct.Elf32_Rel | ElfStruct.Elf64_Rel;
          writeUInt32(reconstructedBuffer, relEntry.r_offset, offset, isLE);
          writeUInt32(reconstructedBuffer, relEntry.r_info, offset + 4, isLE);
        }
      } else {
        if ("r_addend" in entry) {
          const relaEntry = entry as ElfStruct.Elf32_Rela | ElfStruct.Elf64_Rela;
          writeBigUInt64(reconstructedBuffer, relaEntry.r_offset, offset, isLE);
          writeBigUInt64(reconstructedBuffer, relaEntry.r_info, offset + 8, isLE);
          writeBigUInt64(reconstructedBuffer, relaEntry.r_addend, offset + 16, isLE);
        } else {
          const relEntry = entry as ElfStruct.Elf32_Rel | ElfStruct.Elf64_Rel;
          writeBigUInt64(reconstructedBuffer, relEntry.r_offset, offset, isLE);
          writeBigUInt64(reconstructedBuffer, relEntry.r_info, offset + 8, isLE);
        }
      }
    });

    return reconstructedBuffer;
  }
});
