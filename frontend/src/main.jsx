import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ManagerProvider } from "./context/ManagerContext";
import { AdminProvider } from "./context/AdminContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminProvider>
      <ManagerProvider>
        <App />
      </ManagerProvider>
    </AdminProvider>
  </React.StrictMode>
);