import React from "react";
import {
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "../../../Core-Components/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data.filter(Boolean), // Filter out any undefined values
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getAllColumns().map(column => {
              const value = data[0]?.[column.id];
              return (
                <TableRow key={column.id}>
                  <TableCell className="font-medium text-foreground">
                    {column.columnDef.header as React.ReactNode}
                  </TableCell>
                  <TableCell>{value !== undefined ? String(value) : "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
