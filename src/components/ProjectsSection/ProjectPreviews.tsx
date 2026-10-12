import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  FileText,
  Files,
  FolderKanban,
  LayoutDashboard,
  Layers,
  Loader,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Stethoscope,
  Truck,
  UserRound,
  Users,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PreviewKind = "automation" | "recruitment" | "distribution";

/*
 * Product mockups used as project preview art (no public screenshots are available).
 * Labels describe the kind of screen; figures and names are deliberately left as placeholder
 * bars so nothing reads as real project data.
 */

const CANVAS_W = 960;
const CANVAS_H = 600;

/** Renders children on a fixed 960×600 canvas scaled to the container's width. */
function FitCanvas({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / CANVAS_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

const Bar = ({ w, className = "" }: { w: number; className?: string }) => (
  <span className={`block h-[7px] rounded-full bg-white/15 ${className}`} style={{ width: w }} />
);

type Tone = "violet" | "blue" | "emerald" | "orange" | "pink";
const toneBg: Record<Tone, string> = {
  violet: "bg-gradient-to-br from-violet-500 to-indigo-500",
  blue: "bg-gradient-to-br from-sky-500 to-blue-600",
  emerald: "bg-gradient-to-br from-emerald-400 to-teal-500",
  orange: "bg-gradient-to-br from-orange-400 to-rose-500",
  pink: "bg-gradient-to-br from-fuchsia-500 to-pink-500",
};

const statusTone: Record<string, string> = {
  green: "bg-emerald-400/15 text-emerald-300",
  blue: "bg-sky-400/15 text-sky-300",
  amber: "bg-amber-400/15 text-amber-300",
  violet: "bg-violet-400/15 text-violet-200",
};

function Status({ label, tone }: { label: string; tone: keyof typeof statusTone }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-semibold ${statusTone[tone]}`}>
      <span className="size-[5px] rounded-full bg-current" />
      {label}
    </span>
  );
}

function Shell({
  app,
  nav,
  search,
  children,
}: {
  app: string;
  nav: [LucideIcon, string][];
  search: string;
  children: ReactNode;
}) {
  return (
    <div className="flex size-full bg-[#0b0e2a] font-sans text-white">
      <aside className="flex w-[176px] shrink-0 flex-col gap-1 border-r border-white/[0.06] bg-[#0e1236] px-3 py-4">
        <div className="mb-4 flex items-center gap-2.5 px-2">
          <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500">
            <Layers size={14} />
          </span>
          <span className="text-[15px] font-bold tracking-tight">{app}</span>
        </div>
        {nav.map(([Icon, label], i) => (
          <span
            key={label}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium ${
              i === 0 ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-[0_6px_16px_-6px_rgb(124_58_237/0.8)]" : "text-white/55"
            }`}
          >
            <Icon size={14} />
            {label}
          </span>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[54px] shrink-0 items-center gap-3 border-b border-white/[0.06] px-5">
          <span className="flex h-8 w-[260px] items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-[11px] text-white/35">
            <Search size={12} />
            {search}
          </span>
          <span className="ml-auto grid size-8 place-items-center rounded-lg text-white/50">
            <Bell size={15} />
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500">
            <UserRound size={14} />
          </span>
        </header>
        <main className="min-h-0 flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}

function Stats({ items }: { items: [LucideIcon, string, Tone][] }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map(([Icon, label, tone]) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] p-3">
          <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${toneBg[tone]}`}>
            <Icon size={16} />
          </span>
          <div className="min-w-0">
            <span className="block h-[13px] w-12 rounded-[3px] bg-white/70" />
            <span className="mt-1.5 block truncate text-[10px] text-white/50">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex min-h-0 flex-col rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 ${className}`}>
      <p className="mb-3 text-[13px] font-semibold">{title}</p>
      {children}
    </div>
  );
}

function Table({
  columns,
  rows,
}: {
  columns: string[];
  rows: { lead?: ReactNode; bars: number[]; status: [string, keyof typeof statusTone] }[];
}) {
  return (
    <div className="text-[10px]">
      <div className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] gap-3 border-b border-white/[0.06] pb-2 text-white/40">
        {columns.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      {rows.map(({ lead, bars, status }, i) => (
        <div
          key={i}
          className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] items-center gap-3 border-b border-white/[0.04] py-[11px] last:border-0"
        >
          <span className="flex items-center gap-2">
            {lead}
            <Bar w={bars[0]} className="bg-white/30" />
          </span>
          <Bar w={bars[1]} />
          <span>
            <Status label={status[0]} tone={status[1]} />
          </span>
          <Bar w={bars[2]} />
        </div>
      ))}
    </div>
  );
}

