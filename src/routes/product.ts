import express, { Request, Response } from "express";
const router = express.Router();
import Product from "../models/Product";

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await Product.findById(req.params.id)
    .populate("from");
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ error: "Not found" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const result = await Product.create(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/bulk", async (req: Request, res: Response) => {
  try {
    const result = await Product.insertMany(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/filter", async (req: Request, res: Response) => {
  const page = req.body.page;
  const limit = req.body.limit;
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
    const result = await Product.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v -desc -from");
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
