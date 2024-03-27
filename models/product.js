const mongoose = require("mongoose");

const productShema = mongoose.Schema({
  reference: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number },
  image: { type: String },
  category: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Product", productShema);
