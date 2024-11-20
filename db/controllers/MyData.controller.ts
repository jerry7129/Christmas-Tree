import express, { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/AuthMiddleware";

const MyDataController = {
  get: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.user).select("tree letters");
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ tree: user.tree, letters: user.letters });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user data", error });
    }
  },
  put: async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, color } = req.body;

    try {
      const user = await User.findById(req.user);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.tree.name = name || user.tree.name;
      user.tree.color = color || user.tree.color;
      await user.save();

      res.json({ message: "Tree updated successfully", tree: user.tree });
    } catch (error) {
      res.status(500).json({ message: "Error updating tree", error });
    }
  },
};

export default MyDataController;
