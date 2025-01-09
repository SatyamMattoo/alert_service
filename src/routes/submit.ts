import express from "express";
import { submit } from "../controllers/submit";


const router = express.Router();

router.post("/post", submit);

export default router;