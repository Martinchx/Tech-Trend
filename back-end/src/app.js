import express from "express";
import cors from "cors";
import morgan from "morgan";

import {
  NODE_ENV,
  FRONTEND_URL_PRODUCTION,
  FRONTEND_URL_DEVELOPMENT,
} from "./utils/config.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

/* Middlewares */

app.use(
  cors({
    origin:
      NODE_ENV === "production"
        ? FRONTEND_URL_PRODUCTION
        : FRONTEND_URL_DEVELOPMENT,
  })
);
app.use(morgan("dev"));
app.use(express.json());

/* Routes */

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

export default app;
