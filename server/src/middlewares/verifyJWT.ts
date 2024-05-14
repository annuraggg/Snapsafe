import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized (NT)" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized (IT)" });
  }
};

export default verifyJWT;
