import { DictionaryType } from "../../../types/dictionary-type";

// Define the mapping of p_type values to their names
export const TypeMap: DictionaryType = {
  0: "PT_NULL (Program header table entry unused)",
  1: "PT_LOAD (Loadable program segment)",
  2: "PT_DYNAMIC (Dynamic linking information)",
  3: "PT_INTERP (Program interpreter)",
  4: "PT_NOTE (Auxiliary information)",
  5: "PT_SHLIB (Reserved)",
  6: "PT_PHDR (Entry for the header table itself)",
  7: "PT_TLS (Thread-local storage segment)",
  8: "PT_NUM (Number of defined types)",
  0x60000000: "PT_LOOS (Start of OS-specific)",
  0x6474e550: "PT_GNU_EH_FRAME (GCC .eh_frame_hdr segment)",
  0x6474e551: "PT_GNU_STACK (Indicates stack executability)",
  0x6474e552: "PT_GNU_RELRO (Read-only after relocation)",
  0x6474e553: "PT_GNU_PROPERTY (GNU property)",
  0x6ffffffa: "PT_LOSUNW (Start of Sun-specific)" + "PT_SUNWBSS (Sun Specific segment)",
  0x6ffffffb: "PT_SUNWSTACK (Stack segment)",
  0x6fffffff: "PT_HISUNW (End of Sun-specific)" + "PT_HIOS (End of OS-specific)",
  0x70000000: "PT_LOPROC (Start of processor-specific)",
  0x7fffffff: "PT_HIPROC (End of processor-specific)",
};
