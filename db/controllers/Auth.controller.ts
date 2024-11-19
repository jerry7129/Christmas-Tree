import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const AuthController = {
  signup: async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  },
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) res.status(404).json({ message: "User not found" });
      else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
          expiresIn: "1h",
        });
        res.json({ token });
      }
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  },
};

export default AuthController;
