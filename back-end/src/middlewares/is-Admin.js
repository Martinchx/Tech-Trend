import userSchema from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.userId)
      return res.status(401).json({ message: "Not authorizated" });

    const user = await userSchema.findById(req.userId);

    if (user.role !== "admin")
      return res.status(401).json({ message: "Admin role required" });

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something were wrong. Try again later" });
  }
};
