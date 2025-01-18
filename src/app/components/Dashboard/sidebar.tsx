import React from "react";
import { Button } from "../Core-Components/button";
import { Triangle, Home, Bot, Code2 } from "lucide-react";
import clsx from "clsx";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../Core-Components/tooltip";

interface SidebarProps {
  setSelectedContent: (content: string) => void;
  isExpanded: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ setSelectedContent, isExpanded, toggleSidebar }: SidebarProps) {
  return (
    <div className="fixed flex min-h-screen">
      <div
        className={clsx(
          "flex flex-col border-r bg-background transition-all  ease-in-out duration-100",
          isExpanded ? "w-40" : "w-16",
        )}
      >
        {/* Sidebar Header */}
        <header className="flex h-12 items-center justify-between border-b pl-3 p-1">
          {isExpanded && <span className="font-bold text-xl">Dashboard</span>}
          <Button
            variant="ghost"
            className={clsx(
              "flex items-center justify-center p-2 rounded-md transition-transform",
              isExpanded ? "rotate-180" : "rotate-90",
            )}
            onClick={toggleSidebar}
          >
            <Triangle className="h-5 w-5" />
          </Button>
        </header>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start rounded-md p-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                  onClick={() => setSelectedContent("Home")}
                >
                  <Home className="h-5 w-5" />
                  {isExpanded && <span className="ml-2">Home</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="tooltip">
                Home: ELF data and build analyzer table
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start rounded-md p-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                  onClick={() => setSelectedContent("ELF Overview")}
                >
                  <Bot className="h-5 w-5" />
                  {isExpanded && <span className="ml-2">ELF Overview</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="tooltip">
                ELF Overview: Detailed information about the ELF file
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start rounded-md p-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                  onClick={() => setSelectedContent("Symbols")}
                >
                  <Code2 className="h-5 w-5" />
                  {isExpanded && <span className="ml-2">Symbols</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="tooltip">
                Symbols: View and analyze symbol tables
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </div>
    </div>
  );
}
