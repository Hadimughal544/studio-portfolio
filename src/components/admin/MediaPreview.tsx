"use client";

import { X } from "lucide-react";

type Props = {
  url: string;
  type?: "image" | "video";
  alt?: string;
  onRemove?: () => void;
};

export function MediaPreview({
  url,
  type = "image",
  alt = "Upload preview",
  onRemove,
}: Props) {
  if (!url) return null;

  return (
    <div className="relative mt-3 inline-block overflow-hidden rounded-sm border border-border-theme bg-input-bg">
      {type === "video" ? (
        <video
          src={url}
          className="max-h-48 w-full max-w-xs object-cover"
          muted
          playsInline
          controls
        />
      ) : (
        <img
          src={url}
          alt={alt}
          className="max-h-48 w-full max-w-xs object-cover"
        />
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full bg-header-bg p-1 text-muted transition hover:bg-surface hover:text-foreground"
          aria-label="Remove preview"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
