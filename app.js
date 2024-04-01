import express from "express";
import { connect } from "mongoose";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

connect(
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

app.use(
  "/images",
  express.static(join(dirname(fileURLToPath(import.meta.url)), "media/images"))
);

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

export default app;
