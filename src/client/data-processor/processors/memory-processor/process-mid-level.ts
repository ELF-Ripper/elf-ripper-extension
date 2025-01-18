import {
  SectionHeaders_,
  SymbolTables_,
} from "../../../../binary-parser/types/elf/elf-parsers-returns";
import { LowLevelMemoryRegionEntries, MidLevelMemoryRegionEntries } from "../../types";
import {
  calculateEndAddress,
  calculateUsed,
  calculateUsagePercent,
  calculateFree,
  isChild,
} from "../../helper-functions";

export function processMidLevel(
  sections: SectionHeaders_,
  lowLevelEntries: LowLevelMemoryRegionEntries[],
): MidLevelMemoryRegionEntries[] {
  const midLevelEntries: MidLevelMemoryRegionEntries[] = [];

  sections.forEach(section => {
    const startAddress = section.Header.sh_addr;
    const size = section.Header.sh_size;
    const endAddress = calculateEndAddress(startAddress, size);

    const childLowLevels = lowLevelEntries.filter(lowLevel =>
      isChild(startAddress, endAddress, lowLevel.Start_Address),
    );

    const used = calculateUsed(childLowLevels);
    const free = calculateFree(size, used);
    const usagePercent = calculateUsagePercent(used, size);

    // Update low-level usage percentages relative to the mid-level size
    childLowLevels.forEach(lowLevel => {
      lowLevel.Usage_Percent = calculateUsagePercent(lowLevel.Size, used);
    });

    midLevelEntries.push({
      Region: section.Name,
      Start_Address: startAddress,
      End_Address: endAddress,
      Size: size,
      Free: free,
      Used: used,
      Usage_Percent: usagePercent,
      LowLevel: childLowLevels,
    });
  });

  return midLevelEntries;
}

export function processMidLevelFromSymbols(symbols: SymbolTables_): MidLevelMemoryRegionEntries[] {
  const midLevelEntries: MidLevelMemoryRegionEntries[] = [];

  // Process dynsym entries
  if (symbols.dynsym) {
    symbols.dynsym.forEach(symbol => {
      const startAddress = symbol.Header.st_value;
      const size = symbol.Header.st_size;
      const endAddress = calculateEndAddress(startAddress, size);

      const used = null;
      const free = null;
      const usagePercent = null;

      midLevelEntries.push({
        Region: symbol.Name,
        Start_Address: startAddress,
        End_Address: endAddress,
        Size: size,
        Free: free,
        Used: used,
        Usage_Percent: usagePercent,
        LowLevel: [], // No low-level entries
      });
    });
  }

  // Process symtab entries
  if (symbols.symtab) {
    symbols.symtab.forEach(symbol => {
      const startAddress = symbol.Header.st_value;
      const size = symbol.Header.st_size;
      const endAddress = calculateEndAddress(startAddress, size);

      const used = null;
      const free = null;
      const usagePercent = null;

      midLevelEntries.push({
        Region: symbol.Name,
        Start_Address: startAddress,
        End_Address: endAddress,
        Size: size,
        Free: free,
        Used: used,
        Usage_Percent: usagePercent,
        LowLevel: [], // No low-level entries
      });
    });
  }

  return midLevelEntries;
}
