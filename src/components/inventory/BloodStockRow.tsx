// BloodStockRow — blood type inventory row with bar + trend
// Thinzar Kyaw — Frontend Domain

import { AlertTriangle, Clock, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { clsx } from "clsx";
import type { BloodStock, StockLevel } from "@/components/data/mockData";
import { ChevronRight } from "lucide-react";

interface BloodStockRowProps {
  stock: BloodStock;
  maxUnits?: number;
}

const LEVEL_CONFIG: Record<StockLevel, {
  badge: string;
  bar: string;
  icon: React.ElementType;
}> = {
  CRITICAL: {
    badge: "bg-red-100 text-red-700 border border-red-200",
    bar: "bg-red-500",
    icon: AlertTriangle,
  },
  LOW: {
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    bar: "bg-amber-500",
    icon: Clock,
  },
  ADEQUATE: {
    badge: "bg-green-100 text-green-700 border border-green-200",
    bar: "bg-green-500",
    icon: CheckCircle,
  },
};

const TREND_ICON = {
  up:     { icon: TrendingUp,   color: "text-green-500" },
  down:   { icon: TrendingDown, color: "text-red-500"   },
  stable: { icon: Minus,        color: "text-gray-400"  },
};

export const BloodStockRow = ({ stock, maxUnits = 40 }: BloodStockRowProps) => {
  const config = LEVEL_CONFIG[stock.level];
  const LevelIcon = config.icon;
  const trendInfo = TREND_ICON[stock.trend];
  const TrendIcon = trendInfo.icon;
  const pct = Math.min((stock.units / maxUnits) * 100, 100);

  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      {/* Blood type badge */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vr-navy text-sm font-bold text-white">
        {stock.bloodType}
      </div>

      {/* Middle: badge + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={clsx(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              config.badge
            )}
          >
            <LevelIcon className="h-3 w-3" strokeWidth={2.5} />
            {stock.level}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100">
          <div
            className={clsx("h-1.5 rounded-full transition-all", config.bar)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Right: units + trend */}
      <div className="flex items-center gap-2 shrink-0">
        <TrendIcon className={clsx("h-4 w-4", trendInfo.color)} />
        <span className="text-sm font-semibold text-gray-600">
          {stock.units} units
        </span>
        <ChevronRight className="h-4 w-4 text-gray-300" />
      </div>
    </div>
  );
};
