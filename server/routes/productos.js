const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update a product
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidadToSubtract } = req.body; // Updated to 'cantidad' to match the schema

    // Validate input
    if (typeof cantidadToSubtract !== "number" || isNaN(cantidadToSubtract)) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate the new quantity
    const newQuantity = product.cantidad - cantidadToSubtract; // Updated to 'cantidad'

    // Check if the new quantity is valid
    if (newQuantity < 0) {
      return res.status(400).json({ message: "Insufficient quantity" });
    }

    // Update the product quantity
    product.cantidad = newQuantity; // Updated to 'cantidad'
    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT endpoint to handle product quantity addition
router.put("/:id/entrada", async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    // Validate input
    if (typeof cantidad !== "number" || isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product quantity
    product.cantidad += cantidad;
    await product.save();

    res.json({ message: "Product quantity updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
