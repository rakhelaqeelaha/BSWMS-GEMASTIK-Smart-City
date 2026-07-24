import { useState, useEffect, useRef } from "react";
import {
  MapPin, Truck, RefreshCw, Eye, EyeOff, Navigation, X,
  AlertTriangle, CheckCircle, Clock, Info, Layers, ZoomIn, ZoomOut
} from "lucide-react";

type CapacityStatus = "tersedia" | "hampir_penuh" | "penuh";

interface TPS {
  id: string;
  nama: string;
  alamat: string;
  x: number; // % position on map
  y: number;
  kapasitas: number; // percentage 0-100
  status: CapacityStatus;
  jenis: string;
  jam: string;
  sampahHari: number; // kg
  telepon: string;
  lastUpdate: string;
}

interface Truk {
  id: string;
  nopol: string;
  driver: string;
  telepon: string;
  x: number;
  y: number;
  tujuan: string;
  eta: string;
  status: "beroperasi" | "menuju_tps" | "istirahat";
  muatan: number; // percentage
}

const tpsData: TPS[] = [
  { id: "TPS001", nama: "TPS 3R Bogor Tengah", alamat: "Jl. Dewi Sartika No.12", x: 52, y: 45, kapasitas: 82, status: "hampir_penuh", jenis: "3R", jam: "07:00–17:00", sampahHari: 4820, telepon: "0251-334455", lastUpdate: "5 menit lalu" },
  { id: "TPS002", nama: "TPS 3R Bogor Utara", alamat: "Jl. Pajajaran No. 88", x: 55, y: 25, kapasitas: 55, status: "tersedia", jenis: "3R", jam: "06:00–18:00", sampahHari: 3210, telepon: "0251-441122", lastUpdate: "3 menit lalu" },
  { id: "TPS003", nama: "TPS Bogor Selatan", alamat: "Jl. Raya Ciawi No. 5", x: 48, y: 72, kapasitas: 97, status: "penuh", jenis: "Konvensional", jam: "05:00–15:00", sampahHari: 5890, telepon: "0251-556677", lastUpdate: "12 menit lalu" },
  { id: "TPS004", nama: "TPS Tanah Sareal", alamat: "Jl. Baru No. 22", x: 32, y: 38, kapasitas: 43, status: "tersedia", jenis: "3R", jam: "06:00–17:00", sampahHari: 2450, telepon: "0251-778899", lastUpdate: "8 menit lalu" },
  { id: "TPS005", nama: "TPS Bogor Barat", alamat: "Jl. Sindangbarang No. 15", x: 22, y: 55, kapasitas: 68, status: "tersedia", jenis: "Konvensional", jam: "06:00–16:00", sampahHari: 3780, telepon: "0251-991100", lastUpdate: "7 menit lalu" },
  { id: "TPS006", nama: "Bank Sampah Sejahtera", alamat: "Jl. Riau No. 4", x: 62, y: 55, kapasitas: 30, status: "tersedia", jenis: "Bank Sampah", jam: "08:00–16:00", sampahHari: 1230, telepon: "0251-223344", lastUpdate: "1 menit lalu" },
  { id: "TPS007", nama: "TPS Bogor Timur", alamat: "Jl. Bina Marga No. 7", x: 74, y: 42, kapasitas: 91, status: "penuh", jenis: "Konvensional", jam: "05:00–15:00", sampahHari: 5240, telepon: "0251-667788", lastUpdate: "20 menit lalu" },
  { id: "TPS008", nama: "TPS 3R Kedung Halang", alamat: "Jl. Raya Kedung Halang No. 1", x: 63, y: 18, kapasitas: 48, status: "tersedia", jenis: "3R", jam: "07:00–17:00", sampahHari: 2180, telepon: "0251-112233", lastUpdate: "2 menit lalu" },
];

const trukData: Truk[] = [
  { id: "T001", nopol: "F 1234 LH", driver: "Sugeng", telepon: "08123456789", x: 48, y: 38, tujuan: "TPS 3R Bogor Tengah", eta: "8 menit", status: "menuju_tps", muatan: 65 },
  { id: "T002", nopol: "F 5678 LH", driver: "Wahyu", telepon: "08234567890", x: 38, y: 55, tujuan: "TPS Bogor Barat", eta: "5 menit", status: "beroperasi", muatan: 40 },
  { id: "T003", nopol: "F 9012 LH", driver: "Budi", telepon: "08345678901", x: 68, y: 35, tujuan: "TPS Bogor Timur", eta: "12 menit", status: "menuju_tps", muatan: 80 },
  { id: "T004", nopol: "F 3456 LH", driver: "Ahmad", telepon: "08456789012", x: 55, y: 62, tujuan: "—", eta: "—", status: "istirahat", muatan: 0 },
];

