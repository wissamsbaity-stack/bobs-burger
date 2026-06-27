"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function OrdersLoginPage({
  restaurantName,
  logoUrl,
}: {
  restaurantName: string;
  logoUrl: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/orders";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    errorParam === "unauthorized"
      ? "You do not have staff access."
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
    <div className="relative flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="pointer-events-none absolute inset-0 bg-hero-radial opacity-80" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-surface-raised p-8 shadow-card">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/10">
              <Image
                src={logoUrl}
                alt={restaurantName}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          </div>
          <p className="font-display text-2xl tracking-wide text-accent">
            {restaurantName}
          </p>
          <p className="mt-1 text-sm text-muted">Staff Orders Dashboard</p>
          <p className="mt-4 text-sm text-muted">
            Sign in to receive live orders. Your session ends when you close the
            browser.
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
