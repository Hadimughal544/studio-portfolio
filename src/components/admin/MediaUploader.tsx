"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { MAX_IMAGE_UPLOAD_BYTES, MAX_VIDEO_UPLOAD_BYTES } from "@/lib/constants";

function formatMb(bytes: number) {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

type Props = {
  onUploaded: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
};

export function MediaUploader({
  onUploaded,
  folder = "portfolio",
  accept = "image/*,video/*",
  label = "Upload Media",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const maxBytes = isVideo ? MAX_VIDEO_UPLOAD_BYTES : MAX_IMAGE_UPLOAD_BYTES;
    if (file.size > maxBytes) {
      setError(
        `${isVideo ? "Video" : "Image"} must be under ${formatMb(maxBytes)}`,
      );
      e.target.value = "";
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const signRes = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          folder,
        }),
      });

      if (!signRes.ok) throw new Error("Failed to get upload signature");

      const { cloudName, apiKey, timestamp, signature, publicId } =
        await signRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("public_id", publicId);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: formData },
      );

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message ?? "Failed to upload file");
      }

      onUploaded(uploadData.secure_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-dashed border-border-theme px-4 py-3 text-sm text-muted transition hover:border-gold-400/50 hover:text-foreground">
        {uploading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Upload size={16} />
        )}
        {uploading ? "Uploading..." : label}
        <input
          type="file"
          accept={accept}
          className="hidden"
          disabled={uploading}
          onChange={handleFileChange}
        />
      </label>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
