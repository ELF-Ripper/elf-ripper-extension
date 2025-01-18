import fs from "fs";
import { samples } from "./sampleFiles";
import { FileInfo } from "../../../../src/binary-parser/types";
import * as ElfStruct from "../../../../src/binary-parser/types/elf/elf-structures";
import { Header } from "../../../../src/binary-parser/parsers/elf/header";
import { checkEndianess, checkClass, writeUInt16, writeUInt32, writeBigUInt64 } from "./test-utils";

// Iterate over each sample
samples.forEach(({ filePath, fileName }) => {
  describe(`Integration tests for ${fileName}`, () => {
    let headerParser: Header;
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
    });

    test("Header parsing and reconstruction", () => {
      if (!elfDataMock || !elfDataMock.fileContent) {
        // If fileContent is not defined, skip the test
        console.warn("Sample file content is not defined. Skipping test.");
        return;
      }

      // Parse the header and retrieve endianess
      const parsedHeader = headerParser.parse();
      const isLittle = checkEndianess(parsedHeader.e_ident.EI_DATA);
      const isELF32 = checkClass(parsedHeader.e_ident.EI_CLASS);

      const headerSize = isELF32 === true ? 52 : 64;

      // Step 1: Retrieve content buffer for the sliced elf header
      const slicedHeader = elfDataMock.fileContent.slice(0, headerSize);

      // Step 2: Reconstruct the header from the parsed data
      const reconstructedHeaderContent = reconstructHeader(parsedHeader, isLittle, isELF32);

      // Step 3: Assertion
      expect(reconstructedHeaderContent).toEqual(slicedHeader);
    });
  });
});

function reconstructHeader(
  parsedHeader: ElfStruct.Elf_Ehdr,
  isLE: boolean,
  isELF32: boolean,
): Buffer {
  // Allocate buffer with the appropriate size
  const headerSize = isELF32 === true ? 52 : 64;
  const reconstructedHeaderBuffer = Buffer.alloc(headerSize);

  // Write the parsed data back into the buffer
  reconstructedHeaderBuffer.writeUInt8(parsedHeader.e_ident.EI_MAG0, 0);
  reconstructedHeaderBuffer.writeUInt8(parsedHeader.e_ident.EI_MAG1, 1);
  reconstructedHeaderBuffer.writeUInt8(parsedHeader.e_ident.EI_MAG2, 2);
  reconstructedHeaderBuffer.writeUInt8(parsedHeader.e_ident.EI_MAG3, 3);
  reconstructedHeaderBuffer.writeUInt8(parsedHeader.e_ident.EI_CLASS, 4);
  reconstructedHeaderBuffer.writeUInt8(parsedHeader.e_ident.EI_DATA, 5);
  reconstructedHeaderBuffer.writeUInt8(parsedHeader.e_ident.EI_VERSION, 6);
  reconstructedHeaderBuffer.writeUInt8(parsedHeader.e_ident.EI_OSABI, 7);
  reconstructedHeaderBuffer.writeUInt8(parsedHeader.e_ident.EI_ABIVERSION, 8);
  parsedHeader.e_ident.EI_PAD.forEach((value, index) => {
    // Concatenate the numbers in EI_PAD and write them into the buffer
    reconstructedHeaderBuffer.writeUInt8(value, 9 + index);
  });

  if (isELF32 === true) {
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_type, 16, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_machine, 18, isLE);
    writeUInt32(reconstructedHeaderBuffer, parsedHeader.e_version, 20, isLE);
    writeUInt32(reconstructedHeaderBuffer, parsedHeader.e_entry, 24, isLE);
    writeUInt32(reconstructedHeaderBuffer, parsedHeader.e_phoff, 28, isLE);
    writeUInt32(reconstructedHeaderBuffer, parsedHeader.e_shoff, 32, isLE);
    writeUInt32(reconstructedHeaderBuffer, parsedHeader.e_flags, 36, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_ehsize, 40, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_phentsize, 42, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_phnum, 44, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_shentsize, 46, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_shnum, 48, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_shstrndx, 50, isLE);
  } else {
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_type, 16, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_machine, 18, isLE);
    writeUInt32(reconstructedHeaderBuffer, parsedHeader.e_version, 20, isLE);
    writeBigUInt64(reconstructedHeaderBuffer, parsedHeader.e_entry, 24, isLE);
    writeBigUInt64(reconstructedHeaderBuffer, parsedHeader.e_phoff, 32, isLE);
    writeBigUInt64(reconstructedHeaderBuffer, parsedHeader.e_shoff, 40, isLE);
    writeUInt32(reconstructedHeaderBuffer, parsedHeader.e_flags, 48, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_ehsize, 52, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_phentsize, 54, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_phnum, 56, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_shentsize, 58, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_shnum, 60, isLE);
    writeUInt16(reconstructedHeaderBuffer, parsedHeader.e_shstrndx, 62, isLE);
  }

  return reconstructedHeaderBuffer;
}
