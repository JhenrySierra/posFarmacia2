import React, { useState, useEffect } from "react";
import axios from "axios";
import "animate.css";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "https://pos-farmacia2-api.vercel.app/";
// axios.defaults.baseURL = "http://localhost:5000/";

function EditarInventario() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedItem, setUpdatedItem] = useState({
    nombre: "",
    cantidad: "",
    precio_unitario: "",
    categoria: "",
    _id: "",
  });

  useEffect(() => {
    axios
      .get("/api/productos")
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setUpdatedItem({
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      categoria: item.categoria,
      _id: item._id,
    });
    setModalOpen(true);
  };

   const handleGoToInicio = () => {
     navigate("/");
   };

const navigate = useNavigate();
  const handleSaveChanges = () => {

    axios
      .put(`/api/productos/${selectedItem._id}/editar`, updatedItem)
      .then(() => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === selectedItem._id ? updatedItem : item
          )
        );
        setModalOpen(false);
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  const filteredItems = items.filter((item) =>
    item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ width: "90%", margin: "0 auto", padding: "20px" }}>
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
      <div>
        <h1>EDITAR INVENTARIO</h1>
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
        <table
          style={{
            width: "90%",
            borderCollapse: "collapse",
            margin: "20px 0",
          }}
        >
          <thead>
            <tr>
              <th>CANT.</th>
              <th>ARTICULO</th>
              <th>COSTO</th>
              <th>PRECIO VENTA</th>
              <th>CATEGORIA</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{item.cantidad}</td>
                  <td>{item.nombre}</td>
                  <td>$ {item.precio_unitario}</td>
                  <td>$ {(item.precio_unitario * 1.3).toFixed(2)}</td>
                  <td>{item.categoria}</td>
                  <td>
                    <button
                      onClick={() => handleEditItem(item)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay artículos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "60%",
            }}
          >
            <h2>Editar Producto</h2>
            <div style={{ marginBottom: "10px" }}>
              <label>Nombre:</label>
              <input
                type="text"
                value={updatedItem.nombre}
                onChange={(e) =>
                  setUpdatedItem({ ...updatedItem, nombre: e.target.value })
                }
                style={{
                  width: "50%",
                  marginLeft: "2rem",
                  padding: "8px",
                  margin: "5px 0",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Cantidad:</label>
              <input
                type="number"
                value={updatedItem.cantidad}
                onChange={(e) =>
                  setUpdatedItem({
                    ...updatedItem,
                    cantidad: Number(e.target.value),
                  })
                }
                style={{
                  width: "50%",
                  marginLeft: "1.7rem",
                  padding: "8px",
                  margin: "5px 0",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Costo:</label>
              <input
                type="number"
                value={updatedItem.precio_unitario}
                onChange={(e) =>
                  setUpdatedItem({
                    ...updatedItem,
                    precio_unitario: Number(e.target.value),
                  })
                }
                style={{
                  width: "50%",
                  marginLeft: "3rem",
                  padding: "8px",
                  margin: "5px 0",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Categoría:</label>
              <input
                type="text"
                value={updatedItem.categoria}
                onChange={(e) =>
                  setUpdatedItem({ ...updatedItem, categoria: e.target.value })
                }
                style={{
                  width: "50%",
                  marginLeft: "1.4rem",
                  padding: "8px",
                  margin: "5px 0",
                }}
              />
            </div>
            <button
              onClick={handleSaveChanges}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                padding: "10px 20px",
                marginLeft: "10px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditarInventario;
