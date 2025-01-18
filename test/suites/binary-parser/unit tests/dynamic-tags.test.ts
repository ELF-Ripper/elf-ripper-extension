import fs from "fs";
import { FileInfo } from "../../../../src/binary-parser/types";
import { DynamicTags } from "../../../../src/binary-parser/parsers/elf/dynamic-tags";
import {
  mockedSections32,
  mockedSections64,
  mockedPrograms32,
  mockedPrograms64,
} from "./mockedData";

describe("Dynamic Tags Parser", () => {
  test.each([
    [
      "ELF64 little endian",
      "./test/C_Samples/hello",
      mockedSections64,
      mockedPrograms64,
      [
        { d_tag: 1, d_un: 1 },
        { d_tag: 12, d_un: 4096 },
        { d_tag: 13, d_un: 4584 },
        { d_tag: 25, d_un: 15800 },
        { d_tag: 27, d_un: 8 },
        { d_tag: 26, d_un: 15808 },
        { d_tag: 28, d_un: 8 },
        { d_tag: 1879047925, d_un: 928 },
        { d_tag: 5, d_un: 1136 },
        { d_tag: 6, d_un: 968 },
        { d_tag: 10, d_un: 130 },
        { d_tag: 11, d_un: 24 },
        { d_tag: 21, d_un: 0 },
        { d_tag: 3, d_un: 16312 },
        { d_tag: 2, d_un: 24 },
        { d_tag: 20, d_un: 7 },
        { d_tag: 23, d_un: 1504 },
        { d_tag: 7, d_un: 1312 },
        { d_tag: 8, d_un: 192 },
        { d_tag: 9, d_un: 24 },
        { d_tag: 30, d_un: 8 },
        { d_tag: 1879048187, d_un: 134217729 },
        { d_tag: 1879048190, d_un: 1280 },
        { d_tag: 1879048191, d_un: 1 },
        { d_tag: 1879048176, d_un: 1266 },
        { d_tag: 1879048185, d_un: 3 },
        { d_tag: 0, d_un: 0 },
      ],
    ],
    [
      "ELF32 big endian",
      "./test/C_Samples/hello_arm32",
      mockedSections32,
      mockedPrograms32,
      [
        { d_tag: 1, d_un: 1 },
        { d_tag: 12, d_un: 928 },
        { d_tag: 13, d_un: 1384 },
        { d_tag: 25, d_un: 69316 },
        { d_tag: 27, d_un: 4 },
        { d_tag: 26, d_un: 69320 },
        { d_tag: 28, d_un: 4 },
        { d_tag: 1879047925, d_un: 436 },
        { d_tag: 5, d_un: 620 },
        { d_tag: 6, d_un: 460 },
        { d_tag: 10, d_un: 134 },
        { d_tag: 11, d_un: 16 },
        { d_tag: 21, d_un: 0 },
        { d_tag: 3, d_un: 69572 },
        { d_tag: 2, d_un: 40 },
        { d_tag: 20, d_un: 17 },
        { d_tag: 23, d_un: 888 },
        { d_tag: 17, d_un: 808 },
        { d_tag: 18, d_un: 80 },
        { d_tag: 19, d_un: 8 },
        { d_tag: 30, d_un: 8 },
        { d_tag: 1879048187, d_un: 134217729 },
        { d_tag: 1879048190, d_un: 776 },
        { d_tag: 1879048191, d_un: 1 },
        { d_tag: 1879048176, d_un: 754 },
        { d_tag: 1879048186, d_un: 6 },
        { d_tag: 0, d_un: 0 },
      ],
    ],
    // Add more test cases as needed...
  ])(
    "Parse method returns expected section headers for %s",
    async (_, sampleFilePath, mockedSections, mockedPrograms, expectedData) => {
      // Load the content of the sample ELF file
      const fileContent = fs.readFileSync(sampleFilePath);

      // Create a FileInfo object with sample file content
      const elfDataMock: FileInfo = {
        filePath: sampleFilePath,
        fileContent: fileContent,
      };

      // Instantiate DynamicTags parser and call parse method
      const parser = new DynamicTags(elfDataMock);
      const parsedData = parser.parse(mockedSections, mockedPrograms);

      // Assert parsed data matches expected data
      expect(parsedData).toEqual(expectedData);
    },
  );
});
