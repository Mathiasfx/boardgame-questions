import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "antd/dist/reset.css"; // Estilos de Ant Design

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="container">
      <App />
    </div>
  </StrictMode>
);
