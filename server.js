import app from "./app.js";
import dotenv from 'dotenv';

dotenv.config();

export let logMessage = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
}


// Startup handling
const port = process.argv[2] || process.env.PORT || 3000;
const env = process.env.ENV_TYPE || 'unspecified';

const server = app.listen(port, () => {
  logMessage(`Server running on port : ${port}`);
  logMessage(`Server environment type : ${env}`);
});


// Shutdown handling
let exit = (signal) => {
  logMessage(`Signal ${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    logMessage(`Server closed. Process exiting...`);
    process.exit(0);
  });

  setTimeout(() => {
    logMessage(`Graceful shutdown timed out, forcefully shutting down.`);
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => exit('TERMINATE'));
process.on('SIGINT', () => exit('INTERRUPT'));

process.on('uncaughtException', (error) => {
  logMessage(`Uncaught Exception: ${error.message}`);
  exit('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  logMessage(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  exit('UNHANDLED_REJECTION');
});
