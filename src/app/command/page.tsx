"use client";

// src/app/command/page.tsx
// LifeLink — Hospital Emergency Command Center
// Team Vertex Red

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BellRing,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Droplets,
  Filter,
  Hospital,
  ListFilter,
  Map,
  MapPin,
  Plus,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { clsx } from "clsx";

import { MapPlaceholder } from "@/components/command/MapPlaceholder";
import { RequestCard } from "@/components/command/RequestCard";
import { LiveFeed } from "@/components/command/LiveFeed";

import {
  getActiveRequests,
  subscribeToRequests,
  type RequestWithDetails,
  type Urgency,
} from "@/utils/supabase";

import { MOCK_LIVE_FEED, MOCK_REQUESTS } from "@/components/data/mockData";

type FilterTab = "ALL" | Urgency;
type DataMode = "loading" | "live" | "demo";
type MobileView = "REQUESTS" | "MAP" | "ACTIVITY";

type AdvancedFilters = {
  bloodType: string;
  township: string;
};

type RequestStats = {
  total: number;
  critical: number;
  urgent: number;
  standard: number;
  totalUnits: number;
};

const TABS: Array<{
  key: FilterTab;
  label: string;
}> = [
  { key: "ALL", label: "All requests" },
  { key: "CRITICAL", label: "Critical" },
  { key: "URGENT", label: "Urgent" },
  { key: "STANDARD", label: "Routine" },
];

const BLOOD_TYPES = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const MOCK_DISTANCES = [2.4, 3.1, 1.8, 4.2, 5.4, 0.9];

const INITIAL_FILTERS: AdvancedFilters = {
  bloodType: "All",
  township: "",
};

const INITIAL_VISIBLE_REQUESTS = 6;

