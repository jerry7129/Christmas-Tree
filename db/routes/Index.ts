import express from "express";
import messageApi from "./Message.api";

const router = express.Router();

router.use("/messages", messageApi);

export default router;
