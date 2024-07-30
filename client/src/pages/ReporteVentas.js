// client/src/pages/SalesReportPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "animate.css"
axios.defaults.baseURL = "https://pos-farmacia2-api.vercel.app/"; // Set this to your backend server URL -- 

function SalesReportPage() {
  const [sales, setSales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate(); // Create navigate instance for navigation

  useEffect(() => {
    axios
      .get("/api/ventas")
      .then((response) => setSales(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleFilterSales = () => {
    axios
      .get("/api/ventas", {
        params: {
          startDate,
          endDate,
        },
      })
      .then((response) => setSales(response.data))
      .catch((error) => console.error(error));
  };

 const handleGoToInicio = () => {
   navigate("/");
 };

const handleArchiveSale = (saleId) => {
  axios
    .delete("/api/ventas", { data: { saleId } }) // Pasar el ID de la venta en el cuerpo
    .then(() => {
      // Refresh the sales data
      axios
        .get("/api/ventas")
        .then((response) => setSales(response.data))
        .catch((error) => console.error(error));
    })
    .catch((error) => {
      console.error(
        "Error archiving sale:",
        error.response ? error.response.data : error.message
      );
    });
};


  // Inline CSS styles
  const containerStyle = {
    width: "90%",
    margin: "0 auto",
    padding: "20px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "20px 0",
  };

  const thStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    textAlign: "left",
    whiteSpace: "nowrap",
    width: "1%",
  };

  const tdStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  };

  const totalStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "lightGreen",
  };

  const trEvenStyle = {
    backgroundColor: "#f9f9f9",
  };

  const trHoverStyle = {
    backgroundColor: "#f1f1f1",
  };

  const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);

  return (
    <div style={containerStyle} className="animate__fadeIn">
      <h1>REPORTE DE VENTAS</h1>
      <button
        onClick={handleGoToInicio}
        style={{
          padding: "10px 20px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        VOLVER A INICIO
      </button>{" "}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>
          Desde:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: "5px", marginRight: "10px" }}
          />
        </label>
        <label>
          Hasta:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: "5px", marginRight: "10px" }}
          />
        </label>
        <button
          onClick={handleFilterSales}
          style={{
            padding: "5px 10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Filtrar
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Detalles</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale, index) => (
              <tr
                key={sale._id}
                style={index % 2 === 0 ? trEvenStyle : {}}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    trHoverStyle.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? trEvenStyle.backgroundColor : "")
                }
              >
                <td style={tdStyle}>{new Date(sale.date).toLocaleString()}</td>
                <td
                  style={tdStyle}
                  dangerouslySetInnerHTML={{
                    __html: sale.items
                      .map(
                        (item) =>
                          `${item.cantidad} x ${item.nombre} $${item.precio_unitario}`
                      )
                      .join("<br />"),
                  }}
                ></td>
                <td style={tdStyle}>
                  $
                  {sale.total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleArchiveSale(sale._id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    ARCHIVAR
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={tdStyle}>
                No sales found
              </td>
            </tr>
          )}
          <tr>
            {" "}
            <td style={tdStyle}></td>
            <td style={totalStyle}>
              <strong>TOTAL</strong>
            </td>
            <td style={totalStyle}>
              <strong>
                $
                {totalSales.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </td>
            <td style={tdStyle}></td>
          </tr>
        </tbody>
        <tfooter></tfooter>
      </table>
    </div>
  );
}

export default SalesReportPage;
