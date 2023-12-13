import { Router } from "express";
import fileUpload from "express-fileupload";

import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
} from "../controllers/product.controller.js";

import { isAuth } from "../middlewares/is-Auth.js";
import { isAdmin } from "../middlewares/is-Admin.js";

const router = Router();

router.get("/get-products", getProducts);
router.get("/get-product/:productId", getProduct);
router.get("/get-products-by-category/:categoryId", getProductsByCategory);
router.get("/search-products", searchProducts);
router.post(
  "/add-product",
  isAuth,
  isAdmin,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  addProduct
);
router.put(
  "/update-product/:productId",
  isAuth,
  isAdmin,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  updateProduct
);
router.delete("/delete-product/:productId", isAuth, isAdmin, deleteProduct);

export default router;
