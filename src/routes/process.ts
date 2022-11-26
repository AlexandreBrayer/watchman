import express, { Request, Response } from "express";
const router = express.Router();
import Process from "../models/Process";

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await Process.find();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await Process.findById(req.params.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ error: "Not found" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const result = await Process.create(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    await Process.findByIdAndUpdate(req.params.id, req.body);
    res.status(204).json();
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/filter", async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    for (const key in req.body.filters) {
      if (
        typeof req.body.filters[key].value === "string" &&
        req.body.filters[key].strict === false
      ) {
        const regexValue = new RegExp(req.body.filters[key].value, "i");
        filters[key] = regexValue;
      } else {
        filters[key] = req.body.filters[key].value;
      }
    }
    const result = await Process.find(filters);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
