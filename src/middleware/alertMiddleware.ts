import { Request, Response, NextFunction } from "express";
import { FailedRequest } from "../models/failedRequest";
import { handleFailedRequest } from "../utils/alert";

export const monitorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "POST" && req.path === "/api/submit") {
    const authToken = req.headers["authorization"];
    if (!authToken || authToken !== "expected_token") {
      res.status(401).json({ message: "Unauthorized" });
      handleFailedRequest(req.ip!, "Invalid token");
      return;
    }
  }
  next();
};
