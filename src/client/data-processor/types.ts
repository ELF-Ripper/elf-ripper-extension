import { Memory, SuperELF } from "../../binary-parser/types";

// Processor feeds of
export interface ParsedObjects {
  elfObject?: SuperELF;
  memoryObject?: Memory[];
  elfFileName?: string;
  memoryFileName?: string;
}

// Build Analyzer Data Object
export interface MemoryRegionEntries {
  Region: string;
  Start_Address: number;
  End_Address: number;
  Size: number;
  Free: number;
  Used: number;
  Usage_Percent: number;
  Icon?: string; // Optional property for table usage in order to display expandable rows
}

export interface LowLevelMemoryRegionEntries extends MemoryRegionEntries {}

export interface MidLevelMemoryRegionEntries extends MemoryRegionEntries {
  LowLevel: LowLevelMemoryRegionEntries[];
}

export interface HighLevelMemoryRegionEntries extends MemoryRegionEntries {
  MidLevel: MidLevelMemoryRegionEntries[];
}

export interface MemoryTableEntries {
  HighLevel: HighLevelMemoryRegionEntries[];
}

// ELF_Header Table Data Object
export interface Header_Table {
  magic: string;
  class: string;
  data: string;
  type: string;
  machine: string;
  version: string;
  entryPointAddress: string;
  startOfProgramHeaders: string;
  startOfSectionHeaders: string;
  flags: number;
  sizeOfThisHeader: string;
  sizeOfProgramHeaders: string;
  numberOfProgramHeaders: number;
  sizeOfSectionHeaders: string;
  numberOfSectionHeaders: number;
  sectionHeaderStringTableIndex: number;
}

// ELF_ProgramHeaders Table Data Object
export interface ProgramHeader {
  type: string;
  offset: string;
  virtualAddress: string;
  physicalAddress: string;
  memorySize: string;
  flags: string;
  alignment: string;
}

export type ProgramHeaders_Table = ProgramHeader[];

// ELF_SectionHeaders Table Data Object
export interface SectionHeader {
  name: string;
  type: string;
  address: string;
  offset: string;
  size: string;
  entrySize: string;
  flags: string;
  link: number;
  info: number;
  addressAlignment: number;
}

export type SectionHeaders_Table = SectionHeader[];

// ELF_Symbols Tables Data Object
export interface SymbolTableEntry {
  name: string;
  value: string;
  size: number;
  type: string;
  binding: string;
  visibility: string;
  ndx: number;
}

export interface Symbols_Table {
  dynsym: SymbolTableEntry[];
  symtab: SymbolTableEntry[];
}

// ELF_DynamicTags Table Data Object
export interface DynamicTagEntry {
  tag: string;
  type: string;
  nameValue: string;
}

export type DynamicTags_Table = DynamicTagEntry[] | string;

// ELF_Relocations Tables Data Object
export interface RelocationEntry {
  offset: string;
  info: string;
  type: string;
  symbolValue: number;
}

export interface RelocationAEntry extends RelocationEntry {
  symNameAddend: string;
}

export interface Relocations_Table {
  rel: RelocationEntry[] | string;
  rela: RelocationAEntry[] | string;
}

// ELF_Notes Table Data Object
export interface NoteEntry {
  section: string;
  owner: string;
  dataSize: string;
  description: Buffer;
}

export type Notes_Table = NoteEntry[] | string;
