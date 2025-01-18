import React from "react";
import { createRoot } from "react-dom/client";
import DashboardRoot from "./components/Dashboard";
import "./styles/tailwind.css";

const root = createRoot(document.getElementById("root"));
root.render(<DashboardRoot />);
