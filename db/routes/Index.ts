import express from "express";
import AuthApi from "./Auth.api.";
import MyDataApi from "./MyData.api";
import LetterApi from "./Letter.api";

const router = express.Router();

router.use("/auth", AuthApi);
router.use("/mydata", MyDataApi);
router.use("/letter", LetterApi);

export default router;
