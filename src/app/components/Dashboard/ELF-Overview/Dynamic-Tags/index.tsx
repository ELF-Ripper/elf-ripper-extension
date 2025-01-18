import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../../contexts/data-context";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DynamicTagEntry } from "../../../../../client/data-processor/types";

export default function DynamicTagsTable() {
  const contextData = useContext(DataContext);
  const [data, setData] = useState<DynamicTagEntry[]>([]);

  useEffect(() => {
    if (
      contextData &&
      contextData.DynamicTags_Table &&
      Array.isArray(contextData.DynamicTags_Table)
    ) {
      setData(contextData.DynamicTags_Table);
    }
  }, [contextData]);

  return (
    <section>
      <div className="container">
        <h3 className="text-lg font-medium leading-snug tracking-normal mb-3">Dynamic Tags</h3>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}
