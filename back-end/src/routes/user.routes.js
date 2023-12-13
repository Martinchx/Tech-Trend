import { Router } from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { isAuth } from "../middlewares/is-Auth.js";
import { isAdmin } from "../middlewares/is-Admin.js";

const router = Router();

router.get("/get-users", isAuth, isAdmin, getUsers);
router.get("/get-user/:userId", isAuth, isAdmin, getUser);
router.put("/update-user/:userId", isAuth, isAdmin, updateUser);
router.delete("/delete-user/:userId", isAuth, isAdmin, deleteUser);

export default router;
