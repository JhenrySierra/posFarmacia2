const mongoose = require("mongoose");

const ventaSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  items: [
    {
      nombre: String,
      cantidad: Number,
      precio_unitario: Number,
    },
  ],
  total: Number,
});

const Venta = mongoose.model("Venta", ventaSchema, "ventas");

module.exports = Venta;
