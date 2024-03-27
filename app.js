const express = require("express");
const mongoose = require("mongoose");

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
  console.log(req.body);
  res.status(201).json({
    message: "Resource created.",
  });
});

app.get("/api/products", (req, res, next) => {
  const products = [
    {
      id: "oifUKwZp",
      name: "Lenovo ThinkPad T480",
      category: "Laptop",
      price: 360,
    },
    {
      id: "XpqmIsAQ",
      name: "Samsung Galaxy S10",
      category: "Smartphone",
      price: 210,
    },
  ];

  res.status(200).json(products);
});

module.exports = app;
