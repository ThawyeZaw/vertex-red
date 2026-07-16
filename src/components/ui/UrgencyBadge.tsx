// UrgencyBadge — color-coded urgency label
// Thinzar Kyaw — Frontend Domain

import { AlertTriangle, Clock, Activity } from "lucide-react";
import { clsx } from "clsx";
import type { Urgency } from "@/utils/supabase";

interface UrgencyBadgeProps {
  urgency: Urgency;
  className?: string;
}

const CONFIG = {
  CRITICAL: {
    label: "CRITICAL",
    icon: AlertTriangle,
    classes: "bg-red-100 text-red-700 border border-red-200",
  },
  URGENT: {
    label: "URGENT",
    icon: Clock,
    classes: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  STANDARD: {
    label: "ROUTINE",
    icon: Activity,
    classes: "bg-green-100 text-green-700 border border-green-200",
  },
};

export const UrgencyBadge = ({ urgency, className }: UrgencyBadgeProps) => {
  const { label, icon: Icon, classes } = CONFIG[urgency];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        classes,
        className
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {label}
    </span>
  );
};
