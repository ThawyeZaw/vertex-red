// Public marketing landing page — unauthenticated layer (no operational data)
// Thinzar Kyaw — Frontend Domain
// STRICT: no live request feeds, maps, or donor contacts on this page.

import { RadioTower, HeartHandshake, Droplets, ShieldCheck, Building2 } from "lucide-react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { HeroAuthButtons } from "@/components/HeroAuthButtons";

export const metadata: Metadata = {
  title: "Vertex Red — Emergency Blood Donor Platform Myanmar",
  description:
    "Real-time emergency platform connecting blood donors, hospitals, and urgent medical needs across Myanmar.",
};

const STATS = [
  { value: "1,200+", label: "Donors Registered" },
  { value: "202", label: "Partner Hospitals" },
  { value: "24/7", label: "Emergency Coverage" },
];

const STEPS = [
  {
    icon: RadioTower,
    title: "Hospitals broadcast",
    desc: "Yangon General Hospital posts an urgent O+ request in seconds.",
  },
  {
    icon: Droplets,
    title: "Donors get matched",
    desc: "Nearby donors like Ko Aung in Sanchaung are alerted instantly.",
  },
  {
    icon: HeartHandshake,
    title: "Lives are saved",
    desc: "Donors respond, donate, and track their impact in the Donor Passport.",
  },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, text: "Verified hospital partners only" },
  { icon: Building2, text: "From Asia Royal to Pun Hlaing Siloam" },
  { icon: HeartHandshake, text: "Donor privacy protected until dispatch" },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-vr-navy px-5 pb-12 pt-12 md:px-8 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
            Every Drop Saves a Life<br />
            <span className="text-emerald-400">in Myanmar.</span>
          </h1>
          <p className="mt-3 max-w-xs text-base leading-relaxed text-gray-400 md:max-w-md md:text-lg">
            Real-time emergency blood coordination — connecting hospitals and donor heroes across Yangon and beyond.
          </p>
          <HeroAuthButtons />
          <div className="mt-8 flex max-w-md gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex-1 rounded-2xl bg-white/10 p-3 text-center">
                <p className="text-lg font-black text-white">{stat.value}</p>
                <p className="text-xs font-medium text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-xl font-black text-vr-navy md:text-2xl">How it works</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                  <Icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-base font-bold text-vr-navy">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="flex-1 px-5 pb-12 md:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-lg font-black text-vr-navy md:text-xl">Trusted across Yangon</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {TRUST_POINTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                <Icon className="h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm font-semibold text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-8 text-center">
        <p className="text-xs text-gray-400">
          Built with <Droplets className="inline h-3 w-3 text-red-500" /> for Myanmar · Vertex Red Hackathon 2026
        </p>
      </footer>
    </main>
  );
}
