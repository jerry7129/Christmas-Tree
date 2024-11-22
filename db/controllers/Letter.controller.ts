import { Request, Response } from "express";
import User, { ILetter } from "../models/User";

const LetterController = {
  send: async (req: Request, res: Response) => {
    const { username } = req.params;
    const { sender, content, decorationType, isPrivate } = req.body;
    try {
      const recipient = await User.findOne({ username });
      if (!recipient) {
        res.status(404).json({ message: "Recipient not found" });
        return;
      }

      const letter = {
        sender,
        content,
        decorationType,
        isPrivate,
      };

      recipient.letters.push(letter as ILetter);
      await recipient.save();
      res.json({ message: "Letter sent successfully", letter });
    } catch (error) {
      res.status(500).json({ message: "Error sending letter", error });
    }
  },
};

export default LetterController;
