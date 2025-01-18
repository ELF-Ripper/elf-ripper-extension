import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DynamicTagEntry } from "../../../../../client/data-processor/types";

export const columnHelper = createColumnHelper<DynamicTagEntry>();

export const columns: ColumnDef<DynamicTagEntry>[] = [
  columnHelper.accessor("tag", {
    header: "Tag",
  }),
  columnHelper.accessor("type", {
    header: "Type",
  }),
  columnHelper.accessor("nameValue", {
    header: "Name value",
  }),
];

export default columns;
