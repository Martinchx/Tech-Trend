import cartSchema from "../models/Cart.js";
import productSchema from "../models/Product.js";
import userSchema from "../models/User.js";
import mongoose from "mongoose";

export const getCartProducts = async (req, res) => {
  try {
    const cartFound = await cartSchema
      .findOne({ user: req.userId })
      .populate("products.product");

    if (!cartFound || cartFound.products.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "This user has not a shopping car" });

    res.status(200).json({ success: true, cartFound });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const addProductsToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const userFound = await userSchema.findById(req.userId);

    if (userFound.role === "admin")
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access. Only users can add products to their carts",
      });

    if (!product || !quantity)
      return res
        .status(400)
        .json({ success: false, message: "Product and quantity are required" });

    if ((typeof quantity !== "number" && !isFinite(quantity)) || quantity < 1)
      return res.status(400).json({
        success: false,
        message: "Quantity must be a number greater than or equal to 1",
      });

    if (!mongoose.Types.ObjectId.isValid(product))
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });

    const p = await productSchema.findById(product);

    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (p.stock < quantity)
      return res.status(400).json({
        success: false,
        message: "Quantity cannot exceed available stock",
      });

    const cartFound = await cartSchema.findOne({ user: req.userId });

    if (!cartFound) {
      const cart = new cartSchema({
        user: req.userId,
        total: 0,
      });

      cart.products.push({ product, quantity });
      cart.total += p.price * quantity;
      await cart.save();

      return res
        .status(200)
        .json({ success: true, message: "Cart created successfully", cart });
    }

    const foundProductIndex = cartFound.products.findIndex(
      (p) => p.product.toString() === product
    );

    if (foundProductIndex !== -1) {
      const newQuantity =
        cartFound.products[foundProductIndex].quantity + quantity;

      if (p.stock < newQuantity)
        return res.status(400).json({
          success: false,
          message: "Quantity cannot exceed available stock",
        });

      cartFound.products[foundProductIndex].quantity = newQuantity;
      cartFound.total += p.price * quantity;
      await cartFound.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cart: cartFound,
      });
    }

    if (p.stock < quantity)
      return res.status(400).json({
        success: false,
        message: "Quantity cannot exceed available stock",
      });

    cartFound.products.push({ product, quantity });
    cartFound.total += p.price * quantity;
    await cartFound.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: cartFound,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });

    const cartFound = await cartSchema.findOne({ user: req.userId });

    if (!cartFound)
      return res
        .status(404)
        .json({ success: false, message: "This user has not a cart" });

    const productIndex = cartFound.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const removedProduct = cartFound.products.splice(productIndex, 1)[0];
    const productFound = await productSchema.findById(removedProduct.product);

    cartFound.total -= productFound.price * removedProduct.quantity;

    await cartFound.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted from cart",
      cart: cartFound,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });

    if ((typeof quantity !== "number" && !isFinite(quantity)) || quantity < 1)
      return res.status(400).json({
        success: false,
        message: "Quantity must be a number greater than or equal to 1",
      });

    const cartFound = await cartSchema.findOne({ user: req.userId });

    if (!cartFound)
      return res
        .status(404)
        .json({ success: false, message: "This user does not have a cart" });

    const productIndex = cartFound.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1)
      return res
        .status(404)
        .json({ success: false, message: "Product not found in the cart" });

    const updatedProduct = cartFound.products[productIndex];
    const productFound = await productSchema.findById(updatedProduct.product);

    if (!productFound)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (productFound.stock < quantity)
      return res.status(400).json({
        success: false,
        message: "Quantity cannot exceed available stock",
      });

    const priceDifference =
      productFound.price * (quantity - updatedProduct.quantity);

    updatedProduct.quantity = quantity;
    cartFound.total += priceDifference;

    await cartFound.save();

    return res.status(200).json({
      success: true,
      message: "Product quantity updated",
      cart: cartFound,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
