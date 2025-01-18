import fs from "fs";
import { FileInfo } from "../../../../src/binary-parser/types";
import { Notes } from "../../../../src/binary-parser/parsers/elf/notes";
import { mockedSections32, mockedSections64 } from "./mockedData";

describe("Notes Parser", () => {
  test.each([
    [
      "ELF64 little endian",
      "./test/C_Samples/hello",
      mockedSections64,
      [
        {
          Table: { n_namesz: 4, n_descsz: 16, n_type: 5 },
          Name: "GNU",
          Description: Buffer.from([2, 0, 0, 192, 4, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0]),
          Section: ".note.gnu.property",
        },
        {
          Table: { n_namesz: 4, n_descsz: 20, n_type: 3 },
          Name: "GNU",
          Description: Buffer.from([
            220, 53, 252, 61, 22, 116, 241, 162, 15, 100, 163, 101, 42, 173, 187, 198, 5, 77, 37,
            15,
          ]),
          Section: ".note.gnu.build-id",
        },
        {
          Table: { n_namesz: 4, n_descsz: 16, n_type: 1 },
          Name: "GNU",
          Description: Buffer.from([0, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]),
          Section: ".note.ABI-tag",
        },
      ],
    ],
    [
      "ELF32 big endian",
      "./test/C_Samples/hello_arm32",
      mockedSections32,
      [
        {
          Table: { n_namesz: 4, n_descsz: 20, n_type: 3 },
          Name: "GNU",
          Description: Buffer.from([
            3, 230, 156, 33, 184, 18, 8, 105, 1, 100, 155, 248, 121, 174, 172, 60, 34, 207, 87, 141,
          ]),
          Section: ".note.gnu.build-id",
        },
        {
          Table: { n_namesz: 4, n_descsz: 16, n_type: 1 },
          Name: "GNU",
          Description: Buffer.from([0, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]),
          Section: ".note.ABI-tag",
        },
      ],
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

      // Instantiate Notes parser and call parse method
      const parser = new Notes(elfDataMock);
      const parsedData = parser.parse(mockedSections);

      // Assert parsed data matches expected data
      expect(parsedData).toEqual(expectedData);
    },
  );
});
