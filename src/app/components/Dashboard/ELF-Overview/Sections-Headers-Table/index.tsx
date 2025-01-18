import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../../contexts/data-context";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SectionHeaders_Table } from "../../../../../client/data-processor/types";

export default function SectionHeadersTable() {
  // Access the processed data from the DataContext
  const contextData = useContext(DataContext);

  // State to store the section headers data
  const [data, setData] = useState<SectionHeaders_Table>([]);

  // Effect to update data when contextData changes
  useEffect(() => {
    if (contextData && contextData.SectionHeaders_Table) {
      setData(contextData.SectionHeaders_Table); // Set the section headers data
    }
  }, [contextData]); // Re-run the effect whenever contextData changes

  return (
    <section>
      <div className="container">
        <h3 className="text-lg font-medium leading-snug tracking-normal mb-3">Section Headers</h3>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}
