import { useState } from "react";
import { Search, Plus, Filter, Recycle, Users, TrendingUp, ChevronRight, X, CheckCircle, Clock, MapPin } from "lucide-react";

const bankSampahData = [
  { id: "BS001", nama: "Bank Sampah Sejahtera", kecamatan: "Bogor Tengah", kelurahan: "Kebon Kelapa", ketua: "Ibu Siti Rahayu", anggota: 342, saldo: 8450000, volume_bulan: 2840, status: "aktif", jenis_sampah: ["Plastik", "Kertas", "Logam"] },
  { id: "BS002", nama: "Bank Sampah Mandiri", kecamatan: "Bogor Timur", kelurahan: "Sindangsari", ketua: "Pak Budi Santoso", anggota: 287, saldo: 6230000, volume_bulan: 2210, status: "aktif", jenis_sampah: ["Plastik", "Kaca"] },
  { id: "BS003", nama: "Bank Sampah Berkah", kecamatan: "Bogor Selatan", kelurahan: "Pamoyanan", ketua: "Ibu Dewi Lestari", anggota: 251, saldo: 5180000, volume_bulan: 1980, status: "aktif", jenis_sampah: ["Kertas", "Logam", "Plastik"] },
  { id: "BS004", nama: "Bank Sampah Lestari", kecamatan: "Bogor Utara", kelurahan: "Tanah Baru", ketua: "Pak Ahmad Fauzi", anggota: 218, saldo: 4320000, volume_bulan: 1740, status: "aktif", jenis_sampah: ["Plastik", "Organik"] },
  { id: "BS005", nama: "Bank Sampah Hijau", kecamatan: "Tanah Sareal", kelurahan: "Kedung Jaya", ketua: "Ibu Nur Hasanah", anggota: 196, saldo: 3890000, volume_bulan: 1520, status: "aktif", jenis_sampah: ["Kertas", "Plastik"] },
  { id: "BS006", nama: "Bank Sampah Ceria", kecamatan: "Bogor Barat", kelurahan: "Sindang Barang", ketua: "Pak Wahyu Hidayat", anggota: 178, saldo: 2940000, volume_bulan: 1280, status: "nonaktif", jenis_sampah: ["Logam"] },
  { id: "BS007", nama: "Bank Sampah Mawar", kecamatan: "Bogor Tengah", kelurahan: "Sempur", ketua: "Ibu Rini Wulandari", anggota: 145, saldo: 2170000, volume_bulan: 980, status: "aktif", jenis_sampah: ["Plastik", "Kaca", "Logam"] },
  { id: "BS008", nama: "Bank Sampah Tunas", kecamatan: "Bogor Selatan", kelurahan: "Cikaret", ketua: "Pak Dedi Mulyadi", anggota: 132, saldo: 1850000, volume_bulan: 820, status: "verifikasi", jenis_sampah: ["Kertas"] },
];

const setoran = [
  { id: "SET001", nasabah: "Budi Prasetyo", bank: "Bank Sampah Sejahtera", tanggal: "2026-07-24", jenis: "Plastik", berat: 12.4, nilai: 24800, status: "selesai" },
  { id: "SET002", nasabah: "Sari Dewi", bank: "Bank Sampah Mandiri", tanggal: "2026-07-24", jenis: "Kertas", berat: 8.2, nilai: 12300, status: "diproses" },
  { id: "SET003", nasabah: "Agus Suryanto", bank: "Bank Sampah Berkah", tanggal: "2026-07-23", jenis: "Logam", berat: 5.6, nilai: 56000, status: "selesai" },
  { id: "SET004", nasabah: "Rina Maharani", bank: "Bank Sampah Lestari", tanggal: "2026-07-23", jenis: "Kaca", berat: 9.0, nilai: 9000, status: "selesai" },
  { id: "SET005", nasabah: "Yanto Wijaya", bank: "Bank Sampah Hijau", tanggal: "2026-07-22", jenis: "Plastik", berat: 15.3, nilai: 30600, status: "menunggu" },
];

const statusColor: Record<string, string> = {
  aktif: "bg-green-100 text-green-700",
  nonaktif: "bg-gray-100 text-gray-500",
  verifikasi: "bg-amber-100 text-amber-700",
  selesai: "bg-green-100 text-green-700",
  diproses: "bg-blue-100 text-blue-700",
  menunggu: "bg-amber-100 text-amber-700",
};

