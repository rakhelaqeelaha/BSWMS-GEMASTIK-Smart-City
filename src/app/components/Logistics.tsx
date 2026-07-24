import { useState } from "react";
import { Truck, MapPin, Clock, CheckCircle, AlertTriangle, Plus, Navigation, Package } from "lucide-react";

const pickupData = [
  { id: "PKP001", alamat: "Jl. Merdeka No. 12, RT 03/05", kelurahan: "Kebon Kelapa", kecamatan: "Bogor Tengah", jadwal: "2026-07-24 08:00", driver: "Pak Hendra", armada: "B 1234 XY", estimasi: "12 kg", status: "selesai", catatan: "" },
  { id: "PKP002", alamat: "Jl. Sudirman No. 45, RT 07/02", kelurahan: "Gudang", kecamatan: "Bogor Tengah", jadwal: "2026-07-24 09:30", driver: "Pak Anto", armada: "B 5678 AB", estimasi: "8 kg", status: "dalam_proses", catatan: "Rumah pagar hijau" },
  { id: "PKP003", alamat: "Perumahan Griya Asri Blok C No. 7", kelurahan: "Tanah Baru", kecamatan: "Bogor Utara", jadwal: "2026-07-24 10:00", driver: "Pak Doni", armada: "B 9012 CD", estimasi: "15 kg", status: "dalam_proses", catatan: "" },
  { id: "PKP004", alamat: "Jl. Ahmad Yani No. 28", kelurahan: "Sukasari", kecamatan: "Bogor Timur", jadwal: "2026-07-24 11:00", driver: "Belum ditugaskan", armada: "-", estimasi: "20 kg", status: "terjadwal", catatan: "Hub dari bank sampah" },
  { id: "PKP005", alamat: "Jl. Pajajaran No. 100, Apt 3B", kelurahan: "Bantarjati", kecamatan: "Bogor Utara", jadwal: "2026-07-24 13:00", driver: "Pak Rudi", armada: "B 3456 EF", estimasi: "5 kg", status: "terjadwal", catatan: "" },
  { id: "PKP006", alamat: "Jl. Veteran No. 15", kelurahan: "Empang", kecamatan: "Bogor Selatan", jadwal: "2026-07-24 14:30", driver: "Belum ditugaskan", armada: "-", estimasi: "30 kg", status: "menunggu", catatan: "Pickup bulk untuk TPS" },
];

const armada = [
  { id: "ARM001", plat: "B 1234 XY", jenis: "Motor Roda 3", driver: "Pak Hendra", kapasitas: 150, status: "bertugas", lokasi: "Bogor Tengah" },
  { id: "ARM002", plat: "B 5678 AB", jenis: "Motor Roda 3", driver: "Pak Anto", kapasitas: 150, status: "bertugas", lokasi: "Bogor Tengah" },
  { id: "ARM003", plat: "B 9012 CD", jenis: "Pick Up", driver: "Pak Doni", kapasitas: 500, status: "bertugas", lokasi: "Bogor Utara" },
  { id: "ARM004", plat: "B 3456 EF", jenis: "Motor Roda 3", driver: "Pak Rudi", kapasitas: 150, status: "standby", lokasi: "Bogor Utara" },
  { id: "ARM005", plat: "B 7890 GH", jenis: "Truk Kecil", driver: "Pak Wahid", kapasitas: 1500, status: "standby", lokasi: "Pool Bogor Selatan" },
  { id: "ARM006", plat: "B 2468 IJ", jenis: "Motor Roda 3", driver: "Pak Yayan", kapasitas: 150, status: "perbaikan", lokasi: "Bengkel" },
];

