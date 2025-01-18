import React, { useContext } from "react";
import { DataProvider, DataContext } from "../../contexts/data-context";
import BuildAnalyzer from "../Build-Analyzer";
import NoDataPrompt from "../no-data-prompt";

// This is the main component responsible for rendering content in the Panel Webview (Build Analyzer).
const PanelContent: React.FC = () => {
  const data = useContext(DataContext); // Access the data from the context

  // Check if data exists; if not, show NoDataPrompt
  if (!data) {
    return <NoDataPrompt />;
  }

  return (
    <main className="flex flex-col min-h-screen panel-webview">
      <BuildAnalyzer />
    </main>
  );
};

// This is the wrapper component responsible for setting up the data context.
export default function PanelRoot() {
  return (
    <DataProvider>
      <PanelContent />
    </DataProvider>
  );
}
