import express, { Request, Response } from "express";
import Product from "../models/Product";
const router = express.Router();
const { uploadFile } = require("../lib/s3");

async function download(
  url: string,
  name: string
): Promise<{ buffer: Buffer; type: string | null; name: string }> {
  const response = await fetch(url);
  const mime = response.headers.get("content-type");
  const ext = mime?.split("/")[1];
  const buffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(buffer),
    type: mime,
    name: `${name}.${ext}`,
  };
}

router.post("/savetocloud", async (req: Request, res: Response) => {
  try {
    const ids = req.body.ids;
    const products = await Product.find({ _id: { $in: ids } });
    const promises = products.map(async (product: any) => {
      const files = await Promise.all(
        product.images.map(async (image: any, index: number) => {
          const name = `${product._id}_${index}`;
          const img = await download(image, name);
          return {
            buffer: img.buffer,
            originalname: img.name,
            mimetype: img.type,
          };
        })
      );
      const uploadPromises = files.map((file) => {
        return uploadFile(file);
      });
      await Promise.all(uploadPromises);
      const urls = files.map((file) => {
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${file.originalname}`;
      });
      product.images = urls;

      await product.save();
    });

    await Promise.all(promises);

    res.status(200).json({ message: "Files uploaded successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

export default router;
