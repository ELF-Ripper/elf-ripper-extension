import * as offsetType from "../types/elf/elf-offset-interfaces";

// Default offset values for common architectures

export const defaultEhdrOffsets: offsetType.Header = {
  e_ident: 0,
  e_type: 16,
  e_machine: 18,
  e_version: 20,
  e_entry: 24,
  e_phoff: {
    ELF32: 28,
    ELF64: 32,
  },
  e_shoff: {
    ELF32: 32,
    ELF64: 40,
  },
  e_flags: {
    ELF32: 36,
    ELF64: 48,
  },
  e_ehsize: {
    ELF32: 40,
    ELF64: 52,
  },
  e_phentsize: {
    ELF32: 42,
    ELF64: 54,
  },
  e_phnum: {
    ELF32: 44,
    ELF64: 56,
  },
  e_shentsize: {
    ELF32: 46,
    ELF64: 58,
  },
  e_shnum: {
    ELF32: 48,
    ELF64: 60,
  },
  e_shstrndx: {
    ELF32: 50,
    ELF64: 62,
  },
};
export const defaultPhdrOffsets: offsetType.ProgramHeaders = {
  p_type: 0,
  p_offset: {
    ELF32: 4,
    ELF64: 8,
  },
  p_vaddr: {
    ELF32: 8,
    ELF64: 16,
  },
  p_paddr: {
    ELF32: 12,
    ELF64: 24,
  },
  p_filesz: {
    ELF32: 16,
    ELF64: 32,
  },
  p_memsz: {
    ELF32: 20,
    ELF64: 40,
  },
  p_flags: {
    ELF32: 24,
    ELF64: 4,
  },
  p_align: {
    ELF32: 28,
    ELF64: 48,
  },
};
export const defaultShdrOffsets: offsetType.SectionHeaders = {
  sh_name: 0,
  sh_type: 4,
  sh_flags: 8,
  sh_addr: {
    ELF32: 12,
    ELF64: 16,
  },
  sh_offset: {
    ELF32: 16,
    ELF64: 24,
  },
  sh_size: {
    ELF32: 20,
    ELF64: 32,
  },
  sh_link: {
    ELF32: 24,
    ELF64: 40,
  },
  sh_info: {
    ELF32: 28,
    ELF64: 44,
  },
  sh_addralign: {
    ELF32: 32,
    ELF64: 48,
  },
  sh_entsize: {
    ELF32: 36,
    ELF64: 56,
  },
};
export const defaultSymOffsets: offsetType.Symbols = {
  st_name: 0,
  st_value: {
    ELF32: 4,
    ELF64: 8,
  },
  st_size: {
    ELF32: 8,
    ELF64: 16,
  },
  st_info: {
    ELF32: 12,
    ELF64: 4,
  },
  st_other: {
    ELF32: 13,
    ELF64: 5,
  },
  st_shndx: {
    ELF32: 14,
    ELF64: 6,
  },
};
export const defaultRelocsOffsets: offsetType.Relocations = {
  r_offset: {
    ELF32: 0,
    ELF64: 0,
  },
  r_info: {
    ELF32: 4,
    ELF64: 8,
  },
  r_addend: {
    ELF32: 8,
    ELF64: 16,
  },
};
export const defaultDynTagsOffsets: offsetType.DynamicTags = {
  d_tag: 0,
  d_un: {
    ELF32: 4,
    ELF64: 8,
  },
};
export const defaultNotesOffsets: offsetType.Notes = {
  n_namesz: 0,
  n_descsz: 4,
  n_type: 8,
};

// Allow contributors to provide custom offset values for specific architectures

export const customEhdrOffsets: Record<string, offsetType.Header> = {
  // Add custom offset values for specific architectures here
};

export const customPhdrOffsets: Record<string, offsetType.ProgramHeaders> = {
  // Add custom offset values for specific architectures here
};

export const customShdrOffsets: Record<string, offsetType.SectionHeaders> = {
  // Add custom offset values for specific architectures here
};

export const customSymOffsets: Record<string, offsetType.Symbols> = {
  // Add custom offset values for specific architectures here
};

export const customRelocsOffsets: Record<string, offsetType.Relocations> = {
  // Add custom offset values for specific architectures here
};

export const customDynTagsOffsets: Record<string, offsetType.DynamicTags> = {
  // Add custom offset values for specific architectures here
};

export const customNotesOffsets: Record<string, offsetType.Notes> = {
  // Add custom offset values for specific architectures here
};
