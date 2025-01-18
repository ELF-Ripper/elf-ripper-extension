import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../../contexts/data-context";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Header_Table } from "../../../../../client/data-processor/types";

export default function ELFHeaderTable() {
  // Access the processed data from the DataContext
  const contextData = useContext(DataContext);

  // State to store the ELF Header data
  const [data, setData] = useState<Header_Table[]>([]);

  // Effect to update data when contextData changes
  useEffect(() => {
    if (contextData && contextData.Header_Table) {
      setData([contextData.Header_Table]); // Wrap the Header_Table in an array
    }
  }, [contextData]); // Re-run the effect whenever contextData changes

  return (
    <section>
      <div className="container">
        <h3 className="text-lg font-medium leading-snug tracking-normal mb-3">Header</h3>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}
