import express, { Request, Response } from "express";
import Product from "../models/Product";
import { parseFilters } from "../lib/Filters";
const router = express.Router();
const json2csv = require('json2csv');

router.post("/", async (req: Request, res: Response) => {
  try {
    const bodyFilters = req.body.filters;
    const filters = parseFilters(bodyFilters, {}, null);
    const result = await Product.find(filters);
    const fields = req.body.fields;
    const csv = json2csv.parse(result, { flatten: true, fields, delimiter: ";" });
    res.setHeader("Content-disposition", "attachment; filename=data.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: e });
  }
});

export default router;
