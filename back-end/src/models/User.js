import { Schema, model } from "mongoose";

let userSchema = new Schema(
  {
    fullname: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("User", userSchema);
