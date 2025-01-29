import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";


import "antd/dist/reset.css"; // Estilos de Ant Design

import { AuthProvider } from "./providers/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <div className="container">
        <App />
      </div>
    </AuthProvider>
  </StrictMode>
);
