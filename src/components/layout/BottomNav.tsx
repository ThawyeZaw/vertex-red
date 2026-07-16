"use client";
// BottomNav — mobile bottom navigation for donor role
// Thinzar Kyaw — Frontend Domain

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Activity } from "lucide-react";
import { clsx } from "clsx";

const TABS = [
  { href: "/passport", label: "Passport", icon: User },
  { href: "/map",      label: "Find Center", icon: MapPin },
  { href: "/passport#health", label: "Health", icon: Activity },
] as const;

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white pb-safe">
      <div className="flex items-stretch justify-around">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href === "/passport" && pathname === "/passport");
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={clsx(
                "flex min-h-[60px] flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-vr-teal" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon
                className={clsx(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
