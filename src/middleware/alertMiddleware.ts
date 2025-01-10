import { Request, Response, NextFunction } from "express";
import { handleFailedRequest } from "../utils/alert";

/**
 * Express middleware to check if the request has a valid authorization
 * token. If invalid, sends a 401 Unauthorized response and logs the
 * request as a failed attempt.
 *
 * @function
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next middleware function
 */
export const monitorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;
  if (!authToken || authToken !== "expected_token") {
    res.status(401).json({ message: "Unauthorized" });
    handleFailedRequest(req.ip!, "Invalid token");
    return;
  }
  next();
};
