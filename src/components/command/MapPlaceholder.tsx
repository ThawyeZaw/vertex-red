"use client";

// src/components/command/MapPlaceholder.tsx
// LifeLink — Interactive emergency coverage map
// Team Vertex Red

import {
  AlertTriangle,
  Clock3,
  Crosshair,
  Droplets,
  Expand,
  Layers3,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Radio,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

type MarkerTone = "critical" | "urgent" | "routine";

interface EmergencyMarker {
  id: string;
  bloodType: string;
  urgency: string;
  hospital: string;
  township: string;
  units: number;
  nearbyDonors: number;
  updated: string;
  tone: MarkerTone;
  position: string;
  cardAlignment?: "left" | "center" | "right";
}

const EMERGENCY_MARKERS: EmergencyMarker[] = [
  {
    id: "REQ-001",
    bloodType: "O-",
    urgency: "Critical",
    hospital: "Yangon General Hospital",
    township: "Latha",
    units: 3,
    nearbyDonors: 28,
    updated: "Updated 4 min ago",
    tone: "critical",
    position: "left-[24%] top-[47%]",
    cardAlignment: "left",
  },
  {
    id: "REQ-002",
    bloodType: "A+",
    urgency: "Urgent",
    hospital: "Thingangyun Sanpya Hospital",
    township: "Thingangyun",
    units: 2,
    nearbyDonors: 17,
    updated: "Updated 14 min ago",
    tone: "urgent",
    position: "left-[61%] top-[31%]",
    cardAlignment: "center",
  },
  {
    id: "REQ-003",
    bloodType: "B+",
    urgency: "Routine",
    hospital: "North Okkalapa General Hospital",
    township: "North Okkalapa",
    units: 1,
    nearbyDonors: 12,
    updated: "Updated 22 min ago",
    tone: "routine",
    position: "left-[72%] top-[63%]",
    cardAlignment: "right",
  },
];

const toneStyles = {
  critical: {
    marker: "bg-red-500 text-white shadow-[0_14px_32px_rgba(239,68,68,0.38)]",
    markerRing: "ring-red-200/70",
    soft: "bg-red-50 text-red-600",
    badge: "bg-red-50 text-red-600",
    border: "border-red-100",
    icon: AlertTriangle,
    glow: "bg-red-400/25",
  },
  urgent: {
    marker:
      "bg-amber-500 text-white shadow-[0_14px_32px_rgba(245,158,11,0.38)]",
    markerRing: "ring-amber-200/70",
    soft: "bg-amber-50 text-amber-700",
    badge: "bg-amber-50 text-amber-700",
    border: "border-amber-100",
    icon: Droplets,
    glow: "bg-amber-400/25",
  },
  routine: {
    marker: "bg-blue-500 text-white shadow-[0_14px_32px_rgba(59,130,246,0.36)]",
    markerRing: "ring-blue-200/70",
    soft: "bg-blue-50 text-blue-700",
    badge: "bg-blue-50 text-blue-700",
    border: "border-blue-100",
    icon: Droplets,
    glow: "bg-blue-400/25",
  },
} satisfies Record<
  MarkerTone,
  {
    marker: string;
    markerRing: string;
    soft: string;
    badge: string;
    border: string;
    icon: LucideIcon;
    glow: string;
  }
>;

export function MapPlaceholder() {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const [mapMode, setMapMode] = useState<"coverage" | "requests">("coverage");

  const selectedMarker =
    EMERGENCY_MARKERS.find((marker) => marker.id === selectedMarkerId) ?? null;

  return (
    <div className="relative min-h-[430px] overflow-visible rounded-[1.6rem] border border-slate-200/80 bg-[#EDF2F7]">
      <MapBackground />

      <div className="absolute left-4 top-4 z-20 max-w-[190px] rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_12px_32px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0D1933] text-white shadow-lg shadow-slate-300">
            <MapPin className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-[#0D1933]">
                Live emergency map
              </p>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black uppercase tracking-[0.08em] text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              Active requests and estimated compatible donor coverage.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <MapControl
          icon={Layers3}
          label={mapMode === "coverage" ? "Coverage" : "Requests"}
          onClick={() =>
            setMapMode((current) =>
              current === "coverage" ? "requests" : "coverage",
            )
          }
          showLabel
        />

        <MapControl
          icon={Crosshair}
          label="Center map"
          onClick={() => setSelectedMarkerId(null)}
        />

        <MapControl
          icon={Expand}
          label="Expand map"
          onClick={() => undefined}
        />
      </div>

      <div className="absolute left-4 top-[140px] z-10 rounded-2xl border border-white/80 bg-white/90 px-3 py-2.5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4 text-blue-500" />

          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
              Coverage area
            </p>

            <p className="text-[10px] font-black text-[#0D1933]">
              Yangon emergency network
            </p>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-[88px] z-20 flex flex-col gap-2">
        <MapControl icon={Plus} label="Zoom in" onClick={() => undefined} />

        <MapControl icon={Minus} label="Zoom out" onClick={() => undefined} />
      </div>

      <div
        aria-hidden="true"
        className="absolute left-[16%] top-[34%] h-32 w-44 rounded-[50%] border-2 border-blue-200/55 bg-blue-100/20"
      />

      <div
        aria-hidden="true"
        className="absolute left-[42%] top-[28%] h-40 w-56 rotate-6 rounded-[50%] border-2 border-blue-200/55 bg-blue-100/20"
      />

      <div
        aria-hidden="true"
        className="absolute left-[36%] top-[48%] h-28 w-52 -rotate-6 rounded-[50%] border-2 border-slate-300/50 bg-white/10"
      />

      {EMERGENCY_MARKERS.map((marker) => (
        <EmergencyMapMarker
          key={marker.id}
          marker={marker}
          selected={selectedMarkerId === marker.id}
          onSelect={() =>
            setSelectedMarkerId((current) =>
              current === marker.id ? null : marker.id,
            )
          }
          onClose={() => setSelectedMarkerId(null)}
        />
      ))}

      <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-white/70 bg-white/85 px-3 py-2 shadow-sm backdrop-blur">
        <p className="text-[8px] font-bold text-slate-400">
          Live donor coverage estimate
        </p>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-xl border border-white/70 bg-white/85 px-3 py-2 shadow-sm backdrop-blur">
        <Radio className="h-3.5 w-3.5 text-emerald-500" />

        <p className="text-[8px] font-black text-emerald-600">
          Network synchronized
        </p>
      </div>

      {selectedMarker && (
        <p className="sr-only" aria-live="polite">
          {selectedMarker.id}, {selectedMarker.urgency},{" "}
          {selectedMarker.hospital}
        </p>
      )}
    </div>
  );
}

function EmergencyMapMarker({
  marker,
  selected,
  onSelect,
  onClose,
}: {
  marker: EmergencyMarker;
  selected: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  const tone = toneStyles[marker.tone];
  const MarkerIcon = tone.icon;

  return (
    <div className={clsx("group absolute z-30", marker.position)}>
      <div
        aria-hidden="true"
        className={clsx(
          "absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl",
          tone.glow,
        )}
      />

      <button
        type="button"
        onClick={onSelect}
        aria-label={`View ${marker.id} request details`}
        aria-expanded={selected}
        className={clsx(
          "relative z-20 flex h-11 w-11 items-center justify-center rounded-2xl ring-4 transition duration-200",
          "hover:-translate-y-1 hover:scale-105",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white",
          tone.marker,
          tone.markerRing,
          selected && "-translate-y-1 scale-105",
        )}
      >
        <MarkerIcon className="h-5 w-5" />
      </button>

      <div
        className={clsx(
          "absolute bottom-[calc(100%+14px)] z-50 w-[270px] transition-all duration-200",
          getPopoverAlignment(marker.cardAlignment),
          selected
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100",
        )}
      >
        <article
          className={clsx(
            "relative overflow-hidden rounded-[1.4rem] border bg-white p-4 shadow-[0_22px_55px_rgba(15,23,42,0.2)]",
            tone.border,
          )}
        >
          <div
            aria-hidden="true"
            className={clsx(
              "absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl",
              tone.glow,
            )}
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                    tone.marker,
                  )}
                >
                  <Droplets className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black text-[#0D1933]">
                      {marker.id}
                    </p>

                    <span
                      className={clsx(
                        "rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.08em]",
                        tone.badge,
                      )}
                    >
                      {marker.urgency}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-[10px] font-bold leading-4 text-slate-600">
                    {marker.hospital}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-start gap-1">
                <span
                  className={clsx(
                    "rounded-xl px-2.5 py-1.5 text-xs font-black",
                    tone.soft,
                  )}
                >
                  {marker.bloodType}
                </span>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClose();
                  }}
                  aria-label={`Close ${marker.id} details`}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <RequestMetric
                icon={MapPin}
                value={marker.township}
                label="Township"
              />

              <RequestMetric
                icon={Droplets}
                value={String(marker.units)}
                label="Units"
              />

              <RequestMetric
                icon={Users}
                value={String(marker.nearbyDonors)}
                label="Nearby"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <span className="inline-flex min-w-0 items-center gap-1.5 text-[8px] font-bold text-slate-400">
                <Clock3 className="h-3 w-3 shrink-0" />
                <span className="truncate">{marker.updated}</span>
              </span>

              <span className="inline-flex shrink-0 items-center gap-1 text-[8px] font-black text-emerald-600">
                <Radio className="h-3 w-3" />
                Tracking live
              </span>
            </div>
          </div>

          <span
            className={clsx(
              "absolute -bottom-2 h-4 w-4 rotate-45 border-b border-r bg-white",
              tone.border,
              getArrowAlignment(marker.cardAlignment),
            )}
          />
        </article>
      </div>
    </div>
  );
}

function RequestMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-2">
      <div className="flex items-center gap-1">
        <Icon className="h-3 w-3 shrink-0 text-slate-400" />

        <p className="truncate text-[9px] font-black text-[#0D1933]">{value}</p>
      </div>

      <p className="mt-1 truncate text-[7px] font-black uppercase tracking-[0.06em] text-slate-400">
        {label}
      </p>
    </div>
  );
}

function MapControl({
  icon: Icon,
  label,
  onClick,
  showLabel = false,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  showLabel?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/90 text-slate-500 shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:border-slate-300 hover:bg-white hover:text-[#0D1933]",
        showLabel ? "px-3" : "w-10",
      )}
    >
      <Icon className="h-4 w-4" />

      {showLabel && <span className="text-[9px] font-black">{label}</span>}
    </button>
  );
}

function MapBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.16) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      <div className="absolute -left-14 top-[58%] h-3 w-[65%] -rotate-6 rounded-full bg-white/90 shadow-[0_1px_4px_rgba(15,23,42,0.08)]" />

      <div className="absolute left-[38%] top-[18%] h-[75%] w-3 rotate-[8deg] rounded-full bg-white/75 shadow-[0_1px_4px_rgba(15,23,42,0.06)]" />

      <div className="absolute right-[8%] top-[38%] h-2 w-[52%] rotate-12 rounded-full bg-white/65" />

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-200/45 to-transparent" />
    </div>
  );
}

function getPopoverAlignment(alignment: EmergencyMarker["cardAlignment"]) {
  if (alignment === "left") {
    return "left-0";
  }

  if (alignment === "right") {
    return "right-0";
  }

  return "left-1/2 -translate-x-1/2";
}

function getArrowAlignment(alignment: EmergencyMarker["cardAlignment"]) {
  if (alignment === "left") {
    return "left-4";
  }

  if (alignment === "right") {
    return "right-4";
  }

  return "left-1/2 -translate-x-1/2";
}
