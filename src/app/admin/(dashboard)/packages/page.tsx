"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import type { Package } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/utils";

type FormData = {
  name: string;
  description: string;
  price: number;
  features: string;
  isPopular: boolean;
  sortOrder: number;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  price: 0,
  features: "",
  isPopular: false,
  sortOrder: 0,
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/packages");
    setPackages(await res.json());
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

  function openEdit(pkg: Package) {
    setEditingId(pkg.id);
    setForm({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      features: pkg.features.join("\n"),
      isPopular: pkg.isPopular,
      sortOrder: pkg.sortOrder,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      features: form.features.split("\n").filter(Boolean),
    };

    if (editingId) {
      await fetch("/api/admin/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/admin/packages", {
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
    if (!confirm("Delete this package?")) return;
    await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
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
          <h1 className="font-serif text-3xl text-foreground">Packages</h1>
          <p className="mt-1 text-sm text-muted-subtle">
            Add, edit, or remove wedding packages.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-sm bg-gold-500 px-4 py-2 text-sm uppercase tracking-[0.1em] text-black"
        >
          <Plus size={16} />
          Add Package
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-sm border border-border-theme bg-surface-muted p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">
              {editingId ? "Edit Package" : "New Package"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)}>
              <X className="text-muted-subtle" size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label="Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <AdminInput
              label="Price (PKR)"
              type="number"
              value={String(form.price)}
              onChange={(v) => setForm({ ...form, price: Number(v) })}
              required
            />
          </div>

          <div className="mt-4">
            <AdminInput
              label="Description"
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
              textarea
              required
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted-subtle">
              Features (one per line)
            </label>
            <textarea
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              rows={5}
              required
              className="form-input"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) =>
                  setForm({ ...form, isPopular: e.target.checked })
                }
              />
              Mark as popular
            </label>
            <AdminInput
              label="Sort Order"
              type="number"
              value={String(form.sortOrder)}
              onChange={(v) => setForm({ ...form, sortOrder: Number(v) })}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-sm bg-gold-500 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-black disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {packages.map((pkg) => (
          <article
            key={pkg.id}
            className="rounded-sm border border-border-theme bg-surface-muted p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-xl text-foreground">{pkg.name}</h2>
                <p className="mt-1 text-gold-300">{formatPrice(pkg.price)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(pkg)}
                  className="rounded-sm p-2 text-muted-subtle hover:bg-surface-muted hover:text-foreground"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(pkg.id)}
                  className="rounded-sm p-2 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">{pkg.description}</p>
            <ul className="mt-3 space-y-1 text-sm text-muted-subtle">
              {pkg.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const className = "form-input";

  return (
    <div>
      <label className="form-label">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          required={required}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={className}
        />
      )}
    </div>
  );
}
