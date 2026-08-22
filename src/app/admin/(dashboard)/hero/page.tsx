"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaPreview } from "@/components/admin/MediaPreview";
import { isImageUrl } from "@/lib/utils";

type FormData = {
  heading: string;
  description: string;
  locationLabel: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
};

const emptyForm: FormData = {
  heading: "",
  description: "",
  locationLabel: "",
  mediaUrl: "",
  mediaType: "IMAGE",
};

export default function AdminHeroPage() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((res) => res.json())
      .then((data) => {
        setForm({
          heading: data.heading || "",
          description: data.description || "",
          locationLabel: data.locationLabel || "",
          mediaUrl: data.mediaUrl || "",
          mediaType: data.mediaType === "VIDEO" ? "VIDEO" : "IMAGE",
        });
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.mediaUrl) return;
    setSaving(true);
    setSaved(false);

    await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    setSaved(true);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Homepage Hero</h1>
        <p className="mt-1 text-sm text-muted-subtle">
          Control the heading, description, and background media shown at the
          top of the homepage.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-2xl rounded-sm border border-border-theme bg-surface-muted p-4 sm:p-6"
      >
        <label className="form-label">Heading</label>
        <input
          value={form.heading}
          onChange={(e) => setForm({ ...form, heading: e.target.value })}
          placeholder="Welcome to Almir Wedding Films"
          required
          className="form-input"
        />

        <label className="form-label mt-4">Location Label (optional)</label>
        <input
          value={form.locationLabel}
          onChange={(e) => setForm({ ...form, locationLabel: e.target.value })}
          placeholder="Lahore, Pakistan"
          className="form-input"
        />

        <label className="form-label mt-4">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          required
          className="form-input"
        />

        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-muted-subtle">
            Background (image or video)
          </p>
          <MediaUploader
            folder="hero"
            accept="image/*,video/*"
            label="Upload Background"
            onUploaded={(url) =>
              setForm({
                ...form,
                mediaUrl: url,
                mediaType: isImageUrl(url) ? "IMAGE" : "VIDEO",
              })
            }
          />
          <MediaPreview
            url={form.mediaUrl}
            type={form.mediaType === "VIDEO" ? "video" : "image"}
            alt={form.heading || "Hero background"}
            onRemove={() => setForm({ ...form, mediaUrl: "" })}
          />
        </div>

        <button
          type="submit"
          disabled={saving || !form.mediaUrl}
          className="mt-6 rounded-sm bg-gold-500 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-black disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && (
          <span className="ml-4 text-sm text-gold-400">Saved.</span>
        )}
      </form>
    </div>
  );
}
