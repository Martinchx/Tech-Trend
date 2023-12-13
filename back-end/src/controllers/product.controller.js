import productSchema from "../models/Product.js";
import categorySchema from "../models/Category.js";
import mongoose from "mongoose";
import fs from "fs/promises";

import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";

export const getProducts = async (req, res) => {
  try {
    const products = await productSchema.find().populate("category");

    if (products.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No products found" });

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });

    const product = await productSchema.findById(productId);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product found", product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid categoryId" });

    const products = await productSchema.find({
      category: categoryId,
    });

    if (products.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No products found" });

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { productName } = req.query;

    if (!productName) {
      const products = await productSchema.find();

      if (products.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "No products found" });

      return res
        .status(200)
        .json({ success: true, message: "Products found", products });
    }

    const products = await productSchema.find({
      name: { $regex: productName, $options: "i" },
    });

    if (products.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No products found" });

    res
      .status(200)
      .json({ success: true, message: "Products found", products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    if (!mongoose.Types.ObjectId.isValid(category))
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });

    if ((typeof price !== "number" && !isFinite(price)) || price < 1)
      return res.status(400).json({
        success: false,
        message: "Price must be a number greater than or equal to 1",
      });

    if ((typeof stock !== "number" && !isFinite(stock)) || stock < 1)
      return res.status(400).json({
        success: false,
        message: "Stock must be a number greater than or equal to 1",
      });

    if (!req.files?.image)
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });

    const categoryToAddProduct = await categorySchema.findById(category);
    if (!categoryToAddProduct)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    const newProduct = new productSchema({
      name,
      description,
      price,
      stock,
      category,
    });

    const result = await uploadImageToCloudinary(req.files.image.tempFilePath);

    newProduct.image = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };

    await fs.unlink(req.files.image.tempFilePath);

    await newProduct.save();
    categoryToAddProduct.products.push(newProduct._id);
    await categoryToAddProduct.save();

    res.status(200).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, stock, category } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });

    if (!name || !description || !price || !stock || !category)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    if (!mongoose.Types.ObjectId.isValid(category))
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });

    if ((typeof price !== "number" && !isFinite(price)) || price < 1)
      return res.status(400).json({
        success: false,
        message: "Price must be a number greater than or equal to 1",
      });

    if ((typeof stock !== "number" && !isFinite(stock)) || stock < 1)
      return res.status(400).json({
        success: false,
        message: "Stock must be a number greater than or equal to 1",
      });

    const currentProduct = await productSchema.findById(productId);
    if (req.files?.image) {
      if (currentProduct.image?.public_id)
        await deleteImageFromCloudinary(currentProduct.image.public_id);

      const result = await uploadImageToCloudinary(
        req.files.image.tempFilePath
      );
      currentProduct.image.public_id = result.public_id;
      currentProduct.image.secure_url = result.secure_url;

      await fs.unlink(req.files.image.tempFilePath);
    }

    const updatedProduct = await productSchema.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        stock,
        category,
        image: currentProduct.image,
      },
      {
        new: true,
      }
    );

    if (!updatedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    await categorySchema.updateMany(
      { products: currentProduct._id },
      { $pull: { products: currentProduct._id } }
    );

    const categoryToAddProduct = await categorySchema.findById(category);
    if (!categoryToAddProduct)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    categoryToAddProduct.products.push(updatedProduct._id);
    await categoryToAddProduct.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid productId" });

    await categorySchema.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );

    const deletedProduct = await productSchema.findByIdAndDelete(productId);

    if (!deletedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (deletedProduct.image?.public_id) {
      await deleteImageFromCloudinary(deletedProduct.image.public_id);
    }

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
