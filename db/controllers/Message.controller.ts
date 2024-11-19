import { Request, Response } from "express";
import Message from "../models/Message";

const MessageController = {
  createMessage: async (req: Request, res: Response) => {
    try {
      const { name, message, decorationType, isPrivate } = req.body;
      const newMessage = new Message({
        name,
        message,
        decorationType,
        isPrivate,
      });
      await newMessage.save();
      res.status(201).json({ status: "success", data: newMessage });
    } catch (error) {
      res.status(400).json({ status: "fail", error });
      // next(error);
    }
  },

  getMessage: async (req: Request, res: Response) => {
    try {
      const messages = await Message.find();
      res.status(200).json({ status: "success", data: messages });
    } catch (error) {
      res.status(400).json({ status: "fail", error });
    }
  },
};

export default MessageController;
