import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";

export const isAuth = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader)
      return res.status(401).json({ message: "Access denied, missing token" });

    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, JWT_SECRET);

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Invalid token" });
  }
};
