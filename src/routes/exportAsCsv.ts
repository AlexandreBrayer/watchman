import express, { Request, Response } from "express";
const router = express.Router();
import Product from "../models/Product";
const json2csv = require('json2csv');

router.post("/", async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    const bodyFilters = req.body.filters;
    for (const key in bodyFilters) {
      if (
        typeof bodyFilters[key].value === "string" &&
        bodyFilters[key].strict === false
      ) {
        const regexValue = new RegExp(bodyFilters[key].value, "i");
        filters[key] = regexValue;
      } else {
        filters[key] = bodyFilters[key].value;
      }
    }
    const result = await Product.find(filters);
    const fields = req.body.fields;
    const csv = json2csv.parse(result, { flatten: true, fields, delimiter: ";" });
    res.setHeader("Content-disposition", "attachment; filename=data.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
