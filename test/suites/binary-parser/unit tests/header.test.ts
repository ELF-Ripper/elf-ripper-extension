import fs from "fs";
import { FileInfo } from "../../../../src/binary-parser/types";
import { Header } from "../../../../src/binary-parser/parsers/elf/header";

describe("Header Parser", () => {
  test.each([
    [
      "ELF64 little endian",
      "./test/C_Samples/hello",
      {
        e_ident: {
          EI_MAG0: 127,
          EI_MAG1: 69,
          EI_MAG2: 76,
          EI_MAG3: 70,
          EI_CLASS: 2,
          EI_DATA: 1,
          EI_VERSION: 1,
          EI_OSABI: 0,
          EI_ABIVERSION: 0,
          EI_PAD: [0, 0, 0, 0, 0, 0, 0],
        },
        e_type: 3,
        e_machine: 62,
        e_version: 1,
        e_entry: 4192,
        e_phoff: 64,
        e_shoff: 14712,
        e_flags: 0,
        e_ehsize: 64,
        e_phentsize: 56,
        e_phnum: 13,
        e_shentsize: 64,
        e_shnum: 31,
        e_shstrndx: 30,
      },
    ],
    [
      "ELF32 big endian",
      "./test/C_Samples/hello_arm32",
      {
        e_ident: {
          EI_MAG0: 127,
          EI_MAG1: 69,
          EI_MAG2: 76,
          EI_MAG3: 70,
          EI_CLASS: 1,
          EI_DATA: 1,
          EI_VERSION: 1,
          EI_OSABI: 0,
          EI_ABIVERSION: 0,
          EI_PAD: [0, 0, 0, 0, 0, 0, 0],
        },
        e_type: 3,
        e_machine: 40,
        e_version: 1,
        e_entry: 1021,
        e_phoff: 52,
        e_shoff: 6992,
        e_flags: 83887104,
        e_ehsize: 52,
        e_phentsize: 32,
        e_phnum: 9,
        e_shentsize: 40,
        e_shnum: 29,
        e_shstrndx: 28,
      },
    ],
    // Add more test cases as needed...
  ])(
    "Parse method returns expected ELF header for %s",
    async (_, sampleFilePath, expectedHeader) => {
      // Load the content of the sample ELF file
      const fileContent = fs.readFileSync(sampleFilePath);

      // Create a FileInfo object with sample file content
      const elfDataMock: FileInfo = {
        filePath: sampleFilePath,
        fileContent: fileContent,
      };

      // Instantiate Header parser and call parse method
      const parser = new Header(elfDataMock);
      const parsedData = parser.parse();

      // Assert parsed data matches expected data
      expect(parsedData).toEqual(expectedHeader);
    },
  );
});
