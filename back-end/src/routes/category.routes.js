import { Router } from "express";
import {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import { isAuth } from "../middlewares/is-Auth.js";
import { isAdmin } from "../middlewares/is-Admin.js";

const router = Router();

router.get("/get-categories", getCategories);
router.get("/get-category/:categoryId", getCategory);
router.post("/add-category", isAuth, isAdmin, addCategory);
router.put("/update-category/:categoryId", isAuth, isAdmin, updateCategory);
router.delete("/delete-category/:categoryId", isAuth, isAdmin, deleteCategory);

export default router;
