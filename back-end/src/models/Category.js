import { Schema, model } from "mongoose";

let categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Category", categorySchema);
