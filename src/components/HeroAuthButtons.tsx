"use client";

// HeroAuthButtons — landing page CTA buttons that open the auth modal
// Thinzar Kyaw — Frontend Domain
// NOTE: "I need blood now" no longer bypasses authentication. Both CTAs
// route users through the join/login flow before any dashboard access.

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";

export const HeroAuthButtons = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-base font-bold text-white shadow-lg transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          I Need Blood Now <ArrowRight className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/20 px-6 text-base font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Become a Donor Hero
        </button>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};
