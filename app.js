import express from "express";
import { connect } from "mongoose";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from 'dotenv';

dotenv.config();

connect(
  process.env.MONGODB_URI,
)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

const app = express();

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'up',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});


app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);


// Error handling
app.use((err, req, res, next) => {
  if (err) {
    console.error(`[${new Date().toISOString()}] Error:`, err);
    return res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      ...(process.env.ENV_TYPE !== 'production' && { stack: err.stack })
    });
  }
  
  res.status(404).json({ message: 'Route not found' });
});

export default app;
