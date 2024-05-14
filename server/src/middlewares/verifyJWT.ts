import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("No token");
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // @ts-expect-error Property 'user' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs>'.
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default verifyJWT;
