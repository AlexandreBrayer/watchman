import express, { Request, Response } from "express";
import { Stream } from "stream";
const router = express.Router();
const spawn = require("child_process").spawn;

import Process from "../models/Process";
import Flux from "../models/Flux";
import Product from "../models/Product";
import Report from "../models/Report";

async function spawnProcess(processId: String) {
  const python = process.env.PYTHON_PATH;
  const path = process.env.WATCHMAN_CORE_PATH;
  const report = new Report({
    process: processId,
  });
  const start = new Date();
  try {
    const core = spawn(python, [path, processId]);
    var buffer: Array<String> = [];
    core.stdout.on("data", async (data: Stream) => {
      buffer.push(data.toString());
    });
    core.stdout.on("end", async () => {
      const result = buffer.join("");
      const products = JSON.parse(result);
      try {
        report.productsFound = products.length;
        await Product.insertMany(products);
      } catch (e) {
        console.log(e);
        report.error = { error: e };
      }
      const end = new Date();
      report.executionTime = end.getTime() - start.getTime();
      await report.save();
    });
    core.stderr.on("data", (data: Stream) => {
      if (process.env.STDERR_ON === "1") {
        console.log("error", data.toString());
      }
    });
  } catch (e) {
    console.log(e);
  }
}
router.post("/", async (req: Request, res: Response) => {
  try {
    const fluxid = req.body.id;
    const flux = await Flux.findById(fluxid);
    if (flux === null) {
      res.status(404).json({ error: "Flux not found" });
      return;
    }
    if (flux.state === "running") {
      res.status(400).json({ error: "Flux already running" });
      return;
    }
    flux.state = "running";
    await flux.save();
    const processes = await Process.find({ flux: fluxid });
    var processIds = processes.map((p: any) => p.id);
    res.status(201).json({ message: "Flux Spawned" });

    while (processIds.length > 0) {
      const processId = processIds.shift();
      await spawnProcess(processId);
    }
    flux.state = "ready";
    await flux.save();
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
