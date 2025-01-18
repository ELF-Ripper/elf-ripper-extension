import React, { useContext, useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { DataContext } from "../../../contexts/data-context";
import { SymbolTableEntry } from "../../../../client/data-processor/types";
import { columns } from "./columns";

export default function SymbolsTable() {
  // Access the processed data from the DataContext
  const contextData = useContext(DataContext);

  // State to store the dynamic and static symbols data
  const [dynsymData, setDynsymData] = useState<SymbolTableEntry[]>([]);
  const [symtabData, setSymtabData] = useState<SymbolTableEntry[]>([]);

  // Effect to update data when contextData changes
  useEffect(() => {
    if (contextData && contextData.Symbols_Table) {
      setDynsymData(contextData.Symbols_Table.dynsym || []); // Set the dynamic symbols data
      setSymtabData(contextData.Symbols_Table.symtab || []); // Set the static symbols data
    }
  }, [contextData]); // Re-run the effect whenever contextData changes

  return (
    <section className="mt-3">
      <div className="container">
        {/* Dynamic Symbols Table */}
        <h3 className="text-lg font-medium leading-snug tracking-normal mb-3">
          Dynamic Symbols Table
        </h3>
        <DataTable columns={columns} data={dynsymData} />

        <br />

        {/* Static Symbols Table */}
        <h3 className="text-lg font-medium leading-snug tracking-normal mb-3">
          Static Symbols Table
        </h3>
        <DataTable columns={columns} data={symtabData} />
      </div>

      <br />
    </section>
  );
}
