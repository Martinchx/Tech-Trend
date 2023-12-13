import { Schema, model } from "mongoose";

let productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Product", productSchema);
