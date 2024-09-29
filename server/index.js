require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;
const inventoryRoutes = require("./routes/productos"); // Ensure this is the correct path
const salesRoutes = require("./routes/ventas");

const uri = process.env.URI
console.log(uri)

app.use(cors());
app.use(bodyParser.json());

app.use("/api/productos", inventoryRoutes); // Updated route for productos
app.use("/api/ventas", salesRoutes); // Adjust if necessary

mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

db.on("error", (err) => {
  console.error("MongoDB connection error:::", err);
});

app.listen(port, () => {
  console.log(`Server is running on port::: ${port}`);
});
