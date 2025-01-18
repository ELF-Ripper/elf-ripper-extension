import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { NoteEntry } from "../../../../../client/data-processor/types";

export const columnHelper = createColumnHelper<NoteEntry>();

export const columns: ColumnDef<NoteEntry>[] = [
  columnHelper.accessor("section", {
    header: "Section",
  }),
  columnHelper.accessor("owner", {
    header: "Owner",
  }),
  columnHelper.accessor("dataSize", {
    header: "Data Size",
  }),
  columnHelper.accessor("description", {
    header: "Description",
  }),
];

export default columns;
