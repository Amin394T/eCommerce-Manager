const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.end("Server Running ...");
  next();
});

app.use((req, res, next) => {
    console.log("Request Served.")
  });

module.exports = app;
