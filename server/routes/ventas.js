// routes/sales.js
const express = require("express");
const router = express.Router();
const Venta = require("../models/Venta");

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

module.exports = router;
