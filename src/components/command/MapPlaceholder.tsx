// MapPlaceholder — static grid placeholder until Mapbox is integrated
// Thinzar Kyaw — Frontend Domain

import { MapPin } from "lucide-react";

interface MapPin_ {
  id: string;
  label: string;
  color: string;
  x: number; // percentage
  y: number;
  shape?: "circle" | "triangle";
}

const PINS: MapPin_[] = [
  { id: "p1", label: "REQ-001 • O−", color: "bg-red-500",    x: 30, y: 38, shape: "triangle" },
  { id: "p2", label: "REQ-002 • A+", color: "bg-amber-500",  x: 62, y: 55, shape: "circle"   },
];

export const MapPlaceholder = () => {
  return (
    <div className="relative mx-4 h-52 overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
      {/* Grid lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#e5e7eb" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Pins */}
      {PINS.map((pin) => (
        <div
          key={pin.id}
          className="absolute"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          {/* Label tooltip */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-vr-navy px-2 py-1 text-xs font-semibold text-white shadow">
            {pin.label}
          </div>
          {/* Marker */}
          <div
            className={`flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${pin.color} shadow-md`}
          >
            {pin.shape === "triangle" ? (
              <span className="text-white text-xs font-bold">▲</span>
            ) : (
              <span className="text-white text-xs">●</span>
            )}
          </div>
        </div>
      ))}

      {/* Bottom label */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-xs text-gray-500 backdrop-blur-sm">
        Interactive map coming soon
      </div>
    </div>
  );
};
