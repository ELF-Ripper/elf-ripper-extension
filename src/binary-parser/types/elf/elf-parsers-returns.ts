// Importing ELF structure types
import * as ElfStruct from "./elf-structures";

// ELF Header
export type elfHeaders_ = ElfStruct.Elf_Ehdr;

// Program Headers
export type ProgramHeaders_ = (ElfStruct.Elf32_Phdr | ElfStruct.Elf64_Phdr)[];

// Section Headers
export type SectionHeaders_ = {
  Header: ElfStruct.Elf32_Shdr | ElfStruct.Elf64_Shdr;
  Name: string;
}[];

// Symbol Tables
export type SymbolTables_ = {
  dynsym: { Header: ElfStruct.Elf32_Sym | ElfStruct.Elf64_Sym; Name: string }[];
  symtab: { Header: ElfStruct.Elf32_Sym | ElfStruct.Elf64_Sym; Name: string }[];
};

// Relocation Tables
export type RelocationTables_ = {
  rel: (ElfStruct.Elf32_Rel | ElfStruct.Elf64_Rel)[];
  rela: (ElfStruct.Elf32_Rela | ElfStruct.Elf64_Rela)[];
};

// Dynamic Tags
export type DynamicTags_ = (ElfStruct.Elf32_Dyn | ElfStruct.Elf64_Dyn)[];

// Notes
export type Notes_ = {
  Table: ElfStruct.Elf32_Nhdr | ElfStruct.Elf64_Nhdr;
  Name: string;
  Description: Buffer;
  Section: string;
}[];