function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-white/55">
      {items.map(([label, color]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function AutomationPreview() {
  const fileTone = ["text-fuchsia-300", "text-sky-300", "text-orange-300", "text-emerald-300"];
  const segments: [string, number][] = [
    ["#8b5cf6", 40],
    ["#3b82f6", 25],
    ["#f97316", 20],
    ["#ec4899", 10],
    ["#94a3b8", 5],
  ];
  let offset = 0;
  return (
    <Shell
      app="AOTM"
      search="Search documents…"
      nav={[
        [LayoutDashboard, "Dashboard"],
        [Files, "Documents"],
        [FolderKanban, "Classification"],
        [Workflow, "Workflows"],
        [Layers, "Models"],
        [BarChart3, "Reports"],
        [Settings, "Settings"],
      ]}
    >
      <p className="text-[17px] font-bold">Dashboard</p>
      <p className="mt-1 mb-4 text-[11px] text-white/45">Document automation workflows</p>
      <Stats
        items={[
          [FileText, "Total Documents", "violet"],
          [CheckCircle2, "Extraction Accuracy", "pink"],
          [Workflow, "Active Workflows", "emerald"],
          [Loader, "Processing Now", "orange"],
        ]}
      />
      <div className="mt-3 grid h-[362px] grid-cols-[1.55fr_1fr] gap-3">
        <Panel title="Recent Documents">
          <Table
            columns={["Name", "Type", "Status", "Processed"]}
            rows={[0, 1, 2, 3, 4].map((i) => ({
              lead: <FileText size={13} className={fileTone[i % 4]} />,
              bars: [[80, 64, 72, 70, 58][i], [48, 62, 40, 52, 44][i], [44, 50, 46, 52, 40][i]],
              status: i === 2 ? ["Processing", "blue"] : ["Completed", "green"],
            }))}
          />
        </Panel>
        <Panel title="Document Types">
          <div className="flex flex-1 items-center gap-5">
            <svg viewBox="0 0 42 42" className="size-[130px] shrink-0 -rotate-90">
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="5" />
              {segments.map(([color, pct]) => {
                const el = (
                  <circle
                    key={color}
                    cx="21"
                    cy="21"
                    r="15.9"
                    fill="none"
                    stroke={color}
                    strokeWidth="5"
                    strokeDasharray={`${pct - 1.2} ${100 - pct + 1.2}`}
                    strokeDashoffset={-offset}
                    pathLength={100}
                  />
                );
                offset += pct;
                return el;
              })}
            </svg>
            <div className="flex flex-col gap-2.5 text-[10px] text-white/60">
              {["Invoices", "Purchase Orders", "Receipts", "Contracts", "Others"].map((label, i) => (
                <span key={label} className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: segments[i][0] }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

function RecruitmentPreview() {
  const avatars = ["from-rose-300 to-orange-400", "from-sky-300 to-indigo-400", "from-emerald-300 to-teal-500", "from-violet-300 to-fuchsia-500", "from-amber-200 to-orange-400"];
  const series = [
    [38, 22, 10],
    [52, 30, 14],
    [44, 26, 12],
    [70, 40, 18],
    [58, 36, 20],
    [86, 50, 26],
  ];
  return (
    <Shell
      app="RMS"
      search="Search candidates, jobs…"
      nav={[
        [LayoutDashboard, "Dashboard"],
        [Users, "Candidates"],
        [Briefcase, "Jobs"],
        [CalendarCheck, "Interviews"],
        [FileSignature, "Offers"],
        [BarChart3, "Reports"],
        [Settings, "Settings"],
      ]}
    >
      <Stats
        items={[
          [Users, "Total Candidates", "violet"],
          [Briefcase, "Active Jobs", "blue"],
          [CalendarCheck, "Interviews", "emerald"],
          [FileSignature, "Offers", "pink"],
        ]}
      />
      <div className="mt-3 grid h-[402px] grid-cols-[1.35fr_1fr] gap-3">
        <Panel title="Recent Candidates">
          <Table
            columns={["Name", "Position", "Status", "Applied"]}
            rows={[0, 1, 2, 3, 4, 5].map((i) => ({
              lead: <span className={`size-5 shrink-0 rounded-full bg-gradient-to-br ${avatars[i % 5]}`} />,
              bars: [[70, 58, 76, 62, 68, 54][i], [62, 50, 66, 48, 58, 52][i], [46, 46, 46, 46, 46, 46][i]],
              status: [["Shortlisted", "green"], ["Interview", "blue"], ["Pending", "amber"], ["Shortlisted", "green"], ["Interview", "blue"], ["Offer", "violet"]][i] as [string, keyof typeof statusTone],
            }))}
          />
        </Panel>
        <Panel title="Recruitment Overview">
          <div className="flex flex-1 items-end gap-3 border-b border-white/10 px-1">
            {series.map((group, i) => (
              <div key={i} className="flex h-full flex-1 items-end justify-center gap-[3px]">
                {group.map((h, j) => (
                  <span
                    key={j}
                    className={`w-[7px] rounded-t-sm ${["bg-gradient-to-t from-sky-500 to-cyan-300", "bg-gradient-to-t from-violet-600 to-violet-400", "bg-gradient-to-t from-emerald-500 to-emerald-300"][j]}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-around text-[9px] text-white/40">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="mt-3">
            <Legend items={[["Applications", "#22d3ee"], ["Interviews", "#8b5cf6"], ["Offers", "#34d399"]]} />
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

function DistributionPreview() {
  return (
    <Shell
      app="DMS"
      search="Search orders, inventory…"
      nav={[
        [LayoutDashboard, "Dashboard"],
        [Stethoscope, "Surgery Tracking"],
        [ShoppingCart, "Sales"],
        [Truck, "Logistics"],
        [Package, "Inventory"],
        [ClipboardList, "Reports"],
        [Settings, "Settings"],
      ]}
    >
      <Stats
        items={[
          [Stethoscope, "Surgeries", "blue"],
          [ShoppingCart, "Sales", "violet"],
          [Truck, "Shipments", "emerald"],
          [Package, "Inventory", "orange"],
        ]}
      />
      <div className="mt-3 grid h-[402px] grid-cols-[1.3fr_1fr] gap-3">
        <Panel title="Sales Overview">
          <div className="relative flex-1">
            <svg viewBox="0 0 300 160" preserveAspectRatio="none" className="absolute inset-0 size-full">
              <defs>
                <linearGradient id="dms-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[32, 64, 96, 128].map((y) => (
                <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="white" strokeOpacity="0.06" />
              ))}
              <path d="M0 130 L50 112 L100 118 L150 84 L200 92 L250 52 L300 30 L300 160 L0 160 Z" fill="url(#dms-fill)" />
              <path d="M0 130 L50 112 L100 118 L150 84 L200 92 L250 52 L300 30" fill="none" stroke="#a78bfa" strokeWidth="2" />
              <path d="M0 142 L50 132 L100 128 L150 110 L200 114 L250 90 L300 76" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" />
              {[
                [50, 112],
                [100, 118],
                [150, 84],
                [200, 92],
                [250, 52],
              ].map(([x, y]) => (
                <circle key={x} cx={x} cy={y} r="3" fill="#c4b5fd" />
              ))}
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-white/40">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </Panel>
        <Panel title="Recent Shipments">
          <div className="text-[10px]">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-3 border-b border-white/[0.06] pb-2 text-white/40">
              <span>Order</span>
              <span>Branch</span>
              <span>Status</span>
            </div>
            {(
              [
                ["Delivered", "green"],
                ["In Transit", "blue"],
                ["Delivered", "green"],
                ["Pending", "amber"],
                ["Delivered", "green"],
                ["In Transit", "blue"],
              ] as [string, keyof typeof statusTone][]
            ).map((status, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-3 border-b border-white/[0.04] py-[11px] last:border-0">
                <span className="flex items-center gap-2">
                  <Activity size={11} className="text-white/40" />
                  <Bar w={[46, 52, 44, 50, 48, 42][i]} className="bg-white/30" />
                </span>
                <Bar w={[54, 40, 60, 46, 52, 38][i]} />
                <Status label={status[0]} tone={status[1]} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

const previews: Record<PreviewKind, () => ReactNode> = {
  automation: AutomationPreview,
  recruitment: RecruitmentPreview,
  distribution: DistributionPreview,
};

export function ProjectPreview({ kind }: { kind: PreviewKind }) {
  const Preview = previews[kind];
  return (
    <FitCanvas>
      <Preview />
    </FitCanvas>
  );
}

