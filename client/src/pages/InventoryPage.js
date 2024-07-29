import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = "http://localhost:5000";

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSale, setCurrentSale] = useState([]);
  const [amountPaid, setAmountPaid] = useState("");
  const [change, setChange] = useState(0);
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    axios
      .get("/api/productos")
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));
  }, []);

  const containerStyle = {
    width: "90%",
    margin: "0 auto",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
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
    width: "fit-content",
  };

  const tdStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  };

  const trEvenStyle = {
    backgroundColor: "#f9f9f9",
  };

  const trHoverStyle = {
    backgroundColor: "#f1f1f1",
  };

  const filteredItems = items.filter((item) =>
    item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToSale = (item) => {
    if (item.cantidad > 0) {
      setCurrentSale((prevSale) => {
        const existingItem = prevSale.find((i) => i._id === item._id);
        if (existingItem) {
          return prevSale.map((i) =>
            i._id === item._id
              ? { ...i, cantidad: existingItem.cantidad + 1 }
              : i
          );
        } else {
          return [...prevSale, { ...item, cantidad: 1 }];
        }
      });
    }
  };

  const handleRemoveFromSale = (item) => {
    setCurrentSale((prevSale) =>
      prevSale
        .map((i) =>
          i._id === item._id ? { ...i, cantidad: i.cantidad - 1 } : i
        )
        .filter((i) => i.cantidad > 0)
    );
  };

  const handleFinalizeSale = () => {
    const updateRequests = currentSale.map((item) =>
      axios.put(`/api/productos/${item._id}`, {
        cantidadToSubtract: item.cantidad,
      })
    );

    const newSale = {
      items: currentSale.map((item) => ({
        nombre: item.nombre,
        precio_unitario: item.precio_unitario,
        cantidad: item.cantidad,
      })),
      total,
    };

    Promise.all(updateRequests)
      .then(() => {
        setCurrentSale([]);
        return axios.post("/api/ventas", newSale);
      })
      .then(() => axios.get("/api/productos"))
      .then((response) => {
        setItems(response.data);
        handlePrint();
      })
      .catch((error) => {
        console.error(
          "Error finalizing sale:",
          error.response ? error.response.data : error.message
        );
      });

    setAmountPaid(0);
    setChange(0);
  };

  const handleCancelSale = () => {
    setCurrentSale([]);
    setAmountPaid("");
    setChange(0);
  };

  const handleGoToInicio = () => {
    navigate("/inicio");
  };

  const total = currentSale
    .reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleAmountPaidChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAmountPaid(value);
    setChange(value - total);
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 10px; }
          </style>
        </head>
        <body>
          <h2>Receipt</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f4f4f4; text-align: left;">Cantidad</th>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f4f4f4; text-align: left;">Artículo</th>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f4f4f4; text-align: left;">Precio Unitario</th>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f4f4f4; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${currentSale
                .map(
                  (item) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${
                    item.cantidad
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${
                    item.nombre
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">$${
                    item.precio_unitario
                  }</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">$${(
                    item.precio_unitario * item.cantidad
                  ).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 10px; text-align: left;"><strong>Total</strong></td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: left;"><strong>$${total}</strong></td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;
    const printWindow = window.open("", "", "width=600,height=400");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: "60%" }}>
        <div>
          <h1>INVENTARIO</h1>
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
            }}
          >
            VOLVER A INICIO
          </button>{" "}
        </div>
        <input
          type="text"
          placeholder="BUSCAR..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            margin: "10px 0",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>CANTIDAD</th>
              <th style={thStyle}>ARTICULO</th>
              <th style={thStyle}>PRECIO</th>
              <th style={thStyle}>CATEGORIA</th>
              <th style={thStyle}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr
                  key={item._id}
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
                  <td style={tdStyle}>{item.cantidad}</td>
                  <td style={tdStyle}>{item.nombre}</td>
                  <td style={tdStyle}>$ {item.precio_unitario}</td>
                  <td style={tdStyle}>{item.categoria}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleAddToSale(item)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      AGREGAR
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={tdStyle}>
                  No hay artículos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ width: "35%" }}>
        <h2>VENTA ACTUAL</h2>
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            margin: 0,
            marginBottom: "10px",
          }}
        >
          {currentSale.length > 0 ? (
            currentSale.map((item, index) => (
              <li
                key={index}
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {item.cantidad}x - {item.nombre} - ${item.precio_unitario}
                <button
                  onClick={() => handleRemoveFromSale(item)}
                  style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ELIMINAR
                </button>
              </li>
            ))
          ) : (
            <li>No items added</li>
          )}
        </ul>
        <div
          style={{
            padding: "10px 0",
            fontWeight: "bold",
            fontSize: "16px",
            borderTop: "1px solid #ddd",
            marginBottom: "10px",
          }}
        >
          TOTAL: ${total}
        </div>
        <div
          style={{
            display: "flex",
          }}
        >
          <p
            style={{
              width: "40%",
            }}
          >
            PAGA CON
          </p>
          <input
            type="number"
            placeholder="Monto Pagado"
            value={amountPaid}
            onChange={handleAmountPaidChange}
            style={{
              padding: "10px",
              marginBottom: "10px",
              width: "50%",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            borderTop: "1px solid #ddd",
            paddingTop: "10px",
            marginBottom: "2rem",
          }}
        >
          DEVUELTA: ${Math.max(0, change).toFixed(2)}
        </div>
        <button
          onClick={handleFinalizeSale}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          FINALIZAR VENTA
        </button>
        <button
          onClick={handleCancelSale}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          CANCELAR VENTA
        </button>
      </div>
    </div>
  );
}

export default InventoryPage;