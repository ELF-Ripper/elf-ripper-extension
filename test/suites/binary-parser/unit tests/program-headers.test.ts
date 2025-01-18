import fs from "fs";
import { FileInfo } from "../../../../src/binary-parser/types";
import { ProgramHeaders } from "../../../../src/binary-parser/parsers/elf/program-headers";
import { mockedPrograms32, mockedPrograms64 } from "./mockedData";

describe("Program Headers Parser", () => {
  test.each([
    ["ELF64 little endian", "./test/C_Samples/hello", 64, 56, 13, mockedPrograms64],
    ["ELF32 big endian", "./test/C_Samples/hello_arm32", 52, 32, 9, mockedPrograms32],
    // Add more test cases as needed...
  ])(
    "Parse method returns expected program headers for %s",
    async (_, sampleFilePath, e_phoff, e_phentsize, e_phnum, expectedData) => {
      // Load the content of the sample ELF file
      const fileContent = fs.readFileSync(sampleFilePath);

      // Create a FileInfo object with sample file content
      const elfDataMock: FileInfo = {
        filePath: sampleFilePath,
        fileContent: fileContent,
      };

      // Instantiate ProgramHeaders parser and call parse method
      const parser = new ProgramHeaders(elfDataMock);
      const parsedData = parser.parse(e_phoff, e_phentsize, e_phnum);

      // Assert parsed data matches expected data
      expect(parsedData).toEqual(expectedData);
    },
  );
});
