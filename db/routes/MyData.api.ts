import express from "express";
import authMiddleware from "../middleware/AuthMiddleware";
import MyDataController from "../controllers/MyData.controller";

const router = express.Router();
router.get("/", authMiddleware, MyDataController.get);
router.put("/tree", authMiddleware, MyDataController.put);

export default router;
