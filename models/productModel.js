import { Schema, model } from "mongoose";

const productSchema = Schema({
  reference: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number },
  image: { type: String },
  category: { type: String, required: true },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default model("Product", productSchema);
