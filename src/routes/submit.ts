import express from "express";
import { submit } from "../controllers/submit";
import { monitorMiddleware } from "../middleware/alertMiddleware";

const router = express.Router();

router.post("/post", monitorMiddleware, submit);

export default router;