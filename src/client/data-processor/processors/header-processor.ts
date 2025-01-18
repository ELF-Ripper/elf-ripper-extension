import { elfHeaders_ } from "../../../binary-parser/types/elf/elf-parsers-returns";
import { Header_Table } from "../types";
import {
  getElfClass,
  getElfEndianess,
  getElfType,
  getElfMachine,
} from "../../../binary-parser/utils/dictionary/mapping-functions";
import { toHex } from "../helper-functions";

/**
 * Processes ELF header data to create objects for frontend table components.
 * Translates raw header values into human-readable formats using dictionary functions.
 *
 * @param data - The raw ELF header data parsed from the binary-parser component.
 * @returns An object containing processed and human-readable ELF header information.
 */
export function processRawData(data: elfHeaders_): Header_Table {
  // Convert the first bytes of the ELF header (e_ident) to a hexadecimal string,
  // except for the EI_PAD field, which is separately handled.
  const magicHex = Object.entries(data.e_ident)
    .filter(([key]) => key !== "EI_PAD")
    .map(([_, byte]) => byte.toString(16).padStart(2, "0"))
    .join(" ");

  // Convert the EI_PAD field to a hexadecimal string.
  const padHex = data.e_ident.EI_PAD.map(byte => byte.toString(16).padStart(2, "0")).join(" ");

  return {
    magic: `${magicHex} ${padHex}`,
    class: getElfClass(data.e_ident.EI_CLASS),
    data:
      getElfEndianess(data.e_ident.EI_DATA) === "LITTLE_ENDIAN"
        ? "2's complement, little endian"
        : "2's complement, big endian",
    type: getElfType(data.e_type),
    machine: getElfMachine(data.e_machine),
    version: toHex(data.e_version),
    entryPointAddress: toHex(data.e_entry),
    startOfProgramHeaders: `${data.e_phoff} (bytes into file)`,
    startOfSectionHeaders: `${data.e_shoff} (bytes into file)`,
    flags: data.e_flags, // ELF-specific flags (could use a dictionary function)
    sizeOfThisHeader: `${data.e_ehsize} (bytes)`,
    sizeOfProgramHeaders: `${data.e_phentsize} (bytes)`,
    numberOfProgramHeaders: data.e_phnum,
    sizeOfSectionHeaders: `${data.e_shentsize} (bytes)`,
    numberOfSectionHeaders: data.e_shnum,
    sectionHeaderStringTableIndex: data.e_shstrndx,
  };
}
