import { Memory } from "../../../../binary-parser/types/memory-structure";
import { SectionHeaders_ } from "../../../../binary-parser/types/elf/elf-parsers-returns";
import { MidLevelMemoryRegionEntries, HighLevelMemoryRegionEntries } from "../../types";
import {
  calculateEndAddress,
  calculateUsed,
  calculateUsagePercent,
  calculateFree,
  isChild,
} from "../../helper-functions";

export function processHighLevel(
  memoryObject: Memory[],
  midLevelEntries: MidLevelMemoryRegionEntries[],
): HighLevelMemoryRegionEntries[] {
  const highLevelEntries: HighLevelMemoryRegionEntries[] = [];

  memoryObject.forEach(memory => {
    const startAddress = memory.Origin;
    const size = memory.Length;
    const endAddress = calculateEndAddress(startAddress, size);

    const childMidLevels = midLevelEntries.filter(midLevel =>
      isChild(startAddress, endAddress, midLevel.Start_Address),
    );

    const used = calculateUsed(childMidLevels);
    const free = calculateFree(size, used);
    const usagePercent = calculateUsagePercent(used, size);

    // Update mid-level usage percentages relative to the high-level size
    childMidLevels.forEach(midLevel => {
      midLevel.Usage_Percent = calculateUsagePercent(midLevel.Size, used);
    });

    highLevelEntries.push({
      Region: memory.Name,
      Start_Address: startAddress,
      End_Address: endAddress,
      Size: size,
      Free: free,
      Used: used,
      Usage_Percent: usagePercent,
      MidLevel: childMidLevels,
    });
  });

  return highLevelEntries;
}

export function processHighLevelFromSections(
  sections: SectionHeaders_,
  midLevelEntries: MidLevelMemoryRegionEntries[],
): HighLevelMemoryRegionEntries[] {
  const highLevelEntries: HighLevelMemoryRegionEntries[] = [];

  sections.forEach(section => {
    const startAddress = section.Header.sh_addr;
    const size = section.Header.sh_size;
    const endAddress = calculateEndAddress(startAddress, size);

    const childMidLevels = midLevelEntries.filter(midLevel =>
      isChild(startAddress, endAddress, midLevel.Start_Address),
    );

    const used = calculateUsed(childMidLevels);
    const free = calculateFree(size, used);
    const usagePercent = calculateUsagePercent(used, size);

    // Update mid-level usage percentages relative to the high-level size
    childMidLevels.forEach(midLevel => {
      midLevel.Usage_Percent = calculateUsagePercent(midLevel.Size, used);
    });

    highLevelEntries.push({
      Region: section.Name,
      Start_Address: startAddress,
      End_Address: endAddress,
      Size: size,
      Free: free,
      Used: used,
      Usage_Percent: usagePercent,
      MidLevel: childMidLevels,
    });
  });

  return highLevelEntries;
}
