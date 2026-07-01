import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

// ─── Config por tipo ─────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    bar: "bg-[#00D4AA]",
    icon_color: "text-[#00D4AA]",
    border: "border-[#00D4AA]/30",
    glow: "shadow-[0_0_18px_rgba(0,212,170,0.18)]",
    label: "Éxito",
  },
  error: {
    icon: XCircle,
    bar: "bg-red-500",
    icon_color: "text-red-400",
    border: "border-red-500/30",
    glow: "shadow-[0_0_18px_rgba(239,68,68,0.18)]",
    label: "Error",
  },
  info: {
    icon: Info,
    bar: "bg-[#6C63FF]",
    icon_color: "text-[#6C63FF]",
    border: "border-[#6C63FF]/30",
    glow: "shadow-[0_0_18px_rgba(108,99,255,0.18)]",
    label: "Información",
  },
  warning: {
    icon: AlertTriangle,
    bar: "bg-amber-400",
    icon_color: "text-amber-400",
    border: "border-amber-400/30",
    glow: "shadow-[0_0_18px_rgba(251,191,36,0.18)]",
    label: "Advertencia",
  },
};

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 4000;

// ─── Toast individual ─────────────────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const cfg = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.info;
  const Icon = cfg.icon;

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    clearTimeout(timerRef.current);
    setTimeout(() => onRemove(toast.id), 350);
  }, [leaving, onRemove, toast.id]);

  useEffect(() => {
    // entrada
    const t = setTimeout(() => setVisible(true), 20);
    // auto-dismiss
    timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);

    // animate progress bar via CSS custom property
    if (progressRef.current) {
      progressRef.current.style.setProperty(
        "--duration",
        `${AUTO_DISMISS_MS}ms`
      );
    }

    return () => {
      clearTimeout(t);
      clearTimeout(timerRef.current);
    };
  }, [dismiss]);

  const base =
    "relative w-full max-w-sm pointer-events-auto flex flex-col overflow-hidden rounded-xl border bg-[#1A1A2E] transition-all duration-350 ease-out";

  const enterClass = visible && !leaving
    ? "opacity-100 translate-x-0 scale-100"
    : leaving
    ? "opacity-0 translate-x-8 scale-95"
    : "opacity-0 translate-x-8 scale-95";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`${base} ${cfg.border} ${cfg.glow} ${enterClass}`}
    >
      {/* Progress bar */}
      <div
        ref={progressRef}
        className={`absolute top-0 left-0 h-0.5 ${cfg.bar} animate-toast-progress`}
        style={{
          animationDuration: `${AUTO_DISMISS_MS}ms`,
          animationTimingFunction: "linear",
          animationFillMode: "forwards",
        }}
      />

      {/* Content */}
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Icon */}
        <span className={`mt-0.5 shrink-0 ${cfg.icon_color}`}>
          <Icon size={20} strokeWidth={2} />
        </span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${cfg.icon_color}`}>
            {cfg.label}
          </p>
          <p className="text-sm text-white/90 leading-snug break-words">
            {toast.message}
          </p>
          {toast.description && (
            <p className="text-xs text-white/50 mt-1 leading-snug">
              {toast.description}
            </p>
          )}
        </div>

        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Cerrar notificación"
          className="shrink-0 mt-0.5 text-white/30 hover:text-white/80 transition-colors duration-150 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, description, type = "info" }) => {
      setToasts((prev) => {
        const newToast = {
          id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          message,
          description,
          type,
        };
        const updated = [newToast, ...prev];
        return updated.slice(0, MAX_TOASTS);
      });
    },
    []
  );

  // Métodos cortos
  const toast = {
    success: (message, description) =>
      addToast({ message, description, type: "success" }),
    error: (message, description) =>
      addToast({ message, description, type: "error" }),
    info: (message, description) =>
      addToast({ message, description, type: "info" }),
    warning: (message, description) =>
      addToast({ message, description, type: "warning" }),
    custom: addToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Portal-like container — bottom-right */}
      <div
        aria-label="Notificaciones"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2.5 w-[calc(100vw-2rem)] sm:w-96 pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>

      {/* Keyframe injected via style tag (Tailwind JIT can't animate custom values) */}
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
        .animate-toast-progress {
          animation-name: toast-progress;
        }
        .duration-350 {
          transition-duration: 350ms;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastProvider;