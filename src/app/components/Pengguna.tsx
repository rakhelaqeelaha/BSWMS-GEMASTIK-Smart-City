import { useState } from "react";
import { Search, Plus, Shield, User, Edit2, Trash2, MoreVertical, X, CheckCircle, Lock } from "lucide-react";

const penggunaData = [
  { id: "USR001", nama: "Budi Santoso", email: "budi.santoso@dinasLH.bogorkota.go.id", role: "Super Admin", unit: "Dinas Lingkungan Hidup", status: "aktif", lastLogin: "2026-07-24 08:12", avatar: "BS" },
  { id: "USR002", nama: "Siti Rahayu", email: "siti.rahayu@dinasLH.bogorkota.go.id", role: "Admin Kota", unit: "Dinas Lingkungan Hidup", status: "aktif", lastLogin: "2026-07-24 09:34", avatar: "SR" },
  { id: "USR003", nama: "Ahmad Fauzi", email: "ahmad.fauzi@tps3r.id", role: "Operator TPS", unit: "TPS 3R Bogor Tengah", status: "aktif", lastLogin: "2026-07-23 14:21", avatar: "AF" },
  { id: "USR004", nama: "Dewi Lestari", email: "dewi.lestari@banksampah.id", role: "Pengelola Bank Sampah", unit: "Bank Sampah Sejahtera", status: "aktif", lastLogin: "2026-07-24 07:55", avatar: "DL" },
  { id: "USR005", nama: "Wahyu Hidayat", email: "wahyu.hidayat@logistik.id", role: "Koordinator Logistik", unit: "Tim Logistik Bogor Barat", status: "aktif", lastLogin: "2026-07-23 16:40", avatar: "WH" },
  { id: "USR006", nama: "Rini Wulandari", email: "rini.w@marketplace.id", role: "Admin Marketplace", unit: "Tim Marketplace", status: "aktif", lastLogin: "2026-07-22 11:18", avatar: "RW" },
  { id: "USR007", nama: "Hendra Gunawan", email: "hendra.g@driver.id", role: "Driver", unit: "Armada Bogor Tengah", status: "aktif", lastLogin: "2026-07-24 06:30", avatar: "HG" },
  { id: "USR008", nama: "Nurul Hidayah", email: "nurul.h@warga.id", role: "Warga", unit: "Kel. Kebon Kelapa", status: "nonaktif", lastLogin: "2026-06-15 09:00", avatar: "NH" },
];

const roles = [
  {
    nama: "Super Admin",
    deskripsi: "Akses penuh ke seluruh sistem",
    warna: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    izin: ["Kelola pengguna", "Konfigurasi sistem", "Lihat semua data", "Ekspor laporan", "Audit log", "Hapus data"],
  },
  {
    nama: "Admin Kota",
    deskripsi: "Manajemen operasional tingkat kota",
    warna: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    izin: ["Lihat semua data", "Kelola bank sampah", "Kelola TPS 3R", "Kelola logistik", "Ekspor laporan"],
  },
  {
    nama: "Operator TPS",
    deskripsi: "Kelola operasional TPS 3R",
    warna: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    izin: ["Input data masuk TPS", "Update status produksi", "Lihat laporan TPS"],
  },
  {
    nama: "Pengelola Bank Sampah",
    deskripsi: "Kelola setoran dan nasabah bank sampah",
    warna: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
    izin: ["Catat setoran", "Kelola nasabah", "Cetak laporan bank sampah"],
  },
  {
    nama: "Koordinator Logistik",
    deskripsi: "Jadwalkan dan monitor armada pickup",
    warna: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    izin: ["Buat work order", "Tugaskan driver", "Monitor armada", "Update status pickup"],
  },
  {
    nama: "Admin Marketplace",
    deskripsi: "Moderasi listing dan transaksi",
    warna: "bg-teal-100 text-teal-700 border-teal-200",
    dot: "bg-teal-500",
    izin: ["Moderasi listing", "Kelola order", "Lihat transaksi"],
  },
  {
    nama: "Driver",
    deskripsi: "Eksekusi work order pickup",
    warna: "bg-indigo-100 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    izin: ["Lihat work order", "Update status pickup", "Navigasi rute"],
  },
  {
    nama: "Warga",
    deskripsi: "Akses layanan publik",
    warna: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
    izin: ["Daftar bank sampah", "Ajukan pickup", "Buat pengaduan", "Beli di marketplace"],
  },
];

const roleColor: Record<string, string> = {
  "Super Admin": "bg-red-100 text-red-700",
  "Admin Kota": "bg-purple-100 text-purple-700",
  "Operator TPS": "bg-blue-100 text-blue-700",
  "Pengelola Bank Sampah": "bg-green-100 text-green-700",
  "Koordinator Logistik": "bg-amber-100 text-amber-700",
  "Admin Marketplace": "bg-teal-100 text-teal-700",
  "Driver": "bg-indigo-100 text-indigo-700",
  "Warga": "bg-gray-100 text-gray-600",
};

const avatarColor = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-teal-500", "bg-rose-500", "bg-indigo-500", "bg-gray-400"];

export function Pengguna() {
  const [tab, setTab] = useState<"pengguna" | "roles">("pengguna");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = penggunaData.filter(u =>
    u.nama.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase()) ||
    u.unit.toLowerCase().includes(search.toLowerCase())
  );

  const aktif = penggunaData.filter(u => u.status === "aktif").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Pengguna & Peran</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola akun pengguna dan kontrol akses sistem</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Tambah Pengguna
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pengguna", value: penggunaData.length.toString(), sub: "Terdaftar di sistem", icon: User, color: "bg-blue-500" },
          { label: "Pengguna Aktif", value: aktif.toString(), sub: "Login ≤ 30 hari", icon: CheckCircle, color: "bg-green-500" },
          { label: "Total Peran", value: roles.length.toString(), sub: "Tingkat akses berbeda", icon: Shield, color: "bg-purple-500" },
          { label: "Tidak Aktif", value: (penggunaData.length - aktif).toString(), sub: "Perlu tinjauan", icon: Lock, color: "bg-amber-500" },
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
        {(["pengguna", "roles"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "pengguna" ? "Daftar Pengguna" : "Manajemen Peran"}
          </button>
        ))}
      </div>

      {tab === "pengguna" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama, peran, atau unit..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Pengguna", "Peran", "Unit / Instansi", "Status", "Login Terakhir", ""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${avatarColor[i % avatarColor.length]} flex items-center justify-center text-white text-xs shrink-0`}>
                          {u.avatar}
                        </div>
                        <div>
                          <div className="text-gray-800">{u.nama}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor[u.role] ?? "bg-gray-100 text-gray-600"}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{u.unit}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === "aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {u.status === "aktif" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{u.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"><Edit2 size={14} /></button>
                        <button className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map(r => (
            <div key={r.nama} className={`bg-white rounded-xl border shadow-sm p-5 ${r.warna.split(" ").slice(-1)[0]}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${r.dot}`} />
                  <span className={`text-sm px-2 py-0.5 rounded-full border ${r.warna}`}>{r.nama}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {penggunaData.filter(u => u.role === r.nama).length} pengguna
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{r.deskripsi}</p>
              <div className="flex flex-wrap gap-1">
                {r.izin.map(iz => (
                  <span key={iz} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={10} className="text-green-500" />{iz}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Pengguna */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-gray-900">Tambah Pengguna Baru</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Nama Lengkap", placeholder: "Masukkan nama lengkap", type: "text" },
                { label: "Email", placeholder: "email@instansi.go.id", type: "email" },
                { label: "Kata Sandi", placeholder: "Min. 8 karakter", type: "password" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-sm text-gray-700 block mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
                </div>
              ))}
              <div>
                <label className="text-sm text-gray-700 block mb-1">Peran</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400">
                  {roles.map(r => <option key={r.nama}>{r.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-700 block mb-1">Unit / Instansi</label>
                <input type="text" placeholder="Nama unit atau instansi"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">Simpan Pengguna</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
