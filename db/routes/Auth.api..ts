import express from "express";
import AuthController from "../controllers/Auth.controller";

const router = express.Router();
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);

export default router;
