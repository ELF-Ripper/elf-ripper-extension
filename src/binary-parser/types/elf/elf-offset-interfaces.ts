// Define interfaces for offset values

export interface Header {
  e_ident: number;
  e_type: number;
  e_machine: number;
  e_version: number;
  e_entry: number;
  e_phoff: {
    ELF32: number;
    ELF64: number;
  };
  e_shoff: {
    ELF32: number;
    ELF64: number;
  };
  e_flags: {
    ELF32: number;
    ELF64: number;
  };
  e_ehsize: {
    ELF32: number;
    ELF64: number;
  };
  e_phentsize: {
    ELF32: number;
    ELF64: number;
  };
  e_phnum: {
    ELF32: number;
    ELF64: number;
  };
  e_shentsize: {
    ELF32: number;
    ELF64: number;
  };
  e_shnum: {
    ELF32: number;
    ELF64: number;
  };
  e_shstrndx: {
    ELF32: number;
    ELF64: number;
  };
}

export interface ProgramHeaders {
  p_type: number;
  p_offset: {
    ELF32: number;
    ELF64: number;
  };
  p_vaddr: {
    ELF32: number;
    ELF64: number;
  };
  p_paddr: {
    ELF32: number;
    ELF64: number;
  };
  p_filesz: {
    ELF32: number;
    ELF64: number;
  };
  p_memsz: {
    ELF32: number;
    ELF64: number;
  };
  p_flags: {
    ELF32: number;
    ELF64: number;
  };
  p_align: {
    ELF32: number;
    ELF64: number;
  };
}

export interface SectionHeaders {
  sh_name: number;
  sh_type: number;
  sh_flags: number;
  sh_addr: {
    ELF32: number;
    ELF64: number;
  };
  sh_offset: {
    ELF32: number;
    ELF64: number;
  };
  sh_size: {
    ELF32: number;
    ELF64: number;
  };
  sh_link: {
    ELF32: number;
    ELF64: number;
  };
  sh_info: {
    ELF32: number;
    ELF64: number;
  };
  sh_addralign: {
    ELF32: number;
    ELF64: number;
  };
  sh_entsize: {
    ELF32: number;
    ELF64: number;
  };
}

export interface Symbols {
  st_name: number;
  st_value: {
    ELF32: number;
    ELF64: number;
  };
  st_size: {
    ELF32: number;
    ELF64: number;
  };
  st_info: {
    ELF32: number;
    ELF64: number;
  };
  st_other: {
    ELF32: number;
    ELF64: number;
  };
  st_shndx: {
    ELF32: number;
    ELF64: number;
  };
}

export interface Relocations {
  r_offset: {
    ELF32: number;
    ELF64: number;
  };
  r_info: {
    ELF32: number;
    ELF64: number;
  };
  r_addend: {
    ELF32: number;
    ELF64: number;
  };
}

export interface DynamicTags {
  d_tag: number;
  d_un: {
    ELF32: number;
    ELF64: number;
  };
}

export interface Notes {
  n_namesz: number;
  n_descsz: number;
  n_type: number;
}
