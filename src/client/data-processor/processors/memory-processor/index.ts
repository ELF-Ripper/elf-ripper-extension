import { SuperELF } from "../../../../binary-parser/types/super-elf";
import { Memory } from "../../../../binary-parser/types/memory-structure";
import {
  MemoryTableEntries,
  LowLevelMemoryRegionEntries,
  MidLevelMemoryRegionEntries,
  HighLevelMemoryRegionEntries,
} from "../../types";
import { filterSectionsWithAllocFlag, filterSymbolsByType } from "../../helper-functions";
import { processLowLevel } from "./process-low-level";
import { processMidLevel, processMidLevelFromSymbols } from "./process-mid-level";
import { processHighLevel, processHighLevelFromSections } from "./process-high-level";

/**
 * Processes raw ELF and memory data to generate Build Analyzer table entries.
 *
 * This function mimics the Build Analyzer component of the STM32CubeIDE by analyzing the ELF sections and symbols,
 * along with optional memory regions from a map file. It organizes the data into high-level memory regions,
 * mid-level memory sections, and low-level symbols, which are then used to create the final memory analyzer table entries.
 *
 * The final output is an object that includes high-level memory regions with nested mid-level sections and
 * low-level symbols, reflecting how memory is allocated in the ELF file and (optionally) the map file.
 *
 * @param elfObject - The parsed ELF object containing sections and symbols.
 * @param memoryObject - Optional array of memory regions parsed from a map file.
 * @returns MemoryTableEntries - The processed memory table entries, which include high-level memory regions.
 */
export function processRawData(elfObject: SuperELF, memoryObject?: Memory[]): MemoryTableEntries {
  // Step 1: Filter ELF sections and symbols to include only those allocated to memory.
  const filteredSections = filterSectionsWithAllocFlag(elfObject.Sections);
  const filteredSymbols = filterSymbolsByType(elfObject.Symbols);

  // Step 2: Initialize arrays to store high-level and mid-level memory region entries.
  let highLevelEntries: HighLevelMemoryRegionEntries[] = [];
  let midLevelEntries: MidLevelMemoryRegionEntries[] = [];

  // Step 3: If memory regions are provided from a map file:
  if (memoryObject) {
    // a) Process low-level memory entries from the filtered symbols.
    const lowLevelEntries: LowLevelMemoryRegionEntries[] = processLowLevel(filteredSymbols);

    // b) Process mid-level memory entries from the filtered sections, associating them with low-level entries.
    midLevelEntries = processMidLevel(filteredSections, lowLevelEntries);

    // c) Process high-level memory regions from the memory object, associating them with mid-level entries.
    highLevelEntries = processHighLevel(memoryObject, midLevelEntries);
  } else {
    // Step 4: If no memory regions are provided:
    // a) Process mid-level entries directly from symbols when no memory object is available.
    midLevelEntries = processMidLevelFromSymbols(filteredSymbols);

    // b) Process high-level entries directly from sections when no memory object is available.
    highLevelEntries = processHighLevelFromSections(filteredSections, midLevelEntries);
  }

  // Step 5: Return the processed memory table entries, organized into high-level regions.
  return { HighLevel: highLevelEntries };
}
