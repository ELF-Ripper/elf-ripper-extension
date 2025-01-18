import fs from "fs";
import { samples } from "./sampleFiles";
import { FileInfo } from "../../../../src/binary-parser/types";
import * as ElfStruct from "../../../../src/binary-parser/types/elf/elf-structures";
import { Header } from "../../../../src/binary-parser/parsers/elf/header";
import { SectionHeaders } from "../../../../src/binary-parser/parsers/elf/section-headers";
import { SymbolTables } from "../../../../src/binary-parser/parsers/elf/symbol-tables";
import {
  getSlicedBuffer,
  checkEndianess,
  checkClass,
  writeUInt16,
  writeUInt32,
  writeBigUInt64,
} from "./test-utils";

// Iterate over each sample
samples.forEach(({ filePath, fileName }) => {
  describe(`Integration tests for ${fileName}`, () => {
    let headerParser: Header;
    let sectionHeadersParser: SectionHeaders;
    let symbolsTableParser: SymbolTables;
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
      sectionHeadersParser = new SectionHeaders(elfDataMock);
      symbolsTableParser = new SymbolTables(elfDataMock);
    });

    test("Symbols tables parsing and reconstruction", () => {
      // Parse header and retrieve required parameters for parsing the section headers from the sample
      const parsedHeader = headerParser.parse();
      const isLittle = checkEndianess(parsedHeader.e_ident.EI_DATA);
      const isELF32 = checkClass(parsedHeader.e_ident.EI_CLASS);

      const parsedSections = parseSectionHeaders(parsedHeader);

      // Parse the symbol tables using the parsed sections headers
      const parsedSymbolTables = symbolsTableParser.parse(parsedSections);

      // Step 1: Retrieve content buffers for the sliced symbol tables
      const { slicedDynsym, slicedSymtab } = getSlicedBuffers(parsedSections, elfDataMock);

      // Step 2: Reconstruct the symbol tables
      const reconstructedSymbolTables = reconstructSymbolTables(
        parsedSymbolTables,
        isLittle,
        isELF32,
      );

      // Step 3: Assertion
      expect(reconstructedSymbolTables.dynsymBuffer).toEqual(slicedDynsym);
      expect(reconstructedSymbolTables.symtabBuffer).toEqual(slicedSymtab);
    });

    function parseSectionHeaders(parsedHeader: ElfStruct.Elf_Ehdr): {
      Header: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr;
      Name: string;
    }[] {
      const sectionHeaderOffset = parsedHeader.e_shoff;
      const sectionHeaderEntrySize = parsedHeader.e_shentsize;
      const sectionHeaderEntryCount = parsedHeader.e_shnum;
      const sectionHeaderStrTabOffset = parsedHeader.e_shstrndx;

      const parsedSections = sectionHeadersParser.parse(
        sectionHeaderOffset,
        sectionHeaderEntrySize,
        sectionHeaderEntryCount,
        sectionHeaderStrTabOffset,
      );

      return parsedSections;
    }
  });

  function getSlicedBuffers(
    parsedSections: {
      Header: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr;
      Name: string;
    }[],
    elfDataMock: FileInfo,
  ): { slicedDynsym: Buffer; slicedSymtab: Buffer } {
    const dynsymSection = parsedSections.find(section => section.Header.sh_type === 11);
    const symtabSection = parsedSections.find(section => section.Header.sh_type === 2);

    if (!dynsymSection || !symtabSection) {
      throw new Error("Dynamic symbol table or symbol table section not found.");
    }

    const slicedDynsym = getSlicedBuffer(elfDataMock, dynsymSection);
    const slicedSymtab = getSlicedBuffer(elfDataMock, symtabSection);

    return { slicedDynsym, slicedSymtab };
  }

  function reconstructSymbolTables(
    parsedSymbolTables: {
      dynsym: { Header: ElfStruct.Elf32_Sym | ElfStruct.Elf64_Sym; Name: string }[];
      symtab: { Header: ElfStruct.Elf32_Sym | ElfStruct.Elf64_Sym; Name: string }[];
    },
    isLE: boolean,
    isELF32: boolean,
  ): { dynsymBuffer: Buffer; symtabBuffer: Buffer } {
    const dynsymBuffer = reconstructBuffer(parsedSymbolTables.dynsym, isLE, isELF32);
    const symtabBuffer = reconstructBuffer(parsedSymbolTables.symtab, isLE, isELF32);

    return { dynsymBuffer, symtabBuffer };
  }

  function reconstructBuffer(
    parsedSymbols: { Header: ElfStruct.Elf32_Sym | ElfStruct.Elf64_Sym; Name: string }[],
    isLE: boolean,
    isELF32: boolean,
  ): Buffer {
    const entrySize = isELF32 === true ? 16 : 24;
    const reconstructedBuffer = Buffer.alloc(parsedSymbols.length * entrySize);

    // Write the parsed data back into the buffer
    parsedSymbols.forEach((Symbol, index) => {
      // Calculate the offset for this entry in the buffer
      const offset = index * entrySize;

      // Write the symbol fields into the buffer at the calculated offset
      if (isELF32 === true) {
        writeUInt32(reconstructedBuffer, Symbol.Header.st_name, offset, isLE);
        reconstructedBuffer.writeUInt8(Symbol.Header.st_info, offset + 12);
        reconstructedBuffer.writeUInt8(Symbol.Header.st_other, offset + 13);
        writeUInt16(reconstructedBuffer, Symbol.Header.st_shndx, offset + 14, isLE);
        writeUInt32(reconstructedBuffer, Symbol.Header.st_value, offset + 4, isLE);
        writeUInt32(reconstructedBuffer, Symbol.Header.st_size, offset + 8, isLE);
      } else {
        writeUInt32(reconstructedBuffer, Symbol.Header.st_name, offset, isLE);
        reconstructedBuffer.writeUInt8(Symbol.Header.st_info, offset + 4);
        reconstructedBuffer.writeUInt8(Symbol.Header.st_other, offset + 5);
        writeUInt16(reconstructedBuffer, Symbol.Header.st_shndx, offset + 6, isLE);
        writeBigUInt64(reconstructedBuffer, Symbol.Header.st_value, offset + 8, isLE);
        writeBigUInt64(reconstructedBuffer, Symbol.Header.st_size, offset + 16, isLE);
      }
    });

    return reconstructedBuffer;
  }
});
