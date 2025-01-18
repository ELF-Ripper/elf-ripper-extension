import React, { useContext, useEffect, useMemo, useState } from "react";
import { DataContext } from "../../../contexts/data-context";
import { Progress } from "../../Core-Components/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../../Core-Components/card";

export default function Cards() {
  // Access the processed data from the DataContext
  const contextData = useContext(DataContext);

  // State to store whether a memory file is selected
  const [isMemoryFileSelected, setIsMemoryFileSelected] = useState(false);

  // Set the card data from context when available
  useEffect(() => {
    if (contextData) {
      setIsMemoryFileSelected(!!contextData.Map_FileName);
    }
  }, [contextData]);

  return (
    <div
      className={`grid gap-5 ${
        isMemoryFileSelected
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {/* ELF File Name Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">ELF file:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="truncate text-sm" title={contextData?.ELF_FileName || "N/A"}>
            {contextData?.ELF_FileName || "N/A"}
          </div>
        </CardContent>
      </Card>

      {/* Class Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="truncate text-sm" title={contextData?.Header_Table.class || "N/A"}>
            {contextData?.Header_Table.class || "N/A"}
          </div>
        </CardContent>
      </Card>

      {/* Encoding Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Encoding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="truncate text-sm" title={contextData?.Header_Table.data || "N/A"}>
            {contextData?.Header_Table.data || "N/A"}
          </div>
        </CardContent>
      </Card>

      {/* Machine Type Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Machine Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="truncate text-sm" title={contextData?.Header_Table.machine || "N/A"}>
            {contextData?.Header_Table.machine || "N/A"}
          </div>
        </CardContent>
      </Card>

      {isMemoryFileSelected && (
        <>
          {/* Memory File Name Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-muted-foreground">Memory Map file:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="truncate text-sm" title={contextData?.Map_FileName || "N/A"}>
                {contextData?.Map_FileName || "N/A"}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
