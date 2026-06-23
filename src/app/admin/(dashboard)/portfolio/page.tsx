"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import type { PortfolioItem } from "@/generated/prisma/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";

type FormData = {
  title: string;
  description: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  thumbnailUrl: string;
  category: string;
  sortOrder: number;
  featured: boolean;
};

const emptyForm: FormData = {
  title: "",
  description: "",
  mediaType: "IMAGE",
  mediaUrl: "",
  thumbnailUrl: "",
  category: "wedding",
  sortOrder: 0,
  featured: false,
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/portfolio");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description ?? "",
      mediaType: item.mediaType,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl ?? "",
      category: item.category,
      sortOrder: item.sortOrder,
      featured: item.featured,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      thumbnailUrl: form.thumbnailUrl || undefined,
    };

    if (editingId) {
      await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setSaving(false);
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this portfolio item?")) return;
    await fetch(`/api/admin/portfolio?id=${id}`, { method: "DELETE" });
    load();
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-white">Portfolio</h1>
          <p className="mt-1 text-sm text-white/50">
            Upload images and videos to S3 and manage your gallery.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-sm bg-gold-500 px-4 py-2 text-sm uppercase tracking-[0.1em] text-black"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-sm border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-white">
              {editingId ? "Edit Portfolio Item" : "New Portfolio Item"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)}>
              <X className="text-white/50" size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="admin-input"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="admin-input"
              >
                {PORTFOLIO_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Media Type">
              <select
                value={form.mediaType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mediaType: e.target.value as "IMAGE" | "VIDEO",
                  })
                }
                className="admin-input"
              >
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
              </select>
            </Field>
            <Field label="Sort Order">
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: Number(e.target.value) })
                }
                className="admin-input"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="admin-input"
              />
            </Field>
          </div>

          <div className="mt-4 space-y-4">
            <Field label="Media File">
              <MediaUploader
                folder="portfolio"
                accept={form.mediaType === "VIDEO" ? "video/*" : "image/*"}
                label={`Upload ${form.mediaType === "VIDEO" ? "Video" : "Image"}`}
                onUploaded={(url) => setForm({ ...form, mediaUrl: url })}
              />
              {form.mediaUrl && (
                <p className="mt-2 truncate text-xs text-green-400">
                  ✓ {form.mediaUrl}
                </p>
              )}
            </Field>

            {form.mediaType === "VIDEO" && (
              <Field label="Thumbnail (Optional)">
                <MediaUploader
                  folder="portfolio/thumbnails"
                  accept="image/*"
                  label="Upload Thumbnail"
                  onUploaded={(url) =>
                    setForm({ ...form, thumbnailUrl: url })
                  }
                />
              </Field>
            )}

            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
              />
              Show on homepage (featured)
            </label>
          </div>

          <input type="hidden" value={form.mediaUrl} />

          <button
            type="submit"
            disabled={saving || !form.mediaUrl}
            className="mt-6 rounded-sm bg-gold-500 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-black disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-sm border border-white/10 bg-white/[0.03]"
          >
            <div className="aspect-video bg-black/40">
              {item.mediaType === "VIDEO" ? (
                <video
                  src={item.mediaUrl}
                  poster={item.thumbnailUrl ?? undefined}
                  className="h-full w-full object-cover"
                  muted
                />
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-medium text-white">{item.title}</h2>
                  <p className="text-xs uppercase text-white/40">
                    {item.category}
                    {item.featured && " · Featured"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="p-2 text-white/50 hover:text-white"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border-radius: 2px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.4);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/50">
        {label}
      </label>
      {children}
    </div>
  );
}
