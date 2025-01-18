import {
  DynamicTags_,
  elfHeaders_,
  Notes_,
  ProgramHeaders_,
  RelocationTables_,
  SectionHeaders_,
  SymbolTables_,
} from "./elf/elf-parsers-returns";

/**
 * Defines the structure for the SuperObject returned from ELF parsing.
 */
export interface SuperELF {
  Header: elfHeaders_;
  ProgramHeaders: ProgramHeaders_;
  Sections: SectionHeaders_;
  Symbols: SymbolTables_;
  Relocs: RelocationTables_;
  DynTags: DynamicTags_;
  Notes: Notes_;
}
