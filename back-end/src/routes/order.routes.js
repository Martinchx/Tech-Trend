import { Router } from "express";
import {
  createOrder,
  captureOrder,
  cancelPayment,
  getOrders,
  getOrdersByUser,
  getOrder,
} from "../controllers/order.controller.js";

import { isAuth } from "../middlewares/is-Auth.js";
import { isAdmin } from "../middlewares/is-Admin.js";

const router = Router();

router.post("/create-order", isAuth, createOrder);
router.get("/capture-order", captureOrder);
router.get("/cancel-order", cancelPayment);
router.get("/get-orders", isAuth, isAdmin, getOrders);
router.get("/get-order/:orderId", isAuth, getOrder);
router.get("/get-my-orders", isAuth, getOrdersByUser);

export default router;
