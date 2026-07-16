// StatCard — two-stat display card (Lives Saved, Volume Donated)
// Thinzar Kyaw — Frontend Domain

import { clsx } from "clsx";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export const StatCard = ({ value, label, className }: StatCardProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-5 shadow-sm border border-gray-100",
        className
      )}
    >
      <span className="text-3xl font-bold text-vr-navy">{value}</span>
      <span className="mt-1 text-xs font-semibold tracking-widest text-gray-400 uppercase">
        {label}
      </span>
    </div>
  );
};
