"use client";

// Navbar — state-aware top navigation
// Public routes → "Login / Join" auth modal · /dashboard → Profile / Logout
// Thinzar Kyaw — Frontend Domain

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Droplets, Menu, X, UserCircle2, LogOut, LayoutDashboard } from "lucide-react";
import { clsx } from "clsx";
import { AuthModal } from "@/components/AuthModal";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Request Board" },
  { href: "/map", label: "Live Map" },
];

const DASHBOARD_LINKS = [
  { href: "/dashboard", label: "Request Board" },
  { href: "/passport", label: "Donor Passport" },
  { href: "/broadcast", label: "Broadcast" },
  { href: "/inventory", label: "Inventory" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname?.startsWith("/dashboard") ?? false;
  const links = isDashboard ? DASHBOARD_LINKS : PUBLIC_LINKS;

  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const handleLogout = () => {
    // TODO (Backend — Thaw Ye Zaw): wire up Supabase signOut
    // Wipe all client-side storage to prevent residual session artifacts.
    window.sessionStorage.removeItem("vr-demo-session");
    window.localStorage.removeItem("vr-demo-session");
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 md:px-6">
        {/* Brand */}
        <Link href="/" className="flex min-h-[44px] items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-vr-red shadow-sm">
            <Droplets className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-vr-navy">
            Vertex<span className="text-red-600">Red</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex min-h-[44px] items-center rounded-xl px-3 text-sm font-semibold transition hover:bg-gray-50 hover:text-red-600",
                pathname === link.href ? "text-red-600" : "text-gray-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions — conditional on route */}
        <div className="flex items-center gap-2">
          {isDashboard ? (
            <>
              <Link
                href="/dashboard"
                className="flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
              >
                <LayoutDashboard className="h-5 w-5 text-red-600" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-bold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="flex min-h-[44px] items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <UserCircle2 className="h-5 w-5" />
              Login / Join
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={clsx("border-t border-gray-100 bg-white md:hidden", !menuOpen && "hidden")}>
        <div className="space-y-1 px-4 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "flex min-h-[44px] items-center rounded-xl px-3 text-base font-semibold transition hover:bg-red-50 hover:text-red-600",
                pathname === link.href ? "text-red-600" : "text-gray-700"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
};
