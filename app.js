import express from "express";
import mongoose, { connect } from "mongoose";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { logMessage } from "./server.js";
import dotenv from 'dotenv';

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";


// Application configuration
dotenv.config();
const app = express();

connect(process.env.MONGODB_URI)
  .then(() => { logMessage("Successfully connected to MongoDB Atlas!") })
  .catch((error) => {
    logMessage("Connection to MongoDB Atlas failed! " + error.message);
    process.kill(process.pid, 'SIGINT');
  });


// Request configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use((req, res, next) => {
  logMessage(`${req.method} ${req.url}`);
  next();
});

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/images", express.static(join(__dirname, "media/images")));

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);


// Health checking
app.get('/health', (req, res) => {
  res.json({
    status: 'up',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});


// Error handling
app.use((err, req, res) => {
  logMessage(`Error occurred: ${err.message}`);
  return res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.ENV_TYPE !== 'production' && { stack: err.stack })
  });
});

app.use((req, res) => {
  logMessage(`Unknown Route: ${req.method} ${req.url}`);
  return res.status(404).json({ message: 'Route not found' });
});

export default app;
