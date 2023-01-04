const jwt = require("jsonwebtoken");
import { Request, Response } from "express";

export function generateAccessToken(user: IUser) {
  const usercopy = JSON.parse(JSON.stringify(user));
  delete usercopy.password;
  return jwt.sign({ user : usercopy }, process.env.TOKEN_SECRET, {
    expiresIn: "604800s",
  });
}

export function authenticateToken(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ error: "Unauthorized" });
  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    }
  );
}
