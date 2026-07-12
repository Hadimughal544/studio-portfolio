import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function buildMediaPublicId(folder: string, filename: string) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const baseName = safeName.replace(/\.[^/.]+$/, "");
  return `${folder}/${Date.now()}-${baseName}`;
}

export function getSignedUploadParams(folder: string, filename: string) {
  const publicId = buildMediaPublicId(folder, filename);
  const timestamp = Math.round(Date.now() / 1000);

  const params = { timestamp, public_id: publicId };
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET ?? "",
  );

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    publicId,
  };
}

export function extractPublicId(url: string) {
  if (!url || !url.includes("res.cloudinary.com")) return null;

  const afterUpload = url.split("/upload/")[1];
  if (!afterUpload) return null;

  const segments = afterUpload.split("/");
  const versionIndex = segments.findIndex((s) => /^v\d+$/.test(s));
  const pathParts =
    versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments;

  const fullPath = pathParts.join("/");
  return fullPath.replace(/\.[^/.]+$/, "") || null;
}

function getResourceType(url: string): "image" | "video" | "raw" {
  if (url.includes("/video/upload/")) return "video";
  if (url.includes("/raw/upload/")) return "raw";
  return "image";
}

export async function deleteFromCloudinary(url: string) {
  const publicId = extractPublicId(url);
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: getResourceType(url),
  });
}
