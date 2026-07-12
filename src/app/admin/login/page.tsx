"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BrandLogo } from "@/components/layout/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-elevated px-4">
      <div className="w-full max-w-md rounded-sm border border-border-theme bg-surface-elevated p-6 sm:p-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <BrandLogo size="lg" />
          </div>
          <h1 className="mt-4 text-lg text-foreground">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-subtle">
            Almir Wedding Films — sign in to manage your website
          </p>
          <div className="mt-4 flex justify-center">
            <ThemeToggle />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted-subtle">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted-subtle">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-gold-500 py-3 text-sm uppercase tracking-[0.15em] text-black hover:bg-gold-400 disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
