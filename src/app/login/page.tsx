"use client";

// ============================================================================
// LifeLink — Login Page (email/password)
// Demo accounts are provided below the form for quick testing.
// ============================================================================

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Droplets, Heart, Loader2, LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const DEMO_ACCOUNTS = [
  {
    label: "Personal (donor)",
    email: "demo.user@lifelink.test",
    password: "Demo1234!",
    icon: Heart,
    accent: "text-emerald-600 bg-emerald-100",
  },
  {
    label: "Organisation (verified)",
    email: "demo.org@lifelink.test",
    password: "Demo1234!",
    icon: Building2,
    accent: "text-red-500 bg-red-100",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : signInError.message
      );
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101B35] px-5 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500 shadow-[0_10px_35px_rgba(239,68,68,0.35)]">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-black tracking-tight text-white">
            Life<span className="text-red-400">Link</span>
          </p>
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
          <h1 className="text-2xl font-black tracking-tight text-[#101B35]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to request blood or respond to donors.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-xs font-bold text-slate-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#101B35] outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-bold text-slate-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#101B35] outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-500 text-sm font-bold text-white transition hover:bg-red-400 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Sign in
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              try a demo account
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              return (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                    setError(null);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${account.accent}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-black text-[#101B35]">
                      {account.label}
                    </span>
                    <span className="block truncate text-[11px] text-slate-500">
                      {account.email} · {account.password}
                    </span>
                  </span>
                </button>
              );
            })}
            <p className="text-center text-[10px] text-slate-400">
              Tap a demo account to fill the form, then press Sign in.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
              className="font-bold text-red-500 hover:text-red-400"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
