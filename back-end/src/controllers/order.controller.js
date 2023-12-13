import orderSchema from "../models/Order.js";
import cartSchema from "../models/Cart.js";
import productSchema from "../models/Product.js";
import userSchema from "../models/User.js";

import {
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
  NODE_ENV,
  FRONTEND_URL_PRODUCTION,
  FRONTEND_URL_DEVELOPMENT,
  BACKEND_URL_PRODUCTION,
  BACKEND_URL_DEVELOPMENT,
} from "../utils/config.js";
import axios from "axios";

const FrontendURL =
  NODE_ENV === "production"
    ? FRONTEND_URL_PRODUCTION
    : FRONTEND_URL_DEVELOPMENT;
const BackendURL =
  NODE_ENV === "production" ? BACKEND_URL_PRODUCTION : BACKEND_URL_DEVELOPMENT;

let temporaryUserId = null;

export const createOrder = async (req, res) => {
  try {
    temporaryUserId = req.userId;

    const user = await userSchema.findById(req.userId);

    if (user.role === "admin")
      return res.status(401).json({
        success: false,
        message: "You cannot create orders, only users",
      });

    const cart = await cartSchema.findOne({ user: req.userId });

    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    if (cart.products.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    for (const product of cart.products) {
      const existingProduct = await productSchema.findById(product.product);

      if (!existingProduct || existingProduct.stock < product.quantity)
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product ${existingProduct.name}`,
        });
    }

    const orderItems = await Promise.all(
      cart.products.map(async (p) => {
        const product = await productSchema.findById(p.product);
        if (product)
          return {
            name: product.name,
            description: product.id,
            unit_amount: { currency_code: "USD", value: product.price },
            quantity: p.quantity,
          };
      })
    );

    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: cart.total,
            breakdown: {
              item_total: { currency_code: "USD", value: cart.total },
            },
          },
          items: orderItems,
        },
      ],
      application_context: {
        brand_name: "Tech-Trend",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${BackendURL}/capture-order`,
        cancel_url: `${BackendURL}/cancel-order`,
      },
    };

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const {
      data: { access_token },
    } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
      auth: {
        username: PAYPAL_API_CLIENT,
        password: PAYPAL_API_SECRET,
      },
    });

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res.json(response.data.links[1].href);
  } catch (err) {
    console.log(err);
  }
};

export const captureOrder = async (req, res) => {
  try {
    const { token } = req.query;
    const userId = temporaryUserId;
    temporaryUserId = null;

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    const orderData = response.data;

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const {
      data: { access_token },
    } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
      auth: {
        username: PAYPAL_API_CLIENT,
        password: PAYPAL_API_SECRET,
      },
    });

    const orderDetails = await axios.get(`${orderData.links[0].href}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const items = orderDetails.data.purchase_units[0].items;
    const amount = orderDetails.data.purchase_units[0].amount;

    const cart = await cartSchema.findOne({ user: userId });

    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    if (cart.products.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    const products = items.map((i) => {
      return {
        product: i.description,
        quantity: parseInt(i.quantity, 10),
      };
    });

    const newOrder = new orderSchema({
      paypalOrderId: orderDetails.data.id,
      orderStatus: orderDetails.data.status,
      user: userId,
      products: products,
      total: amount.value,
      payerDetails: orderDetails.data.payer,
    });

    await newOrder.save();

    for (const product of cart.products) {
      const existingProduct = await productSchema.findById(product.product);
      existingProduct.stock -= product.quantity;
      await existingProduct.save();
    }

    cart.products = [];
    cart.total = 0;
    await cart.save();

    res.redirect(
      `${FrontendURL}/my-orders?success=${orderDetails.data.id}`
    );
  } catch (err) {
    console.log(err);
  }
};

export const cancelPayment = async (req, res) => {
  try {
    res.redirect(`${FrontendURL}/shopping-car`);
  } catch (err) {
    console.log(err);
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await orderSchema.find().populate("user");

    if (orders.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const foundOrder = await orderSchema
      .findById(orderId)
      .populate("products.product");

    if (!foundOrder)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res
      .status(200)
      .json({ success: true, message: "Order found", order: foundOrder });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await orderSchema.find({ user: req.userId });

    if (orders.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "This users has not orders" });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
