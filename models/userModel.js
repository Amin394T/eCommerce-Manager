import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

export default model("User", userSchema);
