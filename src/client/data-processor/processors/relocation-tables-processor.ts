import {
  RelocationTables_,
  elfHeaders_,
} from "../../../binary-parser/types/elf/elf-parsers-returns";
import { Relocations_Table } from "../types";
import {
  getRelocationSymbol,
  getRelocationType,
} from "../../../binary-parser/utils/dictionary/mapping-functions";
import { toHex } from "../helper-functions";

/**
 * Processes ELF relocation tables to create objects for frontend table components.
 * Converts raw relocation table data into human-readable formats using dictionary functions.
 *
 * @param relocations - The raw relocation tables data parsed from the binary-parser component.
 * @param header - The ELF header data used to determine the relocation type.
 * @returns An object containing processed relocations (rel and rela sections) with human-readable values or messages indicating no relocations are present.
 */
export function processRawData(
  relocations: RelocationTables_,
  header: elfHeaders_,
): Relocations_Table {
  const processedRel =
    relocations.rel.length > 0
      ? relocations.rel.map((relEntry, index) => ({
          offset: toHex(relEntry.r_offset),
          info: toHex(relEntry.r_info),
          type: getRelocationType(relEntry.r_info, header.e_ident.EI_CLASS, header.e_machine),
          symbolValue: getRelocationSymbol(relEntry.r_info, header.e_ident.EI_CLASS),
        }))
      : "No relocations in 'rel' section";

  const processedRela =
    relocations.rela.length > 0
      ? relocations.rela.map((relaEntry, index) => ({
          offset: toHex(relaEntry.r_offset),
          info: toHex(relaEntry.r_info),
          type: getRelocationType(relaEntry.r_info, header.e_ident.EI_CLASS, header.e_machine),
          symbolValue: getRelocationSymbol(relaEntry.r_info, header.e_ident.EI_CLASS),
          symNameAddend: toHex(relaEntry.r_addend),
        }))
      : "No relocations in 'rela' section";

  return { rel: processedRel, rela: processedRela };
}
