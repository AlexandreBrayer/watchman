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

router.get("/delall", async (req: Request, res: Response) => {
    console.log("Deleting all products");
    pb.autoCancellation(false);
    try {
        const products = await pb.collection("product").getFullList(1000000);
        const result = await Promise.all(
            products.map(async (id: any) => {
                console.log("Deleting product", id);
                return pb.collection("product").delete(id);
            }
        ));
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ error: e });
    }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await pb.collection("product").getOne(req.params.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ error: "Not found" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const result = await pb.collection("product").create(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/bulk", async (req: Request, res: Response) => {
  pb.autoCancellation(false);
  try {
    const result = await Promise.all(
      req.body.map(async (product: any) => {
        return pb.collection("product").create(product);
      })
    );
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/filter", async (req: Request, res: Response) => {
  try {
    const result = await pb
      .collection("product")
      .getList(req.body.page, req.body.limit || 20, req.body.params);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
