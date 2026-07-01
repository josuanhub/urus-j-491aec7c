import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Zap,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import ImportarDatos from "./pages/ImportarDatos";
import Configuracion from "./pages/Configuracion";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/importar-datos", label: "Importar Datos", icon: Upload },
  { path: "/configuracion", label: "Configuración", icon: Settings },
];

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-white font-bold text-lg tracking-tight leading-none">
              Sistema j
            </span>
            <span className="block text-xs mt-0.5" style={{ color: "#00D4AA" }}>
              j
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
              style={
                active
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(108,99,255,0.3), rgba(0,212,170,0.15))",
                      border: "1px solid rgba(108,99,255,0.4)",
                    }
                  : {}
              }
              title={collapsed ? label : ""}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors ${
                  active ? "" : "group-hover:text-[#6C63FF]"
                }`}
                style={active ? { color: "#6C63FF" } : {}}
              />
              {!collapsed && (
                <span className="truncate">{label}</span>
              )}
              {active && !collapsed && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#00D4AA" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="hidden md:flex px-3 py-4 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-xs">Colapsar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300 border-r border-white/10`}
        style={{
          width: collapsed ? "64px" : "220px",
          background: "#1A1A2E",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col md:hidden transition-transform duration-300 border-r border-white/10 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "240px", background: "#1A1A2E" }}
      >
        <div className="flex items-center justify-end px-3 pt-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}

function TopBar({ setMobileOpen }) {
  const location = useLocation();
  const current = NAV_ITEMS.find((n) => n.path === location.pathname);

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 h-14 border-b border-white/10"
      style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)" }}
    >
      <button
        className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2">
        {current && (
          <>
            <current.icon size={16} style={{ color: "#6C63FF" }} />
            <h1 className="text-white font-semibold text-sm md:text-base">
              {current.label}
            </h1>
          </>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{
            background: "rgba(0,212,170,0.15)",
            color: "#00D4AA",
            border: "1px solid rgba(0,212,170,0.3)",
          }}
        >
          Sistema j
        </span>
      </div>
    </header>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen w-full"
      style={{ background: "#0A0A0F", color: "#ffffff" }}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/importar-datos" element={<ImportarDatos />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        <footer
          className="text-center text-xs py-3 border-t border-white/5"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Sistema j &mdash; j &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}