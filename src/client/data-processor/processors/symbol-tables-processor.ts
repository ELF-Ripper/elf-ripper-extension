import { SymbolTables_ } from "../../../binary-parser/types/elf/elf-parsers-returns";
import { Symbols_Table } from "../types";
import {
  getSymbolType,
  getSymbolBinding,
  getSymbolVisibility,
} from "../../../binary-parser/utils/dictionary/mapping-functions";
import { toHex } from "../helper-functions";

/**
 * Processes ELF symbol tables to create objects for frontend table components.
 * Converts raw symbol table data into human-readable formats using dictionary functions.
 *
 * @param data - The raw symbol table data parsed from the binary-parser component.
 * @returns An object containing processed symbol tables (dynsym and symtab) with human-readable values.
 */
export function processRawData(data: SymbolTables_): Symbols_Table {
  return {
    dynsym: data.dynsym.map((symbol, index) => ({
      name: symbol.Name,
      value: toHex(symbol.Header.st_value),
      size: symbol.Header.st_size,
      type: getSymbolType(symbol.Header.st_info),
      binding: getSymbolBinding(symbol.Header.st_info),
      visibility: getSymbolVisibility(symbol.Header.st_other),
      ndx: symbol.Header.st_shndx,
    })),
    symtab: data.symtab.map((symbol, index) => ({
      name: symbol.Name,
      value: toHex(symbol.Header.st_value),
      size: symbol.Header.st_size,
      type: getSymbolType(symbol.Header.st_info),
      binding: getSymbolBinding(symbol.Header.st_info),
      visibility: getSymbolVisibility(symbol.Header.st_other),
      ndx: symbol.Header.st_shndx,
    })),
  };
}