export default function CommandPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [dataMode, setDataMode] = useState<DataMode>("loading");

  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [mobileView, setMobileView] = useState<MobileView>("REQUESTS");

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<AdvancedFilters>(INITIAL_FILTERS);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [visibleRequestCount, setVisibleRequestCount] = useState(
    INITIAL_VISIBLE_REQUESTS,
  );

  const [selectedRequest, setSelectedRequest] =
    useState<RequestWithDetails | null>(null);

  const loadRequests = useCallback(async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setDataMode("loading");
    }

    try {
      const data = await getActiveRequests();

      setRequests(data);
      setDataMode("live");
    } catch (error) {
      console.error("Unable to load LifeLink requests:", error);

      setRequests(MOCK_REQUESTS);
      setDataMode("demo");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();

    const channel = subscribeToRequests(
      (newRequest) => {
        const hydratedRequest = {
          ...newRequest,
          requester: {
            id: "",
            full_name: "Emergency patient",
            phone: null,
            blood_type: newRequest.blood_type ?? null,
          },
          hospital: null,
        } as RequestWithDetails;

        setRequests((current) => [
          hydratedRequest,
          ...current.filter((request) => request.id !== newRequest.id),
        ]);
      },
      (updatedRequest) => {
        setRequests((current) =>
          current.map((request) =>
            request.id === updatedRequest.id
              ? {
                  ...request,
                  ...updatedRequest,
                }
              : request,
          ),
        );

        setSelectedRequest((current) => {
          if (!current || current.id !== updatedRequest.id) {
            return current;
          }

          return {
            ...current,
            ...updatedRequest,
          };
        });
      },
    );

    return () => {
      channel.unsubscribe();
    };
  }, [loadRequests]);

  useEffect(() => {
    setVisibleRequestCount(INITIAL_VISIBLE_REQUESTS);
  }, [activeTab, filters, search]);

  const requestStats = useMemo<RequestStats>(() => {
    const critical = requests.filter(
      (request) => request.urgency === "CRITICAL",
    ).length;

    const urgent = requests.filter(
      (request) => request.urgency === "URGENT",
    ).length;

    const standard = requests.filter(
      (request) => request.urgency === "STANDARD",
    ).length;

    const totalUnits = requests.reduce(
      (total, request) => total + Number(request.units_needed ?? 0),
      0,
    );

    return {
      total: requests.length,
      critical,
      urgent,
      standard,
      totalUnits,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedTownship = filters.township.trim().toLowerCase();

    return requests.filter((request) => {
      if (activeTab !== "ALL" && request.urgency !== activeTab) {
        return false;
      }

      if (
        filters.bloodType !== "All" &&
        request.blood_type !== filters.bloodType
      ) {
        return false;
      }

      if (
        normalizedTownship &&
        !request.township?.toLowerCase().includes(normalizedTownship)
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableValues = [
        request.hospital?.name,
        request.township,
        request.blood_type,
        request.requester?.full_name,
        request.urgency,
        request.status,
      ];

      return searchableValues.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(normalizedSearch),
      );
    });
  }, [activeTab, filters, requests, search]);

  const visibleRequests = useMemo(
    () => filteredRequests.slice(0, visibleRequestCount),
    [filteredRequests, visibleRequestCount],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.bloodType !== "All") {
      count += 1;
    }

    if (filters.township.trim()) {
      count += 1;
    }

    return count;
  }, [filters]);

  const hasMoreRequests = visibleRequestCount < filteredRequests.length;

  const hasActiveFilters =
    activeTab !== "ALL" || Boolean(search.trim()) || activeFilterCount > 0;

  const handleManageRequest = (id: string) => {
    const request = requests.find((item) => item.id === id);

    if (request) {
      setSelectedRequest(request);
    }
  };

  const clearAllFilters = () => {
    setActiveTab("ALL");
    setSearch("");
    setFilters(INITIAL_FILTERS);
  };

  const showRequestType = (tab: FilterTab) => {
    setActiveTab(tab);
    setMobileView("REQUESTS");

    window.requestAnimationFrame(() => {
      document.getElementById("request-workspace")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F5F9] pb-24 text-[#111827] lg:pb-12">
      <main>
        <CommandHero
          stats={requestStats}
          dataMode={dataMode}
          isRefreshing={isRefreshing}
          onRefresh={() => void loadRequests(true)}
          onCreateRequest={() => router.push("/broadcast")}
          onSelectType={showRequestType}
        />

        <MobileViewNavigation
          value={mobileView}
          requestCount={requestStats.total}
          criticalCount={requestStats.critical}
          onChange={setMobileView}
        />

        <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <OperationalSummary
            stats={requestStats}
            dataMode={dataMode}
            onCritical={() => showRequestType("CRITICAL")}
            onCreate={() => router.push("/broadcast")}
          />

          <div className="mt-5 hidden items-start gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_410px]">
            <RequestWorkspace
              requests={requests}
              filteredRequests={filteredRequests}
              visibleRequests={visibleRequests}
              dataMode={dataMode}
              activeTab={activeTab}
              search={search}
              activeFilterCount={activeFilterCount}
              hasActiveFilters={hasActiveFilters}
              hasMoreRequests={hasMoreRequests}
              onActiveTabChange={setActiveTab}
              onSearchChange={setSearch}
              onOpenFilters={() => setShowFilters(true)}
              onClearFilters={clearAllFilters}
              onManageRequest={handleManageRequest}
              onLoadMore={() =>
                setVisibleRequestCount((current) => current + 6)
              }
            />

            <aside className="min-w-0">
              <div className="sticky top-5 space-y-5">
                <CompactMapPanel stats={requestStats} />
                <ResponseOverview />
                <CompactActivityPanel />
              </div>
            </aside>
          </div>

          <div className="mt-5 lg:hidden">
            {mobileView === "REQUESTS" && (
              <RequestWorkspace
                requests={requests}
                filteredRequests={filteredRequests}
                visibleRequests={visibleRequests}
                dataMode={dataMode}
                activeTab={activeTab}
                search={search}
                activeFilterCount={activeFilterCount}
                hasActiveFilters={hasActiveFilters}
                hasMoreRequests={hasMoreRequests}
                onActiveTabChange={setActiveTab}
                onSearchChange={setSearch}
                onOpenFilters={() => setShowFilters(true)}
                onClearFilters={clearAllFilters}
                onManageRequest={handleManageRequest}
                onLoadMore={() =>
                  setVisibleRequestCount((current) => current + 6)
                }
              />
            )}

            {mobileView === "MAP" && (
              <div className="space-y-4">
                <CompactMapPanel stats={requestStats} />
                <ResponseOverview />
              </div>
            )}

            {mobileView === "ACTIVITY" && (
              <div className="space-y-4">
                <CompactActivityPanel />
                <ResponseOverview />
              </div>
            )}
          </div>
        </div>
      </main>

      {showFilters && (
        <FilterModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
          onClear={() => setFilters(INITIAL_FILTERS)}
        />
      )}

      {selectedRequest && (
        <RequestDetailsDrawer
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onCoordinate={() => {
            setSelectedRequest(null);
            router.push("/donors");
          }}
        />
      )}
    </div>
  );
}

function CommandHero({
  stats,
  dataMode,
  isRefreshing,
  onRefresh,
  onCreateRequest,
  onSelectType,
}: {
  stats: RequestStats;
  dataMode: DataMode;
  isRefreshing: boolean;
  onRefresh: () => void;
  onCreateRequest: () => void;
  onSelectType: (tab: FilterTab) => void;
}) {
  return (
    <section className="relative overflow-hidden bg-[#0A1630]">
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-red-500/20 blur-[110px]" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-56 w-[34rem] rounded-full bg-blue-500/10 blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 pb-8 pt-6 sm:px-8 sm:pb-10 lg:px-8 lg:pb-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-200">
                Emergency network online
              </span>
            </div>

            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
              Hospital operations
            </p>

            <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              Coordinate every emergency response from one workspace.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Review urgent blood requests, assess nearby coverage, and connect
              compatible donors without losing critical time.
            </p>
          </div>
        </div>

        {dataMode === "demo" && (
          <div className="mt-5 flex max-w-xl items-start gap-2.5 rounded-2xl border border-amber-300/15 bg-amber-300/10 px-4 py-3 text-amber-100 backdrop-blur-xl">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

            <div>
              <p className="text-xs font-black">Prototype data active</p>
              <p className="mt-0.5 text-[10px] leading-4 text-amber-100/70">
                Live requests are unavailable, so realistic sample data is being
                displayed.
              </p>
            </div>
          </div>
        )}

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <HeroMetric
            icon={Activity}
            value={stats.total}
            label="Active requests"
            caption="Across the network"
            tone="blue"
            onClick={() => onSelectType("ALL")}
          />

          <HeroMetric
            icon={AlertTriangle}
            value={stats.critical}
            label="Critical"
            caption="Immediate action"
            tone="red"
            emphasized={stats.critical > 0}
            onClick={() => onSelectType("CRITICAL")}
          />

          <HeroMetric
            icon={Clock3}
            value={stats.urgent}
            label="Urgent"
            caption="Rapid response"
            tone="amber"
            onClick={() => onSelectType("URGENT")}
          />

          <HeroMetric
            icon={Droplets}
            value={stats.totalUnits}
            label="Units needed"
            caption="Total demand"
            tone="pink"
          />
        </div>
      </div>
    </section>
  );
}

function HeroMetric({
  icon: Icon,
  value,
  label,
  caption,
  tone,
  emphasized = false,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  value: number;
  label: string;
  caption: string;
  tone: "blue" | "red" | "amber" | "pink";
  emphasized?: boolean;
  onClick?: () => void;
}) {
  const tones = {
    blue: {
      icon: "bg-blue-400/15 text-blue-300",
      glow: "bg-blue-400/20",
    },
    red: {
      icon: "bg-red-400/15 text-red-300",
      glow: "bg-red-400/20",
    },
    amber: {
      icon: "bg-amber-400/15 text-amber-300",
      glow: "bg-amber-400/20",
    },
    pink: {
      icon: "bg-pink-400/15 text-pink-300",
      glow: "bg-pink-400/20",
    },
  };

  const content = (
    <>
      <div
        aria-hidden="true"
        className={clsx(
          "absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl",
          tones[tone].glow,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={clsx(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            tones[tone].icon,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>

        {onClick && (
          <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-white" />
        )}
      </div>

      <div className="relative mt-4">
        <p className="text-2xl font-black tracking-tight text-white">{value}</p>

        <p className="mt-1 text-xs font-black text-slate-200">{label}</p>

        <p className="mt-0.5 text-[9px] font-medium text-slate-500">
          {caption}
        </p>
      </div>
    </>
  );

  const className = clsx(
    "group relative overflow-hidden rounded-[1.35rem] border p-4 text-left backdrop-blur-xl transition",
    emphasized
      ? "border-red-400/30 bg-red-500/15 shadow-[0_12px_35px_rgba(239,68,68,0.12)]"
      : "border-white/10 bg-white/[0.065]",
    onClick &&
      "cursor-pointer hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.1]",
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <article className={className}>{content}</article>;
}

function OperationalSummary({
  stats,
  dataMode,
  onCritical,
  onCreate,
}: {
  stats: RequestStats;
  dataMode: DataMode;
  onCritical: () => void;
  onCreate: () => void;
}) {
  return (
    <section className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
      <div className="flex min-w-0 items-center gap-3 rounded-[1.35rem] border border-white bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
        <span
          className={clsx(
            "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            stats.critical > 0
              ? "bg-red-50 text-red-500"
              : "bg-emerald-50 text-emerald-600",
          )}
        >
          {stats.critical > 0 ? (
            <Zap className="h-5 w-5" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-[#0D1933]">
              {stats.critical > 0
                ? `${stats.critical} critical ${
                    stats.critical === 1 ? "request needs" : "requests need"
                  } attention`
                : "No critical requests right now"}
            </p>

            <span
              className={clsx(
                "rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.1em]",
                dataMode === "live"
                  ? "bg-emerald-50 text-emerald-700"
                  : dataMode === "demo"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-500",
              )}
            >
              {dataMode === "live"
                ? "Live data"
                : dataMode === "demo"
                  ? "Demo mode"
                  : "Loading"}
            </span>
          </div>

          <p className="mt-1 truncate text-[11px] text-slate-500">
            {stats.urgent} urgent requests · {stats.totalUnits} total blood
            units required
          </p>
        </div>

        {stats.critical > 0 && (
          <button
            type="button"
            onClick={onCritical}
            className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-[10px] font-black text-red-600 transition hover:bg-red-100 sm:inline-flex"
          >
            Review now
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="hidden h-full min-h-16 items-center justify-center gap-2 rounded-[1.35rem] bg-[#0D1933] px-5 text-xs font-black text-white shadow-[0_12px_35px_rgba(13,25,51,0.16)] transition hover:-translate-y-0.5 hover:bg-[#17294F] md:inline-flex lg:hidden"
      >
        <Plus className="h-4 w-4" />
        Create request
      </button>
    </section>
  );
}

function MobileViewNavigation({
  value,
  requestCount,
  criticalCount,
  onChange,
}: {
  value: MobileView;
  requestCount: number;
  criticalCount: number;
  onChange: (view: MobileView) => void;
}) {
  return (
    <div className="sticky top-[72px] z-30 border-b border-slate-200/70 bg-[#F3F5F9]/90 px-4 py-3 backdrop-blur-xl lg:hidden">
      <nav
        aria-label="Command center sections"
        className="mx-auto grid max-w-xl grid-cols-3 rounded-2xl border border-white bg-white p-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
      >
        <MobileViewButton
          active={value === "REQUESTS"}
          label="Requests"
          count={requestCount}
          alertCount={criticalCount}
          icon={ListFilter}
          onClick={() => onChange("REQUESTS")}
        />

        <MobileViewButton
          active={value === "MAP"}
          label="Coverage"
          icon={Map}
          onClick={() => onChange("MAP")}
        />

        <MobileViewButton
          active={value === "ACTIVITY"}
          label="Activity"
          icon={Radio}
          onClick={() => onChange("ACTIVITY")}
        />
      </nav>
    </div>
  );
}

function MobileViewButton({
  active,
  label,
  count,
  alertCount,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  alertCount?: number;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "relative flex h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-[10px] font-black transition",
        active
          ? "bg-[#0D1933] text-white shadow-sm"
          : "text-slate-500 hover:bg-slate-50",
      )}
    >
      <Icon
        className={clsx(
          "h-4 w-4",
          active ? "text-emerald-300" : "text-slate-400",
        )}
      />

      {label}

      {count !== undefined && (
        <span
          className={clsx(
            "rounded-full px-1.5 py-0.5 text-[8px]",
            active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500",
          )}
        >
          {count}
        </span>
      )}

      {!active && Boolean(alertCount) && (
        <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </button>
  );
}

function RequestWorkspace({
  requests,
  filteredRequests,
  visibleRequests,
  dataMode,
  activeTab,
  search,
  activeFilterCount,
  hasActiveFilters,
  hasMoreRequests,
  onActiveTabChange,
  onSearchChange,
  onOpenFilters,
  onClearFilters,
  onManageRequest,
  onLoadMore,
}: {
  requests: RequestWithDetails[];
  filteredRequests: RequestWithDetails[];
  visibleRequests: RequestWithDetails[];
  dataMode: DataMode;
  activeTab: FilterTab;
  search: string;
  activeFilterCount: number;
  hasActiveFilters: boolean;
  hasMoreRequests: boolean;
  onActiveTabChange: (tab: FilterTab) => void;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  onClearFilters: () => void;
  onManageRequest: (id: string) => void;
  onLoadMore: () => void;
}) {
  const getTabCount = (tab: FilterTab) => {
    if (tab === "ALL") {
      return requests.length;
    }

    return requests.filter((request) => request.urgency === tab).length;
  };

  return (
    <section
      id="request-workspace"
      className="scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-[0_14px_45px_rgba(15,23,42,0.06)]"
    >
      <header className="border-b border-slate-100 bg-white px-4 pb-4 pt-5 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <BellRing className="h-4 w-4" />
              </span>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-red-500">
                  Emergency queue
                </p>

                <h2 className="mt-0.5 text-lg font-black tracking-tight text-[#0D1933]">
                  Active requests
                </h2>
              </div>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              Search, prioritize, and coordinate hospital blood requests.
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-2xl font-black tracking-tight text-[#0D1933]">
              {filteredRequests.length}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Results
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="command-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search hospital, blood type or township"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium text-[#0D1933] outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
            />

            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenFilters}
            aria-label="Open request filters"
            className={clsx(
              "relative inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border px-3 transition",
              activeFilterCount > 0
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden text-[10px] font-black sm:inline">
              Filters
            </span>

            {activeFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[8px] font-black text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="-mx-4 mt-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
          <div className="flex min-w-max items-center gap-2 pb-0.5">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              const count = getTabCount(tab.key);

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onActiveTabChange(tab.key)}
                  className={clsx(
                    "inline-flex h-9 items-center gap-2 rounded-xl px-3 text-[10px] font-black transition",
                    active
                      ? tab.key === "CRITICAL"
                        ? "bg-red-500 text-white shadow-sm"
                        : "bg-[#0D1933] text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                  )}
                >
                  {tab.label}

                  <span
                    className={clsx(
                      "rounded-full px-1.5 py-0.5 text-[8px]",
                      active
                        ? "bg-white/15 text-white"
                        : "bg-white text-slate-400",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-[10px] font-black text-red-500 transition hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="bg-[#F8FAFC] p-3 sm:p-5">
        {dataMode === "loading" ? (
          <CommandLoadingState />
        ) : filteredRequests.length === 0 ? (
          <EmptyRequestsState onClear={onClearFilters} />
        ) : (
          <>
            <div className="grid gap-3 xl:grid-cols-2">
              {visibleRequests.map((request, index) => (
                <div
                  key={request.id}
                  className="overflow-hidden rounded-[1.5rem] ring-1 ring-slate-100"
                >
                  <RequestCard
                    request={request}
                    distanceKm={MOCK_DISTANCES[index % MOCK_DISTANCES.length]}
                    onManage={onManageRequest}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col items-center gap-2">
              <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#0D1933] transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (visibleRequests.length / filteredRequests.length) * 100,
                    )}%`,
                  }}
                />
              </div>

              <p className="text-[10px] font-semibold text-slate-400">
                Showing {visibleRequests.length} of {filteredRequests.length}{" "}
                requests
              </p>

              {hasMoreRequests && (
                <button
                  type="button"
                  onClick={onLoadMore}
                  className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-xs font-black text-[#0D1933] shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  Show more
                  <ChevronDown className="h-4 w-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
function CompactMapPanel({ stats }: { stats: RequestStats }) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-[0_14px_45px_rgba(15,23,42,0.06)]">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <MapPin className="h-4 w-4" />
          </span>

          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-red-500">
              Coverage
            </p>

            <h2 className="truncate text-sm font-black text-[#0D1933]">
              Live request map
            </h2>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.08em] text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </header>

      <div className="bg-slate-50 p-3">
        <div className="overflow-hidden rounded-[1.5rem]">
          <MapPlaceholder />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 bg-white p-3">
        <MapStat label="Critical" value={stats.critical} tone="red" />

        <MapStat label="Urgent" value={stats.urgent} tone="amber" />

        <MapStat label="Routine" value={stats.standard} tone="blue" />
      </div>
    </section>
  );
}
function MapStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "red" | "amber" | "blue";
}) {
  const styles = {
    red: {
      value: "text-red-600",
      icon: "bg-red-50",
    },
    amber: {
      value: "text-amber-600",
      icon: "bg-amber-50",
    },
    blue: {
      value: "text-blue-600",
      icon: "bg-blue-50",
    },
  };

  return (
    <article className="rounded-2xl border border-slate-100 bg-slate-50 px-2 py-3 text-center">
      <span
        className={clsx(
          "mx-auto mb-2 block h-1.5 w-6 rounded-full",
          styles[tone].icon,
        )}
      />

      <p className={clsx("text-lg font-black", styles[tone].value)}>{value}</p>

      <p className="mt-1 truncate text-[8px] font-black uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>
    </article>
  );
}
function ResponseOverview() {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] bg-[#0D1933] p-5 text-white shadow-[0_18px_50px_rgba(13,25,51,0.16)]">
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-300">
              Response capacity
            </p>

            <h2 className="mt-1 text-lg font-black">Donor network ready</h2>

            <p className="mt-1 text-[11px] leading-5 text-slate-400">
              Compatible donors are being prioritized by distance, availability,
              and blood type.
            </p>
          </div>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <Sparkles className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <DarkStatusMetric icon={Users} value="24" label="Responding" />

          <DarkStatusMetric icon={ShieldCheck} value="100%" label="Verified" />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] p-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
            <Check className="h-4 w-4" />
          </span>

          <p className="text-[10px] font-semibold leading-4 text-slate-300">
            Smart donor matching is active across all current requests.
          </p>
        </div>
      </div>
    </section>
  );
}

function DarkStatusMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <Icon className="h-4 w-4 text-emerald-300" />

      <p className="mt-2 text-lg font-black text-white">{value}</p>

      <p className="text-[8px] font-black uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function CompactActivityPanel() {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-[0_14px_45px_rgba(15,23,42,0.06)]">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Radio className="h-4 w-4" />
          </span>

          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-emerald-600">
              Activity
            </p>

            <h2 className="truncate text-sm font-black text-[#0D1933]">
              Live response feed
            </h2>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[8px] font-black text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Updating
        </span>
      </header>

      <div className="max-h-[320px] overflow-y-auto overscroll-contain">
        <LiveFeed items={MOCK_LIVE_FEED} />
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50 p-4">
        <OperationStatus
          icon={ShieldCheck}
          title="Verified"
          text="Hospital account"
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <OperationStatus
          icon={Users}
          title="24 active"
          text="Donor responses"
          iconClassName="bg-blue-50 text-blue-600"
        />
      </div>
    </section>
  );
}

function OperationStatus({
  icon: Icon,
  title,
  text,
  iconClassName,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
  iconClassName: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white bg-white p-3 shadow-sm">
      <div
        className={clsx(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          iconClassName,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[10px] font-black text-[#0D1933]">
          {title}
        </p>

        <p className="truncate text-[8px] text-slate-400">{text}</p>
      </div>
    </div>
  );
}

function RequestDetailsDrawer({
  request,
  onClose,
  onCoordinate,
}: {
  request: RequestWithDetails;
  onClose: () => void;
  onCoordinate: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const urgencyStyles = {
    CRITICAL: "bg-red-50 text-red-600 ring-red-100",
    URGENT: "bg-amber-50 text-amber-700 ring-amber-100",
    STANDARD: "bg-blue-50 text-blue-700 ring-blue-100",
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-end bg-[#07101F]/65 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-details-title"
        className="flex h-full w-full max-w-md flex-col bg-[#F3F5F9] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="relative overflow-hidden bg-[#0D1933] px-5 pb-6 pt-5 text-white">
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-red-500/20 blur-3xl"
          />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-red-300">
                <Radio className="h-3.5 w-3.5" />
                Active emergency
              </div>

              <h2
                id="request-details-title"
                className="mt-4 text-2xl font-black tracking-tight"
              >
                Request details
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Review clinical requirements before coordinating donors.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close request details"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 transition hover:bg-white/15"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <section className="relative overflow-hidden rounded-[1.75rem] border border-white bg-white p-5 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-red-100/60 blur-3xl"
            />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Blood required
                </p>

                <p className="mt-2 text-5xl font-black tracking-[-0.05em] text-[#0D1933]">
                  {request.blood_type ?? "—"}
                </p>
              </div>

              <span
                className={clsx(
                  "rounded-full px-3 py-1.5 text-[9px] font-black uppercase ring-1",
                  urgencyStyles[request.urgency],
                )}
              >
                {request.urgency}
              </span>
            </div>

            <div className="relative mt-5 grid grid-cols-2 gap-3">
              <RequestDetailMetric
                icon={Droplets}
                label="Units needed"
                value={String(request.units_needed ?? 0)}
              />

              <RequestDetailMetric
                icon={Activity}
                label="Status"
                value={String(request.status ?? "ACTIVE")}
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-white bg-white p-5 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
              Receiving facility
            </p>

            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Building2 className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#0D1933]">
                  {request.hospital?.name ?? "Verified hospital"}
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {request.township ?? "Location awaiting confirmation"}
                  </span>
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-white bg-white p-5 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
              Requester
            </p>

            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Hospital className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#0D1933]">
                  {request.requester?.full_name ?? "Emergency patient"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Contact details are protected until coordination begins.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="text-sm font-black text-emerald-950">
                  Verified hospital request
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  This request was created through an authenticated facility
                  account and is recorded for emergency coordination.
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="grid grid-cols-[0.8fr_1.2fr] gap-3 border-t border-slate-200 bg-white p-4">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onCoordinate}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-red-500 text-sm font-black text-white shadow-[0_12px_28px_rgba(239,68,68,0.25)] transition hover:bg-red-600"
          >
            <Zap className="h-4 w-4" />
            Find donors
          </button>
        </footer>
      </aside>
    </div>
  );
}

function RequestDetailMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <Icon className="h-4 w-4 text-slate-400" />

      <p className="mt-2 truncate text-sm font-black text-[#0D1933]">{value}</p>

      <p className="mt-1 text-[8px] font-black uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>
    </div>
  );
}

function CommandLoadingState() {
  return (
    <div
      className="grid animate-pulse gap-3 xl:grid-cols-2"
      aria-live="polite"
      aria-label="Loading emergency requests"
    >
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-60 rounded-[1.5rem] border border-slate-100 bg-slate-200/80"
        />
      ))}
    </div>
  );
}

function EmptyRequestsState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-lg font-black text-[#0D1933]">
        No requests match this view
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Try another urgency, blood type, township, or search keyword.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0D1933] px-5 text-sm font-bold text-white transition hover:bg-[#18294F]"
      >
        <Filter className="h-4 w-4" />
        Reset filters
      </button>
    </div>
  );
}

function FilterModal({
  filters,
  setFilters,
  onClose,
  onClear,
}: {
  filters: AdvancedFilters;
  setFilters: Dispatch<SetStateAction<AdvancedFilters>>;
  onClose: () => void;
  onClear: () => void;
}) {
  const [draftFilters, setDraftFilters] = useState<AdvancedFilters>(filters);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const applyFilters = () => {
    setFilters(draftFilters);
    onClose();
  };

  const clearDraftFilters = () => {
    setDraftFilters(INITIAL_FILTERS);
    onClear();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#07101F]/65 backdrop-blur-sm sm:items-center sm:px-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-filter-title"
        className="w-full overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-w-lg sm:rounded-[2rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="relative overflow-hidden bg-[#0D1933] px-6 pb-6 pt-5 text-white">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-500/20 blur-3xl"
          />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-red-300">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Request filters
              </div>

              <h2 id="command-filter-title" className="mt-4 text-xl font-black">
                Refine the emergency queue
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Narrow requests by blood type and township.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 transition hover:bg-white/15"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="space-y-5 p-6">
          <div>
            <label
              htmlFor="blood-type-filter"
              className="text-xs font-black text-slate-600"
            >
              Blood type
            </label>

            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {BLOOD_TYPES.map((bloodType) => {
                const active = draftFilters.bloodType === bloodType;

                return (
                  <button
                    key={bloodType}
                    type="button"
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        bloodType,
                      }))
                    }
                    className={clsx(
                      "h-10 rounded-xl border text-[10px] font-black transition",
                      active
                        ? "border-red-500 bg-red-500 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-red-200 hover:bg-red-50",
                    )}
                  >
                    {bloodType === "All" ? "All types" : bloodType}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="township-filter"
              className="text-xs font-black text-slate-600"
            >
              Township
            </label>

            <div className="relative mt-2">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="township-filter"
                type="text"
                value={draftFilters.township}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    township: event.target.value,
                  }))
                }
                placeholder="Example: Bahan"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-[#0D1933] outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={clearDraftFilters}
              className="h-12 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Clear all
            </button>

            <button
              type="button"
              onClick={applyFilters}
              className="h-12 rounded-2xl bg-red-500 text-sm font-black text-white shadow-lg shadow-red-100 transition hover:bg-red-600"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
