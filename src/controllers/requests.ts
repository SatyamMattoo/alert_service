import { Request, Response } from "express";
import { FailedRequest } from "../models/failedRequest";

export const getFailedRequests = async (req: Request, res: Response) => {
  try {
    const failedRequests = await FailedRequest.find({
      ip: req.ip,
    });
    res.status(200).json(failedRequests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch failed requests" });
  }
};
