import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../../contexts/data-context";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { NoteEntry } from "../../../../../client/data-processor/types";

export default function NotesTable() {
  const contextData = useContext(DataContext);
  const [data, setData] = useState<NoteEntry[]>([]);

  useEffect(() => {
    if (contextData && contextData.Notes_Table && Array.isArray(contextData.Notes_Table)) {
      setData(contextData.Notes_Table);
    }
  }, [contextData]);

  return (
    <section>
      <div className="container">
        <h3 className="text-lg font-medium leading-snug tracking-normal mb-3">Notes</h3>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}
