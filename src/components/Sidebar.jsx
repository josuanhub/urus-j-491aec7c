import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';

const navItems = [];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      style={{ backgroundColor: '#0A0A0F', borderColor: '#1A1A2E' }}
      className={`relative flex flex-col h-screen border-r transition-all duration-300 ease-in-out z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{ backgroundColor: '#1A1A2E', borderColor: '#6C63FF' }}
        className="absolute -right-3 top-6 z-50 flex items-center justify-center w-6 h-6 rounded-full border text-white hover:opacity-80 transition-opacity duration-200"
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} color="#6C63FF" />
        ) : (
          <ChevronLeft size={12} color="#6C63FF" />
        )}
      </button>

      {/* Logo */}
      <div
        style={{ borderColor: '#1A1A2E' }}
        className="flex items-center gap-3 px-4 py-5 border-b overflow-hidden"
      >
        <div
          style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg"
        >
          <LayoutDashboard size={16} color="#0A0A0F" />
        </div>
        <span
          className={`font-bold text-lg tracking-tight whitespace-nowrap transition-all duration-300 ${
            collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
          }`}
          style={{ color: '#6C63FF' }}
        >
          Sistema{' '}
          <span style={{ color: '#00D4AA' }}>j</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto overflow-x-hidden space-y-1">
        {navItems.length === 0 && (
          <div
            className={`text-xs px-2 py-2 whitespace-nowrap transition-all duration-300 ${
              collapsed ? 'opacity-0' : 'opacity-50'
            }`}
            style={{ color: '#6C63FF' }}
          >
            Sin secciones configuradas
          </div>
        )}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={
                isActive
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(0,212,170,0.15))',
                      borderLeft: '3px solid #6C63FF',
                    }
                  : { borderLeft: '3px solid transparent' }
              }
            >
              <span className="flex-shrink-0">
                <Icon
                  size={18}
                  color={isActive ? '#6C63FF' : undefined}
                  className={!isActive ? 'group-hover:text-white' : ''}
                />
              </span>
              <span
                className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                }`}
              >
                {item.label}
              </span>
              {/* Tooltip when collapsed */}
              {collapsed && (
                <span
                  className="absolute left-full ml-3 px-2 py-1 text-xs font-medium rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
                  style={{ backgroundColor: '#1A1A2E', color: '#fff', border: '1px solid #6C63FF' }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Company name footer */}
      <div
        style={{ borderColor: '#1A1A2E' }}
        className="border-t px-3 py-4 overflow-hidden"
      >
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: '#1A1A2E', border: '1px solid #6C63FF' }}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full"
          >
            <Building2 size={14} color="#00D4AA" />
          </div>
          <div
            className={`transition-all duration-300 ${
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            }`}
          >
            <p className="text-xs font-semibold text-white whitespace-nowrap">
              j
            </p>
            <p className="text-xs whitespace-nowrap" style={{ color: '#00D4AA' }}>
              Empresa
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}