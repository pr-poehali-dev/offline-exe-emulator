import { useState } from "react";
import Icon from "@/components/ui/icon";

interface HistoryItem {
  id: string;
  name: string;
  runAt: string;
  duration: string;
  status: "success" | "error" | "stopped";
  fps: number;
  type: "exe" | "apk";
}

const STATUS_META = {
  success: { label: "Завершён", color: "#10b981", icon: "CheckCircle" },
  error: { label: "Ошибка", color: "#ef4444", icon: "XCircle" },
  stopped: { label: "Остановлен", color: "#f59e0b", icon: "StopCircle" },
};

const INITIAL: HistoryItem[] = [
  { id: "1", name: "game_launcher.exe", runAt: "09.05.2026 14:32", duration: "1ч 23м", status: "success", fps: 58, type: "exe" },
  { id: "2", name: "angry_birds.apk", runAt: "09.05.2026 13:05", duration: "32м 10с", status: "success", fps: 55, type: "apk" },
  { id: "3", name: "setup_wizard.exe", runAt: "09.05.2026 12:10", duration: "4м 12с", status: "stopped", fps: 44, type: "exe" },
  { id: "4", name: "old_app.exe", runAt: "08.05.2026 22:45", duration: "0м 38с", status: "error", fps: 12, type: "exe" },
  { id: "5", name: "subway_surf.apk", runAt: "08.05.2026 20:14", duration: "1ч 02м", status: "success", fps: 59, type: "apk" },
  { id: "6", name: "media_player.exe", runAt: "08.05.2026 19:02", duration: "47м 05с", status: "success", fps: 60, type: "exe" },
];

const HistoryTab = () => {
  const [items, setItems] = useState<HistoryItem[]>(INITIAL);
  const [filter, setFilter] = useState<"all" | "success" | "error" | "stopped">("all");

  const filtered = filter === "all" ? items : items.filter(i => i.status === filter);

  const clearAll = () => setItems([]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(["all", "success", "error", "stopped"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                filter === f ? "tab-active text-white border border-transparent" : "glass text-white/40 hover:text-white/70"
              }`}
            >
              {f === "all" ? "Все" : STATUS_META[f].label}
            </button>
          ))}
        </div>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-red-400 transition-colors duration-200"
          >
            <Icon name="Trash2" size={13} />
            Очистить
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="glass rounded-2xl p-10 flex flex-col items-center gap-3 text-center">
          <Icon name="ClockArrowUp" size={32} className="text-white/15" />
          <p className="text-white/30 text-sm">История пуста</p>
        </div>
      )}

      <div className="space-y-2.5">
        {filtered.map(item => {
          const meta = STATUS_META[item.status];
          return (
            <div key={item.id} className="file-card glass rounded-2xl p-4 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${meta.color}18` }}
              >
                <Icon name={meta.icon} size={18} style={{ color: meta.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white/90 font-medium truncate">{item.name}</p>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
                    style={{
                      background: item.type === "apk" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)",
                      color: item.type === "apk" ? "#10b981" : "#60a5fa",
                    }}
                  >
                    {item.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-white/35 text-xs mt-0.5">{item.runAt}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white/60 text-sm">{item.duration}</p>
                <p className="text-xs mt-0.5" style={{ color: meta.color }}>{meta.label}</p>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-white/30 text-xs">FPS</p>
                <p className="text-white/70 font-semibold">{item.fps}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTab;