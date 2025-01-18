import { ArrowUp01, ArrowDown10 } from "lucide-react";
import React from "react";
import { Button } from "../Core-Components/button";

/**
 * A React component that renders a sorting button with up and down arrow icons to indicate the sorting direction.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.column - The column object that the sorting button is associated with.
 * @param {string} props.title - The title to be displayed on the button.
 * @returns {JSX.Element} - The rendered sorting button component.
 */
export const SortingButton = ({ column, title }) => {
  const isSortedAsc = column.getIsSorted() === "asc";
  const isSortedDesc = column.getIsSorted() === "desc";

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSortedAsc)}
      className="sorting-button w-full flex items-center justify-center"
    >
      <span className="truncate mr-0.5">{title}</span>
      <div className="flex-shrink-0 w-4 h-4 relative">
        <ArrowUp01
          className={`sorting-arrow absolute inset-0 ${isSortedAsc ? "visible-icon" : "hidden-icon"}`}
        />
        <ArrowDown10
          className={`sorting-arrow absolute inset-0 ${isSortedDesc ? "visible-icon" : "hidden-icon"}`}
        />
      </div>
    </Button>
  );
};
