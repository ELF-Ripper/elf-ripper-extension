import { DictionaryType } from "../types/dictionary-type";
import { getElfMachine, getElfClass } from "./dictionary/mapping-functions";

export function checkMachineType(
  fileContent: Buffer,
  endianess: DictionaryType | undefined,
  EI_DATA?: number,
): DictionaryType {
  const E_MACHINE_OFFSET = 0x12;

  // Determine the endianess if it's not provided
  if (endianess === undefined && EI_DATA !== undefined) {
    endianess = getElfClass(EI_DATA);
  } else if (endianess === undefined) {
    throw new Error("Endianness or EI_DATA must be provided.");
  }

  const e_machine = readUInt16(fileContent, E_MACHINE_OFFSET, endianess);
  return getElfMachine(e_machine);
}

export function readUInt16(fileContent: Buffer, offset: number, endianess: DictionaryType): number {
  if (endianess === "LITTLE_ENDIAN") {
    return fileContent.readUInt16LE(offset);
  } else {
    return fileContent.readUInt16BE(offset);
  }
}

export function readUInt32(fileContent: Buffer, offset: number, endianess: DictionaryType): number {
  if (endianess === "LITTLE_ENDIAN") {
    return fileContent.readUInt32LE(offset);
  } else {
    return fileContent.readUInt32BE(offset);
  }
}

export function readUInt64(fileContent: Buffer, offset: number, endianess: DictionaryType): number {
  if (endianess === "LITTLE_ENDIAN") {
    return Number(fileContent.readBigUInt64LE(offset));
  } else {
    return Number(fileContent.readBigUInt64BE(offset));
  }
}

export function readNullTerminatedStrings(fileContent: Buffer, offset: number): string {
  let string = "";
  let char = fileContent.readUInt8(offset);

  // Read characters until null terminator (0)
  while (char !== 0x00) {
    string += String.fromCharCode(char);
    offset++;
    char = fileContent.readUInt8(offset);
  }

  return string;
}

export function parseNumericValue(value: string): number {
  if (value.startsWith("0x")) {
    return parseInt(value, 16);
  } else if (value.startsWith("0o")) {
    return parseInt(value, 8);
  } else {
    return parseInt(value, 10);
  }
}

export function convertSizeToBytes(valueOnBytes: number, unit: string): number {
  switch (unit.toLowerCase()) {
    case "k":
      return valueOnBytes * 1024; // kilobyte to bytes
    case "m":
      return valueOnBytes * 1024 * 1024; // megabyte to bytes
    case "g":
      return valueOnBytes * 1024 * 1024 * 1024; // gigabyte to bytes
    case "t":
      return valueOnBytes * 1024 * 1024 * 1024 * 1024; // terabyte to bytes
    default:
      return valueOnBytes; // if no unit or unknown unit, assume bytes
  }
}
