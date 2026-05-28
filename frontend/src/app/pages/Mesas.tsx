import { useContext, useEffect, useMemo, useState } from "react";
import { AlertCircle, ClipboardList, RefreshCw, LayoutGrid, List, Pencil, Trash2, X, Users, Tag } from "lucide-react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AuthContext } from "../contexts/AuthContext";

type Mesa = {
  id: string;
  numero: number;
  capacidade: number;
  status: "LIVRE" | "OCUPADA" | "RESERVADA" | "MANUTENCAO";
};

const statusLabels = {
  LIVRE: "Livre",
  OCUPADA: "Ocupada",
  RESERVADA: "Reservada",
  MANUTENCAO: "Manutenção",
} as const;

const statusStyles = {
  LIVRE:      { card: "border-emerald-200 bg-emerald-50",  badge: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
  OCUPADA:    { card: "border-rose-200 bg-rose-50",        badge: "bg-rose-100 text-rose-800",       dot: "bg-rose-500"    },
  RESERVADA:  { card: "border-amber-200 bg-amber-50",      badge: "bg-amber-100 text-amber-800",     dot: "bg-amber-500"   },
  MANUTENCAO: { card: "border-slate-200 bg-slate-100",     badge: "bg-slate-200 text-slate-600",     dot: "bg-slate-400"   },
} as const;

const summaryConfig = [
  {
    key: "LIVRE" as const,
    label: "Livre",
    color: {
      bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", dot2: "bg-emerald-200",
      label: "text-emerald-600", count: "text-emerald-800", bar: "bg-emerald-500",
      ring: "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-400/20",
    },
  },
  {
    key: "OCUPADA" as const,
    label: "Ocupada",
    color: {
      bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500", dot2: "bg-rose-200",
      label: "text-rose-600", count: "text-rose-800", bar: "bg-rose-500",
      ring: "border-rose-400 bg-rose-50 ring-2 ring-rose-400/20",
    },
  },
  {
    key: "RESERVADA" as const,
    label: "Reservada",
    color: {
      bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400", dot2: "bg-amber-200",
      label: "text-amber-600", count: "text-amber-800", bar: "bg-amber-400",
      ring: "border-amber-400 bg-amber-50 ring-2 ring-amber-400/20",
    },
  },
  {
    key: "MANUTENCAO" as const,
    label: "Manutenção",
    color: {
      bg: "bg-slate-50", border: "border-slate-200", dot: "bg-slate-400", dot2: "bg-slate-200",
      label: "text-slate-500", count: "text-slate-700", bar: "bg-slate-400",
      ring: "border-slate-400 bg-slate-50 ring-2 ring-slate-400/20",
    },
  },
] as const;

// ── Chair SVG helper ────────────────────────────────────────────────
function ChairIcon({ x, y, rotate, color }: { x: number; y: number; rotate: number; color: string }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate})`}>
      <rect x="-9" y="-9" width="18" height="18" rx="3.5" fill={color} />
      <rect x="-9" y="-16" width="18" height="8" rx="2.5" fill={color} opacity="0.7" />
    </g>
  );
}

const CHAIR_COLORS: Record<Mesa["status"], string> = {
  LIVRE: "#22a05a", OCUPADA: "#e83020", RESERVADA: "#e8a020", MANUTENCAO: "#9090a0",
};
const TABLE_COLOR = "#c8844a";

function buildChairs(cx: number, cy: number, n: number, tableW: number, tableH: number, endSeats: boolean) {
  const spread = 13;
  const sideSeats = endSeats ? n - 2 : n;
  const numTop = Math.ceil(sideSeats / 2);
  const numBot = Math.floor(sideSeats / 2);
  const chairs: { x: number; y: number; r: number }[] = [];
  const topStart = cx - ((numTop - 1) * spread) / 2;
  const botStart = cx - ((numBot - 1) * spread) / 2;
  for (let i = 0; i < numTop; i++) chairs.push({ x: topStart + i * spread, y: cy - tableH - 14, r: 0 });
  for (let i = 0; i < numBot; i++) chairs.push({ x: botStart + i * spread, y: cy + tableH + 14, r: 180 });
  if (endSeats) {
    chairs.push({ x: cx - tableW - 14, y: cy, r: 270 });
    chairs.push({ x: cx + tableW + 14, y: cy, r: 90 });
  }
  return chairs;
}

function TableSVG({ capacidade, status, small = false }: { capacidade: number; status: Mesa["status"]; small?: boolean }) {
  const chairColor = CHAIR_COLORS[status];

  if (small) {
    const miniCap = Math.min(capacidade, 4);
    const cx = 30, cy = 30, r = 14;
    const pos: [number, number, number][] = ([
      [cx, cy - 20, 0], [cx, cy + 20, 180], [cx - 20, cy, 270], [cx + 20, cy, 90],
    ] as [number, number, number][]).slice(0, miniCap);
    const tableShape = miniCap <= 2
      ? <circle cx={cx} cy={cy} r={r} fill={TABLE_COLOR} />
      : <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx="4" fill={TABLE_COLOR} />;
    return (
      <svg viewBox="0 0 60 60" width={48} height={48} style={{ display: "block", margin: "0 auto" }}>
        {pos.map(([x, y, rot], i) => <ChairIcon key={i} x={x} y={y} rotate={rot} color={chairColor} />)}
        {tableShape}
        {pos.map(([x, y], i) => (
          <circle key={i} cx={x + (cx - x) * 0.42} cy={y + (cy - y) * 0.42} r="2.5" fill="white" opacity="0.85" />
        ))}
      </svg>
    );
  }

  if (capacidade <= 10) {
    const cap = capacidade;
    let tableW = 20, tableH = 20, round = true, endSeats = false;
    if (cap <= 2)      { tableW = 20; tableH = 20; round = true;  endSeats = false; }
    else if (cap <= 4) { tableW = 22; tableH = 22; round = true;  endSeats = false; }
    else if (cap <= 6) { tableW = 28; tableH = 14; round = false; endSeats = true;  }
    else if (cap <= 8) { tableW = 38; tableH = 14; round = false; endSeats = true;  }
    else               { tableW = 46; tableH = 14; round = false; endSeats = true;  }
    const cx = 70, cy = 60;
    const chairs = buildChairs(cx, cy, cap, tableW, tableH, endSeats);
    const tableShape = round
      ? <circle cx={cx} cy={cy} r={tableW} fill={TABLE_COLOR} />
      : <rect x={cx - tableW} y={cy - tableH} width={tableW * 2} height={tableH * 2} rx="6" fill={TABLE_COLOR} />;
    return (
      <svg viewBox="0 0 140 120" width={140} height={110} style={{ display: "block", margin: "0 auto" }}>
        {chairs.map((c, i) => <ChairIcon key={i} x={c.x} y={c.y} rotate={c.r} color={chairColor} />)}
        {tableShape}
        {chairs.map((c, i) => (
          <circle key={i} cx={c.x + (cx - c.x) * 0.38} cy={c.y + (cy - c.y) * 0.38} r="3" fill="white" opacity="0.85" />
        ))}
      </svg>
    );
  }

  const numTables = capacidade <= 14 ? 2 : capacidade <= 17 ? 2 : 3;
  const perTable = Math.ceil(capacidade / numTables);
  const tableCounts: number[] = [];
  let remaining = capacidade;
  for (let t = 0; t < numTables; t++) { tableCounts.push(Math.min(perTable, remaining)); remaining -= perTable; }
  const tableW = 34, tableH = 13;
  const vw = numTables === 2 ? 220 : 320, vh = 130;
  const tableSpacing = numTables === 2 ? 110 : 106;
  const startX = numTables === 2 ? 55 : 53, cy = 65;
  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} width={vw} height={Math.round(vh * 0.85)} style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}>
      {tableCounts.map((n, t) => {
        const cx = startX + t * tableSpacing;
        const chairs = buildChairs(cx, cy, n, tableW, tableH, true);
        return (
          <g key={t}>
            {chairs.map((c, i) => <ChairIcon key={i} x={c.x} y={c.y} rotate={c.r} color={chairColor} />)}
            <rect x={cx - tableW} y={cy - tableH} width={tableW * 2} height={tableH * 2} rx="5" fill={TABLE_COLOR} />
            {chairs.map((c, i) => (
              <circle key={i} cx={c.x + (cx - c.x) * 0.38} cy={c.y + (cy - c.y) * 0.38} r="2.8" fill="white" opacity="0.85" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ── Loading skeleton ────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#114d77] animate-spin" style={{ animationDuration: "0.8s" }} />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">Carregando mesas...</p>
        <p className="text-xs text-muted-foreground">Sincronizando com o banco de dados</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-3xl mt-4 px-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    </div>
  );
}

// ── Delete Confirmation Modal ───────────────────────────────────────
type DeleteModalProps = {
  mesa: Mesa;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteModal({ mesa, isOpen, isLoading, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl border border-rose-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-rose-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground">Excluir Mesa {mesa.numero}?</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Esta ação é irreversível. A mesa será removida permanentemente do sistema.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ──────────────────────────────────────────────────────
type EditModalProps = {
  mesa: Mesa | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSave: (id: string, data: { capacidade: number; status: Mesa["status"] }) => void;
  onDelete: (mesa: Mesa) => void;
};

const statusOptions: { value: Mesa["status"]; label: string; dot: string }[] = [
  { value: "LIVRE",      label: "Livre",       dot: "bg-emerald-500" },
  { value: "OCUPADA",    label: "Ocupada",      dot: "bg-rose-500"    },
  { value: "RESERVADA",  label: "Reservada",    dot: "bg-amber-400"   },
  { value: "MANUTENCAO", label: "Manutenção",   dot: "bg-slate-400"   },
];

function EditModal({ mesa, isOpen, isLoading, onClose, onSave, onDelete }: EditModalProps) {
  const [capacidade, setCapacidade] = useState(mesa?.capacidade ?? 2);
  const [status, setStatus] = useState<Mesa["status"]>(mesa?.status ?? "LIVRE");

  // Sync fields when mesa changes
  useEffect(() => {
    if (mesa) {
      setCapacidade(mesa.capacidade);
      setStatus(mesa.status);
    }
  }, [mesa]);

  if (!isOpen || !mesa) return null;

  const hasChanges = capacidade !== mesa.capacidade || status !== mesa.status;

  function handleSubmit() {
    if (!mesa) return;
    onSave(mesa.id, { capacidade, status });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-border bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#114d77]/10 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-[#114d77]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Editar Mesa {mesa.numero}</h2>
              <p className="text-xs text-muted-foreground">Altere os dados da mesa abaixo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Preview */}
          <div className={`rounded-xl border p-4 flex items-center justify-center min-h-[120px] transition-colors ${statusStyles[status].card}`}>
            <TableSVG capacidade={capacidade} status={status} />
          </div>

          {/* Capacidade */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Users className="h-4 w-4 text-muted-foreground" />
              Capacidade
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCapacidade((v) => Math.max(1, v - 1))}
                disabled={capacidade <= 1}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-lg font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-foreground tabular-nums">{capacidade}</span>
                <span className="ml-1.5 text-sm text-muted-foreground">{capacidade === 1 ? "pessoa" : "pessoas"}</span>
              </div>
              <button
                type="button"
                onClick={() => setCapacidade((v) => Math.min(20, v + 1))}
                disabled={capacidade >= 20}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-lg font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            {/* Slider */}
            <input
              type="range"
              min={1}
              max={20}
              value={capacidade}
              onChange={(e) => setCapacidade(Number(e.target.value))}
              className="w-full accent-[#114d77] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>10</span>
              <span>20</span>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    status === opt.value
                      ? "border-[#114d77] bg-[#114d77]/5 text-[#114d77] ring-2 ring-[#114d77]/20"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dot}`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 pb-5 pt-1">
          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(mesa)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !hasChanges}
              className="px-5 py-2.5 rounded-xl bg-[#114d77] text-sm font-medium text-white hover:bg-[#0e3d61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────
