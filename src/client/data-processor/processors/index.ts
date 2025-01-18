// Central export hub for all the processRawParseddData functions from the different processors
export { processRawData as processHeader } from "./header-processor";
export { processRawData as processProgramHeaders } from "./program-headers-processor";
export { processRawData as processSectionHeaders } from "./section-headers-processor";
export { processRawData as processSymbolTables } from "./symbol-tables-processor";
export { processRawData as processDynamicTags } from "./dynamic-tags-processor";
export { processRawData as processRelocations } from "./relocation-tables-processor";
export { processRawData as processNotes } from "./notes-processor";
export { processRawData as processMemory } from "./memory-processor";