const kapasitasConfig: Record<CapacityStatus, { color: string; bg: string; border: string; label: string; dotColor: string; barColor: string }> = {
  tersedia: { color: "text-green-700", bg: "bg-green-100", border: "border-green-300", label: "Tersedia", dotColor: "bg-green-500", barColor: "bg-green-500" },
  hampir_penuh: { color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-300", label: "Hampir Penuh", dotColor: "bg-amber-500", barColor: "bg-amber-500" },
  penuh: { color: "text-red-700", bg: "bg-red-100", border: "border-red-300", label: "Penuh", dotColor: "bg-red-500", barColor: "bg-red-500" },
};

const trukStatusConfig = {
  beroperasi: { label: "Beroperasi", color: "bg-green-100 text-green-700" },
  menuju_tps: { label: "Menuju TPS", color: "bg-blue-100 text-blue-700" },
  istirahat: { label: "Istirahat", color: "bg-gray-100 text-gray-600" },
};

export function PetaSampah() {
  const [selectedTPS, setSelectedTPS] = useState<TPS | null>(null);
  const [selectedTruk, setSelectedTruk] = useState<Truk | null>(null);
  const [showTPS, setShowTPS] = useState(true);
  const [showTruk, setShowTruk] = useState(true);
  const [filterStatus, setFilterStatus] = useState<CapacityStatus | "semua">("semua");
  const [destination, setDestination] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Simulate truck movement
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const animOffset = (id: string) => {
    const offsets: Record<string, [number, number]> = {
      T001: [Math.sin(tick * 0.4) * 1.5, Math.cos(tick * 0.3) * 1],
      T002: [Math.cos(tick * 0.3) * 2, Math.sin(tick * 0.5) * 1.5],
      T003: [Math.sin(tick * 0.5 + 1) * 1, Math.cos(tick * 0.4 + 1) * 2],
      T004: [0, 0],
    };
    return offsets[id] || [0, 0];
  };

  const visibleTPS = tpsData.filter(t => filterStatus === "semua" || t.status === filterStatus);

  const stats = {
    tersedia: tpsData.filter(t => t.status === "tersedia").length,
    hampir_penuh: tpsData.filter(t => t.status === "hampir_penuh").length,
    penuh: tpsData.filter(t => t.status === "penuh").length,
    trukBergerak: trukData.filter(t => t.status !== "istirahat").length,
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-gray-900">Peta & Tracker Sampah</h1>
          <p className="text-sm text-gray-500 mt-0.5">Pantau kapasitas TPS dan lokasi truk pengangkut secara real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live · Update otomatis
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {[
          { label: "TPS Tersedia", value: stats.tersedia, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Hampir Penuh", value: stats.hampir_penuh, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "TPS Penuh", value: stats.penuh, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Truk Bergerak", value: stats.trukBergerak, icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-xl ${s.bg}`}><s.icon size={16} className={s.color} /></div>
            <div><div className={`text-xl ${s.color}`}>{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* MAP */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Controls */}
          <div className="flex items-center gap-2 mb-3 shrink-0 flex-wrap">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {(["semua", "tersedia", "hampir_penuh", "penuh"] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${filterStatus === s ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {s === "semua" ? "Semua TPS" : kapasitasConfig[s].label}
                </button>
              ))}
            </div>
            <button onClick={() => setShowTPS(v => !v)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-colors ${showTPS ? "bg-green-50 border-green-300 text-green-700" : "border-gray-200 text-gray-500"}`}>
              {showTPS ? <Eye size={12} /> : <EyeOff size={12} />} TPS
            </button>
            <button onClick={() => setShowTruk(v => !v)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-colors ${showTruk ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-200 text-gray-500"}`}>
              {showTruk ? <Eye size={12} /> : <EyeOff size={12} />} Truk
            </button>
            <div className="ml-auto flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"><ZoomIn size={13} /></button>
              <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))} className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"><ZoomOut size={13} /></button>
            </div>
          </div>

          {/* Map Canvas */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative" style={{ minHeight: "420px" }}>
            {/* Map background */}
            <div className="absolute inset-0 overflow-hidden" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
              {/* Grid */}
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06 }}>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6b7280" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Map background detail */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)" }} />

              {/* Road-like paths */}
              <svg className="absolute inset-0 w-full h-full">
                <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#d1d5db" strokeWidth="8" />
                <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#d1d5db" strokeWidth="8" />
                <line x1="30%" y1="0%" x2="70%" y2="100%" stroke="#e5e7eb" strokeWidth="5" />
                <line x1="70%" y1="0%" x2="30%" y2="100%" stroke="#e5e7eb" strokeWidth="5" />
                <circle cx="50%" cy="50%" r="60" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle cx="50%" cy="50%" r="100" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                {/* Park/green area */}
                <ellipse cx="50%" cy="50%" rx="30" ry="20" fill="#bbf7d0" opacity="0.4" />
                <rect x="10%" y="10%" width="15%" height="10%" rx="6" fill="#dbeafe" opacity="0.5" />
                <rect x="75%" y="65%" width="12%" height="8%" rx="6" fill="#fce7f3" opacity="0.5" />
              </svg>

              {/* Kota Bogor label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-2xl opacity-5 select-none">KOTA BOGOR</div>
              </div>

              {/* Route to destination */}
              {destination && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {(() => {
                    const tps = tpsData.find(t => t.id === destination);
                    if (!tps) return null;
                    return (
                      <line x1="50%" y1="80%" x2={`${tps.x}%`} y2={`${tps.y}%`}
                        stroke="#3b82f6" strokeWidth="3" strokeDasharray="8 4" opacity="0.7" />
                    );
                  })()}
                </svg>
              )}

              {/* TPS Markers */}
              {showTPS && visibleTPS.map(tps => {
                const cfg = kapasitasConfig[tps.status];
                const isSelected = selectedTPS?.id === tps.id;
                const isDest = destination === tps.id;
                return (
                  <button key={tps.id}
                    onClick={() => { setSelectedTPS(isSelected ? null : tps); setSelectedTruk(null); }}
                    className="absolute -translate-x-1/2 -translate-y-full group"
                    style={{ left: `${tps.x}%`, top: `${tps.y}%` }}>
                    <div className={`relative flex flex-col items-center transition-transform hover:scale-110 ${isSelected ? "scale-125 z-20" : "z-10"}`}>
                      {/* Pulse ring for penuh */}
                      {tps.status === "penuh" && (
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-400 opacity-30 animate-ping" />
                      )}
                      <div className={`w-8 h-8 rounded-full border-2 ${cfg.border} ${cfg.bg} flex items-center justify-center shadow-md ${isDest ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}>
                        <MapPin size={14} className={cfg.color} />
                      </div>
                      <div className="w-2 h-2 -mt-1 rounded-sm rotate-45 border-r border-b" style={{ borderColor: "inherit", backgroundColor: "inherit" }} />
                      <div className={`hidden group-hover:block absolute bottom-full mb-2 bg-white px-2 py-1 rounded-lg shadow-lg border border-gray-100 text-xs whitespace-nowrap z-30 ${cfg.color}`}>
                        {tps.nama} · {tps.kapasitas}%
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Truck Markers */}
              {showTruk && trukData.map(truk => {
                const [dx, dy] = animOffset(truk.id);
                const isSelected = selectedTruk?.id === truk.id;
                return (
                  <button key={truk.id}
                    onClick={() => { setSelectedTruk(isSelected ? null : truk); setSelectedTPS(null); }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-1000"
                    style={{ left: `${truk.x + dx}%`, top: `${truk.y + dy}%` }}>
                    <div className={`relative transition-transform hover:scale-110 ${isSelected ? "scale-125" : ""}`}>
                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shadow-md transition-colors ${
                        truk.status === "istirahat" ? "bg-gray-100 border-gray-300" :
                        truk.status === "menuju_tps" ? "bg-blue-100 border-blue-400" :
                        "bg-green-100 border-green-400"
                      }`}>
                        <Truck size={14} className={truk.status === "istirahat" ? "text-gray-500" : truk.status === "menuju_tps" ? "text-blue-600" : "text-green-600"} />
                      </div>
                      {truk.status !== "istirahat" && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white animate-pulse" />
                      )}
                      <div className="hidden group-hover:block absolute bottom-full mb-2 bg-gray-800 text-white px-2 py-1 rounded-lg shadow-lg text-xs whitespace-nowrap z-30">
                        {truk.nopol} · {truk.driver}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* My location */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2 z-30" style={{ left: "50%", top: "80%" }}>
                <div className="relative">
                  <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div className="absolute inset-0 bg-blue-400 rounded-full opacity-30 animate-ping scale-150" />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-xl p-3 border border-gray-100 shadow-sm text-xs space-y-1.5">
              <div className="text-gray-500 mb-1">Legenda</div>
              {Object.entries(kapasitasConfig).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${v.dotColor}`} />
                  <span className="text-gray-600">{v.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                <Truck size={10} className="text-blue-500" />
                <span className="text-gray-600">Truk Bergerak</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-gray-600">Lokasi Anda</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Detail panel */}
        <div className="w-80 flex flex-col gap-3 shrink-0">
          {/* TPS Detail */}
          {selectedTPS ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-900 text-sm">{selectedTPS.nama}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={10} />{selectedTPS.alamat}</p>
                </div>
                <button onClick={() => setSelectedTPS(null)}><X size={14} className="text-gray-400" /></button>
              </div>
              <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${kapasitasConfig[selectedTPS.status].bg} ${kapasitasConfig[selectedTPS.status].color}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${kapasitasConfig[selectedTPS.status].dotColor}`} />
                {kapasitasConfig[selectedTPS.status].label}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Kapasitas</span><span className="text-gray-800">{selectedTPS.kapasitas}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${kapasitasConfig[selectedTPS.status].barColor}`} style={{ width: `${selectedTPS.kapasitas}%` }} />
                </div>
              </div>
              {[
                { label: "Jenis TPS", value: selectedTPS.jenis },
                { label: "Jam Operasional", value: selectedTPS.jam },
                { label: "Volume Hari Ini", value: `${selectedTPS.sampahHari.toLocaleString()} kg` },
                { label: "Telepon", value: selectedTPS.telepon },
                { label: "Update Terakhir", value: selectedTPS.lastUpdate },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-xs">
                  <span className="text-gray-500">{r.label}</span>
                  <span className="text-gray-800">{r.value}</span>
                </div>
              ))}
              {selectedTPS.status === "penuh" && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-700 flex items-start gap-2">
                  <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                  TPS ini sudah penuh. Harap pilih TPS lain atau tunggu hingga diangkut.
                </div>
              )}
              <button
                onClick={() => { setDestination(destination === selectedTPS.id ? null : selectedTPS.id); }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-colors ${
                  destination === selectedTPS.id ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-green-600 text-white hover:bg-green-700"
                }`}>
                <Navigation size={14} />
                {destination === selectedTPS.id ? "Batalkan Navigasi" : "Antar ke Sini"}
              </button>
            </div>
          ) : selectedTruk ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-900 text-sm">{selectedTruk.nopol}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Driver: {selectedTruk.driver}</p>
                </div>
                <button onClick={() => setSelectedTruk(null)}><X size={14} className="text-gray-400" /></button>
              </div>
              <span className={`inline-flex text-xs px-2.5 py-1 rounded-full ${trukStatusConfig[selectedTruk.status].color}`}>
                {trukStatusConfig[selectedTruk.status].label}
              </span>
              {[
                { label: "Tujuan", value: selectedTruk.tujuan },
                { label: "ETA", value: selectedTruk.eta },
                { label: "Telepon Driver", value: selectedTruk.telepon },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-xs">
                  <span className="text-gray-500">{r.label}</span>
                  <span className="text-gray-800">{r.value}</span>
                </div>
              ))}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Muatan</span><span className="text-gray-800">{selectedTruk.muatan}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedTruk.muatan}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center text-center gap-2" style={{ minHeight: "160px" }}>
              <Info size={24} className="text-gray-200" />
              <p className="text-xs text-gray-400">Klik TPS atau truk di peta untuk melihat detail dan status</p>
            </div>
          )}

          {/* TPS List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <span className="text-sm text-gray-800">Semua TPS</span>
              <span className="text-xs text-gray-400">{tpsData.length} lokasi</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
              {tpsData.map(tps => {
                const cfg = kapasitasConfig[tps.status];
                return (
                  <div key={tps.id}
                    onClick={() => { setSelectedTPS(tps); setSelectedTruk(null); }}
                    className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dotColor} ${tps.status === "penuh" ? "animate-pulse" : ""}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-800 truncate">{tps.nama}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{tps.jenis} · {tps.jam}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-xs ${cfg.color}`}>{tps.kapasitas}%</div>
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${cfg.barColor}`} style={{ width: `${tps.kapasitas}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Truck list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <span className="text-sm text-gray-800">Armada Aktif</span>
              <span className="text-xs text-gray-400">{trukData.length} truk</span>
            </div>
            {trukData.map(truk => (
              <div key={truk.id}
                onClick={() => { setSelectedTruk(truk); setSelectedTPS(null); }}
                className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors">
                <Truck size={14} className={truk.status === "istirahat" ? "text-gray-400" : truk.status === "menuju_tps" ? "text-blue-500" : "text-green-500"} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-800">{truk.nopol} · {truk.driver}</div>
                  <div className="text-xs text-gray-400 truncate">{truk.tujuan !== "—" ? `→ ${truk.tujuan}` : "Istirahat"}</div>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${trukStatusConfig[truk.status].color}`}>
                  {truk.eta !== "—" ? truk.eta : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