const statusPickup: Record<string, { badge: string; label: string; icon: any }> = {
  selesai: { badge: "bg-green-100 text-green-700", label: "Selesai", icon: CheckCircle },
  dalam_proses: { badge: "bg-blue-100 text-blue-700", label: "Dalam Proses", icon: Navigation },
  terjadwal: { badge: "bg-purple-100 text-purple-700", label: "Terjadwal", icon: Clock },
  menunggu: { badge: "bg-amber-100 text-amber-700", label: "Menunggu Driver", icon: AlertTriangle },
  dibatalkan: { badge: "bg-red-100 text-red-600", label: "Dibatalkan", icon: AlertTriangle },
};

const statusArmada: Record<string, string> = {
  bertugas: "bg-blue-100 text-blue-700",
  standby: "bg-green-100 text-green-700",
  perbaikan: "bg-red-100 text-red-600",
};

export function Logistics() {
  const [tab, setTab] = useState<"pickup" | "armada">("pickup");

  const selesai = pickupData.filter(p => p.status === "selesai").length;
  const aktif = pickupData.filter(p => p.status === "dalam_proses").length;
  const terjadwal = pickupData.filter(p => p.status === "terjadwal").length;
  const menunggu = pickupData.filter(p => p.status === "menunggu").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Pickup & Logistik</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manajemen penjadwalan pickup dan armada pengangkutan</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus size={16} />
          Jadwalkan Pickup
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pickup Hari Ini", value: pickupData.length.toString(), sub: "Total dijadwalkan", color: "bg-blue-50 text-blue-600" },
          { label: "Selesai", value: selesai.toString(), sub: `${((selesai / pickupData.length) * 100).toFixed(0)}% dari total`, color: "bg-green-50 text-green-600" },
          { label: "Aktif Sekarang", value: aktif.toString(), sub: "Sedang berlangsung", color: "bg-purple-50 text-purple-600" },
          { label: "Menunggu Driver", value: menunggu.toString(), sub: "Perlu penugasan", color: "bg-amber-50 text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className={`text-2xl mb-1 ${s.color.split(" ")[1]}`}>{s.value}</div>
            <div className="text-sm text-gray-700">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(["pickup", "armada"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "pickup" ? "Work Order Pickup" : "Manajemen Armada"}
          </button>
        ))}
      </div>

      {tab === "pickup" && (
        <div className="space-y-3">
          {pickupData.map(p => {
            const st = statusPickup[p.status];
            const IconComp = st.icon;
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-2 rounded-lg ${st.badge} shrink-0`}>
                      <IconComp size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-800">{p.alamat}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${st.badge}`}>{st.label}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={11} />{p.kelurahan}, {p.kecamatan}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{p.jadwal}</span>
                        <span className="flex items-center gap-1"><Package size={11} />~{p.estimasi}</span>
                      </div>
                      {p.catatan && (
                        <div className="mt-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded w-fit">
                          📝 {p.catatan}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-sm text-gray-700">{p.driver}</div>
                    <div className="text-xs text-gray-400">{p.armada}</div>
                    {p.status === "menunggu" && (
                      <button className="mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition-colors">
                        Tugaskan Driver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "armada" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {armada.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">
                    {a.jenis === "Truk Kecil" ? "🚛" : a.jenis === "Pick Up" ? "🚐" : "🛺"}
                  </div>
                  <div>
                    <div className="text-sm text-gray-800">{a.plat}</div>
                    <div className="text-xs text-gray-400">{a.jenis}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusArmada[a.status]}`}>
                  {a.status === "bertugas" ? "Bertugas" : a.status === "standby" ? "Standby" : "Perbaikan"}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Driver</span>
                  <span className="text-gray-700">{a.driver}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Kapasitas</span>
                  <span className="text-gray-700">{a.kapasitas} kg</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Lokasi</span>
                  <span className="text-gray-700 flex items-center gap-1"><MapPin size={10} />{a.lokasi}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 text-xs border border-gray-200 text-gray-600 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Lihat Rute</button>
                {a.status !== "bertugas" && (
                  <button className="flex-1 text-xs bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition-colors">Tugaskan</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
