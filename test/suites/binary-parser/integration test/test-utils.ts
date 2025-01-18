import { FileInfo } from "../../../../src/binary-parser/types";
import * as ElfStruct from "../../../../src/binary-parser/types/elf/elf-structures";

export function getSlicedBuffer(
  elfDataMock: FileInfo,
  section: {
    Header: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr;
    Name: string;
  },
): Buffer {
  const start = section.Header.sh_offset;
  const end = start + section.Header.sh_size;

  return elfDataMock.fileContent!.slice(start, end);
}

export function checkEndianess(EI_DATA: number): boolean {
  // The value of EI_DATA indicating little endian is 1
  return EI_DATA === 1;
}

export function checkClass(EI_CLASS: number): boolean {
  // The value of EI_DATA indicating little endian is 1
  return EI_CLASS === 1;
}

// Functions for handling endianness
export function writeUInt16(
  buffer: Buffer,
  value: number,
  offset: number,
  littleEndian: boolean,
): void {
  if (littleEndian) {
    buffer.writeUInt16LE(value, offset);
  } else {
    buffer.writeUInt16BE(value, offset);
  }
}

export function writeUInt32(
  buffer: Buffer,
  value: number,
  offset: number,
  littleEndian: boolean,
): void {
  if (littleEndian) {
    buffer.writeUInt32LE(value, offset);
  } else {
    buffer.writeUInt32BE(value, offset);
  }
}

export function writeBigUInt64(
  buffer: Buffer,
  value: number,
  offset: number,
  littleEndian: boolean,
): void {
  if (littleEndian) {
    buffer.writeBigUInt64LE(BigInt(value), offset);
  } else {
    buffer.writeBigUInt64BE(BigInt(value), offset);
  }
}
