import express, { Request, Response } from "express";
const router = express.Router();
const spawn = require("child_process").spawn;

import Process from "../models/Process";
import Product from "../models/Product";

router.post("/", async (req: Request, res: Response) => {
  try {
    const python = process.env.PYTHON_PATH;
    const path = process.env.WATCHMAN_CORE_PATH;
    const fluxid = req.body.id;
    const processes = await Process.find({ flux: fluxid });
    const processIds = processes.map((p: any) => p.id);
    console.log(processIds);
    var buffer: Array<any> = [];
    const core = spawn(python, [path, ...processIds]);
    res.status(201).json({ message: "Flux Spawned" });
    core.stdout.on("data", async (data: any) => {
      buffer.push(data.toString());
    });
    core.stdout.on("end", async () => {
      const result = buffer.join("");
        const products = JSON.parse(result);
        await Product.insertMany(products);
        console.log("MAIS NON ??")
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
