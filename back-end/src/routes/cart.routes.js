import { Router } from "express";

const router = Router();

import { getCartProducts, addProductsToCart, updateProductQuantity, deleteProductFromCart } from '../controllers/cart.controller.js'
import { isAuth } from "../middlewares/is-Auth.js";

router.get("/get-cart", isAuth, getCartProducts);
router.post("/add-products-to-cart", isAuth, addProductsToCart);
router.put("/update-product-quantity/:productId/:quantity", isAuth, updateProductQuantity);
router.delete("/delete-product-from-cart/:productId", isAuth, deleteProductFromCart);


export default router;
