import { useState } from "react";
import { Plus } from "lucide-react";
import type { Activity, Logro } from "../types";
import { ha } from "../utils";
import { LOGRO_ICONS } from "../constants";

interface AddLogroFormProps {
  projId: string;
  allActs: Activity[];
  acc: string; gc: string; gs: React.CSSProperties; tp: string; ts: string;
  onAdd: (l: Logro) => void;
}

export default function AddLogroForm({ projId, allActs, acc, tp, ts, onAdd }: AddLogroFormProps) {
  const projActs = allActs.filter(a => a.projectId === projId);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("🏆");
  const [hasTarget, setHasTarget] = useState(false);
  const [target, setTarget] = useState(100);
  const [triggerActId, setTriggerActId] = useState("");
  const [triggerCount, setTriggerCount] = useState(1);
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {!expanded ? (
        <button onClick={() => setExpanded(true)}
          className={`w-full py-1.5 rounded-xl text-[11px] border border-dashed border-white/20 ${ts} hover:text-white hover:border-white/40 cursor-pointer transition-all flex items-center justify-center gap-1`}>
          <Plus size={11} /> Agregar logro
        </button>
      ) : (
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex gap-1.5">
            <select value={icon} onChange={e => setIcon(e.target.value)}
              className="px-1 py-1 rounded-lg text-sm bg-white/10 text-white outline-none border border-white/15 cursor-pointer">
              {LOGRO_ICONS.map(i => <option key={i} value={i} className="bg-gray-900">{i}</option>)}
            </select>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título del logro..."
              className="flex-1 px-2 py-1 rounded-lg text-xs bg-white/10 text-white outline-none border border-white/15" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setHasTarget(!hasTarget)}
              className={`text-[10px] px-2 py-1 rounded-lg cursor-pointer border ${hasTarget ? "text-white border-transparent" : "text-white/40 border-white/15"}`}
              style={hasTarget ? { backgroundColor: ha(acc, 0.4) } : {}}>
              {hasTarget ? "✓" : "+"} Meta numérica
            </button>
            {hasTarget && (
              <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} min="1"
                className="w-20 px-2 py-1 rounded-lg text-xs bg-white/10 text-white outline-none border border-white/15" placeholder="Meta..." />
            )}
          </div>
          {projActs.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/40 flex-shrink-0">Auto al completar:</span>
              <select value={triggerActId} onChange={e => setTriggerActId(e.target.value)}
                className="flex-1 px-2 py-1 rounded-lg text-[10px] bg-white/10 text-white outline-none border border-white/15 cursor-pointer">
                <option value="" className="bg-gray-900">— ninguna —</option>
                {projActs.map(a => <option key={a.id} value={a.id} className="bg-gray-900">{a.title}</option>)}
              </select>
              {triggerActId && (
                <input type="number" value={triggerCount} onChange={e => setTriggerCount(Number(e.target.value))} min="1" max="99"
                  className="w-12 px-1 py-1 rounded-lg text-xs bg-white/10 text-white outline-none border border-white/15" />
              )}
            </div>
          )}
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                if (!title.trim()) return;
                onAdd({
                  id: `lg${Date.now()}`, title: title.trim(), icon, completed: false,
                  current: hasTarget ? 0 : undefined,
                  target: hasTarget ? target : undefined,
                  triggerActivityId: triggerActId || undefined,
                  triggerCount: triggerActId ? triggerCount : undefined,
                });
                setTitle(""); setHasTarget(false); setTriggerActId(""); setExpanded(false);
              }}
              className="flex-1 py-1.5 rounded-xl text-[11px] text-white font-medium cursor-pointer"
              style={{ backgroundColor: acc }}>Agregar</button>
            <button onClick={() => setExpanded(false)}
              className={`px-3 py-1.5 rounded-xl text-[11px] cursor-pointer border border-white/15 ${ts}`}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
