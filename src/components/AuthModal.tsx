"use client";

// AuthModal — auth dialog: Sign In / Sign Up tabs + 1-click Developer Demo Login
// Thinzar Kyaw — Frontend Domain
// NOTE: Demo login sets a mock session flag only — real Supabase Auth is
// backend domain (Thaw Ye Zaw).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Zap, Building2, Heart, Loader2 } from "lucide-react";
import { AuthTabs } from "@/components/AuthTabs";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

interface DemoProfile {
  key: string;
  role: string;
  email: string;
  password: string;
  context: string;
  icon: typeof Building2;
}

const DEMO_PROFILES: DemoProfile[] = [
  {
    key: "hospital",
    role: "Hospital Admin",
    email: "hospital.demo@ygh.gov.mm",
    password: "hospital123",
    context: "Yangon General Hospital",
    icon: Building2,
  },
  {
    key: "donor",
    role: "Donor Hero (O+)",
    email: "koaung.demo@gmail.com",
    password: "donor123",
    context: "Sanchaung Township, Yangon",
    icon: Heart,
  },
];

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const router = useRouter();
  const [prefill, setPrefill] = useState<{ email: string; password: string } | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  if (!open) return null;

  const handleDemoLogin = (profile: DemoProfile) => {
    if (loadingKey) return;
    setPrefill({ email: profile.email, password: profile.password });
    setLoadingKey(profile.key);
    // Mock session flag — replaced by real Supabase session later
    window.sessionStorage.setItem("vr-demo-session", profile.key);
    setTimeout(() => router.push("/dashboard"), 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-start sm:pt-16 sm:pb-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in or sign up"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-vr-navy">Welcome to Vertex Red</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <AuthTabs prefill={prefill} />

        {/* Developer Demo Login */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-gray-500">
            <Zap className="h-4 w-4 text-amber-500" />
            Developer Demo Login
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DEMO_PROFILES.map((profile) => {
              const Icon = profile.icon;
              const isLoading = loadingKey === profile.key;
              return (
                <button
                  key={profile.key}
                  type="button"
                  onClick={() => handleDemoLogin(profile)}
                  disabled={loadingKey !== null}
                  className="flex min-h-[44px] flex-col items-start gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-left transition hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-vr-navy">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                    ) : (
                      <Icon className="h-4 w-4 text-red-600" />
                    )}
                    {isLoading ? "Signing in…" : `Login as ${profile.role}`}
                  </span>
                  <span className="text-xs text-gray-500">{profile.context}</span>
                  <span className="font-mono text-xs text-gray-400">{profile.email}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
