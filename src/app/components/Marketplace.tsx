import { useState } from "react";
import { Search, ShoppingCart, Plus, Star, Package, Filter, Tag, TrendingUp, ChevronDown } from "lucide-react";

const listings = [
  { id: "LIS001", nama: "Plastik PET Bersih Grade A", penjual: "CV Daur Ulang Jaya", kecamatan: "Bogor Tengah", harga: 2500, satuan: "kg", stok: 500, terjual: 1240, rating: 4.8, kategori: "Plastik", status: "aktif", gambar: "♻️" },
  { id: "LIS002", nama: "Kertas Koran Bekas", penjual: "Toko Sampah Mulia", kecamatan: "Bogor Timur", harga: 1200, satuan: "kg", stok: 800, terjual: 980, rating: 4.5, kategori: "Kertas", status: "aktif", gambar: "📰" },
  { id: "LIS003", nama: "Besi Tua Campuran", penjual: "UD Logam Jaya", kecamatan: "Tanah Sareal", harga: 4500, satuan: "kg", stok: 200, terjual: 620, rating: 4.7, kategori: "Logam", status: "aktif", gambar: "🔩" },
  { id: "LIS004", nama: "Botol Kaca Bening 600ml", penjual: "Koperasi Daur", kecamatan: "Bogor Selatan", harga: 3200, satuan: "kg", stok: 150, terjual: 410, rating: 4.3, kategori: "Kaca", status: "aktif", gambar: "🍶" },
  { id: "LIS005", nama: "Kardus Tebal Double Wall", penjual: "CV Daur Ulang Jaya", kecamatan: "Bogor Tengah", harga: 1800, satuan: "kg", stok: 1200, terjual: 2100, rating: 4.9, kategori: "Kertas", status: "aktif", gambar: "📦" },
  { id: "LIS006", nama: "Aluminium Kaleng Minuman", penjual: "UD Logam Jaya", kecamatan: "Tanah Sareal", harga: 12000, satuan: "kg", stok: 80, terjual: 280, rating: 4.6, kategori: "Logam", status: "aktif", gambar: "🥫" },
  { id: "LIS007", nama: "Plastik HDPE Botol Shampo", penjual: "Toko Sampah Mulia", kecamatan: "Bogor Timur", harga: 2000, satuan: "kg", stok: 350, terjual: 760, rating: 4.4, kategori: "Plastik", status: "aktif", gambar: "🧴" },
  { id: "LIS008", nama: "Kompos Organik Siap Pakai", penjual: "TPS 3R Bogor Tengah", kecamatan: "Bogor Tengah", harga: 1500, satuan: "kg", stok: 2000, terjual: 3400, rating: 4.9, kategori: "Organik", status: "aktif", gambar: "🌱" },
];

const orders = [
  { id: "ORD001", pembeli: "PT Green Factory", listing: "Plastik PET Bersih Grade A", qty: 100, total: 250000, tanggal: "2026-07-24", status: "dikonfirmasi" },
  { id: "ORD002", pembeli: "CV Industri Maju", listing: "Kardus Tebal Double Wall", qty: 500, total: 900000, tanggal: "2026-07-23", status: "pengiriman" },
  { id: "ORD003", pembeli: "UD Makmur Jaya", listing: "Besi Tua Campuran", qty: 50, total: 225000, tanggal: "2026-07-23", status: "selesai" },
  { id: "ORD004", pembeli: "PT Kemasan Nusantara", listing: "Aluminium Kaleng Minuman", qty: 20, total: 240000, tanggal: "2026-07-22", status: "menunggu" },
  { id: "ORD005", pembeli: "PT Green Factory", listing: "Kertas Koran Bekas", qty: 200, total: 240000, tanggal: "2026-07-22", status: "selesai" },
];

const statusColor: Record<string, string> = {
  aktif: "bg-green-100 text-green-700",
  nonaktif: "bg-gray-100 text-gray-500",
  dikonfirmasi: "bg-blue-100 text-blue-700",
  pengiriman: "bg-purple-100 text-purple-700",
  selesai: "bg-green-100 text-green-700",
  menunggu: "bg-amber-100 text-amber-700",
  dibatalkan: "bg-red-100 text-red-600",
};

const kategoriList = ["Semua", "Plastik", "Kertas", "Logam", "Kaca", "Organik"];

export function Marketplace() {
  const [tab, setTab] = useState<"katalog" | "orders">("katalog");
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [cart, setCart] = useState<string[]>([]);

  const filtered = listings.filter(l => {
    const matchSearch = l.nama.toLowerCase().includes(search.toLowerCase()) || l.penjual.toLowerCase().includes(search.toLowerCase());
    const matchKat = kategori === "Semua" || l.kategori === kategori;
    return matchSearch && matchKat;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Marketplace Sampah</h1>
          <p className="text-sm text-gray-500 mt-0.5">Jual beli material daur ulang antar pelaku ekonomi sirkular</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors relative">
            <ShoppingCart size={16} />
            Keranjang
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>
            )}
          </button>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <Plus size={16} />
            Tambah Listing
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Listing Aktif", value: "847", icon: Tag },
          { label: "Order Bulan Ini", value: "1,284", icon: ShoppingCart },
          { label: "Nilai Transaksi", value: "Rp 284 jt", icon: TrendingUp },
          { label: "Seller Aktif", value: "142", icon: Package },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <s.icon size={18} className="text-green-600" />
            </div>
            <div>
              <div className="text-lg text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(["katalog", "orders"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "katalog" ? "Katalog Produk" : "Riwayat Order"}
          </button>
        ))}
      </div>

      {tab === "katalog" && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari produk atau penjual..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
            </div>
            <div className="flex gap-2">
              {kategoriList.map(k => (
                <button key={k} onClick={() => setKategori(k)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${kategori === k ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-300"}`}>
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-28 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl">
                  {item.gambar}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.kategori}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star size={11} fill="currentColor" />
                      {item.rating}
                    </div>
                  </div>
                  <h4 className="text-sm text-gray-800 mt-1.5 mb-0.5 line-clamp-2">{item.nama}</h4>
                  <p className="text-xs text-gray-400 mb-3">{item.penjual}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-green-600">Rp {item.harga.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">/{item.satuan}</span>
                    </div>
                    <span className="text-xs text-gray-400">Stok {item.stok} kg</span>
                  </div>
                  <button
                    onClick={() => setCart(c => [...c, item.id])}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5">
                    <ShoppingCart size={13} />
                    Beli Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-gray-800">Daftar Order</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["ID Order", "Pembeli", "Produk", "Qty", "Total", "Tanggal", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{o.id}</td>
                    <td className="px-4 py-3 text-gray-800">{o.pembeli}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px] truncate">{o.listing}</td>
                    <td className="px-4 py-3 text-gray-800">{o.qty} kg</td>
                    <td className="px-4 py-3 text-gray-800">Rp {o.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{o.tanggal}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[o.status]}`}>
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
