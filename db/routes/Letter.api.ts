import express from "express";
import LetterController from "../controllers/Letter.controller";

const router = express.Router();
router.post("/send/:username", LetterController.send);

export default router;
