import React from "react";
import { Button } from "./Core-Components/button";
import { postMessage } from "../utils/vscode-api"; // Import your utility

export function NoDataPrompt() {
  // Function to send a message to the extension to trigger processing files
  const handleProcessDataClick = () => {
    postMessage({ type: "processFiles" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6 shadow-lg rounded-lg border border-gray-300">
        <h1 className="text-xl font-bold mb-4 text-red-600">No Data Available</h1>
        <p className="mb-4">It looks like you haven't processed any data yet.</p>
        <Button variant="default" size="sm" onClick={handleProcessDataClick}>
          Process Data
        </Button>
      </div>
    </div>
  );
}

export default NoDataPrompt;
