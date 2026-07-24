import { useState } from "react";
import { Package, Thermometer, Activity, Clock, CheckCircle, AlertTriangle, Plus, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fasilitasData = [
  { id: "TPS001", nama: "TPS 3R Bogor Tengah", kecamatan: "Bogor Tengah", kapasitas: 15, terpakai: 12.4, operator: "Dinas LH Bogor", status: "beroperasi", luas: 500, petugas: 8, mesin: ["Pencacah", "Kompos", "Press"] },
  { id: "TPS002", nama: "TPS 3R Bogor Timur", kecamatan: "Bogor Timur", kapasitas: 12, terpakai: 9.8, operator: "PT Bogor Bersih", status: "beroperasi", luas: 420, petugas: 6, mesin: ["Pencacah", "Kompos"] },
  { id: "TPS003", nama: "TPS 3R Bogor Selatan", kecamatan: "Bogor Selatan", kapasitas: 18, terpakai: 15.2, operator: "Dinas LH Bogor", status: "beroperasi", luas: 620, petugas: 10, mesin: ["Pencacah", "Kompos", "Press", "Biogas"] },
  { id: "TPS004", nama: "TPS 3R Tanah Sareal", kecamatan: "Tanah Sareal", kapasitas: 10, terpakai: 4.1, operator: "KSM Mandiri", status: "perbaikan", luas: 340, petugas: 4, mesin: ["Pencacah"] },
  { id: "TPS005", nama: "TPS 3R Bogor Utara", kecamatan: "Bogor Utara", kapasitas: 14, terpakai: 11.7, operator: "PT Bogor Bersih", status: "beroperasi", luas: 480, petugas: 7, mesin: ["Pencacah", "Kompos", "Press"] },
  { id: "TPS006", nama: "TPS 3R Bogor Barat", kecamatan: "Bogor Barat", kapasitas: 8, terpakai: 7.9, operator: "KSM Hijau", status: "kapasitas_penuh", luas: 280, petugas: 5, mesin: ["Pencacah", "Kompos"] },
];

const produksiHarian = [
  { jam: "06:00", masuk: 2.1, kompos: 0.8, daur_ulang: 1.1 },
  { jam: "08:00", masuk: 3.8, kompos: 1.4, daur_ulang: 2.0 },
  { jam: "10:00", masuk: 2.9, kompos: 1.1, daur_ulang: 1.5 },
  { jam: "12:00", masuk: 1.2, kompos: 0.4, daur_ulang: 0.6 },
  { jam: "14:00", masuk: 3.5, kompos: 1.3, daur_ulang: 1.8 },
  { jam: "16:00", masuk: 4.2, kompos: 1.6, daur_ulang: 2.2 },
  { jam: "18:00", masuk: 0.8, kompos: 0.3, daur_ulang: 0.4 },
];

const statusStyle: Record<string, { badge: string; label: string }> = {
  beroperasi: { badge: "bg-green-100 text-green-700", label: "Beroperasi" },
  perbaikan: { badge: "bg-amber-100 text-amber-700", label: "Perbaikan" },
  kapasitas_penuh: { badge: "bg-red-100 text-red-600", label: "Kapasitas Penuh" },
  tidak_aktif: { badge: "bg-gray-100 text-gray-500", label: "Tidak Aktif" },
};

export function TPS3R() {
  const [selected, setSelected] = useState<typeof fasilitasData[0] | null>(null);

  const totalKapasitas = fasilitasData.reduce((sum, f) => sum + f.kapasitas, 0);
  const totalTerpakai = fasilitasData.reduce((sum, f) => sum + f.terpakai, 0);
  const beroperasi = fasilitasData.filter(f => f.status === "beroperasi").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">TPS 3R</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tempat Pengolahan Sampah Reduce, Reuse, Recycle</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus size={16} />
          Tambah Fasilitas
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Fasilitas", value: "28", sub: `${beroperasi} beroperasi`, icon: Package, color: "bg-green-500" },
          { label: "Kapasitas Total", value: `${totalKapasitas} ton/hr`, sub: `${totalTerpakai.toFixed(1)} ton terpakai`, icon: Activity, color: "bg-blue-500" },
          { label: "Utilitas Rata-rata", value: `${((totalTerpakai / totalKapasitas) * 100).toFixed(0)}%`, sub: "dari kapasitas total", icon: Thermometer, color: "bg-purple-500" },
          { label: "Perlu Perhatian", value: "3", sub: "perbaikan/penuh", icon: AlertTriangle, color: "bg-amber-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-3">
            <div className={`p-2 rounded-lg ${s.color} shrink-0`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div>
              <div className="text-xl text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fasilitas List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-gray-800">Daftar Fasilitas TPS 3R</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {fasilitasData.map(f => {
              const pct = (f.terpakai / f.kapasitas) * 100;
              const st = statusStyle[f.status];
              return (
                <div key={f.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelected(f)}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm text-gray-800">{f.nama}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{f.kecamatan} · {f.petugas} petugas</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${st.badge}`}>{st.label}</span>
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-green-500"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">{f.terpakai}/{f.kapasitas} ton/hr</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {f.mesin.map(m => (
                      <span key={m} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{m}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800">Detail Fasilitas</h3>
                <button onClick={() => setSelected(null)} className="text-xs text-gray-400 hover:text-gray-600">Tutup</button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">ID</span>
                  <span className="text-xs font-mono text-gray-700">{selected.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">Luas Area</span>
                  <span className="text-xs text-gray-700">{selected.luas} m²</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">Operator</span>
                  <span className="text-xs text-gray-700">{selected.operator}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">Kapasitas</span>
                  <span className="text-xs text-gray-700">{selected.kapasitas} ton/hari</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">Utilisasi</span>
                  <span className="text-xs text-gray-700">{((selected.terpakai / selected.kapasitas) * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1.5">Peralatan</span>
                  <div className="flex flex-wrap gap-1">
                    {selected.mesin.map(m => (
                      <span key={m} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{m}</span>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Lihat Laporan Operasional
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-gray-800 mb-2">Status Fasilitas</h3>
              <div className="space-y-2">
                {Object.entries(statusStyle).map(([key, val]) => {
                  const count = fasilitasData.filter(f => f.status === key).length;
                  if (count === 0) return null;
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${val.badge}`}>{val.label}</span>
                      <span className="text-sm text-gray-800">{count} unit</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-800 mb-1">Produksi Hari Ini</h3>
            <p className="text-xs text-gray-400 mb-3">Alur masuk & olah sampah (ton)</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={produksiHarian} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="jam" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "none", fontSize: 11 }} />
                <Bar key="bar-masuk" dataKey="masuk" fill="#e5e7eb" radius={[2, 2, 0, 0]} name="Sampah Masuk" />
                <Bar key="bar-kompos" dataKey="kompos" fill="#22c55e" radius={[2, 2, 0, 0]} name="Hasil Kompos" />
                <Bar key="bar-daur" dataKey="daur_ulang" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Hasil Daur Ulang" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
