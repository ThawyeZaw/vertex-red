"use client";
// BloodTypeGrid — multi-select 2×4 blood type toggle grid
// Thinzar Kyaw — Frontend Domain

import { clsx } from "clsx";
import type { BloodType } from "@/utils/supabase";

const ALL_TYPES: BloodType[] = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

interface BloodTypeGridProps {
  selected: BloodType[];
  onChange: (types: BloodType[]) => void;
}

export const BloodTypeGrid = ({ selected, onChange }: BloodTypeGridProps) => {
  const toggle = (type: BloodType) => {
    const isSelected = selected.includes(type);
    if (isSelected) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {ALL_TYPES.map((type) => {
          const isSelected = selected.includes(type);
          return (
            <button
              key={type}
              id={`blood-type-${type.replace("+", "pos").replace("-", "neg")}`}
              type="button"
              onClick={() => toggle(type)}
              className={clsx(
                "rounded-xl py-3 text-sm font-bold transition-all border-2",
                isSelected
                  ? "bg-vr-navy border-vr-navy text-white shadow-sm scale-[1.03]"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
              )}
            >
              {type}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-right text-xs text-gray-400">
        {selected.length} selected
      </p>
    </div>
  );
};
