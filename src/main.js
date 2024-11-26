import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "antd/dist/reset.css"; // Estilos de Ant Design
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx("div", { className: "container", children: _jsx(App, {}) }) }));
