"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DEFAULT_ADDON_PRICING } from "@/lib/constants";
import type { AddonPricingInput } from "@/lib/validations";

export default function AdminPricingPage() {
  const [form, setForm] = useState<AddonPricingInput>(DEFAULT_ADDON_PRICING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/addon-pricing")
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await fetch("/api/admin/addon-pricing", {
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

  const fields: { key: keyof AddonPricingInput; label: string }[] = [
    { key: "basePrice", label: "Base Price (PKR)" },
    { key: "photographer", label: "Price per Photographer (PKR)" },
    { key: "videographer", label: "Price per Videographer (PKR)" },
    { key: "drone", label: "Price per Drone (PKR)" },
    { key: "album", label: "Price per Album (PKR)" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">
          Custom Package Pricing
        </h1>
        <p className="mt-1 text-sm text-muted-subtle">
          Set the per-unit rates used by the &quot;Customize Your
          Package&quot; option on the Packages page and booking form.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-xl rounded-sm border border-border-theme bg-surface-muted p-4 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="form-label">{label}</label>
              <input
                type="number"
                min={0}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: Number(e.target.value) })
                }
                required
                className="form-input"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-sm bg-gold-500 px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-black disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && <span className="ml-4 text-sm text-gold-400">Saved.</span>}
      </form>
    </div>
  );
}
