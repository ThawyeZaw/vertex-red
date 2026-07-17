// Dashboard shell — protected area layout with desktop sidebar
// Thinzar Kyaw — Frontend Domain
// NOTE: Auth-gating (redirect if unauthenticated) is handled by middleware
// in the backend domain (Thaw Ye Zaw). This layout is UI only.

import Link from "next/link";
import {
  LayoutDashboard,
  Heart,
  RadioTower,
  Package,
  Map,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DashboardGuard } from "@/components/DashboardGuard";

const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Request Board", icon: LayoutDashboard },
  { href: "/passport", label: "Donor Passport", icon: Heart },
  { href: "/broadcast", label: "Broadcast", icon: RadioTower },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/map", label: "Live Map", icon: Map },
];

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6 md:px-6">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1">
            {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-semibold text-gray-600 transition hover:bg-white hover:text-red-600 hover:shadow-sm"
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content — gated by client-side guard */}
        <main className="min-w-0 flex-1">
          <DashboardGuard>{children}</DashboardGuard>
        </main>
      </div>
    </div>
  );
}
