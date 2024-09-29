const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  precio_unitario: { type: Number, required: true },
  cantidad: { type: Number, required: true },
});

const Product = mongoose.model("Product", productoSchema, "productos");

module.exports = Product;
