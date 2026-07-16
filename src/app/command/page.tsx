"use client";
// Command Center page — hospital admin real-time request dashboard
// Thinzar Kyaw — Frontend Domain

import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { HospitalTopBar } from "@/components/layout/HospitalTopBar";
import { MapPlaceholder } from "@/components/command/MapPlaceholder";
import { RequestCard } from "@/components/command/RequestCard";
import { LiveFeed } from "@/components/command/LiveFeed";
import {
  getActiveRequests,
  subscribeToRequests,
  type RequestWithDetails,
  type Urgency,
} from "@/utils/supabase";
import { MOCK_REQUESTS, MOCK_LIVE_FEED } from "@/components/data/mockData";
import { clsx } from "clsx";

type FilterTab = "ALL" | Urgency | "RESOLVED";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL",      label: "ALL"      },
  { key: "CRITICAL", label: "CRITICAL" },
  { key: "URGENT",   label: "URGENT"   },
  { key: "STANDARD", label: "ROUTINE"  },
];

// Approximate distances (km) for prototype — indexed by request position
const MOCK_DISTANCES = [2.4, 3.1, 1.8, 4.2];

export default function CommandPage() {
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [search, setSearch] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      const data = await getActiveRequests();
      setRequests(data);
    } catch {
      setRequests(MOCK_REQUESTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();

    // Real-time subscription
    const channel = subscribeToRequests(
      (newReq) => {
        setRequests((prev) => [
          {
            ...newReq,
            requester: { id: "", full_name: "", phone: null, blood_type: null },
            hospital: null,
          } as RequestWithDetails,
          ...prev,
        ]);
      },
      (updatedReq) => {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === updatedReq.id ? { ...r, ...updatedReq } : r
          )
        );
      }
    );
    return () => { channel.unsubscribe(); };
  }, [loadRequests]);

  const filtered = requests.filter((r) => {
    if (activeTab !== "ALL" && r.urgency !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.hospital?.name?.toLowerCase().includes(q) ||
        r.township?.toLowerCase().includes(q) ||
        r.blood_type?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <HospitalTopBar
        title="Command Center"
        subtitle="System Live"
        isLive={true}
      />

      {/* Search bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="command-search"
              type="text"
              placeholder="Search hospital or township…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-vr-navy placeholder-gray-400 focus:border-vr-teal focus:outline-none transition-colors"
            />
          </div>
          <button
            aria-label="Filter"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-white pt-4 pb-2">
        <MapPlaceholder />
      </div>

      {/* Filter tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key.toLowerCase()}`}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                "rounded-xl px-3 py-1.5 text-xs font-bold tracking-wide transition-all",
                activeTab === tab.key
                  ? "bg-vr-navy text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Request list */}
      <div className="flex-1 space-y-3 py-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-vr-teal border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <p className="text-gray-400 text-sm">No requests match this filter.</p>
          </div>
        ) : (
          filtered.map((req, i) => (
            <RequestCard
              key={req.id}
              request={req}
              distanceKm={MOCK_DISTANCES[i % MOCK_DISTANCES.length]}
              onManage={(id) => alert(`Managing request ${id} (prototype mode)`)}
            />
          ))
        )}

        {/* Live feed */}
        {!loading && <LiveFeed items={MOCK_LIVE_FEED} />}
      </div>
    </div>
  );
}
