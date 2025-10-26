import { Schema, model } from "mongoose";

const reviewSchema = Schema({
  product: { type: String, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["normal", "edited", "removed", "blocked"],
    default: "normal"
  }
});

export default model("Review", reviewSchema);
