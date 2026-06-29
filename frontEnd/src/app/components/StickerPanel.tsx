import { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, X } from "lucide-react";
import { STICKER_DEFS } from "../stickers";
import { ha } from "../utils";

interface StickerPanelProps {
  stickerPanelOpen: boolean;
  setStickerPanelOpen: (o: boolean | ((prev: boolean) => boolean)) => void;
  setDragStickerId: (id: string | null) => void;
  customStickers: { id: string; dataUrl: string; label: string }[];
  handleStickerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dark: boolean;
  acc: string;
  gc: string;
  gs: React.CSSProperties;
  ts: string;
  tp: string;
}

export default function StickerPanel({
  stickerPanelOpen, setStickerPanelOpen, setDragStickerId,
  customStickers, handleStickerUpload, dark, acc, gc, gs, ts, tp,
}: StickerPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="no-print fixed bottom-5 right-5 z-30">
      <AnimatePresence>
        {stickerPanelOpen && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute bottom-12 right-0 w-56 rounded-2xl p-3 ${gc} shadow-2xl`}
            style={{ ...gs, backgroundColor: dark ? "rgba(15,10,35,0.95)" : "rgba(255,255,255,0.95)" }}>
            <p className={`text-[11px] font-semibold ${tp} mb-2`}>Stickers — arrastra al dashboard</p>
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {STICKER_DEFS.map(({ id, label, Component }) => (
                <div key={id} draggable onDragStart={() => { setDragStickerId(id); setStickerPanelOpen(false); }}
                  className="w-9 h-9 cursor-grab hover:scale-125 transition-transform select-none" title={label}>
                  <Component />
                </div>
              ))}
              {customStickers.map(cs => (
                <div key={cs.id} draggable onDragStart={() => { setDragStickerId(cs.id); setStickerPanelOpen(false); }}
                  className="w-9 h-9 cursor-grab hover:scale-125 transition-transform select-none" title={cs.label}>
                  <img src={cs.dataUrl} className="w-full h-full object-contain rounded" alt={cs.label} />
                </div>
              ))}
            </div>
            <button onClick={() => fileInputRef.current?.click()}
              className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs border border-dashed border-white/30 ${ts} hover:text-white hover:border-white/60 cursor-pointer transition-all`}>
              <Upload size={12} /> Subir sticker
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleStickerUpload} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setStickerPanelOpen(s => !s)}
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg cursor-pointer transition-all hover:scale-110"
        style={{ backgroundColor: stickerPanelOpen ? acc : ha(acc, 0.7) }}
        title="Stickers">
        {stickerPanelOpen ? <X size={18} /> : <span className="text-xl">🎨</span>}
      </button>
    </div>
  );
}
