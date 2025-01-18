import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Header_Table } from "../../../../../client/data-processor/types";

export const columnHelper = createColumnHelper<Header_Table>();

export const columns: ColumnDef<Header_Table>[] = [
  columnHelper.accessor("magic", {
    header: "Magic",
  }),
  columnHelper.accessor("class", {
    header: "Class",
  }),
  columnHelper.accessor("data", {
    header: "Data",
  }),
  columnHelper.accessor("type", {
    header: "Type",
  }),
  columnHelper.accessor("machine", {
    header: "Machine",
  }),
  columnHelper.accessor("version", {
    header: "Version",
  }),
  columnHelper.accessor("entryPointAddress", {
    header: "Entry Point Address",
  }),
  columnHelper.accessor("startOfProgramHeaders", {
    header: "Start of Program Headers",
  }),
  columnHelper.accessor("startOfSectionHeaders", {
    header: "Start of Section Headers",
  }),
  columnHelper.accessor("flags", {
    header: "Flags",
  }),
  columnHelper.accessor("sizeOfThisHeader", {
    header: "Size of This Header",
  }),
  columnHelper.accessor("sizeOfProgramHeaders", {
    header: "Size of Program Headers",
  }),
  columnHelper.accessor("numberOfProgramHeaders", {
    header: "Number of Program Headers",
  }),
  columnHelper.accessor("sizeOfSectionHeaders", {
    header: "Size of Section Headers",
  }),
  columnHelper.accessor("numberOfSectionHeaders", {
    header: "Number of Section Headers",
  }),
  columnHelper.accessor("sectionHeaderStringTableIndex", {
    header: "Section Header String Table Index",
  }),
];

export default columns;
