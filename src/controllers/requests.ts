import { Request, Response } from "express";
import { FailedRequest } from "../models/failedRequest";

/**
 * Handles a GET request to /failed
 * 
 * Retrieves all failed requests (if any) from the database based on the client's IP address
 * and sends them back as JSON in the response body.
 * 
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
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
