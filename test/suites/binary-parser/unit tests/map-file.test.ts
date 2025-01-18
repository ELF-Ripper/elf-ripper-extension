import { FileInfo, Memory } from "../../../../src/binary-parser/types/";
import { MapFileParser } from "../../../../src/binary-parser/parsers/map-file";

describe("MapFile Parser", () => {
  let mockData: FileInfo;
  let Parser: MapFileParser;

  beforeEach(() => {
    mockData = {
      fileName: "mock.map",
      filePath: "/path/to/mock.map",
      fileContent: Buffer.from(""),
    };
    Parser = new MapFileParser(mockData);
  });

  test("should parse a valid map file with memory configurations correctly", () => {
    mockData.fileContent = Buffer.from(`
        Memory Configuration
        Name             Origin             Length             Attributes
        FLASH            0x0000000008000000 0x0000000000040000 xr
        RAM              0x0000000020000000 0x0000000000020000 xrw
        RAM2             0x0000000020000000 0x0000000000020000 xrw   NULLENTRY
        *default*        0x0000000000000000 0xffffffffffffffff
      `);

    const expectedMemories: Memory[] = [
      {
        Name: "FLASH",
        Origin: 0x0000000008000000,
        Length: 0x0000000000040000,
        Attributes: "xr",
      },
      {
        Name: "RAM",
        Origin: 0x0000000020000000,
        Length: 0x0000000000020000,
        Attributes: "xrw",
      },
    ];

    const result = Parser.parse();
    expect(result).toEqual(expectedMemories);
  });

  test("should throw an error if Memory Configuration block is not found", () => {
    mockData.fileContent = Buffer.from(`INVALID CONTENT`);
    expect(() => Parser.parse()).toThrow("Memory Configuration block not found in the .map file.");
  });

  test("should throw an error if memory block size is less or equal to 2", () => {
    mockData.fileContent = Buffer.from(`
        Memory Configuration
        Name             Origin             Length             Attributes
        *default*        0x00000000         0xffffffff
      `);
    expect(() => Parser.parse()).toThrow("Invalid Memory Configuration block.");
  });

  test("should throw an error if Memory Configuration header is invalid", () => {
    mockData.fileContent = Buffer.from(`
        Memory Configuration
        Invalid Header
        FLASH            0x0000000008000000 0x0000000000040000 xr
        *default*        0x00000000         0xffffffff
      `);
    expect(() => Parser.parse()).toThrow("Invalid Memory Configuration header.");
  });

  test("should throw an error if Origin or Length values are not numbers", () => {
    mockData.fileContent = Buffer.from(`
            Memory Configuration
    
            Name             Origin             Length             Attributes
            FLASH            0x0000000008000000 0x0000000000040000 xr
            RAM              f 0x0000000000020000 xrw
            *default*        0x0000000000000000 0xffffffffffffffff
        `);

    expect(() => Parser.parse()).toThrow(
      "Invalid Origin or Length value in memory definition:             RAM              f 0x0000000000020000 xrw",
    );
  });
});
