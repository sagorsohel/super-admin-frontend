import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SidebarLayout from "./layout/SidebarLayout.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
         <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>s
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
