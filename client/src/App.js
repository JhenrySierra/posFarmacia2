// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";
import Inicio from "./pages/Inicio";
import ReporteVentas from "./pages/ReporteVentas";
import Entrada from "./pages/Entrada";
import EditarInventario from "./pages/EditarInventario";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<InventoryPage />} />
          <Route path="/reporte-ventas" element={<ReporteVentas />} />
          <Route path="/entrada" element={<Entrada />} />
          <Route path="/editar" element={<EditarInventario />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
