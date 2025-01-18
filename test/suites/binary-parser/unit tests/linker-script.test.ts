import { FileInfo, Memory } from "../../../../src/binary-parser/types/";
import { LinkerScriptParser } from "../../../../src/binary-parser/parsers/linker-script";

describe("LinkerScript Parser", () => {
  let mockData: FileInfo;
  let Parser: LinkerScriptParser;

  beforeEach(() => {
    mockData = {
      fileName: "mock.ld",
      filePath: "/path/to/mock.ld",
      fileContent: Buffer.from(""),
    };
    Parser = new LinkerScriptParser(mockData);
  });

  test("should parse a valid linker script with memory definitions correctly", () => {
    mockData.fileContent = Buffer.from(`
      MEMORY
      {
        FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 256K, FILL = 0x08001000
        RAM (rwx) : org = 0x20000000, len = 64M, fill = 0x20001000
        RAM2 (rwx) : o = 0x30000000, l = 128G, f = 0x30001000
        ROM (rx) : ORIGIN = 0x40000000, LENGTH = 1T
      }
    `);

    const expectedMemories: Memory[] = [
      {
        Name: "FLASH",
        Origin: 0x08000000,
        Length: 256 * 1024,
        Attributes: "rx",
        Fill: 0x08001000,
      },
      {
        Name: "RAM",
        Origin: 0x20000000,
        Length: 64 * 1024 * 1024,
        Attributes: "rwx",
        Fill: 0x20001000,
      },
      {
        Name: "RAM2",
        Origin: 0x30000000,
        Length: 128 * 1024 * 1024 * 1024,
        Attributes: "rwx",
        Fill: 0x30001000,
      },
      {
        Name: "ROM",
        Origin: 0x40000000,
        Length: 1 * 1024 * 1024 * 1024 * 1024,
        Attributes: "rx",
      },
    ];

    const result = Parser.parse();
    expect(result).toEqual(expectedMemories);
  });

  test("should throw an error if MEMORY section is not found", () => {
    mockData.fileContent = Buffer.from(`INVALID CONTENT`);
    expect(() => Parser.parse()).toThrow("Invalid linker script format: MEMORY section not found.");
  });

  test('should throw an error if memory definition cannot be split by ":" correctly', () => {
    mockData.fileContent = Buffer.from(`
      MEMORY
      {
        FLASH (rx) ORIGIN = 0x08000000, LENGTH = 256K
      }
    `);
    expect(() => Parser.parse()).toThrow(
      "Invalid memory definition: FLASH (rx) ORIGIN = 0x08000000, LENGTH = 256K",
    );

    mockData.fileContent = Buffer.from(`
      MEMORY
      {
        FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 256K : FILL = 0x08001000
      }
    `);
    expect(() => Parser.parse()).toThrow(
      "Invalid memory definition: FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 256K : FILL = 0x08001000",
    );
  });

  test("should throw an error if origin or length is undefined", () => {
    mockData.fileContent = Buffer.from(`
      MEMORY
      {
        FLASH (rx) : LENGTH = 256K
      }
    `);
    expect(() => Parser.parse()).toThrow(
      "Failed to parse origin or length in memory definition: FLASH (rx) : LENGTH = 256K",
    );
  });

  test("should throw an error if name option regex fails", () => {
    mockData.fileContent = Buffer.from(`
      MEMORY
      {
        (rx) : ORIGIN = 0x08000000, LENGTH = 256K
      }
    `);
    expect(() => Parser.parse()).toThrow("Failed to extract name from memory definition: (rx)");
  });
});