export function Mesas() {
  const { user } = useContext(AuthContext);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState<Mesa["status"] | "ALL">("ALL");

  // Modal state
  const [editingMesa, setEditingMesa] = useState<Mesa | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [deletingMesa, setDeletingMesa] = useState<Mesa | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  async function loadMesas() {
    if (!user?.estabelecimentoId) {
      setErrorMessage("Não foi possível identificar o estabelecimento.");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await api.get("/mesas");
      setMesas(response.data.mesas ?? []);
    } catch (error) {
      console.error("Falha ao carregar mesas:", error);
      setErrorMessage("Não foi possível carregar as mesas cadastradas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadMesas(); }, [user?.estabelecimentoId]);

  // ── Edit handlers ──
  function openEditModal(mesa: Mesa) {
    setEditingMesa(mesa);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    if (isEditLoading) return;
    setIsEditModalOpen(false);
    setTimeout(() => setEditingMesa(null), 150);
  }

  async function handleSaveMesa(id: string, data: { capacidade: number; status: Mesa["status"] }) {
    try {
      setIsEditLoading(true);
      await api.put(`/mesas/${id}`, data);
      setMesas((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...data } : m)),
      );
      closeEditModal();
    } catch (error) {
      console.error("Falha ao atualizar mesa:", error);
    } finally {
      setIsEditLoading(false);
    }
  }

  // ── Delete handlers ──
  function openDeleteFromEdit(mesa: Mesa) {
    setIsEditModalOpen(false);
    setTimeout(() => {
      setDeletingMesa(mesa);
      setIsDeleteModalOpen(true);
    }, 100);
  }

  function openDeleteModal(mesa: Mesa) {
    setDeletingMesa(mesa);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    if (isDeleteLoading) return;
    setIsDeleteModalOpen(false);
    setTimeout(() => setDeletingMesa(null), 150);
  }

  async function handleDeleteMesa() {
    if (!deletingMesa) return;
    try {
      setIsDeleteLoading(true);
      await api.delete(`/mesas/${deletingMesa.id}`);
      setMesas((prev) => prev.filter((m) => m.id !== deletingMesa.id));
      closeDeleteModal();
    } catch (error) {
      console.error("Falha ao excluir mesa:", error);
    } finally {
      setIsDeleteLoading(false);
    }
  }

  const totals = useMemo(
    () => mesas.reduce(
      (acc, m) => { acc[m.status]++; return acc; },
      { LIVRE: 0, OCUPADA: 0, RESERVADA: 0, MANUTENCAO: 0 },
    ),
    [mesas],
  );

  const filteredMesas = useMemo(
    () => activeFilter === "ALL" ? mesas : mesas.filter((m) => m.status === activeFilter),
    [mesas, activeFilter],
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6 p-8">

      {/* ── Resumo ── */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#114d77]/10">
              <svg className="w-4 h-4 text-[#114d77]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </span>
            Resumo das mesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => setActiveFilter("ALL")}
              className={`relative rounded-xl border p-4 flex flex-col gap-2 md:col-span-1 overflow-hidden text-left transition-all cursor-pointer ${
                activeFilter === "ALL"
                  ? "border-[#114d77] bg-[#114d77]/5 ring-2 ring-[#114d77]/20"
                  : "border-border bg-muted/40 hover:bg-muted/60"
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-[#114d77]" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">Total</p>
              <p className="text-3xl font-bold text-foreground leading-none">{mesas.length}</p>
            </button>
            {summaryConfig.map(({ key, label, color }) => {
              const count = totals[key];
              const pct = mesas.length > 0 ? Math.round((count / mesas.length) * 100) : 0;
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFilter(isActive ? "ALL" : key)}
                  className={`relative rounded-xl border p-4 flex flex-col gap-2 overflow-hidden text-left transition-all cursor-pointer ${
                    isActive ? color.ring : `${color.bg} ${color.border} hover:brightness-[0.97]`
                  }`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${color.bar}`} />
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2.5 w-2.5">
                        {key === "OCUPADA" && count > 0 && (
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${color.dot}`} />
                        )}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color.dot}`} />
                      </span>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${color.label}`}>{label}</p>
                    </div>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${color.dot2} ${color.count}`}>{pct}%</span>
                  </div>
                  <p className={`text-3xl font-bold leading-none ${color.count}`}>{count}</p>
                  <div className={`w-full h-1.5 rounded-full ${color.dot2}`}>
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${color.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Lista de mesas ── */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ClipboardList className="h-5 w-5 text-[#114d77]" />
            {activeFilter === "ALL" ? "Lista de mesas" : `${statusLabels[activeFilter]} (${filteredMesas.length})`}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "grid" ? "bg-[#114d77] text-white" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Visualização
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "list" ? "bg-[#114d77] text-white" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <List className="h-4 w-4" />
                Lista
              </button>
            </div>
            <button
              type="button"
              onClick={loadMesas}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 mb-4">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}

          {filteredMesas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma mesa cadastrada ainda.</p>
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMesas.map((mesa) => (
                <div
                  key={mesa.id}
                  className={`group relative rounded-2xl border p-4 shadow-sm transition-transform hover:-translate-y-0.5 ${statusStyles[mesa.status].card}`}
                >
                  {/* Edit button — visible on hover */}
                  <button
                    type="button"
                    onClick={() => openEditModal(mesa)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/80 border border-border flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-[#114d77] shadow-sm"
                    title="Editar mesa"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex flex-col items-center gap-3 pt-2">
                    <TableSVG capacidade={mesa.capacidade} status={mesa.status} />
                    <div className="text-center">
                      <p className="font-bold text-foreground text-base">Mesa {mesa.numero}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {mesa.capacidade} {mesa.capacidade === 1 ? "pessoa" : "pessoas"}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[mesa.status].badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[mesa.status].dot}`} />
                      {statusLabels[mesa.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {filteredMesas.map((mesa) => (
                <div
                  key={mesa.id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted overflow-hidden">
                      <TableSVG capacidade={mesa.capacidade} status={mesa.status} small />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Mesa {mesa.numero}</p>
                      <p className="text-xs text-muted-foreground">
                        {mesa.capacidade} {mesa.capacidade === 1 ? "pessoa" : "pessoas"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[mesa.status].badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[mesa.status].dot}`} />
                      {statusLabels[mesa.status]}
                    </span>
                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => openEditModal(mesa)}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#114d77] transition-colors"
                      title="Editar mesa"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Modals ── */}
      <EditModal
        mesa={editingMesa}
        isOpen={isEditModalOpen}
        isLoading={isEditLoading}
        onClose={closeEditModal}
        onSave={handleSaveMesa}
        onDelete={openDeleteFromEdit}
      />
      {deletingMesa && (
        <DeleteModal
          mesa={deletingMesa}
          isOpen={isDeleteModalOpen}
          isLoading={isDeleteLoading}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteMesa}
        />
      )}
    </div>
  );
}
