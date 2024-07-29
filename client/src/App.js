// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";
import Inicio from "./pages/Inicio";
import ReporteVentas from "./pages/ReporteVentas";
import Entrada from "./pages/Entrada";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<InventoryPage />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/reporte-ventas" element={<ReporteVentas />} />
          <Route path="/entrada" element={<Entrada />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
