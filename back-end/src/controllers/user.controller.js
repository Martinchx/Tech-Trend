import userSchema from "../models/User.js";
import cartSchema from "../models/Cart.js";
import orderSchema from "../models/Order.js";
import mongoose from "mongoose";

export const getUsers = async (req, res) => {
  try {
    const users = await userSchema.find();

    if (users.length === 0)
      return res.status(400).json({ message: "No users" });

    res.status(200).json({ success: true, message: "Users found", users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });

    const user = await userSchema.findById(userId);

    if (!user) return res.status(400).json({ message: "User not found" });

    res.status(200).json({ success: true, message: "User found", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullname, email, address, phone } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });

    if (!fullname || !email || !address || !phone)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const userToUpdate = await userSchema.findById(userId);

    if (!userToUpdate)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    if (
      userToUpdate.role === "admin" &&
      userToUpdate._id.toString() !== req.userId
    )
      return res
        .status(401)
        .json({ success: false, message: "You cannot edit other admins" });

    if (userToUpdate.email !== email) {
      const foundUser = await userSchema.findOne({ email });

      if (foundUser && foundUser._id.toString() !== userId)
        return res
          .status(409)
          .json({ success: false, message: "The email is already registered" });
    }

    const updatedUser = await userSchema.findByIdAndUpdate(
      userId,
      {
        fullname,
        address,
        email,
        phone,
      },
      {
        new: true,
      }
    );

    if (!updatedUser)
      return res.status(400).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });

    const userToDelete = await userSchema.findById(userId);

    if (!userToDelete)
      return res.status(404).json({ message: "User not found" });

    if (userId === req.userId)
      return res
        .status(403)
        .json({ success: false, message: "You cannot delete yourself" });

    if (userToDelete.role === "admin")
      return res
        .status(401)
        .json({ success: false, message: "You cannot delete other admins" });

    await cartSchema.deleteMany({ user: userId });
    await orderSchema.deleteMany({ user: userId });
    await userSchema.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};
