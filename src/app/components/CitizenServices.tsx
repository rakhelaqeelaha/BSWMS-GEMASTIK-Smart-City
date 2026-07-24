import { useState } from "react";
import { MessageSquare, AlertCircle, CheckCircle, Clock, Plus, Search, ChevronRight, X, MapPin, Calendar, User } from "lucide-react";

const pengaduan = [
  { id: "ADU001", judul: "Tumpukan sampah di depan pasar tradisional", warga: "Budi Santoso", telp: "081234567890", lokasi: "Jl. Pasar Baru, Kel. Pasar Anyar, Bogor Tengah", tanggal: "2026-07-24", kategori: "Tumpukan Liar", prioritas: "tinggi", status: "ditinjau", petugas: "Pak Agus (Dinas LH)", foto: true },
  { id: "ADU002", judul: "Jadwal pickup sampah tidak sesuai", warga: "Siti Rahayu", telp: "082345678901", lokasi: "RT 05/03, Kel. Cimahpar", tanggal: "2026-07-23", kategori: "Layanan Pickup", prioritas: "sedang", status: "diproses", petugas: "Tim Logistik", foto: false },
  { id: "ADU003", judul: "Bank sampah tutup sudah 2 minggu", warga: "Ahmad Fauzi", telp: "083456789012", lokasi: "Bank Sampah Ceria, Kel. Sindang Barang", tanggal: "2026-07-22", kategori: "Bank Sampah", prioritas: "sedang", status: "selesai", petugas: "Koordinator Bank Sampah", foto: false },
  { id: "ADU004", judul: "Bau tidak sedap dari TPS terdekat", warga: "Dewi Lestari", telp: "084567890123", lokasi: "TPS 3R Bogor Timur, Kel. Sindangsari", tanggal: "2026-07-22", kategori: "Fasilitas TPS", prioritas: "tinggi", status: "diproses", petugas: "Operator TPS", foto: true },
  { id: "ADU005", judul: "Armada pengangkut bocor dan mencemari jalan", warga: "Wahyu Hidayat", telp: "085678901234", lokasi: "Jl. Baru No. 15, Bogor Barat", tanggal: "2026-07-21", kategori: "Armada", prioritas: "tinggi", status: "ditinjau", petugas: "Belum ditugaskan", foto: true },
  { id: "ADU006", judul: "Permintaan penambahan titik depo sampah", warga: "Nur Hasanah", telp: "086789012345", lokasi: "Komplek Perumahan Bogor Raya, Blok D", tanggal: "2026-07-20", kategori: "Saran", prioritas: "rendah", status: "selesai", petugas: "Tim Perencanaan", foto: false },
];

const layanan = [
  { id: "LAY001", nama: "Pickup Sampah Terjadwal", deskripsi: "Penjemputan sampah terpilah ke rumah warga", icon: "🚛", aktif: true },
  { id: "LAY002", nama: "Daftar Bank Sampah", deskripsi: "Daftarkan diri sebagai nasabah bank sampah", icon: "♻️", aktif: true },
  { id: "LAY003", nama: "Info Jadwal Pengangkutan", deskripsi: "Cek jadwal truk sampah di wilayah Anda", icon: "📅", aktif: true },
  { id: "LAY004", nama: "Laporan Pengaduan", deskripsi: "Laporkan masalah sampah di lingkungan Anda", icon: "📢", aktif: true },
  { id: "LAY005", nama: "Edukasi Pilah Sampah", deskripsi: "Panduan dan materi pemilahan sampah", icon: "📚", aktif: true },
  { id: "LAY006", nama: "Konsultasi Lingkungan", deskripsi: "Tanya jawab dengan petugas lingkungan", icon: "💬", aktif: false },
];

const statusStyle: Record<string, { badge: string; label: string }> = {
  ditinjau: { badge: "bg-amber-100 text-amber-700", label: "Ditinjau" },
  diproses: { badge: "bg-blue-100 text-blue-700", label: "Diproses" },
  selesai: { badge: "bg-green-100 text-green-700", label: "Selesai" },
  ditolak: { badge: "bg-red-100 text-red-600", label: "Ditolak" },
};

const prioritasStyle: Record<string, string> = {
  tinggi: "bg-red-100 text-red-600",
  sedang: "bg-amber-100 text-amber-700",
  rendah: "bg-green-100 text-green-700",
};

