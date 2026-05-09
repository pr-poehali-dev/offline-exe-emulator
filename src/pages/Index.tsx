import { useState } from "react";
import Icon from "@/components/ui/icon";
import FilesTab from "@/components/FilesTab";
import PerformanceTab from "@/components/PerformanceTab";
import HistoryTab from "@/components/HistoryTab";
import SettingsTab from "@/components/SettingsTab";

type Tab = "files" | "performance" | "history" | "settings";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "files", label: "Файлы", icon: "FolderOpen" },
  { id: "performance", label: "Производительность", icon: "Activity" },
  { id: "history", label: "История", icon: "ClockArrowUp" },
  { id: "settings", label: "Настройки", icon: "SlidersHorizontal" },
];

const Index = () => {
  const [tab, setTab] = useState<Tab>("files");

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 40% at 100% 80%, rgba(139,92,246,0.1) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 0 20px rgba(59,130,246,0.35)" }}
            >
              <Icon name="Monitor" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text leading-tight">WinEmu</h1>
              <p className="text-white/30 text-xs">Эмулятор Windows-приложений</p>
            </div>
          </div>
        </header>

        <nav className="grid grid-cols-4 gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-all duration-250 text-xs font-medium
                ${tab === t.id
                  ? "tab-active text-white border-blue-500/30"
                  : "glass text-white/35 border-transparent hover:text-white/60 hover:border-white/10"
                }`}
            >
              <Icon name={t.icon} size={18} />
              <span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex-1">
          {tab === "files" && <FilesTab />}
          {tab === "performance" && <PerformanceTab />}
          {tab === "history" && <HistoryTab />}
          {tab === "settings" && <SettingsTab />}
        </div>

        <footer className="mt-8 text-center text-white/15 text-xs">
          WinEmu • Офлайн-режим активен
        </footer>
      </div>
    </div>
  );
};

export default Index;
