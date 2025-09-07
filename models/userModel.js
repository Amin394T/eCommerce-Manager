import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = Schema({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 25 },
  password: { type: String, required: true, minlength: 8, maxlength: 100 },
  phone: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  status: { type: String, enum: ["active", "blocked"], default: "active" },
});

userSchema.plugin(uniqueValidator);

export default model("User", userSchema);
