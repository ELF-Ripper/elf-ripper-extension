import fs from "fs";
import { samples } from "./sampleFiles";
import { FileInfo } from "../../../../src/binary-parser/types";
import * as ElfStruct from "../../../../src/binary-parser/types/elf/elf-structures";
import { Header } from "../../../../src/binary-parser/parsers/elf/header";
import { ProgramHeaders } from "../../../../src/binary-parser/parsers/elf/program-headers";
import { checkEndianess, checkClass, writeUInt32, writeBigUInt64 } from "./test-utils";

// Iterate over each sample
samples.forEach(({ filePath, fileName }) => {
  describe(`Integration tests for ${fileName}`, () => {
    let headerParser: Header;
    let programHeadersParser: ProgramHeaders;
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
      programHeadersParser = new ProgramHeaders(elfDataMock);
    });

    test("Program headers parsing and reconstruction", () => {
      if (!elfDataMock || !elfDataMock.fileContent) {
        // If fileContent is not defined, skip the test
        console.warn("Sample file content is not defined. Skipping test.");
        return;
      }

      // Parse header and retrieve required parameters for parsing the program headers from the sample
      const parsedHeader = headerParser.parse();
      const isLittle = checkEndianess(parsedHeader.e_ident.EI_DATA);
      const isELF32 = checkClass(parsedHeader.e_ident.EI_CLASS);

      // Parse the program headers
      const parsedProgramHeaders = programHeadersParser.parse(
        parsedHeader.e_phoff,
        parsedHeader.e_phentsize,
        parsedHeader.e_phnum,
      );

      // Step 1: Retrieve content buffer for the sliced program headers
      const slicedProgramHeaders = elfDataMock.fileContent.slice(
        parsedHeader.e_phoff,
        parsedHeader.e_phoff + parsedHeader.e_phentsize * parsedHeader.e_phnum,
      );

      // Step 2: Reconstruct the program headers from the parsed data
      const reconstructedProgramHeadersContent = reconstructProgramHeaders(
        parsedProgramHeaders,
        parsedHeader.e_phentsize,
        parsedHeader.e_phnum,
        isLittle,
        isELF32,
      );

      // Step 3: Assertion
      expect(reconstructedProgramHeadersContent).toEqual(slicedProgramHeaders);
    });
  });
});

function reconstructProgramHeaders(
  parsedProgramHeaders: (ElfStruct.Elf32_Phdr | ElfStruct.Elf64_Phdr)[],
  programHeaderEntrySize: number,
  programHeaderEntryCount: number,
  isLE: boolean,
  isELF32: boolean,
): Buffer {
  // Allocate buffer with the appropriate size
  const reconstructedProgramsBuffer = Buffer.alloc(
    programHeaderEntrySize * programHeaderEntryCount,
  );

  // Write the parsed data back into the buffer
  parsedProgramHeaders.forEach((program, index) => {
    // Calculate the offset for this entry in the buffer
    const offset = index * programHeaderEntrySize;

    // Write the program header fields into the buffer at the calculated offset
    if (isELF32 === true) {
      writeUInt32(reconstructedProgramsBuffer, program.p_type, offset, isLE);
      writeUInt32(reconstructedProgramsBuffer, program.p_flags, offset + 24, isLE);
      writeUInt32(reconstructedProgramsBuffer, program.p_offset, offset + 4, isLE);
      writeUInt32(reconstructedProgramsBuffer, program.p_vaddr, offset + 8, isLE);
      writeUInt32(reconstructedProgramsBuffer, program.p_paddr, offset + 12, isLE);
      writeUInt32(reconstructedProgramsBuffer, program.p_filesz, offset + 16, isLE);
      writeUInt32(reconstructedProgramsBuffer, program.p_memsz, offset + 20, isLE);
      writeUInt32(reconstructedProgramsBuffer, program.p_align, offset + 28, isLE);
    } else {
      writeUInt32(reconstructedProgramsBuffer, program.p_type, offset, isLE);
      writeUInt32(reconstructedProgramsBuffer, program.p_flags, offset + 4, isLE);
      writeBigUInt64(reconstructedProgramsBuffer, program.p_offset, offset + 8, isLE);
      writeBigUInt64(reconstructedProgramsBuffer, program.p_vaddr, offset + 16, isLE);
      writeBigUInt64(reconstructedProgramsBuffer, program.p_paddr, offset + 24, isLE);
      writeBigUInt64(reconstructedProgramsBuffer, program.p_filesz, offset + 32, isLE);
      writeBigUInt64(reconstructedProgramsBuffer, program.p_memsz, offset + 40, isLE);
      writeBigUInt64(reconstructedProgramsBuffer, program.p_align, offset + 48, isLE);
    }
  });

  return reconstructedProgramsBuffer;
}
