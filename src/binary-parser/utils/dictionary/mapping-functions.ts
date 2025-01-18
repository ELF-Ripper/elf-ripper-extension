import { DictionaryType } from "../../types/dictionary-type";
import * as Header from "./maps/header";
import * as Program from "./maps/program-header";
import * as Section from "./maps/section-header";
import * as Symbol from "./maps/symbols";
import * as Relocations from "./maps/relocations";
import * as DynamicTags from "./maps/dynamic-tags";

export function getElfClass(EI_CLASS: number): string {
  return Header.ClassMap[EI_CLASS] || Header.ClassMap[0];
}

export function getElfEndianess(EI_DATA: number): string {
  return Header.EndianessMap[EI_DATA] || Header.EndianessMap[0];
}

export function getElfMachine(e_machine: number): string {
  return Header.MachineMap[e_machine] || `Unknown e_machine: ${e_machine}`;
}

export function getElfType(e_type: number): string {
  return Header.TypeMap[e_type] || `Unknown e_type: ${e_type}`;
}

export function getProgramType(p_type: number): string {
  return Program.TypeMap[p_type] || `Unknown p_type: ${p_type}`;
}

export function getProgramFlag(p_flags: number): string {
  const PF_X = 1 << 0; // Segment is executable
  const PF_W = 1 << 1; // Segment is writable
  const PF_R = 1 << 2; // Segment is readable
  const PF_MASKOS = 0x0ff00000; // OS-specific
  const PF_MASKPROC = 0xf0000000; // Processor-specific

  if (p_flags === 0) {
    return "No p_flags (Segment has no permissions)";
  }

  let flagsList = [];

  if (p_flags & PF_X) flagsList.push("X");
  if (p_flags & PF_W) flagsList.push("W");
  if (p_flags & PF_R) flagsList.push("R");

  if ((p_flags & PF_MASKOS) !== 0 || (p_flags & PF_MASKPROC) !== 0) {
    return `Unknown p_flags: ${p_flags}`;
  }

  return flagsList.join(" | ");
}

export function getSectionType(sh_type: number): string {
  return Section.TypeMap[sh_type] || `Unknown sh_type: ${sh_type}`;
}

export function getSectionFlagString(sh_flags: number): string {
  const flagStrings: string[] = [];

  if (sh_flags & 0x01) {
    flagStrings.push("SHF_WRITE");
  }
  if (sh_flags & 0x02) {
    flagStrings.push("SHF_ALLOC");
  }
  if (sh_flags & 0x04) {
    flagStrings.push("SHF_EXECINSTR");
  }
  if (sh_flags & 0x10) {
    flagStrings.push("SHF_MERGE");
  }
  if (sh_flags & 0x20) {
    flagStrings.push("SHF_STRINGS");
  }
  if (sh_flags & 0x40) {
    flagStrings.push("SHF_INFO_LINK");
  }
  if (sh_flags & 0x80) {
    flagStrings.push("SHF_LINK_ORDER");
  }
  if (sh_flags & 0x100) {
    flagStrings.push("SHF_OS_NONCONFORMING");
  }
  if (sh_flags & 0x200) {
    flagStrings.push("SHF_GROUP");
  }
  if (sh_flags & 0x400) {
    flagStrings.push("SHF_TLS");
  }
  if (sh_flags & 0x800) {
    flagStrings.push("SHF_COMPRESSED");
  }

  // OS-specific sh_flags
  if (sh_flags & 0x0ff00000) {
    flagStrings.push(`SHF_MASKOS(${sh_flags >>> 20})`);
  }

  // Processor-specific sh_flags
  if (sh_flags & 0xf0000000) {
    flagStrings.push(`SHF_MASKPROC(${sh_flags >>> 28})`);
  }

  if (sh_flags & 0x40000000) {
    flagStrings.push("SHF_ORDERED");
  }
  if (sh_flags & 0x80000000) {
    flagStrings.push("SHF_EXCLUDE");
  }

  // MIPS-specific sh_flags
  if (sh_flags & 0x10000000) {
    flagStrings.push("SHF_MIPS_GPREL");
  }
  if (sh_flags & 0x20000000) {
    flagStrings.push("SHF_MIPS_MERGE");
  }
  if (sh_flags & 0x40000000) {
    flagStrings.push("SHF_MIPS_ADDR");
  }
  if (sh_flags & 0x80000000) {
    flagStrings.push("SHF_MIPS_STRINGS");
  }
  if (sh_flags & 0x08000000) {
    flagStrings.push("SHF_MIPS_NOSTRIP");
  }
  if (sh_flags & 0x04000000) {
    flagStrings.push("SHF_MIPS_LOCAL");
  }
  if (sh_flags & 0x02000000) {
    flagStrings.push("SHF_MIPS_NAMES");
  }
  if (sh_flags & 0x01000000) {
    flagStrings.push("SHF_MIPS_NODUPE");
  }

  // PARISC-specific sh_flags
  if (sh_flags & 0x20000000) {
    flagStrings.push("SHF_PARISC_SHORT");
  }
  if (sh_flags & 0x40000000) {
    flagStrings.push("SHF_PARISC_HUGE");
  }
  if (sh_flags & 0x80000000) {
    flagStrings.push("SHF_PARISC_SBP");
  }

  // ALPHA-specific sh_flags
  if (sh_flags & 0x10000000) {
    flagStrings.push("SHF_ALPHA_GPREL");
  }

  // ARM-specific sh_flags
  if (sh_flags & 0x10000000) {
    flagStrings.push("SHF_ARM_ENTRYSECT");
  }
  if (sh_flags & 0x80000000) {
    flagStrings.push("SHF_ARM_COMDEF");
  }

  // IA-64-specific sh_flags
  if (sh_flags & 0x10000000) {
    flagStrings.push("SHF_IA_64_SHORT");
  }
  if (sh_flags & 0x20000000) {
    flagStrings.push("SHF_IA_64_NORECOV");
  }

  return flagStrings.join(" | ");
}

