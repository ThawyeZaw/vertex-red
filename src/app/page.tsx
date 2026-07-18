// src/app/page.tsx
// LifeLink — Emergency Blood Network
// Team Vertex Red
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import {
  Activity,
  ArrowRight,
  BellRing,
  Building2,
  CheckCircle2,
  Clock3,
  Droplets,
  Heart,
  Hospital,
  LogIn,
  LogOut,
  MapPin,
  Radio,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "LifeLink — Emergency Blood Network Myanmar",
  description:
    "LifeLink connects verified hospitals, patients, and blood donors across Myanmar in real time.",
};

const stats = [
  {
    value: "202",
    label: "Hospitals",
    icon: Hospital,
  },
  {
    value: "1,400+",
    label: "Ready donors",
    icon: Users,
  },
  {
    value: "24/7",
    label: "Emergency network",
    icon: Clock3,
  },
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Verified requests",
    description:
      "Emergency blood requests are managed through trusted hospitals.",
  },
  {
    icon: Radio,
    title: "Real-time dispatch",
    description:
      "Compatible nearby donors can be notified as soon as help is needed.",
  },
  {
    icon: MapPin,
    title: "Location-based matching",
    description:
      "Donors are prioritised by blood type, availability, and distance.",
  },
];

export default async function HomePage() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let isOrganisation = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, account_type")
      .eq("id", user.id)
      .single();
    displayName = profile?.full_name || user.email || "Account";
    isOrganisation = profile?.account_type === "organisation";
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F8FC] text-[#162033]">
      <section className="relative isolate overflow-hidden bg-[#0D1933]">
        {/* Background */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-red-500/15 blur-[140px]" />

          <div className="absolute -right-32 top-16 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-[140px]" />

          <div className="absolute bottom-[-8rem] left-1/2 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0D1933] via-[#0D1933]/70 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            {/* Left content */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 shadow-sm backdrop-blur-xl">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>

                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-200 sm:text-[11px]">
                  Emergency blood network online
                </span>
              </div>

<<<<<<< HEAD
              <div>
                <p className="text-xl font-black tracking-tight text-white">
                  Life<span className="text-red-400">Link</span>
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  by Team Vertex Red
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur lg:flex">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                Emergency network online
              </div>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={isOrganisation ? "/org" : "/profile"}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/10"
                  >
                    <UserCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="max-w-[10rem] truncate">{displayName}</span>
                  </Link>
                  <form action="/auth/signout" method="POST">
                    <button
                      type="submit"
                      aria-label="Sign out"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 backdrop-blur transition hover:bg-white/10 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_30px_rgba(239,68,68,0.3)] transition hover:bg-red-400"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              )}
            </div>
          </nav>

          <div className="grid items-center gap-12 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-3.5 py-2 text-xs font-bold text-red-200 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Myanmar&apos;s emergency blood response network
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
                Every second counts.
                <br />
                <span className="bg-gradient-to-r from-red-400 via-red-300 to-orange-300 bg-clip-text text-transparent">
                  Every match saves a life.
=======
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl lg:text-[4.3rem]">
                The right donor.
                <span className="block bg-gradient-to-r from-red-400 via-red-300 to-orange-300 bg-clip-text text-transparent">
                  When every second matters.
>>>>>>> TZ
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                LifeLink connects verified hospitals with compatible nearby
                blood donors in real time, helping urgent requests reach the
                right people faster.
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/broadcast"
                  className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-red-500 px-6 text-sm font-black text-white shadow-[0_18px_45px_rgba(239,68,68,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1933]"
                >
                  <BellRing className="h-4 w-4" />
                  Create emergency request
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/profile"
                  className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] px-6 text-sm font-black text-white backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1933]"
                >
                  <Heart className="h-4 w-4 text-emerald-300" />
                  Join as a donor
                </Link>
              </div>

              {/* Trust points */}
              <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xl transition hover:bg-white/[0.08]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-black text-white">Verified</p>
                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      Hospital requests
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xl transition hover:bg-white/[0.08]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                    <Users className="h-4 w-4 text-emerald-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-black text-white">Nearby</p>
                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      Compatible donors
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xl transition hover:bg-white/[0.08]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                    <Activity className="h-4 w-4 text-emerald-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-black text-white">Real time</p>
                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      Live donor response
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative mx-auto flex w-full max-w-[560px] items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute h-[78%] w-[78%] rounded-full bg-red-500/20 blur-[85px]"
              />

              <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-7">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-red-500/[0.06]" />

                <div className="relative flex min-h-[420px] flex-col justify-between sm:min-h-[500px]">
                  {/* Card top */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0D1933]/60 px-3 py-2 backdrop-blur-xl">
                      <span className="h-2 w-2 rounded-full bg-red-400" />

                      <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-200">
                        LifeLink response system
                      </span>
                    </div>

                    <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5">
                      <span className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-300">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Symbol */}
                  <div className="relative mx-auto my-6 flex w-full max-w-[330px] items-center justify-center">
                    <div className="absolute h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />

                    <Image
                      src="/images/logo.png"
                      alt="LifeLink blood safety symbol"
                      width={500}
                      height={500}
                      priority
                      className="relative h-auto w-full object-contain drop-shadow-[0_25px_45px_rgba(239,68,68,0.28)]"
                    />
                  </div>

                  {/* Response status */}
                  <div className="rounded-[1.35rem] border border-white/10 bg-[#0D1933]/70 p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10">
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-black text-white">
                            Smart donor matching
                          </p>

                          <Activity className="h-4 w-4 shrink-0 text-emerald-300" />
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Matching hospitals with eligible donors by blood type,
                          distance, and availability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 left-4 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#172541] px-4 py-3 text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)] sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/15">
                  <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                </div>

                <div>
                  <p className="text-xs font-black">Built to save lives</p>
                  <p className="mt-0.5 text-[9px] text-slate-400">
                    Fast, verified and coordinated
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.055] backdrop-blur-xl lg:mt-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className={`flex min-w-0 flex-col items-center justify-center px-2 py-4 text-center sm:flex-row sm:gap-3 sm:px-5 sm:py-5 ${
                    index > 0 ? "border-l border-white/10" : ""
                  }`}
                >
                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] sm:flex">
                    <Icon className="h-5 w-5 text-red-300" />
                  </div>

                  <div className="min-w-0 sm:text-left">
                    <p className="truncate text-base font-black text-white sm:text-xl">
                      {stat.value}
                    </p>

                    <p className="mt-0.5 truncate text-[8px] font-semibold text-slate-400 sm:text-[11px]">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
            Enter LifeLink
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#101B35] sm:text-4xl">
            How are you using LifeLink?
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            Choose your role to access the emergency tools designed for you.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Link
            href="/profile"
            id="role-donor"
            className="group relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.07)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_22px_65px_rgba(16,185,129,0.13)] sm:p-8"
          >
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-100/70 blur-2xl transition group-hover:scale-125" />

            <div className="relative">
              <div className="flex items-start justify-between gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100">
                  <Heart className="h-8 w-8 text-emerald-600" />
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-emerald-200 group-hover:bg-emerald-500 group-hover:text-white">
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                Donor access
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-[#101B35]">
                I&apos;m a blood donor
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                Manage your donor passport, update availability, receive
                compatible emergency requests, and track your impact.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {["Donor Profile", "Nearby requests", "Eligibility status"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>
          </Link>

          <Link
            href="/command"
            id="role-hospital"
            className="group relative overflow-hidden rounded-[2rem] border border-red-100 bg-white p-6 shadow-[0_16px_50px_rgba(16,24,40,0.07)] transition duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-[0_22px_65px_rgba(239,68,68,0.13)] sm:p-8"
          >
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-red-100/70 blur-2xl transition group-hover:scale-125" />

            <div className="relative">
              <div className="flex items-start justify-between gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100">
                  <Building2 className="h-8 w-8 text-red-600" />
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-red-200 group-hover:bg-red-500 group-hover:text-white">
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-red-500">
                Hospital access
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-[#101B35]">
                I&apos;m a hospital
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                Create emergency broadcasts, coordinate responding donors,
                monitor blood stock, and manage active requests.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  "Command center",
                  "Emergency broadcasts",
                  "Blood inventory",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link
            href="/broadcast"
            id="quick-broadcast"
            className="group flex items-center justify-between rounded-3xl border border-red-100 bg-red-50 p-5 transition hover:border-red-200 hover:bg-red-100/70"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-500 shadow-sm">
                <BellRing className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-black text-red-950">
                  Create emergency request
                </p>

                <p className="mt-1 text-xs text-red-700/70">
                  Notify compatible nearby donors
                </p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-red-400 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/inventory"
            id="quick-inventory"
            className="group flex items-center justify-between rounded-3xl border border-emerald-100 bg-emerald-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-100/70"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                <Droplets className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-black text-emerald-950">
                  View blood inventory
                </p>

                <p className="mt-1 text-xs text-emerald-700/70">
                  Monitor blood-group availability
                </p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-emerald-500 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-slate-100 bg-[#FAFBFD] p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101B35] text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-base font-black text-[#101B35]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#101B35] px-5 py-8 text-center">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-red-400" />

            <p className="text-sm font-black text-white">
              Life<span className="text-red-400">Link</span>
            </p>
          </div>

          <p className="text-xs text-slate-400">
            Built with care for Myanmar · Team Vertex Red
          </p>

          <p className="text-xs font-semibold text-slate-400">
            Connecting blood. Saving lives.
          </p>
        </div>
      </footer>
    </main>
  );
}
