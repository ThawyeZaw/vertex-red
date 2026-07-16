"use client";
// FacilitySelector — hospital dropdown for broadcast form
// Thinzar Kyaw — Frontend Domain

import { MapPin } from "lucide-react";
import type { Hospital } from "@/utils/supabase";

interface FacilitySelectorProps {
  hospitals: Hospital[];
  selectedId: string;
  onChange: (id: string) => void;
  loading?: boolean;
}

export const FacilitySelector = ({
  hospitals,
  selectedId,
  onChange,
  loading = false,
}: FacilitySelectorProps) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <MapPin className="h-4 w-4 text-gray-400" />
      </div>
      <select
        id="facility-selector"
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full appearance-none rounded-2xl border-2 border-gray-200 bg-white py-3.5 pl-9 pr-4 text-sm font-medium text-vr-navy focus:border-vr-teal focus:outline-none disabled:opacity-50 transition-colors"
      >
        <option value="">
          {loading ? "Loading hospitals…" : "Select receiving facility"}
        </option>
        {hospitals.map((h) => (
          <option key={h.id} value={h.id}>
            {h.name} — {h.township}
          </option>
        ))}
      </select>
    </div>
  );
};
