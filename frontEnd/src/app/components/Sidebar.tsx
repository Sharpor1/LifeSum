import { Home, Calendar, Settings, Sun, Moon } from "lucide-react";
import type { Screen, AppCfg } from "../types";
import { ha } from "../utils";

interface SidebarProps {
  screen: Screen;
  setScreen: (s: Screen) => void;
  cfg: AppCfg;
  upCfg: (patch: Partial<AppCfg>) => void;
  ts: string;
  sb: string;
}

export default function Sidebar({ screen, setScreen, cfg, upCfg, ts, sb }: SidebarProps) {
  const dark = cfg.isDark;
  const acc = cfg.accentColor;

  return (
    <nav className={`no-print relative z-20 w-[70px] flex flex-col items-center py-5 gap-1 ${sb} border-r border-white/10 flex-shrink-0`}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 select-none"
        style={{ backgroundColor: acc }}>
        {cfg.username.slice(0, 2).toUpperCase()}
      </div>
      {([
        { id: "dashboard" as Screen, icon: Home, label: "Inicio" },
        { id: "calendar" as Screen, icon: Calendar, label: "Cal" },
        { id: "settings" as Screen, icon: Settings, label: "Config" },
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
    </nav>
  );
}
