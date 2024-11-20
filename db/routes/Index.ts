import express from "express";
import AuthApi from "./Auth.api.";
import MyDataApi from "./MyData.api";

const router = express.Router();

router.use("/auth", AuthApi);
router.use("/mydata", MyDataApi);

export default router;
