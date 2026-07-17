"use client";

// DashboardGuard — client-side session gate for all /dashboard routes
// Thinzar Kyaw — Frontend Domain
// NOTE: Real auth gating is enforced by middleware (backend domain, Thaw Ye Zaw).
// This is a complementary client-side check for immediate UX feedback.

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface DashboardGuardProps {
  children: ReactNode;
}

export const DashboardGuard = ({ children }: DashboardGuardProps) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = window.sessionStorage.getItem("vr-demo-session");
    if (session) {
      setAuthorized(true);
    } else {
      router.replace("/");
    }
    setChecked(true);
  }, [router]);

  // Listen for session removal (e.g., from another tab logging out)
  useEffect(() => {
    const onStorage = () => {
      if (!window.sessionStorage.getItem("vr-demo-session")) {
        router.replace("/");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!authorized) return null;
  return <>{children}</>;
};
