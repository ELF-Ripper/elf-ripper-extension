import React, { createContext, useEffect, useState, ReactNode } from "react";
import {
  DynamicTags_Table,
  Header_Table,
  MemoryTableEntries,
  Notes_Table,
  ProgramHeaders_Table,
  Relocations_Table,
  SectionHeaders_Table,
  Symbols_Table,
} from "../../client/data-processor/types";
import { postMessage } from "../utils/vscode-api";

// The shape of the processed data
export interface ProcessedData {
  ELF_FileName: string;
  Map_FileName?: string; // Optional, only included if a map file is provided
  Header_Table: Header_Table;
  ProgramHeaders_Table: ProgramHeaders_Table;
  SectionHeaders_Table: SectionHeaders_Table;
  Symbols_Table: Symbols_Table;
  DynamicTags_Table: DynamicTags_Table;
  Relocations_Table: Relocations_Table;
  Notes_Table: Notes_Table;
  BuildAnalyzer_Table: MemoryTableEntries;
}

// Create the context with default null data
export const DataContext = createContext<ProcessedData | null>(null);

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ProcessedData | null>(null);

  useEffect(() => {
    // Send request for data when the component mounts
    postMessage({ type: "requestData" });

    // Listener for receiving data from the extension
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "data") {
        setData(message.data); // Set the processed data when received
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
