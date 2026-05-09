import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

type FileType = "exe" | "apk";

interface ExeFile {
  id: string;
  name: string;
  path: string;
  size: string;
  type: FileType;
  lastRun?: string;
}

const getFileType = (name: string): FileType =>
  name.endsWith(".apk") ? "apk" : "exe";

const FilesTab = () => {
  const [files, setFiles] = useState<ExeFile[]>([
    { id: "1", name: "game_launcher.exe", path: "C:\\Games\\game_launcher.exe", size: "45.2 MB", type: "exe" },
    { id: "2", name: "setup_wizard.exe", path: "C:\\Downloads\\setup_wizard.exe", size: "128.7 MB", type: "exe" },
    { id: "3", name: "angry_birds.apk", path: "angry_birds.apk", size: "67.4 MB", type: "apk" },
  ]);
  const [dragging, setDragging] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith(".exe") || f.name.endsWith(".apk"));
    const newFiles: ExeFile[] = dropped.map(f => ({
      id: Date.now().toString() + Math.random(),
      name: f.name,
      path: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + " MB",
      type: getFileType(f.name),
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter(f => f.name.endsWith(".exe") || f.name.endsWith(".apk"));
    const newFiles: ExeFile[] = selected.map(f => ({
      id: Date.now().toString() + Math.random(),
      name: f.name,
      path: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + " MB",
      type: getFileType(f.name),
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRun = (id: string) => {
    setRunning(id);
    setTimeout(() => setRunning(null), 2000);
  };

  const handleRemove = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-300
          ${dragging
            ? "border-blue-400 bg-blue-500/10 scale-[1.01]"
            : "border-white/10 bg-white/[0.03] hover:border-blue-500/40 hover:bg-blue-500/05"
          }`}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))" }}>
          <Icon name="Upload" size={26} className="text-blue-400" />
        </div>
        <div className="text-center">
          <p className="text-white/80 font-medium">Перетащите EXE или APK-файлы сюда</p>
          <p className="text-white/40 text-sm mt-1">или нажмите для выбора файлов</p>
        </div>
        <input ref={inputRef} type="file" accept=".exe,.apk" multiple className="hidden" onChange={handleFileInput} />
      </div>

      <div className="space-y-3">
        {files.length === 0 && (
          <p className="text-center text-white/30 py-6 text-sm">Нет добавленных файлов</p>
        )}
        {files.map(file => (
          <div key={file.id} className="file-card glass rounded-2xl p-4 flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: file.type === "apk"
                  ? "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,182,212,0.25))"
                  : "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))",
              }}
            >
              <Icon
                name={file.type === "apk" ? "Smartphone" : "FileCode2"}
                size={20}
                className={file.type === "apk" ? "text-emerald-400" : "text-blue-400"}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white/90 font-medium truncate">{file.name}</p>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
                  style={{
                    background: file.type === "apk" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)",
                    color: file.type === "apk" ? "#10b981" : "#60a5fa",
                  }}
                >
                  {file.type.toUpperCase()}
                </span>
              </div>
              <p className="text-white/35 text-xs mt-0.5 truncate">{file.path}</p>
            </div>
            <span className="text-white/40 text-xs flex-shrink-0">{file.size}</span>
            <button
              onClick={() => handleRun(file.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: running === file.id
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "#fff",
                boxShadow: running === file.id ? "0 0 16px rgba(16,185,129,0.3)" : "0 0 12px rgba(59,130,246,0.25)",
              }}
            >
              <Icon name={running === file.id ? "CheckCircle" : "Play"} size={14} />
              {running === file.id ? "Запущен" : "Запуск"}
            </button>
            <button
              onClick={() => handleRemove(file.id)}
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <Icon name="Trash2" size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesTab;