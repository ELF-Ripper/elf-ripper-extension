import React, { useState } from "react";
import Sidebar from "./sidebar";
import Home from "./Home";
import Overview from "./ELF-Overview";
import SymbolsTable from "./Symbols-Tables";
import clsx from "clsx";

const Dashboard: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<string>("Home");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const renderContent = () => {
    switch (selectedContent) {
      case "Home":
        return <Home />;
      case "ELF Overview":
        return <Overview />;
      case "Symbols":
        return <SymbolsTable />;
      default:
        return <div>Welcome to My Extension</div>;
    }
  };

  return (
    <main className="flex">
      <Sidebar
        setSelectedContent={setSelectedContent}
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={clsx("min-w-0.5 w-full transition-all ease-in-out duration-100", {
          "ml-40": isSidebarExpanded,
          "ml-16": !isSidebarExpanded,
        })}
      >
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight pl-4 pt-2">
            {selectedContent}
          </h1>
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
