import { Home, Calendar, Settings, Sun, Moon, FileText, LogOut } from "lucide-react";
import type { Screen, AppCfg } from "../types";
import { ha } from "../utils";
import { useAuth } from "../auth/AuthContext";

interface SidebarProps {
  screen: Screen;
  setScreen: (s: Screen) => void;
  cfg: AppCfg;
  upCfg: (patch: Partial<AppCfg>) => void;
  ts: string;
  sb: string;
  isDemo: boolean;
}

export default function Sidebar({ screen, setScreen, cfg, upCfg, ts, sb, isDemo }: SidebarProps) {
  const { user, logout } = useAuth();
  const dark = cfg.isDark;
  const acc = cfg.accentColor;

  return (
    <nav className={`no-print relative z-20 w-[70px] flex flex-col items-center py-5 gap-1 ${sb} border-r border-white/10 flex-shrink-0`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 select-none relative ${isDemo ? "ring-2 ring-amber-400/60" : ""}`}
        style={{ backgroundColor: isDemo ? "#d97706" : acc }}>
        {(user?.username ?? cfg.username).slice(0, 2).toUpperCase()}
        {isDemo && (
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 flex items-center justify-center text-[7px]"
            style={{ borderColor: dark ? "#1a1a2e" : "#fff" }}>
            D
          </span>
        )}
      </div>
      {([
        { id: "dashboard" as Screen, icon: Home, label: "Inicio" },
        { id: "calendar" as Screen, icon: Calendar, label: "Cal" },
        { id: "settings" as Screen, icon: Settings, label: "Config" },
        { id: "docs" as Screen, icon: FileText, label: "API" },
      ] as const).map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => setScreen(id)}
          className={`w-14 h-14 flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-all cursor-pointer ${screen === id ? "text-white" : `${ts} hover:text-white hover:bg-white/10`}`}
          style={screen === id ? { backgroundColor: ha(acc, 0.32) } : {}}>
          <Icon size={18} /><span className="text-[9px] font-semibold tracking-wide">{label}</span>
        </button>
      ))}
      <div className="flex-1" />
      <button onClick={() => upCfg({ isDark: !dark })}
        className={`w-9 h-9 rounded-full flex items-center justify-center ${ts} hover:text-white hover:bg-white/10 transition-all cursor-pointer`}>
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <button onClick={logout}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-white/10 transition-all cursor-pointer`}
        title="Cerrar sesión">
        <LogOut size={16} />
      </button>
    </nav>
  );
}
