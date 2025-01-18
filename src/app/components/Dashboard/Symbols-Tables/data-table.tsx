import React, { useState, useMemo } from "react";
import {
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../Core-Components/table";
import { Input } from "../../Core-Components/input";
import { Button } from "../../Core-Components/button";
import { ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div>
      <div className="flex items-center pb-2">
        {/* Search box Filter*/}
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="text-gray-400 h-4 w-4" />
          </div>
          <Input
            type="text"
            value={searchTerm}
            placeholder="Search..."
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id} className="text-foreground">
                    {header.isPlaceholder ? null : String(header.column.columnDef.header)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{String(cell.getValue())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="data-table-no-results">
                  No results...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center mt-4 space-x-2 pt-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
        <p className="text-sm text-muted-foreground mx-2">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
