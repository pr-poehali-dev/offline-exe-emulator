import { useState } from "react";
import Icon from "@/components/ui/icon";

interface ToggleSetting {
  id: string;
  label: string;
  desc: string;
  icon: string;
  value: boolean;
}

interface SliderSetting {
  id: string;
  label: string;
  desc: string;
  icon: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
  color: string;
}

const SettingsTab = () => {
  const [toggles, setToggles] = useState<ToggleSetting[]>([
    { id: "adaptive", label: "Адаптивная графика", desc: "Авто-снижение качества при нехватке RAM", icon: "Layers", value: true },
    { id: "vsync", label: "Вертикальная синхронизация", desc: "Устраняет разрывы кадров (снижает FPS)", icon: "RefreshCw", value: false },
    { id: "lowmem", label: "Режим экономии памяти", desc: "Сжатые текстуры для слабых устройств", icon: "MemoryStick", value: true },
    { id: "hwaccel", label: "Аппаратное ускорение", desc: "Использует GPU вместо CPU", icon: "Zap", value: true },
    { id: "sandbox", label: "Изолированная среда", desc: "Запуск EXE в безопасной песочнице", icon: "Shield", value: true },
  ]);

  const [sliders, setSliders] = useState<SliderSetting[]>([
    { id: "fps_limit", label: "Лимит FPS", desc: "Максимальная частота кадров", icon: "Gauge", min: 15, max: 144, step: 1, value: 60, unit: "кадр/с", color: "#3b82f6" },
    { id: "cpu_limit", label: "Лимит CPU", desc: "Максимальная нагрузка на процессор", icon: "Cpu", min: 10, max: 100, step: 5, value: 80, unit: "%", color: "#8b5cf6" },
    { id: "ram_limit", label: "Лимит RAM", desc: "Максимум памяти для эмулятора", icon: "Database", min: 256, max: 4096, step: 256, value: 2048, unit: "МБ", color: "#06b6d4" },
    { id: "render_scale", label: "Масштаб рендера", desc: "Качество отображения (50-200%)", icon: "ScanSearch", min: 50, max: 200, step: 10, value: 100, unit: "%", color: "#10b981" },
  ]);

  const toggle = (id: string) => {
    setToggles(prev => prev.map(t => t.id === id ? { ...t, value: !t.value } : t));
  };

  const setSlider = (id: string, value: number) => {
    setSliders(prev => prev.map(s => s.id === id ? { ...s, value } : s));
  };

  const resetAll = () => {
    setToggles(prev => prev.map(t => ({ ...t, value: t.id === "adaptive" || t.id === "lowmem" || t.id === "hwaccel" || t.id === "sandbox" })));
    setSliders(prev => prev.map(s => ({
      ...s,
      value: s.id === "fps_limit" ? 60 : s.id === "cpu_limit" ? 80 : s.id === "ram_limit" ? 2048 : 100,
    })));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="glass rounded-2xl p-5 space-y-1">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/60 text-sm font-medium flex items-center gap-2">
            <Icon name="ToggleRight" size={15} className="text-blue-400" />
            Функции
          </p>
        </div>
        {toggles.map((t, i) => (
          <div key={t.id}>
            <div className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: t.value ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)" }}>
                  <Icon name={t.icon} size={16} className={t.value ? "text-blue-400" : "text-white/25"} />
                </div>
                <div>
                  <p className="text-white/85 text-sm font-medium">{t.label}</p>
                  <p className="text-white/35 text-xs mt-0.5">{t.desc}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(t.id)}
                className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 ${
                  t.value ? "" : "bg-white/10"
                }`}
                style={t.value ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 0 12px rgba(59,130,246,0.35)" } : {}}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                    t.value ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            {i < toggles.length - 1 && <div className="h-px bg-white/[0.05]" />}
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5 space-y-5">
        <p className="text-white/60 text-sm font-medium flex items-center gap-2">
          <Icon name="SlidersHorizontal" size={15} className="text-violet-400" />
          Производительность
        </p>
        {sliders.map(s => (
          <div key={s.id}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon name={s.icon} size={14} style={{ color: s.color }} />
                <span className="text-white/70 text-sm">{s.label}</span>
              </div>
              <span className="text-white font-semibold text-sm" style={{ color: s.color }}>
                {s.value} <span className="text-white/40 font-normal">{s.unit}</span>
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-white/[0.07]">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
                style={{
                  width: `${((s.value - s.min) / (s.max - s.min)) * 100}%`,
                  background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
                }}
              />
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={s.value}
                onChange={e => setSlider(s.id, Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-white/20 text-xs">{s.min} {s.unit}</span>
              <span className="text-white/20 text-xs">{s.max} {s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={resetAll}
        className="w-full py-3 rounded-2xl text-sm font-medium text-white/50 glass hover:text-white/80 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Icon name="RotateCcw" size={14} />
        Сбросить настройки
      </button>
    </div>
  );
};

export default SettingsTab;
