// DonationHistorySection — stats, history, badges
// Thinzar Kyaw — Frontend Domain

import { Droplets, ChevronRight, Award } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface HistoryItem {
  id: string;
  date: string;
  type: string;
  hospital: string;
  status: "PROCESSED" | "PENDING";
}

interface DonationHistorySectionProps {
  livesSaved?: number;
  volumeLiters?: number;
  history?: HistoryItem[];
}

const DEFAULT_HISTORY: HistoryItem[] = [
  { id: "h1", date: "12 Mar 2024", type: "Whole Blood",    hospital: "Yangon General Hospital (YGH)",      status: "PROCESSED" },
  { id: "h2", date: "04 Jan 2024", type: "Urgent Response", hospital: "Asia Royal Hospital",               status: "PROCESSED" },
  { id: "h3", date: "22 Sep 2023", type: "Power Red",      hospital: "Thukha Yeik Mon Specialist Hospital", status: "PROCESSED" },
];

const BADGES = [
  { icon: "🥇", title: "First Responder",  sub: "Answered 3 dispatches" },
  { icon: "🩸", title: "1 Litre Club",     sub: "Volume milestone"      },
];

export const DonationHistorySection = ({
  livesSaved = 12,
  volumeLiters = 3.5,
  history = DEFAULT_HISTORY,
}: DonationHistorySectionProps) => {
  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="mx-4 grid grid-cols-2 gap-3">
        <StatCard value={String(livesSaved)} label="Lives Saved" />
        <StatCard value={`${volumeLiters}L`} label="Volume Donated" />
      </div>

      {/* Recent history */}
      <div className="mx-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-vr-teal" />
            <SectionHeader>Recent History</SectionHeader>
          </div>
          <button className="flex items-center gap-1 text-xs font-semibold text-vr-teal">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold text-vr-navy">{item.type}</p>
                <p className="text-xs text-gray-500">{item.hospital}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{item.date}</p>
                <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recognition badges */}
      <div className="mx-4">
        <SectionHeader className="mb-3">Recognitions</SectionHeader>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm border border-gray-100"
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="text-xs font-bold text-vr-navy">{badge.title}</p>
                <p className="text-xs text-gray-500">{badge.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
