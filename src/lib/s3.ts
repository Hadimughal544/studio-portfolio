import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const bucket = process.env.AWS_S3_BUCKET ?? "";

export function getPublicUrl(key: string) {
  if (process.env.AWS_S3_PUBLIC_URL) {
    return `${process.env.AWS_S3_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  }
  return `https://${bucket}.s3.${process.env.AWS_REGION ?? "us-east-1"}.amazonaws.com/${key}`;
}

export async function getUploadPresignedUrl(
  key: string,
  contentType: string,
  expiresIn = 3600,
) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return { uploadUrl, publicUrl: getPublicUrl(key), key };
}

export async function deleteFromS3(key: string) {
  if (!key || !bucket) return;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export function extractS3Key(url: string) {
  if (!url) return null;

  const publicBase = process.env.AWS_S3_PUBLIC_URL?.replace(/\/$/, "");
  if (publicBase && url.startsWith(publicBase)) {
    return url.slice(publicBase.length + 1);
  }

  const match = url.match(/amazonaws\.com\/(.+)$/);
  return match?.[1] ?? null;
}

export function buildMediaKey(folder: string, filename: string) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${folder}/${Date.now()}-${safeName}`;
}
