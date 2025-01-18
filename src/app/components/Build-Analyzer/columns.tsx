import React from "react";
import { Button } from "../Core-Components/button";
import { Progress } from "../Core-Components/progress";
import { SortingButton } from "./sorting-button";
import { ChevronDown, ChevronRight, Layers3, Layers2, File } from "lucide-react";
import { createColumnHelper, AccessorKeyColumnDef } from "@tanstack/react-table";
import { MemoryRegionEntries } from "../../../client/data-processor/types";
import { decimalToHex, formatBytes } from "../../utils/helper-functions";

export const columnHelper = createColumnHelper<MemoryRegionEntries>();

export const getColumns = (
  isMemoryFileSelected: boolean,
): AccessorKeyColumnDef<MemoryRegionEntries>[] => {
  const Columns: AccessorKeyColumnDef<MemoryRegionEntries>[] = [
    // Push all base headers first

    columnHelper.accessor("Icon", {
      id: "Icon",
      header: ({ table }) => (
        <div className="flex justify-center items-center">
          <Button
            onClick={table.getToggleAllRowsExpandedHandler()}
            variant="ghost"
            className="p-1 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <span
              className={`expand-collapse-icon ${table.getIsAllRowsExpanded() ? "expand-collapse-rotate-open" : "expand-collapse-rotate"}`}
            >
              <ChevronRight className="w-5 h-4" />
            </span>
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="flex justify-center items-center"
          style={{ paddingLeft: `${row.depth * 2}rem` }}
        >
          <Button
            onClick={row.getCanExpand() ? row.getToggleExpandedHandler() : undefined}
            color="warning"
            variant="ghost"
            className={`p-1 rounded-full w-8 h-8 flex items-center justify-center ${!row.getCanExpand() ? "no-hover" : ""}`}
          >
            {row.getCanExpand() && (
              <span
                className={`expand-collapse-icon ${
                  row.getIsExpanded() ? "expand-collapse-rotate-open" : "expand-collapse-rotate"
                }`}
              >
                <ChevronRight className="w-5 h-4" />
              </span>
            )}
          </Button>
        </div>
      ),
    }),

    columnHelper.accessor("Region", {
      id: "Region",
      header: () => <div className="text-center">Region</div>,
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
    }),

    columnHelper.accessor("Start_Address", {
      id: "Start_Address",
      header: ({ column }) => (
        <div className="text-center">
          <SortingButton column={column} title="Start Address" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">{decimalToHex(row.original.Start_Address)}</div>
      ),
    }),

    columnHelper.accessor("End_Address", {
      id: "End_Address",
      header: ({ column }) => (
        <div className="text-center">
          <SortingButton column={column} title="End Address" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">{decimalToHex(row.original.End_Address)}</div>
      ),
    }),

    columnHelper.accessor("Size", {
      id: "Size",
      header: ({ column }) => (
        <div className="text-center">
          <SortingButton column={column} title="Size" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.Size !== null ? formatBytes(row.original.Size) : "-"}
        </div>
      ),
    }),
  ];

  // Push the alternative headers depending on a memory file
  if (isMemoryFileSelected) {
    Columns.push(
      columnHelper.accessor("Free", {
        id: "Free",
        header: ({ column }) => (
          <div className="text-center">
            <SortingButton column={column} title="Free" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.Free !== null ? formatBytes(row.original.Free) : "-"}
          </div>
        ),
      }),

      columnHelper.accessor("Used", {
        id: "Used",
        header: ({ column }) => (
          <div className="text-center">
            <SortingButton column={column} title="Used" />
          </div>
        ),
        cell: ({ row }) => {
          const usedValue = row.original.Used;
          return (
            <div className="text-center">{usedValue !== null ? formatBytes(usedValue) : "-"}</div>
          );
        },
      }),
    );
  }

  // Push the usage last to maintain header structure
  Columns.push(
    columnHelper.accessor("Usage_Percent", {
      id: "Usage_Percent",
      header: ({ column }) => (
        <div className="text-center">
          <SortingButton column={column} title="Usage %" />
        </div>
      ),
      cell: ({ row }) => {
        const usagePercent = row.original.Usage_Percent;
        let levelLabel;
        let progressBarWidth;

        // Determine the label and progress bar width based on depth
        if (isMemoryFileSelected) {
          switch (row.depth) {
            case 0:
              levelLabel = "Memory:";
              progressBarWidth = "100%";
              break;
            case 1:
              levelLabel = "Section:";
              progressBarWidth = "80%";
              break;
            case 2:
              levelLabel = "Symbol:";
              progressBarWidth = "60%";
              break;
          }
        } else {
          switch (row.depth) {
            case 0:
              levelLabel = "Section:";
              progressBarWidth = "100%";
              break;
            case 1:
              levelLabel = "Symbol:";
              progressBarWidth = "80%";
              break;
          }
        }

        return usagePercent !== null ? (
          <div className="flex flex-col items-center w-full">
            {/* Container for the top division */}
            <div
              style={{ width: progressBarWidth }}
              className="flex justify-between text-xs font-semibold mb-1"
            >
              <span className="text-left">{levelLabel}</span>
              <span className="text-right">{usagePercent.toFixed(2)}%</span>
            </div>
            {/* Container for the progress bar */}
            <div className="w-full flex justify-center pb-[1px]">
              <div style={{ width: progressBarWidth }}>
                <Progress value={usagePercent} className="progress-bar" />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">-</div>
        );
      },
    }),
  );

  return Columns;
};

export default getColumns;
