import fs from "fs";
import { FileInfo } from "../../../../src/binary-parser/types";
import { RelocationTables } from "../../../../src/binary-parser/parsers/elf/relocation-tables";
import { mockedSections32, mockedSections64 } from "./mockedData";

describe("Relocation Tables Parser", () => {
  test.each([
    [
      "ELF64 little endian",
      "./test/C_Samples/hello",
      mockedSections64,
      {
        rel: [],
        rela: [
          { r_offset: 15800, r_info: 8, r_addend: 4416 },
          { r_offset: 15808, r_info: 8, r_addend: 4352 },
          { r_offset: 16392, r_info: 8, r_addend: 16392 },
          { r_offset: 16344, r_info: 4294967302, r_addend: 0 },
          { r_offset: 16352, r_info: 12884901894, r_addend: 0 },
          { r_offset: 16360, r_info: 17179869190, r_addend: 0 },
          { r_offset: 16368, r_info: 21474836486, r_addend: 0 },
          { r_offset: 16376, r_info: 25769803782, r_addend: 0 },
          { r_offset: 16336, r_info: 8589934599, r_addend: 0 },
        ],
      },
    ],
    [
      "ELF32 big endian",
      "./test/C_Samples/hello_arm32",
      mockedSections32,
      {
        rel: [
          { r_offset: 69316, r_info: 23 },
          { r_offset: 69320, r_info: 23 },
          { r_offset: 69604, r_info: 23 },
          { r_offset: 69620, r_info: 23 },
          { r_offset: 69624, r_info: 23 },
          { r_offset: 69636, r_info: 23 },
          { r_offset: 69608, r_info: 789 },
          { r_offset: 69612, r_info: 1045 },
          { r_offset: 69616, r_info: 1813 },
          { r_offset: 69628, r_info: 2069 },
          { r_offset: 69584, r_info: 790 },
          { r_offset: 69588, r_info: 1302 },
          { r_offset: 69592, r_info: 1558 },
          { r_offset: 69596, r_info: 1814 },
          { r_offset: 69600, r_info: 2326 },
        ],
        rela: [],
      },
    ],
    // Add more test cases as needed...
  ])(
    "Parse method returns expected section headers for %s",
    async (_, sampleFilePath, mockedSections, expectedData) => {
      // Load the content of the sample ELF file
      const fileContent = fs.readFileSync(sampleFilePath);

      // Create a FileInfo object with sample file content
      const elfDataMock: FileInfo = {
        filePath: sampleFilePath,
        fileContent: fileContent,
      };

      // Instantiate RelocationTables parser and call parse method
      const parser = new RelocationTables(elfDataMock);
      const parsedData = parser.parse(mockedSections);

      // Assert parsed data matches expected data
      expect(parsedData).toEqual(expectedData);
    },
  );
});
