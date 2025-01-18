import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../contexts/data-context";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { HighLevelMemoryRegionEntries } from "../../../client/data-processor/types";

export default function BuildAnalyzer() {
  // Access the processed data from the DataContext
  const contextData = useContext(DataContext);

  // State to store the high-level memory region entries
  const [data, setData] = useState<HighLevelMemoryRegionEntries[]>([]);

  // Determine if the Map_FileName is present to indicate whether a memory file is selected
  const isMemoryFileSelected = !!contextData?.Map_FileName;

  // Effect to update data when contextData changes
  useEffect(() => {
    if (contextData && contextData.BuildAnalyzer_Table) {
      const highLevelData = contextData.BuildAnalyzer_Table.HighLevel || [];
      setData(highLevelData);
    }
  }, [contextData]); // Re-run the effect whenever contextData changes

  return (
    <section>
      <div className="container pl-1 pr-1" style={{ maxWidth: "none" }}>
        <DataTable
          columns={getColumns(isMemoryFileSelected)}
          data={data}
          isMemoryFileSelected={isMemoryFileSelected}
        />
      </div>
    </section>
  );
}
