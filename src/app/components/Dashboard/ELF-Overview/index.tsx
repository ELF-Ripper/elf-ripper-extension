import React, { useContext, useState } from "react";
import ELFHeaderTable from "./Header-Table";
import ProgramHeadersTable from "./Program-Headers-Table";
import SectionHeadersTable from "./Sections-Headers-Table";
import { DataContext } from "../../../contexts/data-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Core-Components/select";
import DynamicTagsTable from "./Dynamic-Tags";
import NotesTable from "./Notes-Table";

export function ELF_Overview() {
  // Access the processed data from the context
  const data = useContext(DataContext);

  // State to manage which table is currently selected
  const [selectedTable, setSelectedTable] = useState<
    "Header" | "Program" | "Section" | "Dynamic_Tags" | "Notes"
  >("Header");

  // Function to render the selected table
  const renderSelectedTable = () => {
    switch (selectedTable) {
      case "Header":
        return <ELFHeaderTable />;
      case "Program":
        return <ProgramHeadersTable />;
      case "Section":
        return <SectionHeadersTable />;
      case "Dynamic_Tags":
        return <DynamicTagsTable />;
      case "Notes":
        return <NotesTable />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 py-4">
      {/* Header with ELF File Name on the left and Table Selector on the right */}
      <div className="flex justify-between items-center mb-6">
        {/* ELF File Name */}
        <h3 className="text-lg font-medium leading-snug tracking-normal" title={data?.ELF_FileName}>
          ELF File Name: <span className="text-base font-medium">{data?.ELF_FileName}</span>
        </h3>

        {/* Table Selection Dropdown */}
        <Select
          onValueChange={value =>
            setSelectedTable(value as "Header" | "Program" | "Section" | "Dynamic_Tags" | "Notes")
          }
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select Table" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Header">ELF Header Table</SelectItem>
            <SelectItem value="Program">Program Headers Table</SelectItem>
            <SelectItem value="Section">Section Headers Table</SelectItem>
            <SelectItem value="Dynamic_Tags">Dynamic Tags Table</SelectItem>
            <SelectItem value="Notes">Notes Table</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Render Selected Table */}
      <main className="flex-1">{renderSelectedTable()}</main>
    </div>
  );
}

export default ELF_Overview;
