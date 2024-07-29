import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"; // Import react-modal

axios.defaults.baseURL = "http://localhost:5000"; // Set this to your backend server URL

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [quantity, setQuantity] = useState("");

  const navigate = useNavigate();

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

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      border: "none",
      width: "80%",
      maxWidth: "500px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  const filteredItems = items.filter((item) =>
    item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEntradaProducto = (item) => {
    setCurrentItem(item);
    setModalIsOpen(true);
  };

  const handleQuantitySubmit = () => {
    if (currentItem && quantity > 0) {
      axios
        .put(`/api/productos/${currentItem._id}/entrada`, {
          cantidad: quantity,
        })
        .then((response) => {
          // Update the item quantity locally
          setItems((prevItems) =>
            prevItems.map((item) =>
              item._id === currentItem._id
                ? { ...item, cantidad: item.cantidad + quantity }
                : item
            )
          );
          setModalIsOpen(false);
          setQuantity(0);
        })
        .catch((error) => {
          console.error(error);
          setModalIsOpen(false);
        });
    }
  };

  const handleGoToInicio = () => {
    navigate("/inicio");
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: "60%" }}>
        <div>
          <h1>ENTRADA DE PRODUCTOS</h1>
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
          </button>
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
                  <td style={tdStyle}>${item.precio_unitario}</td>
                  <td style={tdStyle}>{item.categoria}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleEntradaProducto(item)}
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
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Agregar Cantidad"
        style={modalStyle}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          Agregar Cantidad
        </h2>
        <p style={{ marginBottom: "20px" }}>
          {currentItem ? currentItem.nombre : ""}
        </p>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          placeholder="CANTIDAD A AGRAGAR"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handleQuantitySubmit}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
              flex: "1",
            }}
          >
            Agregar
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              flex: "1",
            }}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default InventoryPage;
