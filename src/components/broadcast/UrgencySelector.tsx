"use client";
// UrgencySelector — radio-style urgency picker for broadcast form
// Thinzar Kyaw — Frontend Domain

import { AlertTriangle, Clock, Activity } from "lucide-react";
import { clsx } from "clsx";
import type { Urgency } from "@/utils/supabase";

interface UrgencySelectorProps {
  value: Urgency;
  onChange: (urgency: Urgency) => void;
}

const OPTIONS = [
  {
    value: "CRITICAL" as Urgency,
    label: "CRITICAL",
    description: "Life-threatening. Immediate response needed (< 30 mins).",
    icon: AlertTriangle,
    border: "border-red-400 bg-red-50",
    iconColor: "text-red-600",
    labelColor: "text-red-700",
    activeBorder: "border-red-400",
  },
  {
    value: "URGENT" as Urgency,
    label: "URGENT",
    description: "Inventory critically low. Needed within 2–4 hours.",
    icon: Clock,
    border: "border-amber-300 bg-amber-50",
    iconColor: "text-amber-600",
    labelColor: "text-amber-700",
    activeBorder: "border-amber-400",
  },
  {
    value: "STANDARD" as Urgency,
    label: "ROUTINE",
    description: "Standard restock. Appointments within 48 hours.",
    icon: Activity,
    border: "border-gray-200 bg-gray-50",
    iconColor: "text-gray-500",
    labelColor: "text-gray-700",
    activeBorder: "border-gray-400",
  },
] as const;

export const UrgencySelector = ({ value, onChange }: UrgencySelectorProps) => {
  return (
    <div className="space-y-2">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            id={`urgency-${opt.value.toLowerCase()}`}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "w-full rounded-2xl border-2 p-4 text-left transition-all",
              isSelected
                ? `${opt.border} ${opt.activeBorder} shadow-sm`
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon
                className={clsx(
                  "h-4 w-4",
                  isSelected ? opt.iconColor : "text-gray-400"
                )}
                strokeWidth={2.5}
              />
              <span
                className={clsx(
                  "text-sm font-bold tracking-wide",
                  isSelected ? opt.labelColor : "text-gray-500"
                )}
              >
                {opt.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed pl-6">
              {opt.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};
