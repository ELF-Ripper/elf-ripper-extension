import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { SymbolTableEntry } from "../../../../client/data-processor/types";

export const columnHelper = createColumnHelper<SymbolTableEntry>();

export const columns: ColumnDef<SymbolTableEntry>[] = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("value", {
    header: "Value",
  }),
  columnHelper.accessor("size", {
    header: "Size",
  }),
  columnHelper.accessor("binding", {
    header: "Binding",
  }),
  columnHelper.accessor("type", {
    header: "Type",
  }),
  columnHelper.accessor("visibility", {
    header: "Visibility",
  }),
  columnHelper.accessor("ndx", {
    header: "Section Index",
  }),
];

export default columns;
