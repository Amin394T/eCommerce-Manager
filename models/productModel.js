import e from "express";
import { Schema, model } from "mongoose";

const productSchema = Schema({
  reference: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, min: 0, max: 100, default: 0 },
  image: { type: String },
  category: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, default: 1 },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["in-stock", "sold-out", "deleted", "on-hold", "hidden"],
    default: "in-stock",
  },
  specification: {
    type: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    default: [],
  },
  delivery: {
    type: {
      range: { type: String, required: true },
      cost: { type: Number, required: true },
      time: { type: String, required: true },
    },
  },
  policy: {
    type: {
      type: { type: String, enum: ["refund", "exchange"], required: true },
      method: { type: String, enum: ["drop-off", "pick-up", "in-store", "none"], required: true },
      period: { type: Number, required: true },
    },
  },
});

export default model("Product", productSchema);
