import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
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

        const accessToken = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET || "",
          {
            expiresIn: "1h",
          }
        );
        const refreshToken = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET || "",
          {
            expiresIn: "7d",
          }
        );
        res.json({ accessToken, refreshToken });
      }
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  },
  refresh: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ error: "Refresh token required" });
      return;
    }
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || ""
      ) as JwtPayload;
      const user = await User.findById(payload.id);

      if (!user || user.refreshToken !== refreshToken) {
        res.status(401).json({ error: "Invalid refresh token" });
        return;
      }
      const newAccessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET || "",
        { expiresIn: "7d" }
      );
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(401).json({ error: "Invalid or expired refresh token" });
    }
  },
};

export default AuthController;
