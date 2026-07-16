"use client";
// ActiveDispatchCard — critical request dispatched to donor
// Thinzar Kyaw — Frontend Domain

import { AlertTriangle, Clock, MapPin, Droplets } from "lucide-react";
import { UrgencyBadge } from "@/components/ui/UrgencyBadge";
import type { RequestWithDetails } from "@/utils/supabase";

interface ActiveDispatchCardProps {
  request: RequestWithDetails;
  distanceKm?: number;
  onRespond?: () => void;
}

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
};

export const ActiveDispatchCard = ({
  request,
  distanceKm = 1.8,
  onRespond,
}: ActiveDispatchCardProps) => {
  const hospitalName = request.hospital?.name ?? "Unknown Hospital";
  const bloodType = request.blood_type ?? "—";

  return (
    <div className="mx-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
      {/* Red left accent bar */}
      <div className="flex">
        <div className="w-1 shrink-0 bg-vr-red rounded-l-2xl" />
        <div className="flex-1 p-4">
          {/* Top row */}
          <div className="flex items-center justify-between mb-3">
            <UrgencyBadge urgency={request.urgency} />
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {timeAgo(request.created_at)}
            </div>
          </div>

          {/* Hospital */}
          <h3 className="text-base font-bold text-vr-navy">{hospitalName}</h3>
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            {distanceKm.toFixed(1)} km away
          </div>

          {/* Blood type match */}
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-red-50 px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-sm font-bold text-red-600">
              {bloodType}
            </div>
            <div>
              <p className="text-sm font-semibold text-vr-navy">
                Patient match found
              </p>
              <p className="text-xs text-gray-500">
                Your blood type is urgently needed
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            id="dispatch-respond-btn"
            onClick={onRespond}
            className="mt-4 w-full rounded-2xl bg-vr-red py-3.5 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-95"
          >
            Acknowledge &amp; Respond
          </button>
        </div>
      </div>
    </div>
  );
};
