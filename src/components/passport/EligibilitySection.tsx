// EligibilitySection — donation eligibility table
// Thinzar Kyaw — Frontend Domain

import { Activity, CheckCircle } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface EligibilityItem {
  type: string;
  status: string;
  eligible: boolean;
}

const ELIGIBILITY_ITEMS: EligibilityItem[] = [
  { type: "Whole Blood",  status: "Eligible today",     eligible: true  },
  { type: "Power Red",    status: "Eligible today",     eligible: true  },
  { type: "Platelets",    status: "Available in 4 days", eligible: false },
];

export const EligibilitySection = () => {
  return (
    <div className="mx-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-vr-teal" />
          <SectionHeader>Eligibility</SectionHeader>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
          <CheckCircle className="h-3 w-3" />
          READY
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-100">
        {ELIGIBILITY_ITEMS.map((item) => (
          <div key={item.type} className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-600">{item.type}</span>
            <span
              className={
                item.eligible
                  ? "text-sm font-semibold text-vr-navy"
                  : "text-sm text-gray-400"
              }
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
