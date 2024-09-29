// routes/sales.js
const express = require("express");
const router = express.Router();
const Venta = require("../models/Venta");
const Product = require("../models/Product");
const ArchivedSale = require("../models/Archived");

// Get all sales
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999
        query.date.$lte = end;
      }
    }

    const ventas = await Venta.find(query).sort({ date: -1 });
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new sale
router.post("/", async (req, res) => {
  try {
    const newSale = new Venta(req.body);
    await newSale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint para eliminar una venta, archivarla y devolver cantidades a productos
router.delete('/', async (req, res) => {
  try {
    const { saleId } = req.body; // Obtener el ID de la venta del cuerpo de la solicitud

    // Verificar que el ID esté presente
    if (!saleId) {
      return res
        .status(400)
        .json({ message: "El ID de la venta es requerido" });
    }

    // Encuentra y elimina la venta
    const sale = await Venta.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    // Archiva la venta
    const archivedSale = new ArchivedSale({
      items: sale.items,
      total: sale.total,
    });

    await archivedSale.save();

    // Crea las operaciones de actualización en un array
    const bulkOperations = sale.items.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { cantidad: item.cantidad } },
      },
    }));

    // Ejecuta las operaciones de actualización en bloque
    await Product.bulkWrite(bulkOperations);

    // Elimina la venta
    await Venta.findByIdAndDelete(saleId);

    res
      .status(200)
      .json({ message: "Venta archivada y cantidades restauradas" });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
