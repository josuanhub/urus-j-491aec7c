import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Users,
  ShoppingCart,
  FileText,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
} from "lucide-react";

const API_BASE =
  "https://www.urusverify.com/v1/client/491aec7c-4945-4267-8778-b3719e15951f/api";
const HEADERS = { "x-factory-key": "factory2026" };

const TABLES = ["usuarios", "pedidos", "documentos", "transacciones"];

const TABLE_CONFIG = {
  usuarios: {
    label: "Usuarios Totales",
    icon: Users,
    color: "#6C63FF",
    bgColor: "bg-[#6C63FF]/10",
    borderColor: "border-[#6C63FF]/30",
    textColor: "text-[#6C63FF]",
  },
  pedidos: {
    label: "Pedidos Activos",
    icon: ShoppingCart,
    color: "#00D4AA",
    bgColor: "bg-[#00D4AA]/10",
    borderColor: "border-[#00D4AA]/30",
    textColor: "text-[#00D4AA]",
  },
  documentos: {
    label: "Documentos",
    icon: FileText,
    color: "#6C63FF",
    bgColor: "bg-[#6C63FF]/10",
    borderColor: "border-[#6C63FF]/30",
    textColor: "text-[#6C63FF]",
  },
  transacciones: {
    label: "Transacciones",
    icon: Activity,
    color: "#00D4AA",
    bgColor: "bg-[#00D4AA]/10",
    borderColor: "border-[#00D4AA]/30",
    textColor: "text-[#00D4AA]",
  },
};

function SkeletonCard() {
  return (
    <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-white/10 rounded-xl" />
        <div className="w-16 h-5 bg-white/10 rounded-full" />
      </div>
      <div className="w-20 h-8 bg-white/10 rounded-lg mb-2" />
      <div className="w-28 h-4 bg-white/10 rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="w-32 h-4 bg-white/10 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="w-20 h-4 bg-white/10 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="w-24 h-4 bg-white/10 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="w-16 h-6 bg-white/10 rounded-full" />
      </td>
    </tr>
  );
}

function KPICard({ table, count, trend, loading, error }) {
  const config = TABLE_CONFIG[table];
  const Icon = config.icon;
  const isPositive = trend >= 0;

  if (loading) return <SkeletonCard />;

  return (
    <div
      className={`bg-[#1A1A2E] border ${config.borderColor} rounded-2xl p-6 hover:border-opacity-60 transition-all duration-300 hover:shadow-lg hover:shadow-black/30 group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${config.bgColor} p-2.5 rounded-xl`}>
          <Icon size={20} style={{ color: config.color }} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
            isPositive
              ? "bg-[#00D4AA]/10 text-[#00D4AA]"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <XCircle size={16} />
          <span>Error al cargar</span>
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold text-white mb-1 group-hover:text-opacity-90 transition-colors">
            {count !== null ? count.toLocaleString() : "—"}
          </p>
          <p className="text-sm text-white/50 font-medium">{config.label}</p>
        </>
      )}
    </div>
  );
}

