import { SectionHeaders_, SymbolTables_ } from "../../binary-parser/types/elf/elf-parsers-returns";
import { MemoryRegionEntries } from "./types";
import {
  getSectionFlagString,
  getSymbolType,
  getSymbolVisibility,
} from "../../binary-parser/utils/dictionary/mapping-functions";

/**
 * Calculates the end address given a start address and size.
 * @param start - The start address.
 * @param size - The size of the region.
 * @returns The end address.
 */
export function calculateEndAddress(start: number, size: number): number {
  return start + size;
}

/**
 * Determines if a child element falls within a parent's range.
 * @param parentStart - The start address of the parent.
 * @param parentEnd - The end address of the parent.
 * @param childStart - The start address of the child.
 * @returns True if the child is within the parent's range, false otherwise.
 */
export function isChild(parentStart: number, parentEnd: number, childStart: number): boolean {
  return childStart >= parentStart && childStart < parentEnd;
}

/**
 * Calculates the total size used by child entries.
 * @param childEntries - An array of memory region entries.
 * @returns The total size used.
 */
export function calculateUsed(childEntries: MemoryRegionEntries[]): number {
  return childEntries.reduce((sum, child) => sum + child.Size, 0);
}

/**
 * Calculates the usage percentage of a memory region.
 * @param used - The amount of used memory.
 * @param size - The total size of the memory region.
 * @returns The usage percentage.
 */
export function calculateUsagePercent(used: number, size: number): number {
  return (used / size) * 100;
}

/**
 * Calculates the free memory in a region.
 * @param size - The total size of the region.
 * @param used - The amount of used memory.
 * @returns The amount of free memory.
 */
export function calculateFree(size: number, used: number): number {
  return size - used;
}

/**
 * Filters sections that have the SHF_ALLOC flag.
 * @param sections - The array of section headers.
 * @returns A filtered array of section headers with the SHF_ALLOC flag.
 */
export function filterSectionsWithAllocFlag(sections: SectionHeaders_): SectionHeaders_ {
  return sections.filter(section => {
    const flags = getSectionFlagString(section.Header.sh_flags);
    return flags.includes("SHF_ALLOC");
  });
}

/**
 * Filters symbols by type, including only STT_OBJECT and STT_FUNC types and excluding those with STV_HIDDEN visibility.
 * @param symbols - The arrays of symbol tables.
 * @returns Filtered symbol tables containing only the specified types.
 */
export function filterSymbolsByType(symbols: SymbolTables_): SymbolTables_ {
  const filteredSymbols: SymbolTables_ = {
    dynsym: [],
    symtab: [],
  };

  if (symbols.dynsym) {
    filteredSymbols.dynsym = symbols.dynsym.filter(symbol => {
      const type = getSymbolType(symbol.Header.st_info);
      const visibility = getSymbolVisibility(symbol.Header.st_other);
      return (type === "STT_OBJECT" || type === "STT_FUNC") && visibility !== "STV_HIDDEN";
    });
  }

  if (symbols.symtab) {
    filteredSymbols.symtab = symbols.symtab.filter(symbol => {
      const type = getSymbolType(symbol.Header.st_info);
      const visibility = getSymbolVisibility(symbol.Header.st_other);
      return (type === "STT_OBJECT" || type === "STT_FUNC") && visibility !== "STV_HIDDEN";
    });
  }

  return filteredSymbols;
}

/**
 * Converts a decimal value to an 8-digit zero-padded hexadecimal string.
 * @param value - The decimal value to convert.
 * @returns A string representing the hexadecimal value, prefixed with "0x" and zero-padded to 8 digits.
 */
export function toHex(value: number): string {
  return `0x${value.toString(16).padStart(8, "0").toUpperCase()}`;
}
