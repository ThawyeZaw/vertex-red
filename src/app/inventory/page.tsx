"use client";
// Blood Inventory page — per-hospital blood stock view
// Thinzar Kyaw — Frontend Domain

import { useState } from "react";
import { Building2, Plus, AlertTriangle, Clock } from "lucide-react";
import { HospitalTopBar } from "@/components/layout/HospitalTopBar";
import { BloodStockRow } from "@/components/inventory/BloodStockRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  MOCK_BLOOD_INVENTORY,
  MOCK_RECENT_INTAKE,
  type StockLevel,
} from "@/components/data/mockData";
import { clsx } from "clsx";

type StockFilter = "All" | StockLevel;

const FILTERS: StockFilter[] = ["All", "CRITICAL", "LOW", "ADEQUATE"];

const FILTER_LABELS: Record<StockFilter, string> = {
  All: "All",
  CRITICAL: "Critical",
  LOW: "Low",
  ADEQUATE: "Adequate",
};

// Selected hospital for this prototype
const HOSPITAL_NAME = "Yangon General Hospital (YGH)";

export default function InventoryPage() {
  const [filter, setFilter] = useState<StockFilter>("All");
  const [showLogModal, setShowLogModal] = useState(false);

  const criticalCount = MOCK_BLOOD_INVENTORY.filter((s) => s.level === "CRITICAL").length;
  const lowCount = MOCK_BLOOD_INVENTORY.filter((s) => s.level === "LOW").length;

  const filtered =
    filter === "All"
      ? MOCK_BLOOD_INVENTORY
      : MOCK_BLOOD_INVENTORY.filter((s) => s.level === filter);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <HospitalTopBar
        title="Blood Inventory"
        subtitle={HOSPITAL_NAME.toUpperCase()}
        isLive={false}
      />

      <div className="flex-1 space-y-4 py-4">
        {/* Summary cards */}
        <div className="mx-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
            <p className="text-3xl font-black text-red-600">{criticalCount}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" strokeWidth={2.5} />
              <p className="text-xs font-bold text-red-500 tracking-wide uppercase">
                Critical Types
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
            <p className="text-3xl font-black text-amber-600">{lowCount}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="h-3.5 w-3.5 text-amber-500" strokeWidth={2.5} />
              <p className="text-xs font-bold text-amber-500 tracking-wide uppercase">
                Low Types
              </p>
            </div>
          </div>
        </div>

        {/* Log donation CTA */}
        <div className="mx-4">
          <button
            id="log-donation-btn"
            onClick={() => setShowLogModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-vr-teal py-4 text-sm font-bold text-white shadow-lg shadow-emerald-100 hover:bg-vr-teal-dark active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5" />
            Log Received Donation
          </button>
        </div>

        {/* Filter tabs + stock list */}
        <div className="mx-4 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
            <SectionHeader>Stock by Type</SectionHeader>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 px-4 py-3 border-b border-gray-100">
            {FILTERS.map((f) => (
              <button
                key={f}
                id={`filter-${f.toLowerCase()}`}
                onClick={() => setFilter(f)}
                className={clsx(
                  "rounded-xl px-3 py-1 text-xs font-semibold transition-all",
                  filter === f
                    ? "bg-vr-navy text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>

          {/* Stock rows */}
          <div className="divide-y divide-gray-100">
            {filtered.map((stock) => (
              <BloodStockRow key={stock.bloodType} stock={stock} maxUnits={40} />
            ))}
          </div>
        </div>

        {/* Recent intake */}
        <div className="mx-4 rounded-2xl bg-white shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-vr-teal" />
            <SectionHeader>Recent Intake</SectionHeader>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_RECENT_INTAKE.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vr-teal/10">
                  <span className="text-vr-teal text-sm">🩸</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-vr-navy">
                    {item.donor} donated 1 unit · {item.bloodType}
                  </p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log donation modal */}
      {showLogModal && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm"
          onClick={() => setShowLogModal(false)}
        >
          <div
            className="w-full rounded-t-3xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-vr-navy mb-1">Log Received Donation</h3>
            <p className="text-sm text-gray-500 mb-4">
              Record a new unit received at {HOSPITAL_NAME}.
            </p>
            <p className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-500 text-center">
              Full form coming soon — connect to blood bank integration.
            </p>
            <button
              onClick={() => setShowLogModal(false)}
              className="mt-4 w-full rounded-2xl bg-vr-navy py-3.5 text-sm font-bold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
