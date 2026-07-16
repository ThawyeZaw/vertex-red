// DonorTopBar — light top bar for donor-facing screens
// Thinzar Kyaw — Frontend Domain

import Link from "next/link";
import { Bell } from "lucide-react";

interface DonorTopBarProps {
  title: string;
  subtitle?: string;
}

export const DonorTopBar = ({ title, subtitle }: DonorTopBarProps) => {
  return (
    <header className="flex items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
      <div>
        <h1 className="text-xl font-bold text-vr-navy">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      <Link
        href="/passport"
        aria-label="Notifications"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        <Bell className="h-5 w-5" />
      </Link>
    </header>
  );
};
