import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { SectionHeader } from "../../../../../client/data-processor/types";

export const columnHelper = createColumnHelper<SectionHeader>();

export const columns: ColumnDef<SectionHeader>[] = [
  columnHelper.accessor((row, index) => index, {
    id: "index",
    header: "Index",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("type", {
    header: "Type",
  }),
  columnHelper.accessor("offset", {
    header: "Offset",
  }),
  columnHelper.accessor("size", {
    header: "Size",
  }),
  columnHelper.accessor("entrySize", {
    header: "Entry Size",
  }),
  columnHelper.accessor("flags", {
    header: "Flags",
  }),
  columnHelper.accessor("link", {
    header: "Link",
  }),
  columnHelper.accessor("info", {
    header: "Info",
  }),
  columnHelper.accessor("addressAlignment", {
    header: "Address Alignment",
  }),
];

export default columns;
