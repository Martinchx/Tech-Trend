import categorySchema from "../models/Category.js";
import productSchema from "../models/Product.js";
import mongoose from "mongoose";

export const getCategories = async (req, res) => {
  try {
    const categories = await categorySchema.find();

    if (categories.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No categories found" });

    res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid categoryId" });

    const category = await categorySchema.findById(categoryId);

    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    res
      .status(200)
      .json({ success: true, message: "Category found", category });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, description, products } = req.body;

    if (!name || !description)
      return res
        .status(400)
        .json({ success: false, message: "Name and description are required" });

    if (!Array.isArray(products))
      return res.status(422).json({
        success: false,
        message: "The 'products' field should be an array",
      });

    const productExistInCategory = await Promise.all(
      products.map(async (p) => {
        const product = await productSchema.findById(p);
        return product && product.category !== null;
      })
    );

    const existsInCategory = productExistInCategory.some((exists) => exists);

    if (existsInCategory)
      return res.status(400).json({
        success: false,
        message:
          "A product is alredy in another category, remove it from there to add it",
      });

    const newCategory = new categorySchema({
      name,
      description,
      products,
    });

    await newCategory.save();

    if (products.length > 0)
      await productSchema.updateMany(
        { _id: { $in: products } },
        { category: newCategory._id }
      );

    res.status(200).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, products } = req.body;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid categoryId" });

    if (!name || !description)
      return res
        .status(400)
        .json({ success: false, message: "Name and description are required" });

    if (!Array.isArray(products))
      return res.status(422).json({
        success: false,
        message: "The 'products' field should be an array",
      });

    const productExistInCategory = await Promise.all(
      products.map(async (p) => {
        const product = await productSchema.findById(p);
        return product && product.category !== null && product.category.toString() !== categoryId;
      })
    );

    const existsInCategory = productExistInCategory.some((exists) => exists);

    if (existsInCategory)
      return res.status(400).json({
        success: false,
        message:
          "A product is alredy in another category, remove it from there to add it",
      });

    const updatedCategory = await categorySchema.findByIdAndUpdate(
      categoryId,
      {
        name,
        description,
        products,
      },
      {
        new: true,
      }
    );

    if (!updatedCategory)
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });

    await productSchema.updateMany(
      { category: categoryId, _id: { $nin: products } },
      { category: null }
    );

    await productSchema.updateMany(
      { _id: { $in: products } },
      { category: categoryId }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid categoryId" });

    const deletedCategory = await categorySchema.findByIdAndDelete(categoryId);

    if (!deletedCategory)
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });

    await productSchema.updateMany(
      { category: categoryId },
      { category: null }
    );

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