export function CitizenServices() {
  const [tab, setTab] = useState<"pengaduan" | "layanan">("pengaduan");
  const [selected, setSelected] = useState<typeof pengaduan[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = pengaduan.filter(p =>
    p.judul.toLowerCase().includes(search.toLowerCase()) ||
    p.warga.toLowerCase().includes(search.toLowerCase()) ||
    p.kategori.toLowerCase().includes(search.toLowerCase())
  );

  const terbuka = pengaduan.filter(p => p.status !== "selesai").length;
  const tinggi = pengaduan.filter(p => p.prioritas === "tinggi").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Layanan Warga & Pengaduan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola pengaduan dan permohonan layanan warga Kota Bogor</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus size={16} />
          Tambah Pengaduan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pengaduan", value: pengaduan.length.toString(), sub: "Bulan Juli 2026", icon: MessageSquare, color: "bg-blue-500" },
          { label: "Belum Selesai", value: terbuka.toString(), sub: "Perlu tindak lanjut", icon: Clock, color: "bg-amber-500" },
          { label: "Prioritas Tinggi", value: tinggi.toString(), sub: "Butuh respons cepat", icon: AlertCircle, color: "bg-red-500" },
          { label: "Sudah Selesai", value: (pengaduan.length - terbuka).toString(), sub: `${(((pengaduan.length - terbuka) / pengaduan.length) * 100).toFixed(0)}% tingkat penyelesaian`, icon: CheckCircle, color: "bg-green-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-3">
            <div className={`p-2 rounded-lg ${s.color} shrink-0`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div>
              <div className="text-xl text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-700">{s.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(["pengaduan", "layanan"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "pengaduan" ? "Pengaduan Warga" : "Katalog Layanan"}
          </button>
        ))}
      </div>

      {tab === "pengaduan" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari pengaduan, nama warga, atau kategori..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
            </div>
            {filtered.map(p => {
              const st = statusStyle[p.status];
              return (
                <div key={p.id}
                  onClick={() => setSelected(p)}
                  className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all ${selected?.id === p.id ? "border-green-300 ring-2 ring-green-100" : "border-gray-100"}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${prioritasStyle[p.prioritas]}`}>
                        {p.prioritas === "tinggi" ? "🔴 Tinggi" : p.prioritas === "sedang" ? "🟡 Sedang" : "🟢 Rendah"}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.kategori}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${st.badge}`}>{st.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 shrink-0 mt-0.5" />
                  </div>
                  <h4 className="text-sm text-gray-800 mb-1">{p.judul}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><User size={11} />{p.warga}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />{p.tanggal}</span>
                    {p.foto && <span className="text-blue-500">📷 Ada foto</span>}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <MapPin size={11} />{p.lokasi.substring(0, 60)}...
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          <div>
            {selected ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-800">Detail Pengaduan</h3>
                  <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className={`inline-flex text-xs px-2 py-0.5 rounded-full mb-2 ${statusStyle[selected.status].badge}`}>
                      {statusStyle[selected.status].label}
                    </div>
                    <p className="text-sm text-gray-800">{selected.judul}</p>
                  </div>
                  {[
                    { label: "ID", value: selected.id },
                    { label: "Warga", value: selected.warga },
                    { label: "Telepon", value: selected.telp },
                    { label: "Kategori", value: selected.kategori },
                    { label: "Prioritas", value: selected.prioritas.charAt(0).toUpperCase() + selected.prioritas.slice(1) },
                    { label: "Tanggal", value: selected.tanggal },
                    { label: "Petugas", value: selected.petugas },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500">{item.label}</span>
                      <span className="text-xs text-gray-700 text-right max-w-[60%]">{item.value}</span>
                    </div>
                  ))}
                  <div className="py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500 block mb-1">Lokasi</span>
                    <span className="text-xs text-gray-700">{selected.lokasi}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    {selected.status !== "selesai" && (
                      <button className="flex-1 bg-green-600 text-white py-1.5 rounded-lg text-xs hover:bg-green-700 transition-colors">
                        Tandai Selesai
                      </button>
                    )}
                    <button className="flex-1 border border-gray-200 text-gray-600 py-1.5 rounded-lg text-xs hover:bg-gray-50 transition-colors">
                      Balas Warga
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <MessageSquare size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Klik pengaduan untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "layanan" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {layanan.map(l => (
            <div key={l.id} className={`bg-white rounded-xl border shadow-sm p-5 ${l.aktif ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{l.icon}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${l.aktif ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {l.aktif ? "Aktif" : "Segera Hadir"}
                </span>
              </div>
              <h4 className="text-sm text-gray-800 mb-1">{l.nama}</h4>
              <p className="text-xs text-gray-500 mb-4">{l.deskripsi}</p>
              <button disabled={!l.aktif} className={`w-full py-1.5 rounded-lg text-xs transition-colors ${l.aktif ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                {l.aktif ? "Akses Layanan" : "Belum Tersedia"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
