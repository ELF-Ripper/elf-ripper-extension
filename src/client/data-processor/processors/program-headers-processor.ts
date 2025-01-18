import { ProgramHeaders_ } from "../../../binary-parser/types/elf/elf-parsers-returns";
import { ProgramHeaders_Table } from "../types";
import {
  getProgramType,
  getProgramFlag,
} from "../../../binary-parser/utils/dictionary/mapping-functions";
import { toHex } from "../helper-functions";

/**
 * Processes ELF program headers to create objects for frontend table components.
 * Converts raw program header data into human-readable formats using dictionary functions.
 *
 * @param data - The raw program header data parsed from the binary-parser component.
 * @returns An array of processed program headers with human-readable values.
 */
export function processRawData(data: ProgramHeaders_): ProgramHeaders_Table {
  return data.map((program, index) => ({
    type: getProgramType(program.p_type),
    offset: toHex(program.p_offset),
    virtualAddress: toHex(program.p_vaddr),
    physicalAddress: toHex(program.p_paddr),
    memorySize: toHex(program.p_memsz),
    flags: getProgramFlag(program.p_flags),
    alignment: toHex(program.p_align),
  }));
}
