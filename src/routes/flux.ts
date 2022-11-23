import express, { Request, Response } from "express";
const router = express.Router();

const PocketBase = require("pocketbase/cjs");
const pb = new PocketBase(process.env.POCKET_BASE_URL);
const connect = async () => {
  await pb.admins.authWithPassword(
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_PASSWORD
  );
};
connect();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pb.collection("flux").getFullList(1000000);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await pb.collection("flux").getOne(req.params.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ error: "Not found" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const result = await pb.collection("flux").create(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    await pb.collection("flux").update(req.params.id, req.body);
    res.status(204).json();
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/search/:q", async (req: Request, res: Response) => {
  try {
    const result = await pb.collection("flux").getFullList(1000000, {
      filter: 'name ~ "' + req.params.q + '"',
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
