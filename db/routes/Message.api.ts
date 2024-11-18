import express from "express";
import messageController from "../controllers/Message.controller";

const router = express.Router();
router.get("/", messageController.getMessage);
router.post("/", messageController.createMessage);
//router.put("/:id");
//router.delete("/:id");

export default router;
