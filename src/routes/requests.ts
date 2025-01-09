import express from "express";
import { getFailedRequests } from "../controllers/requests";

const router = express.Router();

router.get("/failed", getFailedRequests);

export default router;