"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import type { ClientAlbum } from "@/generated/prisma/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { slugify } from "@/lib/utils";

type FormData = {
  title: string;
  slug: string;
  password: string;
  coverUrl: string;
  description: string;
};

const emptyForm: FormData = {
  title: "",
  slug: "",
  password: "",
  coverUrl: "",
  description: "",
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
    setSaving(true);

    const payload = {
      ...form,
      password: form.password || undefined,
      coverUrl: form.coverUrl || undefined,
      description: form.description || undefined,
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
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-white">Client Albums</h1>
          <p className="mt-1 text-sm text-white/50">
            Create private galleries for your clients.
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
          className="mt-8 rounded-sm border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-white">
              {editingId ? "Edit Album" : "New Album"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)}>
              <X className="text-white/50" size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                  slug: editingId ? form.slug : slugify(e.target.value),
                })
              }
              placeholder="Album title"
              required
              className="rounded-sm border border-white/15 bg-black/40 px-4 py-3 text-sm text-white"
            />
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="URL slug"
              required
              className="rounded-sm border border-white/15 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password (optional)"
            className="mt-4 w-full rounded-sm border border-white/15 bg-black/40 px-4 py-3 text-sm text-white"
          />

          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="mt-4 w-full rounded-sm border border-white/15 bg-black/40 px-4 py-3 text-sm text-white"
          />

          <div className="mt-4">
            <MediaUploader
              folder="albums"
              accept="image/*"
              label="Upload Cover Image"
              onUploaded={(url) => setForm({ ...form, coverUrl: url })}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-sm bg-gold-500 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-black"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {albums.map((album) => (
          <article
            key={album.id}
            className="rounded-sm border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-medium text-white">{album.title}</h2>
                <p className="text-xs text-white/40">/client-album/{album.slug}</p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(album.id);
                    setForm({
                      title: album.title,
                      slug: album.slug,
                      password: album.password ?? "",
                      coverUrl: album.coverUrl ?? "",
                      description: album.description ?? "",
                    });
                    setShowForm(true);
                  }}
                  className="p-2 text-white/50 hover:text-white"
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
