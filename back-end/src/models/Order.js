import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

let orderSchema = new Schema(
  {
    paypalOrderId: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [productSchema],
    total: {
      type: Number,
      required: true,
    },
    payerDetails: {
      name: {
        given_name: String,
        surname: String,
      },
      email_address: String,
      payer_id: String,
      address: {
        country_code: String,
      },
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Order", orderSchema);
