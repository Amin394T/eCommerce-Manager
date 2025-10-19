import { Schema, model } from "mongoose";

const productSchema = Schema({
  reference: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, default: 1 },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["in-stock", "sold-out", "deleted", "on-hold", "hidden"],
    default: "in-stock"
  }
});

export default model("Product", productSchema);
