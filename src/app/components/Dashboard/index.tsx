import React, { useContext } from "react";
import { DataProvider, DataContext } from "../../contexts/data-context";
import Dashboard from "./Dashboard";
import NoDataPrompt from "../no-data-prompt";

// This is the main component responsible for rendering content in the Editor Webview (Dashboard).
const DashboardContent: React.FC = () => {
  const data = useContext(DataContext); // Access the data from the context

  // Check if data exists; if not, show NoDataPrompt
  if (!data) {
    return <NoDataPrompt />;
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Dashboard />
    </main>
  );
};

// This is the wrapper component responsible for setting up the data context.
export default function DashboardRoot() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}
