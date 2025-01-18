import { DictionaryType } from "../../../types/dictionary-type";

// Define the mapping for the type of dynamic tags (d_tag values)
export const TypeMap: DictionaryType = {
  0: "DT_NULL" /* Marks end of dynamic section */,
  1: "DT_NEEDED" /* Name of needed library */,
  2: "DT_PLTRELSZ" /* Size in bytes of PLT relocs */,
  3: "DT_PLTGOT" /* Processor defined value */,
  4: "DT_HASH" /* Address of symbol hash table */,
  5: "DT_STRTAB" /* Address of string table */,
  6: "DT_SYMTAB" /* Address of symbol table */,
  7: "DT_RELA" /* Address of Rela relocs */,
  8: "DT_RELASZ" /* Total size of Rela relocs */,
  9: "DT_RELAENT" /* Size of one Rela reloc */,
  10: "DT_STRSZ" /* Size of string table */,
  11: "DT_SYMENT" /* Size of one symbol table entry */,
  12: "DT_INIT" /* Address of init function */,
  13: "DT_FINI" /* Address of termination function */,
  14: "DT_SONAME" /* Name of shared object */,
  15: "DT_RPATH" /* Library search path (deprecated) */,
  16: "DT_SYMBOLIC" /* Start symbol search here */,
  17: "DT_REL" /* Address of Rel relocs */,
  18: "DT_RELSZ" /* Total size of Rel relocs */,
  19: "DT_RELENT" /* Size of one Rel reloc */,
  20: "DT_PLTREL" /* Type of reloc in PLT */,
  21: "DT_DEBUG" /* For debugging; unspecified */,
  22: "DT_TEXTREL" /* Reloc might modify .text */,
  23: "DT_JMPREL" /* Address of PLT relocs */,
  24: "DT_BIND_NOW" /* Process relocations of object */,
  25: "DT_INIT_ARRAY" /* Array with addresses of init fct */,
  26: "DT_FINI_ARRAY" /* Array with addresses of fini fct */,
  27: "DT_INIT_ARRAYSZ" /* Size in bytes of DT_INIT_ARRAY */,
  28: "DT_FINI_ARRAYSZ" /* Size in bytes of DT_FINI_ARRAY */,
  29: "DT_RUNPATH" /* Library search path */,
  30: "DT_FLAGS" /* Flags for the object being loaded */,
  32:
    "DT_ENCODING" /* Start of encoded range */ +
    "DT_PREINIT_ARRAY" /* Array with addresses of preinit fct*/,
  33: "DT_PREINIT_ARRAYSZ" /* size in bytes of DT_PREINIT_ARRAY */,
  34: "DT_SYMTAB_SHNDX" /* Address of SYMTAB_SHNDX section */,
  35: "DT_NUM" /* Number used */,
  0x6000000d: "DT_LOOS" /* Start of OS-specific */,
  0x6ffff000: "DT_HIOS" /* End of OS-specific */,
  0x70000000: "DT_LOPROC" /* Start of processor-specific */,
  0x7fffffff: "DT_HIPROC" /* End of processor-specific */,
  0x36: "DT_PROCNUM" /* Most used by any processor */,
  /* DT_* entries which fall between DT_VALRNGHI & DT_VALRNGLO use the
     Dyn.d_un.d_val field of the Elf*_Dyn structure.  This follows Sun's
     approach.  */
  0x6ffffd00: "DT_VALRNGLO",
  0x6ffffdf5: "DT_GNU_PRELINKED" /* Prelinking timestamp */,
  0x6ffffdf6: "DT_GNU_CONFLICTSZ" /* Size of conflict section */,
  0x6ffffdf7: "DT_GNU_LIBLISTSZ" /* Size of library list */,
  0x6ffffdf8: "DT_CHECKSUM",
  0x6ffffdf9: "DT_PLTPADSZ",
  0x6ffffdfa: "DT_MOVEENT",
  0x6ffffdfb: "DT_MOVESZ",
  0x6ffffdfc: "DT_FEATURE_1" /* Feature selection (DTF_*).  */,
  0x6ffffdfd: "DT_POSFLAG_1" /* Flags for DT_* entries, effecting the following DT_* entry.  */,
  0x6ffffdfe: "DT_SYMINSZ" /* Size of syminfo table (in bytes) */,
  0x6ffffdff: "DT_SYMINENT" /* Entry size of syminfo */ + "DT_VALRNGHI",
  /* DT_* entries which fall between DT_ADDRRNGHI & DT_ADDRRNGLO use the
     Dyn.d_un.d_ptr field of the Elf*_Dyn structure.
  
     If any adjustment is made to the ELF object after it has been
     built these entries will need to be adjusted.  */
  0x6ffffe00: "DT_ADDRRNGLO",
  0x6ffffef5: "DT_GNU_HASH" /* GNU-style hash table.  */,
  0x6ffffef6: "DT_TLSDESC_PLT",
  0x6ffffef7: "DT_TLSDESC_GOT",
  0x6ffffef8: "DT_GNU_CONFLICT" /* Start of conflict section */,
  0x6ffffef9: "DT_GNU_LIBLIST" /* Library list */,
  0x6ffffefa: "DT_CONFIG" /* Configuration information.  */,
  0x6ffffefb: "DT_DEPAUDIT" /* Dependency auditing.  */,
  0x6ffffefc: "DT_AUDIT" /* Object auditing.  */,
  0x6ffffefd: "DT_PLTPAD" /* PLT padding.  */,
  0x6ffffefe: "DT_MOVETAB" /* Move table.  */,
  0x6ffffeff: "DT_SYMINFO" /* Syminfo table.  */ + "DT_ADDRRNGHI",
  /* The versioning entry types.  The next are defined as part of the
     GNU extension.  */
  0x6ffffff0: "DT_VERSYM",
  0x6ffffff9: "DT_RELACOUNT",
  0x6ffffffa: "DT_RELCOUNT",
  /* These were chosen by Sun.  */
  0x6ffffffb: "DT_FLAGS_1" /* State flags, see DF_1_* below.  */,
  0x6ffffffc: "DT_VERDEF" /* Address of version definition table */,
  0x6ffffffd: "DT_VERDEFNUM" /* Number of version definitions */,
  0x6ffffffe: "DT_VERNEED" /* Address of table with needed versions */,
  0x6fffffff: "DT_VERNEEDNUM" /* Number of needed versions */,
  /* Sun added these machine-independent extensions in the "processor-specific"
     range.  Be compatible.  */
  0x7ffffffd: "DT_AUXILIARY" /* Shared object to load before self */,
  // 0x7fffffff: "DT_FILTER" /* Shared object to get values from */,
  0x70000001: "DT_MIPS_RLD_VERSION" /* Runtime linker interface version */,
  0x70000002: "DT_MIPS_TIME_STAMP" /* Timestamp */,
  0x70000003: "DT_MIPS_ICHECKSUM" /* Checksum */,
  0x70000004: "DT_MIPS_IVERSION" /* Version string (string tbl index) */,
  0x70000005: "DT_MIPS_FLAGS" /* Flags */,
  0x70000006: "DT_MIPS_BASE_ADDRESS" /* Base address */,
  0x70000007: "DT_MIPS_MSYM",
  0x70000008: "DT_MIPS_CONFLICT" /* Address of CONFLICT section */,
  0x70000009: "DT_MIPS_LIBLIST" /* Address of LIBLIST section */,
  0x7000000a: "DT_MIPS_LOCAL_GOTNO" /* Number of local GOT entries */,
  0x7000000b: "DT_MIPS_CONFLICTNO" /* Number of CONFLICT entries */,
  0x70000010: "DT_MIPS_LIBLISTNO" /* Number of LIBLIST entries */,
  0x70000011: "DT_MIPS_SYMTABNO" /* Number of DYNSYM entries */,
  0x70000012: "DT_MIPS_UNREFEXTNO" /* First external DYNSYM */,
  0x70000013: "DT_MIPS_GOTSYM" /* First GOT entry in DYNSYM */,
  0x70000014: "DT_MIPS_HIPAGENO" /* Number of GOT page table entries */,
  0x70000016: "DT_MIPS_RLD_MAP" /* Address of run time loader map.  */,
  0x70000017: "DT_MIPS_DELTA_CLASS" /* Delta C++ class definition.  */,
  0x70000018: "DT_MIPS_DELTA_CLASS_NO" /* Number of entries in DT_MIPS_DELTA_CLASS.  */,
  0x70000019: "DT_MIPS_DELTA_INSTANCE" /* Delta C++ class instances.  */,
  0x7000001a: "DT_MIPS_DELTA_INSTANCE_NO" /* Number of entries in DT_MIPS_DELTA_INSTANCE.  */,
  0x7000001b: "DT_MIPS_DELTA_RELOC" /* Delta relocations.  */,
  0x7000001c: "DT_MIPS_DELTA_RELOC_NO" /* Number of entries in DT_MIPS_DELTA_RELOC.  */,
  0x7000001d: "DT_MIPS_DELTA_SYM" /* Delta symbols that Delta relocations refer to.  */,
  0x7000001e: "DT_MIPS_DELTA_SYM_NO" /* Number of entries in DT_MIPS_DELTA_SYM.  */,
  0x70000020: "DT_MIPS_DELTA_CLASSSYM" /* Delta symbols that hold the class declaration.  */,
  0x70000021: "DT_MIPS_DELTA_CLASSSYM_NO" /* Number of entries in DT_MIPS_DELTA_CLASSSYM.  */,
  0x70000022: "DT_MIPS_CXX_FLAGS" /* Flags indicating for C++ flavor.  */,
  0x70000023: "DT_MIPS_PIXIE_INIT",
  0x70000024: "DT_MIPS_SYMBOL_LIB",
  0x70000025: "DT_MIPS_LOCALPAGE_GOTIDX",
  0x70000026: "DT_MIPS_LOCAL_GOTIDX",
  0x70000027: "DT_MIPS_HIDDEN_GOTIDX",
  0x70000028: "DT_MIPS_PROTECTED_GOTIDX",
  0x70000029: "DT_MIPS_OPTIONS" /* Address of .options.  */,
  0x7000002a: "DT_MIPS_INTERFACE" /* Address of .interface.  */,
  0x7000002b: "DT_MIPS_DYNSTR_ALIGN",
  0x7000002c: "DT_MIPS_INTERFACE_SIZE" /* Size of the .interface section. */,
  0x7000002d:
    "DT_MIPS_RLD_TEXT_RESOLVE_ADDR" /* Address of rld_text_rsolve function stored in GOT.  */,
  0x7000002e:
    "DT_MIPS_PERF_SUFFIX" /* Default suffix of dso to be added by rld on dlopen() calls.  */,
  0x7000002f: "DT_MIPS_COMPACT_SIZE" /* (O32)Size of compact rel section. */,
  0x70000030: "DT_MIPS_GP_VALUE" /* GP value for aux GOTs.  */,
  0x70000031: "DT_MIPS_AUX_DYNAMIC" /* Address of aux .dynamic.  */,
  /* The address of .got.plt in an executable using the new non-PIC ABI.  */
  0x70000032: "DT_MIPS_PLTGOT",
  /* The base of the PLT in an executable using the new non-PIC ABI if that
      PLT is writable.  For a non-writable PLT, this is omitted or has a zero
      value.  */
  0x70000034: "DT_MIPS_RWPLT",
  /* An alternative description of the classic MIPS RLD_MAP that is usable
      in a PIE as it stores a relative offset from the address of the tag
      rather than an absolute address.  */
  0x70000035: "DT_MIPS_RLD_MAP_REL",
};
