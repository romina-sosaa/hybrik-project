import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const region = process.env.AWS_REGION!;

console.log(bucketName,accessKeyId, secretAccessKey, region)
if (!bucketName || !accessKeyId || !secretAccessKey || !region) {
  throw new Error("Please define all necessary environment variables.");
}

export const awsConfig = {
  bucketName,
  accessKeyId,
  secretAccessKey,
  region,
};
