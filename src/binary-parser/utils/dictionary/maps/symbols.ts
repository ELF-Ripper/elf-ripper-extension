import { DictionaryType } from "../../../types/dictionary-type";

// Define the mapping of symbol binding (st_info) values to their names
export const BindingMap: DictionaryType = {
  0: "STB_LOCAL",
  1: "STB_GLOBAL",
  2: "STB_WEAK",
  3: "STB_NUM",
  10: "STB_LOOS" + "STB_GNU_UNIQUE",
  12: "STB_HIOS",
  13: "STB_LOPROC",
  15: "STB_HIPROC",
};

// Define the mapping of symbol type values (st_info) to their names
export const TypeMap: DictionaryType = {
  0: "STT_NOTYPE",
  1: "STT_OBJECT",
  2: "STT_FUNC",
  3: "STT_SECTION",
  4: "STT_FILE",
  5: "STT_COMMON",
  6: "STT_TLS",
  7: "STT_NUM",
  10: "STT_LOOS" + "STT_GNU_IFUNC",
  12: "STT_HIOS",
  13: "STT_LOPROC",
  15: "STT_HIPROC",
};

// Define the mapping of symbol type values (st_info) to their names
export const VisibilityMap: DictionaryType = {
  0: "STV_DEFAULT",
  1: "STV_INTERNAL",
  2: "STV_HIDDEN",
  3: "STV_PROTECTED",
};
