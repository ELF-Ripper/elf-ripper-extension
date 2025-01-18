import React, { useState, useEffect } from "react";
import {
  SortingState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Core-Components/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../Core-Components/dropdown-menu";
import { Button } from "../Core-Components/button";
import { Input } from "../Core-Components/input";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { decimalToHex, formatBytes } from "../../utils/helper-functions";
import { Expand, ArrowUp, Search } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../Core-Components/tooltip";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isMemoryFileSelected: boolean;
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [expanded, setExpanded] = useState({});

  const pageSizes = [10, 50, 500, 1000];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFromLeafRows: true,
    onGlobalFilterChange: setFiltering,
    globalFilterFn: customGlobalFilter,
    getPaginationRowModel: getPaginationRowModel(),
    onExpandedChange: updater => {
      setExpanded(updater);
      table.resetPageIndex();
    },
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: row => [...(row.HighLevel || []), ...(row.MidLevel || []), ...(row.LowLevel || [])],
    autoResetPageIndex: false,
    state: {
      sorting,
      globalFilter: filtering,
      expanded,
    },
  });

  useEffect(() => {
    const pageCount = table.getPageCount();
    const currentPageIndex = table.getState().pagination.pageIndex;
    if (currentPageIndex >= pageCount) {
      table.setPageIndex(Math.max(pageCount - 1, 0));
    }
  }, [table.getRowModel().rows]);

  // Scroll to top event listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-center pb-3 pt-3">
        {/* Search box Filter*/}
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="text-gray-400 h-4 w-4" />
          </div>
          <Input
            type="text"
            value={filtering}
            placeholder="Search..."
            onChange={e => setFiltering(e.target.value)}
            className="pl-8 w-full"
          />
        </div>

        {/* Columns visibility toggler */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto h-8 lg:flex text-muted-foreground"
            >
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-sm text-gray-300 w-[150px]">
            <DropdownMenuLabel>Toggle columns:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(column => column.id !== "Icon" && column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table rendering */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
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

      <div className="flex items-center justify-between pt-3">
        {/* Row Limiter */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="flex-col">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
                  <Expand className="mr-2 h-4 w-4" />
                  Row limiter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-sm text-gray-300 w-[150px]">
                <DropdownMenuLabel>Max row number:</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {pageSizes.map(pageSize => (
                  <DropdownMenuCheckboxItem
                    key={pageSize}
                    className="capitalize cursor-pointer"
                    checked={table.getState().pagination.pageSize === pageSize}
                    onCheckedChange={() => table.setPageSize(pageSize)}
                  >
                    {pageSize}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center space-x-4 lg:space-x-4">
          {/* Scroll to top button with tooltip */}
          {showScrollButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full p-2"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="mr-4 tooltip">
                  Scroll to top
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Pagination controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
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
            <p className="text-sm text-muted-foreground">
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
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// *File specific utility functions

const getFormattedValue = (columnId: string, value: any) => {
  switch (columnId) {
    case "Start_Address":
    case "End_Address":
      return decimalToHex(value);
    case "Size":
    case "Free":
    case "Used":
      return formatBytes(value);
    default:
      return String(value);
  }
};

const customGlobalFilter: FilterFn<any> = (
  row: { getValue: (arg0: any) => any },
  columnId: string,
  filterValue: string,
) => {
  const columnValue = row.getValue(columnId);
  const lowerFilterValue = filterValue.toLowerCase();
  const rawValueMatches = String(columnValue).toLowerCase().includes(lowerFilterValue);
  const formattedValueMatches = getFormattedValue(columnId, columnValue)
    .toLowerCase()
    .includes(lowerFilterValue);
  return rawValueMatches || formattedValueMatches;
};
