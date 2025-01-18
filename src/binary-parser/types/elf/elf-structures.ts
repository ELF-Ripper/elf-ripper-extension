// Define constant and types for ELF identifications

export const EI_NIDENT = 16;

// Define a single type for the e_ident (buffer)
export interface Elf_Eident {
  EI_MAG0: number;
  EI_MAG1: number;
  EI_MAG2: number;
  EI_MAG3: number;
  EI_CLASS: number;
  EI_DATA: number;
  EI_VERSION: number;
  EI_OSABI: number;
  EI_ABIVERSION: number;
  EI_PAD: number[]; // Array of size 7 for padding
}

// Define a single type for ELF Header (Ehdr)
export interface Elf_Ehdr {
  e_ident: Elf_Eident;
  e_type: number;
  e_machine: number;
  e_version: number;
  e_entry: number;
  e_phoff: number;
  e_shoff: number;
  e_flags: number;
  e_ehsize: number;
  e_phentsize: number;
  e_phnum: number;
  e_shentsize: number;
  e_shnum: number;
  e_shstrndx: number;
}

// Define types for Program Header (Phdr)
export interface Elf32_Phdr {
  p_type: number;
  p_offset: number;
  p_vaddr: number;
  p_paddr: number;
  p_filesz: number;
  p_memsz: number;
  p_flags: number;
  p_align: number;
}
export interface Elf64_Phdr {
  p_type: number;
  p_flags: number;
  p_offset: number;
  p_vaddr: number;
  p_paddr: number;
  p_filesz: number;
  p_memsz: number;
  p_align: number;
}

// Define types for Section Header (Shdr) entries
export interface Elf32_Shdr {
  sh_name: number;
  sh_type: number;
  sh_flags: number;
  sh_addr: number;
  sh_offset: number;
  sh_size: number;
  sh_link: number;
  sh_info: number;
  sh_addralign: number;
  sh_entsize: number;
}
export interface Elf64_Shdr {
  sh_name: number;
  sh_type: number;
  sh_flags: number;
  sh_addr: number;
  sh_offset: number;
  sh_size: number;
  sh_link: number;
  sh_info: number;
  sh_addralign: number;
  sh_entsize: number;
}

// Define types for String and Symbol table entries
export interface Elf32_Sym {
  st_name: number;
  st_value: number;
  st_size: number;
  st_info: number;
  st_other: number;
  st_shndx: number;
}
export interface Elf64_Sym {
  st_name: number;
  st_info: number;
  st_other: number;
  st_shndx: number;
  st_value: number;
  st_size: number;
}

// Define types for ELF Relocation entries (Rel & Rela) structures
export interface Elf32_Rel {
  r_offset: number;
  r_info: number;
}
export interface Elf32_Rela extends Elf32_Rel {
  r_addend: number;
}
export interface Elf64_Rel {
  r_offset: number;
  r_info: number;
}
export interface Elf64_Rela extends Elf64_Rel {
  r_addend: number;
}

// Define types for ELF Dynamic Tags entries (Dyn) structures
export interface Elf32_Dyn {
  d_tag: number;
  d_un: number;
}
export interface Elf64_Dyn {
  d_tag: number;
  d_un: number;
}

//Define types for ELF Notes (Nhdr) entry structures
export interface Elf32_Nhdr {
  n_namesz: number;
  n_descsz: number;
  n_type: number;
}
export interface Elf64_Nhdr {
  n_namesz: number;
  n_descsz: number;
  n_type: number;
}

export * from "./elf-structures";
