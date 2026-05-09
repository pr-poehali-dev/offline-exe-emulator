import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

interface MetricPoint {
  value: number;
  time: number;
}

const MAX_POINTS = 30;

const Sparkline = ({ data, color }: { data: MetricPoint[]; color: string }) => {
  const width = 120;
  const height = 36;
  if (data.length < 2) return null;
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values) || 1;
  const points = data.map((d, i) => {
    const x = (i / (MAX_POINTS - 1)) * width;
    const y = height - ((d.value - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="opacity-70">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const MetricCard = ({
  label, value, unit, max, color, icon, sparkData
}: {
  label: string; value: number; unit: string; max: number; color: string; icon: string; sparkData: MetricPoint[];
}) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
            <Icon name={icon} size={16} style={{ color }} />
          </div>
          <span className="text-white/50 text-sm">{label}</span>
        </div>
        <Sparkline data={sparkData} color={color} />
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-white/40 text-sm mb-1">{unit}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }}
        />
      </div>
    </div>
  );
};

const PerformanceTab = () => {
  const [fps, setFps] = useState(60);
  const [cpu, setCpu] = useState(23);
  const [ram, setRam] = useState(38);
  const [fpsData, setFpsData] = useState<MetricPoint[]>([{ value: 60, time: 0 }]);
  const [cpuData, setCpuData] = useState<MetricPoint[]>([{ value: 23, time: 0 }]);
  const [ramData, setRamData] = useState<MetricPoint[]>([{ value: 38, time: 0 }]);
  const [memScale, setMemScale] = useState<"Высокое" | "Среднее" | "Низкое">("Высокое");
  const tick = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tick.current += 1;
      const t = tick.current;

      const newFps = Math.max(20, Math.min(144, fps + Math.round((Math.random() - 0.48) * 8)));
      const newCpu = Math.max(5, Math.min(95, cpu + Math.round((Math.random() - 0.5) * 6)));
      const newRam = Math.max(10, Math.min(90, ram + Math.round((Math.random() - 0.5) * 3)));

      setFps(newFps);
      setCpu(newCpu);
      setRam(newRam);

      const push = (prev: MetricPoint[], val: number) => {
        const next = [...prev, { value: val, time: t }];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
      };
      setFpsData(p => push(p, newFps));
      setCpuData(p => push(p, newCpu));
      setRamData(p => push(p, newRam));

      if (newRam > 70) setMemScale("Низкое");
      else if (newRam > 45) setMemScale("Среднее");
      else setMemScale("Высокое");
    }, 1000);
    return () => clearInterval(interval);
  }, [fps, cpu, ram]);

  const scaleColor = memScale === "Высокое" ? "#10b981" : memScale === "Среднее" ? "#f59e0b" : "#ef4444";

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="FPS" value={fps} unit="кадр/с" max={144} color="#3b82f6" icon="Gauge" sparkData={fpsData} />
        <MetricCard label="CPU" value={cpu} unit="%" max={100} color="#8b5cf6" icon="Cpu" sparkData={cpuData} />
        <MetricCard label="RAM" value={ram} unit="%" max={100} color="#06b6d4" icon="MemoryStick" sparkData={ramData} />
      </div>

      <div className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${scaleColor}22` }}>
            <Icon name="Layers" size={18} style={{ color: scaleColor }} />
          </div>
          <div>
            <p className="text-white/50 text-sm">Адаптивное масштабирование графики</p>
            <p className="font-semibold text-white">Качество: <span style={{ color: scaleColor }}>{memScale}</span></p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/35 text-xs">Доступная RAM</p>
          <p className="text-white font-medium text-lg">{100 - ram}<span className="text-white/40 text-sm">%</span></p>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <p className="text-white/50 text-sm mb-3 flex items-center gap-2">
          <Icon name="Activity" size={15} className="text-blue-400" />
          Статус системы
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Режим эмуляции", val: "x86-64", icon: "MonitorCog" },
            { label: "DirectX", val: "12 (эмул.)", icon: "Sparkles" },
            { label: "Рендер", val: fps > 55 ? "Плавный" : fps > 30 ? "Нормальный" : "Тормоза", icon: "Film" },
            { label: "Оптимизация", val: "Авто", icon: "Zap" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-3 py-2.5">
              <Icon name={item.icon} size={14} className="text-white/30" />
              <div>
                <p className="text-white/35 text-xs">{item.label}</p>
                <p className="text-white/80 text-sm font-medium">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceTab;