import app from "./app.js";
import dotenv from 'dotenv';


dotenv.config();

const port = process.argv[2] || process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] Server running on port : ${port}`);
  console.log(`[${new Date().toISOString()}] Environment type : ${process.env.ENV_TYPE || 'development'}`);
});


const gracefulShutdown = (signal) => {
  console.log(`[${new Date().toISOString()}] ${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log(`[${new Date().toISOString()}] Server closed. Process exiting...`);
    process.exit(0);
  });

  setTimeout(() => {
    console.error(`[${new Date().toISOString()}] Could not close connections in time, forcefully shutting down`);
    process.exit(1);
  }, 30000);
};

['SIGTERM', 'SIGINT'].forEach(signal => {
  process.on(signal, () => gracefulShutdown(signal));
});


process.on('uncaughtException', (error) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection at:`, promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});
