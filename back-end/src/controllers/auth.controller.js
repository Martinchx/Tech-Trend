import userSchema from "../models/User.js";
import { JWT_SECRET } from "../utils/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const postSignup = async (req, res) => {
  try {
    const { fullname, address, email, phone, password } = req.body;

    if (!fullname || !address || !email || !phone || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const foundUser = await userSchema.findOne({ email });
    if (foundUser)
      return res
        .status(409)
        .json({ message: "The email is already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new userSchema({
      fullname,
      address,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({ message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await userSchema.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Incorrect email or password" });

    const hasMatch = await bcrypt.compare(password, user.password);

    if (!hasMatch)
      return res.status(401).json({ message: "Incorrect email or password" });

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: "2h",
    });

    return res
      .status(200)
      .json({ message: "User logged", token, userRole: user.role });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
