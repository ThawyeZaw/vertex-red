// RequestCard — command center request card
// Thinzar Kyaw — Frontend Domain

import { MapPin, ChevronRight } from "lucide-react";
import { UrgencyBadge } from "@/components/ui/UrgencyBadge";
import { BloodTypeBadge } from "@/components/ui/BloodTypeBadge";
import type { RequestWithDetails } from "@/utils/supabase";
import { clsx } from "clsx";

interface RequestCardProps {
  request: RequestWithDetails;
  distanceKm?: number;
  onManage?: (id: string) => void;
}

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  OPEN:        { text: "Awaiting donors",  color: "text-gray-500" },
  IN_PROGRESS: { text: "1 en route",       color: "text-amber-600 font-semibold" },
  FULFILLED:   { text: "Fulfilled",        color: "text-green-600 font-semibold" },
  EXPIRED:     { text: "Expired",          color: "text-gray-400" },
};

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

export const RequestCard = ({
  request,
  distanceKm = 2.4,
  onManage,
}: RequestCardProps) => {
  const hospitalName = request.hospital?.name ?? "Unknown Hospital";
  const reqId = `REQ-${request.id.slice(0, 4).toUpperCase()}`;
  const statusInfo = STATUS_LABEL[request.status] ?? STATUS_LABEL.OPEN;

  return (
    <div className="mx-4 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        {/* Top row: urgency + time */}
        <div className="flex items-center justify-between mb-3">
          <UrgencyBadge urgency={request.urgency} />
          <span className="text-xs text-gray-400">{timeAgo(request.created_at)}</span>
        </div>

        {/* Hospital row */}
        <div className="flex items-center gap-3">
          <BloodTypeBadge bloodType={request.blood_type ?? "?"} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-vr-navy truncate">{hospitalName}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <MapPin className="h-3 w-3" />
              {distanceKm.toFixed(1)} km • {reqId}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
        </div>

        {/* Status + Manage */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className={clsx("text-sm", statusInfo.color)}>
            {statusInfo.text}
          </span>
          <button
            id={`manage-${request.id}`}
            onClick={() => onManage?.(request.id)}
            className="rounded-xl bg-gray-100 px-4 py-1.5 text-xs font-semibold text-vr-navy hover:bg-gray-200 transition-colors"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};
