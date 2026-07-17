"use client";

// AuthTabs — Sign In / Sign Up tabbed form UI
// Thinzar Kyaw — Frontend Domain
// NOTE: onSubmit handlers are intentionally empty — Supabase Auth wiring
// belongs to the backend team (Thaw Ye Zaw).

import { useEffect, useState, type FormEvent } from "react";
import { Mail, Lock, User, Phone, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import { PasswordPolicy } from "@/components/PasswordPolicy";

interface AuthTabsProps {
  prefill?: { email: string; password: string } | null;
}

type AuthMode = "signin" | "signup";

const inputClasses =
  "w-full min-h-[44px] rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500";

const Field = ({
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: typeof Mail }) => (
  <div className="relative">
    <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
    <input className={inputClasses} {...props} />
  </div>
);

export const AuthTabs = ({ prefill = null }: AuthTabsProps) => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  useEffect(() => {
    if (prefill) {
      setMode("signin");
      setEmail(prefill.email);
      setPassword(prefill.password);
    }
  }, [prefill]);

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO (Backend — Thaw Ye Zaw): wire up Supabase signInWithPassword
  };

  const handleSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO (Backend — Thaw Ye Zaw): wire up Supabase signUp
    // Password policy validated client-side via PasswordPolicy.
    // Backend MUST re-validate (12-char min, mixed types, breach check).
  };

  return (
    <div className="w-full">
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-gray-100 p-1" role="tablist">
        {(
          [
            { key: "signin", label: "Sign In" },
            { key: "signup", label: "Sign Up" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={mode === tab.key}
            onClick={() => setMode(tab.key)}
            className={clsx(
              "min-h-[44px] rounded-xl text-base font-semibold transition-all",
              mode === tab.key
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "signin" ? (
        <form onSubmit={handleSignIn} className="space-y-4">
          <Field
            icon={Mail}
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Field
            icon={Lock}
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-red-600 py-3 text-base font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignUp} className="space-y-4">
          <Field icon={User} type="text" name="fullName" placeholder="Full name (e.g., Ko Aung)" required />
          <Field icon={Phone} type="tel" name="phone" placeholder="Phone (e.g., 09 7XX XXX XXX)" required />
          <Field icon={Mail} type="email" name="email" placeholder="Email address" required />
          <Field
            icon={Lock}
            type="password"
            name="password"
            placeholder="Create a password"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            required
          />
          <PasswordPolicy password={signUpPassword} />

          {/* MFA opt-in — frontend placeholder; enrollment handled by backend */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-left">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-red-600" />
            <div>
              <span className="flex items-center gap-1.5 text-sm font-bold text-vr-navy">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Enable Multi-Factor Authentication
              </span>
              <p className="mt-0.5 text-xs text-gray-500">
                Strongly recommended. You will be guided through setup after registration.
              </p>
            </div>
          </label>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-red-600 py-3 text-base font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Create Account
          </button>
          <p className="text-center text-xs leading-relaxed text-gray-400">
            By joining, you agree to be contacted for emergency blood requests near you.
          </p>
        </form>
      )}
    </div>
  );
};