export function BankSampah() {
  const [tab, setTab] = useState<"daftar" | "setoran" | "nasabah">("daftar");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof bankSampahData[0] | null>(null);

  const filtered = bankSampahData.filter(bs =>
    bs.nama.toLowerCase().includes(search.toLowerCase()) ||
    bs.kecamatan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Bank Sampah</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manajemen operasional bank sampah di seluruh Kota Bogor</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus size={16} />
          Daftarkan Bank Sampah
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bank Sampah", value: "312", sub: "+8 bulan ini", icon: MapPin, color: "text-green-600 bg-green-50" },
          { label: "Total Anggota", value: "24,381", sub: "+342 bulan ini", icon: Users, color: "text-blue-600 bg-blue-50" },
          { label: "Volume Bulan Ini", value: "48.2 ton", sub: "+12% vs bulan lalu", icon: Recycle, color: "text-purple-600 bg-purple-50" },
          { label: "Total Nilai Setoran", value: "Rp 182 jt", sub: "Bulan Juli 2026", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className={`inline-flex p-2 rounded-lg ${s.color} mb-3`}>
              <s.icon size={18} />
            </div>
            <div className="text-xl text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            <div className="text-xs text-green-600 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(["daftar", "setoran", "nasabah"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors capitalize ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "daftar" ? "Daftar Bank Sampah" : t === "setoran" ? "Riwayat Setoran" : "Kelola Nasabah"}
          </button>
        ))}
      </div>

      {tab === "daftar" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama atau kecamatan..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
            </div>
            <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
              <Filter size={14} /> Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["ID", "Nama Bank Sampah", "Kecamatan", "Ketua", "Anggota", "Volume/Bln", "Saldo", "Status", ""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(bs => (
                  <tr key={bs.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">{bs.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-800">{bs.nama}</div>
                      <div className="text-xs text-gray-400">{bs.kelurahan}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{bs.kecamatan}</td>
                    <td className="px-4 py-3 text-gray-600">{bs.ketua}</td>
                    <td className="px-4 py-3 text-gray-800">{bs.anggota.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-800">{bs.volume_bulan.toLocaleString()} kg</td>
                    <td className="px-4 py-3 text-gray-800">Rp {(bs.saldo / 1000000).toFixed(1)} jt</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[bs.status]}`}>
                        {bs.status === "aktif" ? "Aktif" : bs.status === "nonaktif" ? "Nonaktif" : "Verifikasi"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(bs)} className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "setoran" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-gray-800">Riwayat Setoran Sampah</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["ID Setoran", "Nasabah", "Bank Sampah", "Tanggal", "Jenis", "Berat (kg)", "Nilai", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {setoran.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{s.id}</td>
                    <td className="px-4 py-3 text-gray-800">{s.nasabah}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{s.bank}</td>
                    <td className="px-4 py-3 text-gray-600">{s.tanggal}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">{s.jenis}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-800">{s.berat}</td>
                    <td className="px-4 py-3 text-gray-800">Rp {s.nilai.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[s.status]}`}>
                        {s.status === "selesai" ? "Selesai" : s.status === "diproses" ? "Diproses" : "Menunggu"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "nasabah" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
          <Users size={48} className="text-gray-200 mb-4" />
          <h3 className="text-gray-600">Manajemen Nasabah</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-sm">Data 24,381 nasabah terdaftar. Pilih bank sampah terlebih dahulu untuk mengelola nasabah.</p>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
            Pilih Bank Sampah
          </button>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">{selected.nama}</h2>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[selected.status]}`}>
                    {selected.status === "aktif" ? "✓ Aktif" : selected.status}
                  </span>
                  <span className="text-xs text-gray-400">{selected.id}</span>
                </div>
                {[
                  { label: "Kecamatan", value: selected.kecamatan },
                  { label: "Kelurahan", value: selected.kelurahan },
                  { label: "Ketua", value: selected.ketua },
                  { label: "Total Anggota", value: `${selected.anggota} orang` },
                  { label: "Volume Bulan Ini", value: `${selected.volume_bulan.toLocaleString()} kg` },
                  { label: "Saldo", value: `Rp ${selected.saldo.toLocaleString()}` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-3 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm text-gray-800">{item.value}</span>
                  </div>
                ))}
                <div className="py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500 block mb-2">Jenis Sampah Diterima</span>
                  <div className="flex flex-wrap gap-1">
                    {selected.jenis_sampah.map(j => (
                      <span key={j} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">{j}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                    Kelola Setoran
                  </button>
                  <button className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    Lihat Laporan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