export function getSymbolBinding(st_info: number): string {
  return Symbol.BindingMap[(st_info >> 4) & 0xf] || `Unknown Binding: ${st_info >> 4}`;
}

export function getSymbolType(st_info: number): string {
  return Symbol.TypeMap[st_info & 0xf] || `Unknown Type: ${st_info & 0xf}`;
}

export function getSymbolVisibility(st_other: number): string {
  return Symbol.VisibilityMap[st_other] || `Unknown st_other: ${st_other}`;
}

export function getRelocationType(r_info: number, EI_CLASS: number, e_machine: number): string {
  let type: number;
  const classProperty = getElfClass(EI_CLASS);
  const machineProperty = getElfMachine(e_machine);

  // Determine whether the ELF is 32-bit or 64-bit
  if (classProperty === "ELF32") {
    // For ELF32, extract the type information using ELF32_R_TYPE
    type = r_info & 0xff;
  } else if (classProperty === "ELF64") {
    // For ELF64, extract the type information using ELF64_R_TYPE
    type = r_info & 0xffffffff;
  } else {
    throw new Error("Invalid ELF class");
  }

  const typeMapping = getTypeMapping(machineProperty);
  if (!typeMapping) {
    throw new Error("Unknown Architecture! Can't map that relocation type!");
  }

  const relocationType = typeMapping[type];
  if (!relocationType) {
    throw new Error(`Unknown relocation type: ${type}`);
  }

  return relocationType;
}

function getTypeMapping(machineProperty: DictionaryType): DictionaryType | undefined {
  if (machineProperty === "EM_ARM") {
    return Relocations.ARM_TypeMap;
  } else if (machineProperty === "EM_X86_64") {
    return Relocations.x86_64_TypeMap;
  } else if (machineProperty === "EM_68K") {
    return Relocations.M68k_TypeMap;
  } else if (machineProperty === "EM_386") {
    return Relocations.I386_TypeMap;
  } else if (machineProperty === "EM_SPARC") {
    return Relocations.SPARC_TypeMap;
  } else if (machineProperty === "EM_MIPS") {
    return Relocations.MIPS_TypeMap;
  } else if (machineProperty === "EM_PARISC") {
    return Relocations.HPPA_TypeMap;
  } else if (machineProperty === "EM_FAKE_ALPHA") {
    return Relocations.ALPHA_TypeMap;
  } else if (machineProperty === "EM_AARCH64") {
    return Relocations.AArch64_TypeMap;
  } else if (machineProperty === "EM_SH") {
    return Relocations.SH_TypeMap;
  } else if (machineProperty === "EM_M32R") {
    return Relocations.M32R_TypeMap;
  } else if (machineProperty === "EM_PPC") {
    return Relocations.PPC_TypeMap;
  } else if (machineProperty === "EM_PPC64") {
    return Relocations.PPC64_TypeMap;
  } else if (machineProperty === "EM_IA_64") {
    return Relocations.IA64_TypeMap;
  } else if (machineProperty === "EM_S390") {
    return Relocations.S390_TypeMap;
  } else if (machineProperty === "EM_CRIS") {
    return Relocations.CRIS_TypeMap;
  } else if (machineProperty === "EM_MN10300") {
    return Relocations.AM33_TypeMap;
  } else if (machineProperty === "EM_MICROBLAZE") {
    return Relocations.MicroBlaze_TypeMap;
  } else if (machineProperty === "EM_ALTERA_NIOS2") {
    return Relocations.Nios2_TypeMap;
  } else if (machineProperty === "EM_TILEPRO") {
    return Relocations.TILEPro_TypeMap;
  } else if (machineProperty === "EM_TILEGX") {
    return Relocations.TILEGx_TypeMap;
  } else if (machineProperty === "EM_RISCV") {
    return Relocations.RISCV_TypeMap;
  } else if (machineProperty === "EM_METAG") {
    return Relocations.MetaG_TypeMap;
  } else if (machineProperty === "EM_NDS32") {
    return Relocations.NDS32_TypeMap;
  } else {
    return undefined;
  }
}

export function getRelocationSymbol(r_info: number, EI_CLASS: number): number {
  let symbolIndex: number;
  const classProperty = getElfClass(EI_CLASS);

  // Determine whether the ELF is 32-bit or 64-bit
  if (classProperty === "ELF32") {
    // For ELF32, extract the symbol index using ELF32_R_SYM
    symbolIndex = r_info >> 8;
  } else if (classProperty === "ELF64") {
    // For ELF64, extract the symbol index using ELF64_R_SYM
    symbolIndex = r_info >> 32;
  } else {
    throw new Error("Invalid ELF class");
  }

  return symbolIndex;
}

export function getDynTagType(d_tag: number): string {
  return DynamicTags.TypeMap[d_tag] || `Unknown d_tag: ${d_tag}`;
}
