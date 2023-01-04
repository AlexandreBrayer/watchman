import express, { Request, Response } from "express";
import User from "../models/User";
import { generateAccessToken } from "../lib/Jwt";
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function saltandhash(password: string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

router.post("/register", async (req: Request, res: Response) => {
  try {
    const hash = await saltandhash(req.body.password);
    const user = await User.create({
      username: req.body.username,
      password: hash,
    });
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json({ error: "User not found" });
    } else {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        const token = generateAccessToken(user.username);
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "Wrong password" });
      }
    }
  } catch (e) {
    res.status(500).json({ error: e });
    console.log(e);
  }
});

export default router;
