import express, { Request, Response } from "express";
const router = express.Router();
const spawn = require("child_process").spawn;

const PocketBase = require("pocketbase/cjs");
const pb = new PocketBase(process.env.POCKET_BASE_URL);
const connect = async () => {
  await pb.admins.authWithPassword(
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_PASSWORD
  );
};
connect();

router.post("/", async (req: Request, res: Response) => {
  try {
    const python = process.env.PYTHON_PATH;
    const path = process.env.WATCHMAN_CORE_PATH;
    const fluxid = req.body.id;

    const processes = await pb.collection("process").getFullList(1000000, {
      filter: 'flux = "' + fluxid + '"',
    });
    const names = processes.map((p: any) => p.name);

    const core = spawn(python, [path, ...names]);
    
    res.status(201).json({ message: "Flux Spawned" });
    core.stdout.on("data", (data: any) => {
      console.log(data.toString());
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
