const AWS = require("@aws-sdk/client-s3");
import { PutObjectCommand } from "@aws-sdk/client-s3";
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing env variables for S3");
}
const s3 = new AWS.S3({
  region,
  credentials: {
    secretAccessKey,
    accessKeyId,
  },
});

export async function uploadFile(file: { buffer: Buffer; originalname: string; }) {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: file.originalname,
  };
  try {
    const result = await s3.send(new PutObjectCommand(uploadParams));
    return result;
  } catch (e) {
    console.log(e);
    return -1;
  }
}
