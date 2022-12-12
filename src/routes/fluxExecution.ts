import express, { Request, Response } from "express";
import { Stream } from "stream";
const router = express.Router();
const spawn = require("child_process").spawn;

import Process from "../models/Process";
import Product from "../models/Product";

async function spawnProcess(processId: String) {
  const python = process.env.PYTHON_PATH;
  const path = process.env.WATCHMAN_CORE_PATH;
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
        await Product.insertMany(products);
      } catch (e) {
        console.log(e);
      }
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
    const processes = await Process.find({ flux: fluxid });
    var processIds = processes.map((p: any) => p.id);
    res.status(201).json({ message: "Flux Spawned" });

    while (processIds.length > 0) {
      const processId = processIds.shift();
      await spawnProcess(processId);
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
