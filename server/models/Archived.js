// server/models/archivedSales.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArchivedSaleSchema = new Schema({
  items: [
    {
      nombre: String,
      precio_unitario: Number,
      cantidad: Number,
    },
  ],
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ArchivedSale = mongoose.model("ArchivedSale", ArchivedSaleSchema, "ventasArchivadas")
module.exports = ArchivedSale;
