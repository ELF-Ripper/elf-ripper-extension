import { SymbolTables_ } from "../../../../binary-parser/types/elf/elf-parsers-returns";
import { LowLevelMemoryRegionEntries } from "../../types";
import { calculateEndAddress } from "../../helper-functions";

export function processLowLevel(symbols: SymbolTables_): LowLevelMemoryRegionEntries[] {
  const lowLevelEntries: LowLevelMemoryRegionEntries[] = [];

  // Process dynsym entries
  if (symbols.dynsym) {
    symbols.dynsym.forEach(symbol => {
      const startAddress = symbol.Header.st_value;
      const size = symbol.Header.st_size;
      const endAddress = calculateEndAddress(startAddress, size);

      lowLevelEntries.push({
        Region: symbol.Name,
        Start_Address: startAddress,
        End_Address: endAddress,
        Size: size,
        Free: null, // Placeholder, not calculated for LowLevel
        Used: null, // Placeholder, not calculated for LowLevel
        Usage_Percent: null, // Placeholder, not calculated for LowLevel
      });
    });
  }

  // Process symtab entries
  if (symbols.symtab) {
    symbols.symtab.forEach(symbol => {
      const startAddress = symbol.Header.st_value;
      const size = symbol.Header.st_size;
      const endAddress = calculateEndAddress(startAddress, size);

      lowLevelEntries.push({
        Region: symbol.Name,
        Start_Address: startAddress,
        End_Address: endAddress,
        Size: size,
        Free: null, // Placeholder, not calculated for LowLevel
        Used: null, // Placeholder, not calculated for LowLevel
        Usage_Percent: null, // Placeholder, not calculated for LowLevel
      });
    });
  }

  return lowLevelEntries;
}
