import express, { Request, Response } from "express";
const router = express.Router();
import Product from "../models/Product";
import { parseFilters } from "../lib/Filters";

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await Product.findById(req.params.id).populate("from");
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
  const page = req.body.page || 1;
  const limit = req.body.limit || 10;
  const sort = req.body.sortBy;
  try {
    const filters = parseFilters(req.body.filters, req.body.dateBarrier);
    const result = await Product.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .select("-__v -desc -from")
      .exec();
    const count = await Product.countDocuments(filters);
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      products: result,
      totalPages: totalPages,
      count: count,
    });
  } catch (e) {
    res.status(500).json({ error: e });
    console.log(e);
  }
});

router.post("/count", async (req: Request, res: Response) => {
  try {
    const filters = parseFilters(req.body.filters, req.body.dateBarrier);
    const result = await Product.countDocuments(filters);
    res.status(200).json({ count: result });
  } catch (e) {
    res.status(500).json({ error: e });
    console.log(e);
  }
});

export default router;
