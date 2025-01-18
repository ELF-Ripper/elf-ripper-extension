import React from "react";
import { createRoot } from "react-dom/client";
import PanelRoot from "./components/Panel";
import "./styles/tailwind.css";

const root = createRoot(document.getElementById("root"));
root.render(<PanelRoot />);
