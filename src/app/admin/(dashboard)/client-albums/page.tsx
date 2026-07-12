"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import type { ClientAlbum } from "@/generated/prisma/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaPreview } from "@/components/admin/MediaPreview";
import { slugify } from "@/lib/utils";

type FormData = {
  title: string;
  coverUrl: string;
  albumUrl: string;
};

const emptyForm: FormData = {
  title: "",
  coverUrl: "",
  albumUrl: "",
};

export default function AdminClientAlbumsPage() {
  const [albums, setAlbums] = useState<ClientAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/client-albums");
    setAlbums(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.coverUrl) return;
    setSaving(true);

    const title = form.title.trim();
    const existingSlug = editingId
      ? albums.find((a) => a.id === editingId)?.slug
      : undefined;
    const payload = {
      title,
      slug:
        existingSlug ??
        (slugify(title) || `album-${Date.now().toString(36)}`),
      albumUrl: form.albumUrl,
      coverUrl: form.coverUrl,
    };

    if (editingId) {
      await fetch("/api/admin/client-albums", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/client-albums", {
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
    if (!confirm("Delete this album?")) return;
    await fetch(`/api/admin/client-albums?id=${id}`, { method: "DELETE" });
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Client Albums</h1>
          <p className="mt-1 text-sm text-muted-subtle">
            Add a title, cover image, and album link for each client gallery.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-sm bg-gold-500 px-4 py-2 text-sm uppercase tracking-[0.1em] text-black"
        >
          <Plus size={16} />
          Add Album
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-sm border border-border-theme bg-surface-muted p-4 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">
              {editingId ? "Edit Album" : "New Album"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)}>
              <X className="text-muted-subtle" size={20} />
            </button>
          </div>

          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title (optional)"
            className="form-input"
          />

          <input
            value={form.albumUrl}
            onChange={(e) => setForm({ ...form, albumUrl: e.target.value })}
            placeholder="View album URL"
            required
            type="url"
            className="mt-4 form-input"
          />

          <div className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-[0.15em] text-muted-subtle">
              Cover Image
            </p>
            <MediaUploader
              folder="client-albums"
              accept="image/*"
              label="Upload Cover Image"
              onUploaded={(url) => setForm({ ...form, coverUrl: url })}
            />
            <MediaPreview
              url={form.coverUrl}
              type="image"
              alt={form.title || "Album cover"}
              onRemove={() => setForm({ ...form, coverUrl: "" })}
            />
          </div>

          <button
            type="submit"
            disabled={saving || !form.coverUrl}
            className="mt-6 rounded-sm bg-gold-500 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-black disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {albums.map((album) => (
          <article
            key={album.id}
            className="overflow-hidden rounded-sm border border-border-theme bg-surface-muted"
          >
            {album.coverUrl && (
              <div
                className="aspect-[16/9] bg-cover bg-center"
                style={{
                  backgroundImage: `url('${album.coverUrl}')`,
                }}
              />
            )}
            <div className="flex items-start justify-between gap-3 p-5">
              <div className="min-w-0">
                <h2 className="font-medium text-foreground">
                  {album.title || "Untitled album"}
                </h2>
                <a
                  href={album.albumUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block truncate text-xs text-gold-400 hover:text-gold-300"
                >
                  {album.albumUrl}
                </a>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(album.id);
                    setForm({
                      title: album.title,
                      coverUrl: album.coverUrl ?? "",
                      albumUrl: album.albumUrl ?? "",
                    });
                    setShowForm(true);
                  }}
                  className="p-2 text-muted-subtle hover:text-foreground"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(album.id)}
                  className="p-2 text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
