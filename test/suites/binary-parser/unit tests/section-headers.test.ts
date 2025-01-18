import fs from "fs";
import { FileInfo } from "../../../../src/binary-parser/types";
import { SectionHeaders } from "../../../../src/binary-parser/parsers/elf/section-headers";
import { mockedSections32, mockedSections64 } from "./mockedData";

describe("Section Headers Parser", () => {
  test.each([
    ["ELF64 little endian", "./test/C_Samples/hello", 14712, 64, 31, 30, mockedSections64],
    ["ELF32 big endian", "./test/C_Samples/hello_arm32", 6992, 40, 29, 28, mockedSections32],
    // Add more test cases as needed...
  ])(
    "Parse method returns expected section headers for %s",
    async (_, sampleFilePath, e_shoff, e_shentsize, e_shnum, e_shstrndx, expectedData) => {
      // Load the content of the sample ELF file
      const fileContent = fs.readFileSync(sampleFilePath);

      // Create a FileInfo object with sample file content
      const elfDataMock: FileInfo = {
        filePath: sampleFilePath,
        fileContent: fileContent,
      };

      // Instantiate SectionHeaders parser and call parse method
      const parser = new SectionHeaders(elfDataMock);
      const parsedData = parser.parse(e_shoff, e_shentsize, e_shnum, e_shstrndx);

      // Assert parsed data matches expected data
      expect(parsedData).toEqual(expectedData);
    },
  );
});