function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-amber-500/20 p-2 rounded-lg">
          <AlertTriangle size={18} className="text-amber-400" />
        </div>
        <div>
          <h3 className="text-amber-400 font-semibold text-sm">
            Alertas Críticas
          </h3>
          <p className="text-white/40 text-xs">
            {alerts.length} registro{alerts.length > 1 ? "s" : ""} urgente
            {alerts.length > 1 ? "s" : ""} detectado
            {alerts.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto custom-scroll">
        {alerts.slice(0, 5).map((alert, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl px-3 py-2"
          >
            <Zap size={14} className="text-amber-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs truncate">
                {alert.nombre ||
                  alert.titulo ||
                  alert.descripcion ||
                  `Registro #${alert.id || idx + 1}`}
              </p>
              {alert.created_at && (
                <p className="text-white/30 text-xs">
                  {new Date(alert.created_at).toLocaleDateString("es-ES")}
                </p>
              )}
            </div>
            <span className="text-amber-400 text-xs font-semibold bg-amber-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
              URGENTE
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusMap = {
    activo: { label: "Activo", class: "bg-[#00D4AA]/10 text-[#00D4AA]" },
    inactivo: { label: "Inactivo", class: "bg-white/5 text-white/40" },
    urgente: { label: "Urgente", class: "bg-amber-500/10 text-amber-400" },
    pendiente: {
      label: "Pendiente",
      class: "bg-[#6C63FF]/10 text-[#6C63FF]",
    },
    completado: { label: "Completado", class: "bg-[#00D4AA]/10 text-[#00D4AA]" },
    cancelado: { label: "Cancelado", class: "bg-red-500/10 text-red-400" },
    default: { label: status || "—", class: "bg-white/5 text-white/40" },
  };

  const s = statusMap[status?.toLowerCase()] || statusMap.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.class}`}
    >
      {s.label}
    </span>
  );
}

function ActivityTable({ data, loading }) {
  const columns = ["Nombre/Título", "Tipo", "Fecha", "Estado"];

  return (
    <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#6C63FF]/10 p-2 rounded-lg">
            <Activity size={16} className="text-[#6C63FF]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              Actividad Reciente
            </h3>
            <p className="text-white/40 text-xs">Últimos 10 registros</p>
          </div>
        </div>
        <Clock size={16} className="text-white/30" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-white/30 text-sm"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-white/10" />
                    <span>No hay actividad reciente</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-white/2 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    <span className="text-white/80 text-sm font-medium truncate max-w-[200px] block">
                      {item.nombre ||
                        item.titulo ||
                        item.descripcion ||
                        item.name ||
                        item.email ||
                        `Registro #${item.id || idx + 1}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white/40 text-xs capitalize">
                      {item.tipo || item.type || item.categoria || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white/40 text-xs">
                      {item.created_at || item.fecha || item.date
                        ? new Date(
                            item.created_at || item.fecha || item.date
                          ).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.estado || item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [kpis, setKpis] = useState({
    usuarios: null,
    pedidos: null,
    documentos: null,
    transacciones: null,
  });
  const [trends] = useState({
    usuarios: 12,
    pedidos: -3,
    documentos: 8,
    transacciones: 24,
  });
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [kpiErrors, setKpiErrors] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchKPIs = async () => {
    const errors = {};
    const results = {};
    const urgentItems = [];

    await Promise.allSettled(
      TABLES.map(async (table) => {
        try {
          const res = await fetch(`${API_BASE}/${table}`, {
            headers: HEADERS,
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const records = Array.isArray(data)
            ? data
            : data.data || data.records || data.results || [];
          results[table] = records.length;

          const urgent = records.filter(
            (r) =>
              r.estado?.toLowerCase() === "urgente" ||
              r.status?.toLowerCase() === "urgente"
          );
          urgentItems.push(...urgent);
        } catch (err) {
          errors[table] = err.message;
          results[table] = null;
        }
      })
    );

    setKpis(results);
    setKpiErrors(errors);
    setAlerts(urgentItems);
  };

  const fetchActivity = async () => {
    const allRecords = [];

    await Promise.allSettled(
      TABLES.map(async (table) => {
        try {
          const res = await fetch(`${API_BASE}/${table}`, {
            headers: HEADERS,
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const records = Array.isArray(data)
            ? data
            : data.data || data.records || data.results || [];
          records.forEach((r) => {
            allRecords.push({ ...r, _table: table });
          });
        } catch {}
      })
    );

    const sorted = allRecords.sort((a, b) => {
      const dateA = new Date(a.created_at || a.fecha || a.date || 0);
      const dateB = new Date(b.created_at || b.fecha || b.date || 0);
      return dateB - dateA;
    });

    setRecentActivity(sorted.slice(0, 10));
  };

  const loadData = async () => {
    setGlobalError(null);
    setLoadingKpis(true);
    setLoadingActivity(true);

    try {
      await Promise.all([fetchKPIs(), fetchActivity()]);
      setLastUpdated(new Date());
    } catch (err) {
      setGlobalError("Error de conexión con el servidor");
    } finally {
      setLoadingKpis(false);
      setLoadingActivity(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRecords = Object.values(kpis).reduce(
    (sum, v) => sum + (v || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-[#6C63FF]">j</span>
                <span className="text-white/20 font-light">|</span>
                <span>Dashboard</span>
              </h1>
              <p className="text-white/40 text-xs mt-0.5">
                Sistema j — Vista general del sistema
              </p>
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <p className="text-white/30 text-xs hidden sm:block">
                  Actualizado:{" "}
                  {lastUpdated.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 bg-[#1A1A2E] border border-white/10 hover:border-[#6C63FF]/40 text-white/60 hover:text-white px-3 py-2 rounded-xl text-sm transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">
                  {refreshing ? "Actualizando..." : "Actualizar"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Global Error */}
        {globalError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
            <XCircle size={20} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium text-sm">{globalError}</p>
              <p className="text-red-400/60 text-xs mt-0.5">
                Verifica la conexión con el servidor e intenta de nuevo
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="ml-auto text-red-400 hover:text-red-300 text-xs underline flex-shrink-0"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Summary Bar */}
        {!loadingKpis && (
          <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl px-6 py-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
              <span className="text-white/60 text-sm">Sistema Activo</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-[#00D4AA]" />
              <span className="text-white/60 text-sm">
                <span className="text-white font-semibold">
                  {totalRecords.toLocaleString()}
                </span>{" "}
                registros totales
              </span>
            </div>
            {alerts.length > 0 && (
              <>
                <div className="h-4 w-px bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">
                    {alerts.length} alerta{alerts.length > 1 ? "s" : ""} crítica
                    {alerts.length > 1 ? "s" : ""}
                  </span>
                </div>
              </>
            )}
            <div className="ml-auto text-xs text-white/20 hidden md:block">
              Sistema j v1.0
            </div>
          </div>
        )}

        {/* KPI Grid */}
        <div>
          <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
            Indicadores Clave
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TABLES.map((table) => (
              <KPICard
                key={table}
                table={table}
                count={kpis[table]}
                trend={trends[table]}
                loading={loadingKpis}
                error={kpiErrors[table]}
              />
            ))}
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div>
            <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
              Alertas del Sistema
            </h2>
            <AlertBanner alerts={alerts} />
          </div>
        )}

        {/* Activity Table */}
        <div>
          <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
            Actividad Reciente
          </h2>
          <ActivityTable data={recentActivity} loading={loadingActivity} />
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs">
            Sistema j — Dashboard Principal
          </p>
          <p className="text-white/20 text-xs">
            API:{" "}
            <span className="text-white/30">urusverify.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}