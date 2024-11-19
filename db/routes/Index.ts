import express from "express";
import messageApi from "./Message.api";
import authApi from "./Auth.api.";

const router = express.Router();

router.use("/messages", messageApi);
router.use("/auth", authApi);

export default router;
