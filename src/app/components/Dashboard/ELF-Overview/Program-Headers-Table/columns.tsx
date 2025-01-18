import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ProgramHeader } from "../../../../../client/data-processor/types";

export const columnHelper = createColumnHelper<ProgramHeader>();

export const columns: ColumnDef<ProgramHeader>[] = [
  columnHelper.accessor((row, index) => index, {
    id: "index",
    header: "Index",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("type", {
    header: "Type",
  }),
  columnHelper.accessor("offset", {
    header: "Offset",
  }),
  columnHelper.accessor("virtualAddress", {
    header: "Virtual Address",
  }),
  columnHelper.accessor("physicalAddress", {
    header: "Physical Address",
  }),
  columnHelper.accessor("memorySize", {
    header: "Memory Size",
  }),
  columnHelper.accessor("flags", {
    header: "Flags*",
  }),
  columnHelper.accessor("alignment", {
    header: "Alignment",
  }),
];

export default columns;
