import React from "react";
import { Link } from "react-router-dom";
import "animate.css"

const Inicio = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const currentDate = `${day}/${month}/${year}`;

  const containerStyle = {
    textAlign: "center",
    padding: "50px",
    background:
      "radial-gradient(circle, rgba(0,80,128,1) 0%, rgba(82,159,205,1) 100%)",
    height: "100vh",
    color: "#fff", // Make text white for better contrast
  };

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#fff", // Ensure title is visible on the gradient background
    marginBottom: "10px",
    letterSpacing: "3px",
  };

  const logoStyle = {
    width: "100px",
    height: "100px",
    margin: "20px 0",
    borderRadius: "10px",
  };

  const dateStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const linkContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  };

  const linkStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    letterSpacing: "3px",
    padding: "15px 30px",
    backgroundColor: "#4CAF50",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, box-shadow 0.3s",
    aspectRatio: "3/1",
    alignContent: "center",
  };

  const footer = {
    position: "fixed",
    bottom: 0,
    left: 50,
    color: "black",
    textAlign: "center",
    padding: "10px 0",
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle} className="animate__animated animate__fadeInDown">
        Super Farmacia Tony
      </div>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYXdYKSoRHZC29qSTe3sYoZ1d3kQ1jQad3Lw&s"
        alt="Pharmacy Logo"
        style={logoStyle}
        className="animate__animated animate__zoomIn"
      />
      <div style={dateStyle} className="animate__animated animate__fadeInDown">
        Fecha: {currentDate}
      </div>
      <div style={linkContainerStyle}>
        <Link
          to="../productos"
          className="animate__animated animate__zoomIn"
          style={linkStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#45a049")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#4CAF50")
          }
        >
          <img
            src="https://cdn-icons-png.freepik.com/256/12201/12201509.png?semt=ais_hybrid"
            alt="Pharmacy Logo"
            style={logoStyle}
          />
          <br></br>
          INVENTARIO
        </Link>
        <Link
          to="../reporte-ventas"
          style={linkStyle}
          className="animate__animated animate__zoomIn"
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#45a049")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#4CAF50")
          }
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/5071/5071208.png"
            alt="Pharmacy Logo"
            style={logoStyle}
          />
          <br></br> REPORTE DE VENTAS
        </Link>
        <Link
          to="../entrada"
          style={linkStyle}
          className="animate__animated animate__zoomIn"
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#45a049")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#4CAF50")
          }
        >
          <img
            src="https://as2.ftcdn.net/v2/jpg/03/09/93/07/1000_F_309930773_Bd6fnrufMDhVBFrFXmlMjjQRjQ4PSarT.jpg"
            alt="Pharmacy Logo"
            style={logoStyle}
          />
          <br></br>ENTRADA
        </Link>
      </div>
      <div style={footer}>
        Hecho por TECHTONIC Solutions - Todos los derechos Reservados {year}
        <br></br>
        Soporte Tecnico - Jhenry Sierra t.: 829-645-2598 <br></br>
        Fecha de Hoy: {currentDate}
      </div>
    </div>
  );
};

export default Inicio;
