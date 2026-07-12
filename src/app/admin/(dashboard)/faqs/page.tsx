"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import type { FaqItem } from "@/generated/prisma/client";

type FormData = {
  question: string;
  answer: string;
  sortOrder: number;
};

const emptyForm: FormData = { question: "", answer: "", sortOrder: 0 };

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/faqs");
    setFaqs(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editingId) {
      await fetch("/api/admin/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...form }),
      });
    } else {
      await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setSaving(false);
    setShowForm(false);
    setForm(emptyForm);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
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
          <h1 className="font-serif text-3xl text-foreground">FAQs</h1>
          <p className="mt-1 text-sm text-muted-subtle">Manage frequently asked questions.</p>
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
          Add FAQ
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-sm border border-border-theme bg-surface-muted p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">
              {editingId ? "Edit FAQ" : "New FAQ"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)}>
              <X className="text-muted-subtle" size={20} />
            </button>
          </div>
          <input
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="Question"
            required
            className="mb-4 form-input"
          />
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            placeholder="Answer"
            rows={4}
            required
            className="mb-4 form-input"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-gold-500 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-black"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {faqs.map((faq) => (
          <article
            key={faq.id}
            className="flex items-start justify-between gap-4 rounded-sm border border-border-theme bg-surface-muted p-5"
          >
            <div>
              <h2 className="font-medium text-foreground">{faq.question}</h2>
              <p className="mt-2 text-sm text-muted">{faq.answer}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => {
                  setEditingId(faq.id);
                  setForm({
                    question: faq.question,
                    answer: faq.answer,
                    sortOrder: faq.sortOrder,
                  });
                  setShowForm(true);
                }}
                className="p-2 text-muted-subtle hover:text-foreground"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(faq.id)}
                className="p-2 text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
