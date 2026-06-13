"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    errorParam === "unauthorized"
      ? "You do not have admin access."
      : errorParam === "auth"
        ? "Authentication failed. Try again."
        : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-raised p-8 shadow-card">
        <div className="mb-8 text-center">
          <p className="font-display text-3xl tracking-wide text-accent">
            BOB&apos;S ADMIN
          </p>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage your restaurant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button type="submit" className="w-full" isLoading={loading}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
