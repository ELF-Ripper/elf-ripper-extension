import { SectionHeaders_ } from "../../../binary-parser/types/elf/elf-parsers-returns";
import { SectionHeaders_Table } from "../types";
import {
  getSectionType,
  getSectionFlagString,
} from "../../../binary-parser/utils/dictionary/mapping-functions";
import { toHex } from "../helper-functions";

/**
 * Processes ELF section headers to create objects for frontend table components.
 * Converts raw section header data into human-readable formats using dictionary functions.
 *
 * @param data - The raw section header data parsed from the binary-parser component.
 * @returns An array of processed section headers with human-readable values.
 */
export function processRawData(data: SectionHeaders_): SectionHeaders_Table {
  return data.map((section, index) => ({
    name: section.Name,
    type: getSectionType(section.Header.sh_type),
    address: toHex(section.Header.sh_addr),
    offset: toHex(section.Header.sh_offset),
    size: toHex(section.Header.sh_size),
    entrySize: toHex(section.Header.sh_entsize),
    flags: getSectionFlagString(section.Header.sh_flags),
    link: section.Header.sh_link,
    info: section.Header.sh_info,
    addressAlignment: section.Header.sh_addralign,
  }));
}
