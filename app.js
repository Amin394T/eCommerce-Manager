import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from 'dotenv';
import express from "express";
import mongoose, { connect } from "mongoose";

import { logMessage } from "./server.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";


// application configuration
dotenv.config();
const app = express();
export default app;

connect(process.env.MONGODB_URI)
  .then(() => { logMessage("Connected to DB succeeded.") })
  .catch((error) => {
    logMessage("Connection to DB failed! " + error.message);
    process.kill(process.pid, 'SIGINT');
  });


// request configuration
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


// health checking
app.get('/health', (req, res) => {
  res.json({
    application: 'running',
    database: mongoose.connection.readyState == 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});


// error handling
app.use((err, req, res, next) => {
  logMessage(`Error occurred: ${err.message}`);
  return res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.ENV_TYPE != 'production' && { stack: err.stack })
  });
});

app.use((req, res) => {
  logMessage(`Unknown Route: ${req.method} ${req.url}`);
  return res.status(404).json({ message: 'Route not found' });
});
