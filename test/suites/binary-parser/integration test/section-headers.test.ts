import fs from "fs";
import { samples } from "./sampleFiles";
import { FileInfo } from "../../../../src/binary-parser/types";
import * as ElfStruct from "../../../../src/binary-parser/types/elf/elf-structures";
import { Header } from "../../../../src/binary-parser/parsers/elf/header";
import { SectionHeaders } from "../../../../src/binary-parser/parsers/elf/section-headers";
import { checkEndianess, checkClass, writeUInt32, writeBigUInt64 } from "./test-utils";

// Iterate over each sample
samples.forEach(({ filePath, fileName }) => {
  describe(`Integration tests for ${fileName}`, () => {
    let headerParser: Header;
    let sectionHeadersParser: SectionHeaders;
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
    });

    test("Section headers parsing and reconstruction", () => {
      if (!elfDataMock || !elfDataMock.fileContent) {
        // If fileContent is not defined, skip the test
        console.warn("Sample file content is not defined. Skipping test.");
        return;
      }

      // Parse header and retrieve required parameters for parsing the section headers from the sample
      const parsedHeader = headerParser.parse();
      const isLittle = checkEndianess(parsedHeader.e_ident.EI_DATA);
      const isELF32 = checkClass(parsedHeader.e_ident.EI_CLASS);

      // Parse the section headers
      const parsedSectionHeaders = sectionHeadersParser.parse(
        parsedHeader.e_shoff,
        parsedHeader.e_shentsize,
        parsedHeader.e_shnum,
        parsedHeader.e_shstrndx,
      );

      // Step 1: Retrieve content buffer for the sliced section headers
      const slicedSectionHeaders = elfDataMock.fileContent.slice(
        parsedHeader.e_shoff,
        parsedHeader.e_shoff + parsedHeader.e_shentsize * parsedHeader.e_shnum,
      );

      // Step 2: Reconstruct the section headers from the parsed data
      const reconstructedSectionHeadersContent = reconstructSectionHeaders(
        parsedSectionHeaders,
        parsedHeader.e_shentsize,
        parsedHeader.e_shnum,
        isLittle,
        isELF32,
      );

      // Step 3: Assertion
      expect(reconstructedSectionHeadersContent).toEqual(slicedSectionHeaders);
    });
  });
});

function reconstructSectionHeaders(
  parsedSectionHeaders: {
    Header: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr;
    Name: string;
  }[],
  sectionHeaderEntrySize: number,
  sectionHeaderEntryCount: number,
  isLE: boolean,
  isELF32: boolean,
): Buffer {
  // Allocate buffer with the appropriate size
  const reconstructedSectionsBuffer = Buffer.alloc(
    sectionHeaderEntrySize * sectionHeaderEntryCount,
  );

  // Write the parsed data back into the buffer
  parsedSectionHeaders.forEach((Section, index) => {
    // Calculate the offset for this entry in the buffer
    const offset = index * sectionHeaderEntrySize;

    // Write the section header fields into the buffer at the calculated offset
    if (isELF32 === true) {
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_name, offset, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_type, offset + 4, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_flags, offset + 8, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_addr, offset + 12, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_offset, offset + 16, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_size, offset + 20, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_link, offset + 24, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_info, offset + 28, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_addralign, offset + 32, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_entsize, offset + 36, isLE);
    } else {
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_name, offset, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_type, offset + 4, isLE);
      writeBigUInt64(reconstructedSectionsBuffer, Section.Header.sh_flags, offset + 8, isLE);
      writeBigUInt64(reconstructedSectionsBuffer, Section.Header.sh_addr, offset + 16, isLE);
      writeBigUInt64(reconstructedSectionsBuffer, Section.Header.sh_offset, offset + 24, isLE);
      writeBigUInt64(reconstructedSectionsBuffer, Section.Header.sh_size, offset + 32, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_link, offset + 40, isLE);
      writeUInt32(reconstructedSectionsBuffer, Section.Header.sh_info, offset + 44, isLE);
      writeBigUInt64(reconstructedSectionsBuffer, Section.Header.sh_addralign, offset + 48, isLE);
      writeBigUInt64(reconstructedSectionsBuffer, Section.Header.sh_entsize, offset + 56, isLE);
    }
  });

  return reconstructedSectionsBuffer;
}
