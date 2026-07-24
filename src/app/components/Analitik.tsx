import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, TrendingDown, Download, Calendar, Filter } from "lucide-react";

const kpiTren = [
  { bulan: "Feb", volume: 162, nasabah: 21400, transaksi: 31.2, pengaduan: 28 },
  { bulan: "Mar", volume: 178, nasabah: 22100, transaksi: 35.8, pengaduan: 22 },
  { bulan: "Apr", volume: 195, nasabah: 22800, transaksi: 40.1, pengaduan: 18 },
  { bulan: "Mei", volume: 210, nasabah: 23200, transaksi: 43.7, pengaduan: 15 },
  { bulan: "Jun", volume: 228, nasabah: 23800, transaksi: 47.2, pengaduan: 12 },
  { bulan: "Jul", volume: 244, nasabah: 24381, transaksi: 48.2, pengaduan: 19 },
];

const volumePerKecamatan = [
  { kecamatan: "Bogor Tengah", volume: 58.2, target: 60 },
  { kecamatan: "Bogor Timur", volume: 42.1, target: 45 },
  { kecamatan: "Bogor Selatan", volume: 51.7, target: 50 },
  { kecamatan: "Bogor Utara", volume: 38.4, target: 40 },
  { kecamatan: "Bogor Barat", volume: 29.8, target: 35 },
  { kecamatan: "Tanah Sareal", volume: 33.5, target: 35 },
];

const jenisTransaksi = [
  { name: "Setoran Bank Sampah", value: 45, color: "#22c55e" },
  { name: "Jual Marketplace", value: 30, color: "#3b82f6" },
  { name: "Pickup Terjadwal", value: 15, color: "#8b5cf6" },
  { name: "Lainnya", value: 10, color: "#f59e0b" },
];

const pickupPerformance = [
  { minggu: "M1 Jun", tepat: 88, terlambat: 10, gagal: 2 },
  { minggu: "M2 Jun", tepat: 91, terlambat: 7, gagal: 2 },
  { minggu: "M3 Jun", tepat: 85, terlambat: 12, gagal: 3 },
  { minggu: "M4 Jun", tepat: 93, terlambat: 6, gagal: 1 },
  { minggu: "M1 Jul", tepat: 90, terlambat: 8, gagal: 2 },
  { minggu: "M2 Jul", tepat: 94, terlambat: 5, gagal: 1 },
  { minggu: "M3 Jul", tepat: 87, terlambat: 9, gagal: 4 },
];

const topKPI = [
  { label: "Total Volume Daur Ulang", value: "244 ton", change: 7.0, unit: "bulan ini", up: true },
  { label: "Nilai Ekonomi Sampah", value: "Rp 48.2 jt", change: 2.1, unit: "bulan ini", up: false },
  { label: "Tingkat Penyelesaian Pengaduan", value: "78%", change: 5.3, unit: "vs bulan lalu", up: true },
  { label: "Rata-rata Waktu Pickup", value: "2.4 jam", change: 12.0, unit: "lebih cepat", up: true },
];

const laporanList = [
  { nama: "Laporan Bulanan Juli 2026", tipe: "PDF", ukuran: "2.4 MB", tanggal: "2026-07-24" },
  { nama: "Rekapitulasi Bank Sampah Q2 2026", tipe: "XLSX", ukuran: "1.1 MB", tanggal: "2026-07-01" },
  { nama: "Laporan Kinerja TPS 3R Juni 2026", tipe: "PDF", ukuran: "3.2 MB", tanggal: "2026-06-30" },
  { nama: "Data Transaksi Marketplace Juni 2026", tipe: "CSV", ukuran: "0.8 MB", tanggal: "2026-06-30" },
  { nama: "Analisis Pengaduan Warga Q2 2026", tipe: "PDF", ukuran: "1.7 MB", tanggal: "2026-06-30" },
];

const tipeColor: Record<string, string> = {
  PDF: "bg-red-100 text-red-600",
  XLSX: "bg-green-100 text-green-700",
  CSV: "bg-blue-100 text-blue-700",
};

export function Analitik() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Analitik & Laporan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tren kinerja dan ringkasan data operasional BSWMS LOOP</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Calendar size={14} /> Juli 2026
          </button>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <Download size={14} /> Ekspor Laporan
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topKPI.map((k) => (
          <div key={k.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-3 ${k.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {k.change}%
            </div>
            <div className="text-xl text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.unit}</div>
          </div>
        ))}
      </div>

      {/* Tren KPI Utama */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-gray-800 mb-1">Tren KPI Utama (6 Bulan Terakhir)</h3>
        <p className="text-xs text-gray-400 mb-4">Volume (ton), Nasabah Aktif, Nilai Transaksi (juta Rp)</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={kpiTren}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Line key="line-volume" type="monotone" dataKey="volume" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: "#22c55e" }} name="Volume (ton)" />
            <Line key="line-transaksi" type="monotone" dataKey="transaksi" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6" }} name="Nilai Transaksi (juta)" />
            <Line key="line-pengaduan" type="monotone" dataKey="pengaduan" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "#ef4444" }} name="Pengaduan" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volume per Kecamatan */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 mb-1">Volume per Kecamatan</h3>
          <p className="text-xs text-gray-400 mb-4">Aktual vs Target (ton/bulan)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={volumePerKecamatan} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="kecamatan" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar key="bar-volume-kec" dataKey="volume" fill="#22c55e" radius={[0, 4, 4, 0]} name="Aktual (ton)" />
              <Bar key="bar-target-kec" dataKey="target" fill="#e5e7eb" radius={[0, 4, 4, 0]} name="Target (ton)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Komposisi Transaksi */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 mb-1">Komposisi Transaksi</h3>
          <p className="text-xs text-gray-400 mb-4">Berdasarkan jenis layanan</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={jenisTransaksi} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {jenisTransaksi.map((entry, index) => (
                  <Cell key={`cell-trx-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `${val}%`} contentStyle={{ borderRadius: 8, border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {jenisTransaksi.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
                <span className="text-xs text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performa Pickup */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-gray-800 mb-1">Performa Pickup Mingguan</h3>
        <p className="text-xs text-gray-400 mb-4">Persentase tepat waktu, terlambat, dan gagal (%)</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={pickupPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="minggu" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Area key="area-tepat" type="monotone" dataKey="tepat" stroke="#22c55e" fill="#f0fdf4" strokeWidth={2} name="Tepat Waktu (%)" />
            <Area key="area-terlambat" type="monotone" dataKey="terlambat" stroke="#f59e0b" fill="#fffbeb" strokeWidth={2} name="Terlambat (%)" />
            <Area key="area-gagal" type="monotone" dataKey="gagal" stroke="#ef4444" fill="#fef2f2" strokeWidth={2} name="Gagal (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daftar Laporan */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-gray-800">Arsip Laporan</h3>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
            <Filter size={12} /> Filter
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {laporanList.map((l) => (
            <div key={l.nama} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded font-mono ${tipeColor[l.tipe]}`}>{l.tipe}</span>
                <div>
                  <div className="text-sm text-gray-800">{l.nama}</div>
                  <div className="text-xs text-gray-400">{l.tanggal} · {l.ukuran}</div>
                </div>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 px-3 py-1.5 border border-green-200 hover:bg-green-50 rounded-lg transition-colors">
                <Download size={12} /> Unduh
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
