const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose
  .connect(
    "mongodb+srv://user:pwd@ecommercedb.9a6ge1v.mongodb.net/?retryWrites=true&w=majority&appName=eCommerceDB"
  )
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/products", (req, res, next) => {
  const product = new Product({
    reference: req.body.reference,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    category: req.body.category,
  });

  product
    .save()
    .then(() => {
      res.status(201).json({
        message: "Product saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

app.get("/api/products/:id", (req, res, next) => {
  Product.findOne({ reference: req.params.id })
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
});

app.get("/api/products", (req, res, next) => {
  Product.find()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
});

module.exports = app;
