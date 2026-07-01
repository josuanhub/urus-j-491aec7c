import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Database,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/491aec7c-4945-4267-8778-b3719e15951f/api";
const UPLOAD_URL = "https://www.urusverify.com/v1/factory/project/491aec7c-4945-4267-8778-b3719e15951f/upload-data";
const HEADERS = { "x-factory-key": "factory2026" };
const PAGE_SIZE = 20;

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 ${
            t.type === "success"
              ? "bg-[#00D4AA]/10 border-[#00D4AA]/30 text-[#00D4AA]"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {t.type === "success" ? <Check size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100 shrink-0">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };
  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  return { toasts, success: (m) => add(m, "success"), error: (m) => add(m, "error"), remove };
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded-md bg-white/5 animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-end">
          <div className="h-7 w-7 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-7 w-7 rounded-lg bg-white/5 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-[#1A1A2E] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

// ── Confirm Dialog ─────────────────────────────────────────────────────────
function ConfirmDialog({ open, onClose, onConfirm, label }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-[#1A1A2E] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-white font-semibold">Confirmar eliminación</h3>
        </div>
        <p className="text-white/60 text-sm mb-6">
          ¿Estás seguro de eliminar <span className="text-white font-medium">{label}</span>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Field renderer ─────────────────────────────────────────────────────────
function FormField({ label, name, value, onChange, required }) {
  const isLong = typeof value === "string" && value.length > 80;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
        {label} {required && <span className="text-[#6C63FF]">*</span>}
      </label>
      {isLong ? (
        <textarea
          name={name}
          value={value ?? ""}
          onChange={onChange}
          rows={3}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#6C63FF]/50 focus:ring-1 focus:ring-[#6C63FF]/20 resize-none transition-all"
          placeholder={label}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value ?? ""}
          onChange={onChange}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#6C63FF]/50 focus:ring-1 focus:ring-[#6C63FF]/20 transition-all"
          placeholder={label}
        />
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Configuracion() {
  const toast = useToast();

  const [tabla, setTabla] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Discover table ───────────────────────────────────────────────────────
  useEffect(() => {
    const candidatos = ["configuracion", "configuraciones", "config", "settings", "parametros", "sistema"];
    async function discover() {
      for (const t of candidatos) {
        try {
          const res = await fetch(`${API_BASE}/${t}`, { headers: HEADERS });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) || (data && (data.data || data.results || data.items))) {
              setTabla(t);
              return;
            }
          }
        } catch (_) {}
      }
      // fallback: use first candidate
      setTabla(candidatos[0]);
    }
    discover();
  }, []);

  // ── Fetch rows ───────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!tabla) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${tabla}`, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = Array.isArray(json) ? json : (json.data || json.results || json.items || []);
      setRows(list);
      if (list.length > 0) {
        const cols = Object.keys(list[0]).filter((k) => k !== "__v");
        setColumns(cols);
      }
    } catch (e) {
      toast.error("Error al cargar los datos: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [tabla]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Filtering & pagination ───────────────────────────────────────────────
  const displayCols = columns.filter((c) => !["_id", "id", "createdAt", "updatedAt", "__v"].includes(c));
  const idKey = columns.find((c) => c === "_id" || c === "id") || "_id";

  const filtered = rows.filter((r) => {
    if (!search) return true;
    return Object.values(r).some((v) =>
      String(v ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  // ── Form helpers ─────────────────────────────────────────────────────────
  const openNew = () => {
    const empty = {};
    displayCols.forEach((c) => { empty[c] = ""; });
    setForm(empty);
    setEditRow(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (row) => {
    const filtered = {};
    displayCols.forEach((c) => { filtered[c] = row[c] ?? ""; });
    setForm(filtered);
    setEditRow(row);
    setErrors({});
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    // Require first non-id field
    if (displayCols[0] && !form[displayCols[0]]?.toString().trim()) {
      errs[displayCols[0]] = "Este campo es requerido";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const isEdit = !!editRow;
      const id = editRow?.[idKey];
      const url = isEdit ? `${API_BASE}/${tabla}/${id}` : `${API_BASE}/${tabla}`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { ...HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success(isEdit ? "Registro actualizado correctamente" : "Registro creado correctamente");
      setModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error("Error al guardar: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (row) => {
    setDeleteTarget(row);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget[idKey];
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/${tabla}/${id}`, {
        method: "DELETE",
        headers: HEADERS,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Registro eliminado correctamente");
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (e) {
      toast.error("Error al eliminar: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const formatCell = (val) => {
    if (val === null || val === undefined) return <span className="text-white/20">—</span>;
    const str = String(val);
    if (str.length > 40) return <span title={str}>{str.slice(0, 40)}…</span>;
    return str;
  };

  const getRowLabel = (row) => {
    const labelKey = displayCols.find((c) => ["nombre", "name", "titulo", "title", "clave", "key", "label"].includes(c));
    return labelKey ? row[labelKey] : row[idKey];
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Toast toasts={toast.toasts} remove={toast.remove} />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        label={deleteTarget ? getRowLabel(deleteTarget) : ""}
      />

      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20">
              <Settings size={20} className="text-[#6C63FF]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Configuración del sistema</h1>
              <p className="text-xs text-white/40 hidden sm:block">
                {tabla ? `Tabla: ${tabla}` : "Detectando tabla…"} · {filtered.length} registros
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
              title="Recargar"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-sm font-semibold transition-all shadow-lg shadow-[#6C63FF]/20"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en todos los campos…"
              className="w-full bg-[#1A1A2E] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[#6C63FF]/50 focus:ring-1 focus:ring-[#6C63FF]/20 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <SlidersHorizontal size={14} />
            <span>{columns.length} columnas · {rows.length} total</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1A1A2E] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <th key={i} className="px-4 py-3 text-left">
                        <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
                      </th>
                    ))
                  ) : (
                    displayCols.slice(0, 6).map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">
                        {col}
                      </th>
                    ))
                  )}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonRow key={i} cols={Math.min(displayCols.length, 6) || 4} />
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={(displayCols.slice(0, 6).length || 4) + 1}>
                      <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 text-white/20">
                          <Database size={32} />
                        </div>
                        <div className="text-center">
                          <p className="text-white/40 font-medium">
                            {search ? "Sin resultados para tu búsqueda" : "No hay registros aún"}
                          </p>
                          <p className="text-white/20 text-xs mt-1">
                            {search ? "Intenta con otros términos" : "Crea el primer registro con el botón Nuevo"}
                          </p>
                        </div>
                        {!search && (
                          <button
                            onClick={openNew}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C63FF]/20 text-[#6C63FF] text-sm font-medium hover:bg-[#6C63FF]/30 border border-[#6C63FF]/20 transition-all"
                          >
                            <Plus size={14} />
                            Crear primer registro
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((row, ri) => (
                    <tr
                      key={row[idKey] ?? ri}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                    >
                      {displayCols.slice(0, 6).map((col) => (
                        <td key={col} className="px-4 py-3 text-white/70 whitespace-nowrap max-w-[200px] truncate">
                          {formatCell(row[col])}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(row)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 border border-transparent hover:border-[#6C63FF]/20 transition-all"
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => confirmDelete(row)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="border-t border-white/5 px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-white/30">
                Página {page} de {totalPages} · {filtered.length} registros
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        p === page
                          ? "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/20"
                          : "text-white/40 hover:text-white border border-white/10 hover:border-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      <Modal open={modalOpen} onClose={() => !saving && setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${editRow ? "bg-[#00D4AA]/10 text-[#00D4AA]" : "bg-[#6C63FF]/10 text-[#6C63FF]"}`}>
                {editRow ? <Edit2 size={16} /> : <Plus size={16} />}
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">
                  {editRow ? "Editar registro" : "Nuevo registro"}
                </h2>
                <p className="text-white/30 text-xs">{tabla}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => !saving && setModalOpen(false)}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Fields */}
          <div className="px-6 py-5 space-y-4">
            {displayCols.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-8">No se detectaron campos para este formulario.</p>
            ) : (
              displayCols.map((col, i) => (
                <div key={col}>
                  <FormField
                    label={col}
                    name={col}
                    value={form[col] ?? ""}
                    onChange={handleChange}
                    required={i === 0}
                  />
                  {errors[col] && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertTriangle size={10} />
                      {errors[col]}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => !saving && setModalOpen(false)}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || displayCols.length === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all shadow-lg shadow-[#6C63FF]/20"
            >
              {saving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Guardando…
                </>
              ) : (
                <>
                  <Check size={14} />
                  {editRow ? "Actualizar" : "Crear"}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}