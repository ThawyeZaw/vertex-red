"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Command,
  Hospital,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

type NavigationItem = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
  match?: string[];
};

const MAIN_NAVIGATION: NavigationItem[] = [
  {
    label: "Overview",
    href: "/",
    description: "Emergency network overview",
    icon: LayoutDashboard,
    match: ["/"],
  },
  {
    label: "Command",
    href: "/command",
    description: "Coordinate active emergencies",
    icon: Command,
    match: ["/command"],
  },
  {
    label: "Donors",
    href: "/donors",
    description: "Manage the donor network",
    icon: Users,
    match: ["/donors", "/donor"],
  },
];

const ACCOUNT_NAVIGATION: NavigationItem[] = [
  {
    label: "Profile",
    href: "/profile",
    description: "Hospital information",
    icon: UserRound,
  },
  {
    label: "Settings",
    href: "/settings",
    description: "Account preferences",
    icon: Settings,
  },
];

export function MainNavbar() {
  const pathname = usePathname();

  const profileRef = useRef<HTMLDivElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center px-4 sm:h-[72px] sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            aria-label="LifeLink home"
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-red-50 sm:h-10 sm:w-10 sm:rounded-2xl">
              <Image
                src="/images/logo.png"
                alt=""
                width={30}
                height={30}
                priority
                className="h-7 w-7 object-contain sm:h-8 sm:w-8"
              />
            </span>

            <span className="min-w-0">
              <span className="block text-[17px] font-black leading-none tracking-[-0.04em]">
                <span className="text-black">Life</span>
                <span className="text-red-500">Link</span>
              </span>

              <span className="mt-1 hidden text-[8px] font-black uppercase tracking-[0.16em] text-slate-400 sm:block">
                Emergency Blood Network
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden min-w-0 flex-1 justify-center lg:flex"
          >
            <div className="flex items-center gap-1 rounded-[1.25rem] border border-slate-200/80 bg-slate-50/90 p-1.5">
              {MAIN_NAVIGATION.map((item) => (
                <DesktopNavigationLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </div>
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-700">
                Network live
              </span>
            </div>

            <Link
              href="/broadcast"
              className="hidden h-11 items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 text-[10px] font-black text-white shadow-[0_10px_24px_rgba(239,68,68,0.22)] transition hover:-translate-y-0.5 hover:bg-red-600 sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              New request
            </Link>

            <button
              type="button"
              aria-label="Open notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#0D1933] sm:h-11 sm:w-11 sm:rounded-2xl"
            >
              <Bell className="h-[18px] w-[18px]" />

              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Desktop profile */}
            <div ref={profileRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className={clsx(
                  "flex h-11 items-center gap-2 rounded-2xl border bg-white px-2.5 shadow-sm transition",
                  profileOpen
                    ? "border-[#0D1933] ring-4 ring-slate-100"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0D1933] text-white">
                  <Hospital className="h-4 w-4" />
                </span>

                <span className="hidden max-w-[135px] text-left xl:block">
                  <span className="block truncate text-[10px] font-black text-[#0D1933]">
                    Yangon General
                  </span>

                  <span className="mt-0.5 block truncate text-[8px] font-bold text-slate-400">
                    Verified hospital
                  </span>
                </span>

                <ChevronDown
                  className={clsx(
                    "h-3.5 w-3.5 text-slate-400 transition-transform",
                    profileOpen && "rotate-180",
                  )}
                />
              </button>

              {profileOpen && (
                <ProfileDropdown onClose={() => setProfileOpen(false)} />
              )}
            </div>

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0D1933] shadow-sm transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <MobileNavigation
          pathname={pathname}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

function DesktopNavigationLink({
  item,
  pathname,
}: {
  item: NavigationItem;
  pathname: string;
}) {
  const active = isNavigationActive(item, pathname);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "group relative inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-3.5 text-[10px] font-black transition",
        active
          ? "bg-[#0D1933] text-white shadow-[0_8px_20px_rgba(13,25,51,0.16)]"
          : "text-slate-500 hover:bg-white hover:text-[#0D1933]",
      )}
    >
      <Icon
        className={clsx(
          "h-3.5 w-3.5",
          active
            ? "text-emerald-300"
            : "text-slate-400 group-hover:text-slate-600",
        )}
      />

      {item.label}

      {active && (
        <span className="absolute inset-x-4 -bottom-[7px] h-0.5 rounded-full bg-emerald-400" />
      )}
    </Link>
  );
}

function MobileNavigation({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-[#07101F]/55 backdrop-blur-sm lg:hidden"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className="ml-auto flex h-full w-[min(88%,360px)] flex-col overflow-hidden bg-[#F7F8FB] shadow-[-24px_0_70px_rgba(7,16,31,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Drawer header */}
        <header className="relative overflow-hidden bg-[#0D1933] px-5 pb-5 pt-5 text-white">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-red-500/20 blur-3xl"
          />

          <div className="relative flex items-center justify-between gap-4">
            <Link
              href="/"
              onClick={onClose}
              className="flex min-w-0 items-center gap-3"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <Image
                  src="/images/lifelink-symbol-white.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              </span>

              <span className="min-w-0">
                <span className="block text-lg font-black tracking-[-0.04em]">
                  Life<span className="text-red-400">Link</span>
                </span>

                <span className="mt-0.5 block truncate text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Emergency Blood Network
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-white transition hover:bg-white/[0.14]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mt-5 flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.07] p-3.5 backdrop-blur-xl">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
              <Hospital className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black">
                Yangon General Hospital
              </p>

              <p className="mt-1 flex items-center gap-1 text-[9px] font-bold text-emerald-300">
                <ShieldCheck className="h-3 w-3" />
                Verified facility
              </p>
            </div>

            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
          </div>
        </header>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p className="px-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
            Navigation
          </p>

          <nav
            aria-label="Mobile primary navigation"
            className="mt-3 space-y-2"
          >
            {MAIN_NAVIGATION.map((item) => {
              const active = isNavigationActive(item, pathname);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "group flex min-h-[62px] items-center gap-3 rounded-[1.25rem] border px-3.5 py-3 transition",
                    active
                      ? "border-[#0D1933] bg-[#0D1933] text-white shadow-[0_12px_30px_rgba(13,25,51,0.18)]"
                      : "border-slate-200/80 bg-white text-slate-600 shadow-sm hover:border-slate-300",
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      active
                        ? "bg-white/10 text-emerald-300"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-black">
                      {item.label}
                    </span>

                    <span
                      className={clsx(
                        "mt-1 block truncate text-[9px]",
                        active ? "text-slate-400" : "text-slate-400",
                      )}
                    >
                      {item.description}
                    </span>
                  </span>

                  {active && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 ring-4 ring-emerald-400/15" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="my-5 h-px bg-slate-200" />

          <p className="px-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
            Account
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {ACCOUNT_NAVIGATION.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex min-w-0 flex-col rounded-[1.15rem] border border-slate-200/80 bg-white p-3.5 shadow-sm transition hover:border-slate-300"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="mt-3 text-xs font-black text-[#0D1933]">
                    {item.label}
                  </span>

                  <span className="mt-1 truncate text-[8px] text-slate-400">
                    {item.description}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Drawer footer */}
        <footer className="border-t border-slate-200 bg-white p-4">
          <Link
            href="/broadcast"
            onClick={onClose}
            className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 text-sm font-black text-white shadow-[0_14px_34px_rgba(239,68,68,0.25)] transition hover:bg-red-600 active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Create emergency request
          </Link>
        </footer>
      </aside>
    </div>
  );
}

function ProfileDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="menu"
      className="absolute right-0 top-[calc(100%+12px)] z-50 w-72 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_26px_70px_rgba(15,23,42,0.18)]"
    >
      <div className="relative overflow-hidden bg-[#0D1933] p-4 text-white">
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/15 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <Hospital className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-black">
              Yangon General Hospital
            </p>

            <p className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-300">
              <ShieldCheck className="h-3 w-3" />
              Verified facility
            </p>
          </div>
        </div>
      </div>

      <div className="p-2">
        {ACCOUNT_NAVIGATION.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <Icon className="h-4 w-4" />
              </span>

              <span className="min-w-0">
                <span className="block text-xs font-black text-[#0D1933]">
                  {item.label}
                </span>

                <span className="mt-0.5 block text-[9px] text-slate-400">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}

        <div className="my-2 h-px bg-slate-100" />

        <button
          type="button"
          role="menuitem"
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-red-50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <LogOut className="h-4 w-4" />
          </span>

          <span>
            <span className="block text-xs font-black text-red-600">
              Sign out
            </span>

            <span className="mt-0.5 block text-[9px] text-red-400">
              End this secure session
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

function isNavigationActive(item: NavigationItem, pathname: string) {
  if (item.href === "/") {
    return pathname === "/";
  }

  const matchingPaths = item.match ?? [item.href];

  return matchingPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
