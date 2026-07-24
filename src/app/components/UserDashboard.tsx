import { useState } from "react";
import {
  Home, ShoppingBag, Truck, Map, User, Search, Star,
  Recycle, Plus, Bell, ArrowUpRight, Leaf, Gift, ChevronRight,
  Package, Filter, ShoppingCart, X, CheckCircle, Clock, Sparkles, Send
} from "lucide-react";

type UserPage = "beranda" | "pasar" | "pickup" | "peta" | "profil";

const produkMarket = [
  { id: "M001", nama: "Plastik PET Grade A - Bersih", harga: 2500, satuan: "kg", penjual: "CV Daur Ulang Jaya", rating: 4.8, ulasan: 142, stok: 500, kategori: "Plastik", icon: "♻️", terjual: 1240 },
  { id: "M002", nama: "Kardus Tebal Double Wall", harga: 1800, satuan: "kg", penjual: "Toko Sampah Mulia", rating: 4.9, ulasan: 218, stok: 1200, kategori: "Kertas", icon: "📦", terjual: 2100 },
  { id: "M003", nama: "Besi Tua Campuran", harga: 4500, satuan: "kg", penjual: "UD Logam Jaya", rating: 4.7, ulasan: 89, stok: 200, kategori: "Logam", icon: "🔩", terjual: 620 },
  { id: "M004", nama: "Kompos Organik Siap Pakai", harga: 1500, satuan: "kg", penjual: "TPS 3R Bogor Tengah", rating: 4.9, ulasan: 312, stok: 2000, kategori: "Organik", icon: "🌱", terjual: 3400 },
  { id: "M005", nama: "Aluminium Kaleng", harga: 12000, satuan: "kg", penjual: "UD Logam Jaya", rating: 4.6, ulasan: 67, stok: 80, kategori: "Logam", icon: "🥫", terjual: 280 },
  { id: "M006", nama: "Botol Kaca Bening", harga: 3200, satuan: "kg", penjual: "Koperasi Daur", rating: 4.3, ulasan: 45, stok: 150, kategori: "Kaca", icon: "🍶", terjual: 410 },
  { id: "M007", nama: "Plastik HDPE Botol Shampo", harga: 2000, satuan: "kg", penjual: "Toko Sampah Mulia", rating: 4.4, ulasan: 93, stok: 350, kategori: "Plastik", icon: "🧴", terjual: 760 },
  { id: "M008", nama: "Kertas Koran Bekas", harga: 1200, satuan: "kg", penjual: "Bank Sampah Mandiri", rating: 4.5, ulasan: 156, stok: 800, kategori: "Kertas", icon: "📰", terjual: 980 },
];

const riwayatTransaksi = [
  { id: "T001", produk: "Plastik PET Grade A", qty: 5, total: 12500, tanggal: "24 Jul", status: "selesai" },
  { id: "T002", produk: "Kardus Tebal", qty: 10, total: 18000, tanggal: "20 Jul", status: "diproses" },
  { id: "T003", produk: "Kompos Organik", qty: 8, total: 12000, tanggal: "15 Jul", status: "selesai" },
];

const kategoriList = ["Semua", "Plastik", "Kertas", "Logam", "Kaca", "Organik"];

const chatResponses: Record<string, string> = {
  default: "Halo! Ada yang bisa saya bantu seputar marketplace sampah LOOP?",
  harga: "Harga sampah terkini: Plastik PET Rp 2.000–2.500/kg, Kertas Rp 1.200–1.800/kg, Logam Rp 4.500–12.000/kg, Kaca Rp 3.200/kg. Cek marketplace untuk harga live!",
  jual: "Untuk jual sampah: 1) Pilih produk di tab Pasar, 2) Klik 'Jual Sekarang', 3) Masukkan berat & kondisi, 4) Pilih metode pengiriman. Saldo langsung masuk ke rekening bank sampah Anda.",
  pickup: "Untuk request pickup berbayar (event/acara), buka tab 'Pickup' lalu pilih 'Request Khusus'. Tersedia paket Basic (< 100kg), Standard, hingga Enterprise.",
};

function getResponse(msg: string) {
  const l = msg.toLowerCase();
  if (l.includes("harga") || l.includes("berapa")) return chatResponses.harga;
  if (l.includes("jual") || l.includes("jual")) return chatResponses.jual;
  if (l.includes("pickup") || l.includes("angkut") || l.includes("ambil")) return chatResponses.pickup;
  return chatResponses.default;
}

export function UserDashboard() {
  const [page, setPage] = useState<UserPage>("beranda");
  const [kategori, setKategori] = useState("Semua");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof produkMarket[0] | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Halo Budi! Saya LOOP AI. Tanya seputar jual sampah, harga, atau pickup yuk! 👋" },
  ]);

  const filtered = produkMarket.filter(p => {
    const matchKat = kategori === "Semua" || p.kategori === kategori;
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase()) || p.penjual.toLowerCase().includes(search.toLowerCase());
    return matchKat && matchSearch;
  });

  const totalCart = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      return existing ? prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { id, qty: 1 }];
    });
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(m => [...m, { role: "user", text: userMsg }, { role: "assistant", text: getResponse(userMsg) }]);
    setChatInput("");
  };

  const navItems: Array<{ id: UserPage; label: string; icon: any }> = [
    { id: "beranda", label: "Beranda", icon: Home },
    { id: "pasar", label: "Pasar", icon: ShoppingBag },
    { id: "pickup", label: "Pickup", icon: Truck },
    { id: "peta", label: "Peta", icon: Map },
    { id: "profil", label: "Profil", icon: User },
  ];

  return (
    <div className="flex flex-col bg-gray-50" style={{ height: "100%", minHeight: "600px" }}>
      {/* ===== BERANDA ===== */}
      {page === "beranda" && (
        <div className="flex-1 overflow-y-auto pb-20">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 px-4 pt-6 pb-20 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute bottom-0 left-0 w-48 h-24 bg-white/5 rounded-tr-full" />
            <div className="relative flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/25 rounded-full flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-white/70 text-xs">Hai,</div>
                  <div className="text-white text-sm">Budi Santoso 👋</div>
                </div>
              </div>
              <button className="relative w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bell size={15} className="text-white" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-400 rounded-full border border-green-500" />
              </button>
            </div>
            <div className="relative bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
              <div className="text-white/70 text-xs mb-0.5">Saldo Tabungan Sampah</div>
              <div className="text-2xl text-white mb-3">Rp 33.210</div>
              <div className="flex justify-between items-end">
                <div className="flex gap-5">
                  <div><div className="text-white/60 text-xs">Total Setor</div><div className="text-white text-sm">71.3 kg</div></div>
                  <div><div className="text-white/60 text-xs">Transaksi</div><div className="text-white text-sm">18x</div></div>
                </div>
                <button className="bg-white text-green-600 text-xs px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors">Tarik Saldo</button>
              </div>
            </div>
          </div>

          <div className="px-4 -mt-10 space-y-4 relative">
            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Jual Sampah", icon: ShoppingBag, color: "bg-green-50 text-green-600", page: "pasar" },
                { label: "Request Pickup", icon: Truck, color: "bg-blue-50 text-blue-600", page: "pickup" },
                { label: "Peta TPS", icon: Map, color: "bg-purple-50 text-purple-600", page: "peta" },
                { label: "Tanya AI", icon: Sparkles, color: "bg-amber-50 text-amber-600", page: "beranda" },
              ].map(a => (
                <button key={a.label} onClick={() => setPage(a.page as UserPage)}
                  className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`p-2 rounded-xl ${a.color}`}><a.icon size={16} /></div>
                  <span className="text-[10px] text-gray-600 text-center leading-tight">{a.label}</span>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Leaf, label: "Bulan Ini", value: "15.3 kg", color: "bg-green-50 text-green-600" },
                { icon: ArrowUpRight, label: "Nilai Juli", value: "Rp 12.750", color: "bg-amber-50 text-amber-600" },
                { icon: Gift, label: "Poin Reward", value: "1.420 poin", color: "bg-purple-50 text-purple-600" },
                { icon: Star, label: "Rank RT", value: "#3 dari 24", color: "bg-blue-50 text-blue-600" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${s.color}`}><s.icon size={15} /></div>
                  <div><div className="text-sm text-gray-900">{s.value}</div><div className="text-xs text-gray-400">{s.label}</div></div>
                </div>
              ))}
            </div>

            {/* Produk Unggulan */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="text-sm text-gray-800">Produk Unggulan</div>
                <button onClick={() => setPage("pasar")} className="text-xs text-green-600 flex items-center gap-0.5">Lihat semua <ChevronRight size={12} /></button>
              </div>
              <div className="flex gap-3 px-4 pb-4 overflow-x-auto">
                {produkMarket.slice(0, 5).map(p => (
                  <div key={p.id} className="flex-none w-36 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <div className="h-16 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-3xl">{p.icon}</div>
                    <div className="p-2">
                      <div className="text-xs text-gray-700 line-clamp-1">{p.nama}</div>
                      <div className="text-xs text-green-600 mt-0.5">Rp {p.harga.toLocaleString()}/{p.satuan}</div>
                      <button onClick={() => { setSelectedProduct(p); setPage("pasar"); }}
                        className="w-full mt-1.5 bg-green-600 text-white text-[10px] py-1 rounded-lg hover:bg-green-700 transition-colors">
                        Jual
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat mini */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Sparkles size={13} className="text-white" />
                </div>
                <div className="text-sm text-gray-800">Tanya LOOP AI</div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="bg-green-50 rounded-xl p-3 mb-3">
                <p className="text-xs text-green-800 leading-relaxed">{messages[messages.length - 1].text}</p>
              </div>
              <div className="flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()}
                  placeholder="Tanya harga, cara jual, dll..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
                <button onClick={sendChat} disabled={!chatInput.trim()}
                  className="w-8 h-8 bg-green-600 text-white rounded-xl flex items-center justify-center disabled:bg-gray-200 hover:bg-green-700 transition-colors">
                  <Send size={13} />
                </button>
              </div>
            </div>

            {/* Riwayat Transaksi */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="text-sm text-gray-800 mb-3">Transaksi Terakhir</div>
              <div className="space-y-2">
                {riwayatTransaksi.map(t => (
                  <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <Recycle size={14} className="text-green-500 shrink-0" />
                      <div>
                        <div className="text-xs text-gray-800">{t.produk}</div>
                        <div className="text-xs text-gray-400">{t.tanggal} · {t.qty} kg</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-600">+Rp {t.total.toLocaleString()}</div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${t.status === "selesai" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                        {t.status === "selesai" ? "Selesai" : "Diproses"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MARKETPLACE / PASAR ===== */}
      {page === "pasar" && (
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-900 text-base">Marketplace Sampah</h2>
              <button onClick={() => setShowCart(true)} className="relative p-2 hover:bg-gray-100 rounded-xl">
                <ShoppingCart size={18} className="text-gray-600" />
                {totalCart > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">{totalCart}</span>}
              </button>
            </div>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari produk atau penjual..." className="w-full pl-8 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-gray-50" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {kategoriList.map(k => (
                <button key={k} onClick={() => setKategori(k)}
                  className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors shrink-0 ${kategori === k ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-300"}`}>
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(p => (
                <div key={p.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${selectedProduct?.id === p.id ? "border-green-300 ring-2 ring-green-100" : "border-gray-100"}`}>
                  <div className="h-24 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-4xl relative">
                    {p.icon}
                    <span className="absolute top-2 right-2 text-[9px] bg-white/80 text-gray-600 px-1.5 py-0.5 rounded-full">{p.kategori}</span>
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-gray-800 line-clamp-2 leading-tight mb-1">{p.nama}</div>
                    <div className="text-[10px] text-gray-400 mb-1.5 truncate">{p.penjual}</div>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm text-green-600">Rp {p.harga.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400">/{p.satuan}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                        <Star size={9} fill="currentColor" />{p.rating}
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 mb-2">Stok: {p.stok} kg · Terjual {p.terjual}</div>
                    <button onClick={() => addToCart(p.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1">
                      <ShoppingCart size={11} />Jual Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== PICKUP ===== */}
      {page === "pickup" && (
        <div className="flex-1 overflow-y-auto pb-20 p-4 space-y-4">
          <h2 className="text-gray-900">Pickup & Request Khusus</h2>
          <div className="bg-green-600 rounded-2xl p-4 text-white">
            <div className="text-sm mb-1">Jadwal Pickup Rutin Berikutnya</div>
            <div className="text-lg mb-1">Rabu, 31 Jul 2026 · 08:00–10:00</div>
            <div className="text-green-200 text-xs">Plastik · Kertas · Otomatis terjadwal mingguan</div>
          </div>
          <button onClick={() => setPage("pickup")}
            className="w-full flex items-center justify-between bg-white rounded-2xl p-4 border border-dashed border-green-300 hover:bg-green-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Truck size={18} className="text-amber-600" /></div>
              <div className="text-left">
                <div className="text-sm text-gray-800">Request Pickup Berbayar</div>
                <div className="text-xs text-gray-500">Untuk event, acara, atau sampah menumpuk</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-sm text-gray-700 mb-3">Riwayat Pickup</div>
            {[
              { tanggal: "17 Jul 2026", jenis: "Rutin", berat: "12 kg", status: "selesai" },
              { tanggal: "10 Jul 2026", jenis: "Rutin", berat: "9 kg", status: "selesai" },
              { tanggal: "03 Jul 2026", jenis: "Rutin", berat: "14 kg", status: "selesai" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <div><div className="text-xs text-gray-800">{p.tanggal}</div><div className="text-xs text-gray-400">{p.jenis} · {p.berat}</div></div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Selesai</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PETA ===== */}
      {page === "peta" && (
        <div className="flex-1 flex flex-col pb-20 p-4">
          <h2 className="text-gray-900 mb-3">Peta & Lokasi TPS</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center" style={{ minHeight: "300px" }}>
            <Map size={48} className="text-gray-200 mb-3" />
            <p className="text-sm text-gray-500 mb-1">Peta Tracker Tersedia di Tampilan Admin</p>
            <p className="text-xs text-gray-400">Buka menu "Peta & Tracker" dari halaman utama</p>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { nama: "TPS 3R Bogor Tengah", jarak: "0.8 km", kapasitas: 82, status: "beroperasi" },
              { nama: "TPS 3R Bogor Utara", jarak: "1.4 km", kapasitas: 55, status: "beroperasi" },
              { nama: "Bank Sampah Sejahtera", jarak: "0.3 km", kapasitas: null, status: "aktif" },
            ].map(t => (
              <div key={t.nama} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${t.kapasitas && t.kapasitas > 80 ? "bg-red-500" : "bg-green-500"}`} />
                  <div>
                    <div className="text-xs text-gray-800">{t.nama}</div>
                    <div className="text-xs text-gray-400">{t.jarak} dari lokasi Anda</div>
                  </div>
                </div>
                {t.kapasitas && (
                  <div className={`text-xs px-2 py-1 rounded-full ${t.kapasitas > 80 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                    {t.kapasitas}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PROFIL ===== */}
      {page === "profil" && (
        <div className="flex-1 overflow-y-auto pb-20 p-4 space-y-4">
          <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl p-5 text-center">
            <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <User size={28} className="text-white" />
            </div>
            <div className="text-white text-base">Budi Santoso</div>
            <div className="text-green-200 text-xs mt-0.5">Anggota Bank Sampah Sejahtera · BS-0142</div>
            <div className="flex justify-center gap-4 mt-3">
              {[{ label: "Setoran", value: "18x" }, { label: "Total", value: "71.3kg" }, { label: "Poin", value: "1.420" }].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-white text-sm">{s.value}</div>
                  <div className="text-green-200 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {[
            { label: "Informasi Akun", icon: User },
            { label: "Riwayat Transaksi", icon: Package },
            { label: "Notifikasi", icon: Bell },
            { label: "Bantuan & FAQ", icon: Sparkles },
          ].map(m => (
            <button key={m.label} className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-xl"><m.icon size={16} className="text-green-600" /></div>
                <span className="text-sm text-gray-700">{m.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowCart(false)}>
          <div className="bg-white rounded-t-3xl w-full p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Keranjang Jual</h3>
              <button onClick={() => setShowCart(false)}><X size={18} /></button>
            </div>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Keranjang kosong</p>
            ) : (
              cart.map(c => {
                const p = produkMarket.find(x => x.id === c.id)!;
                return (
                  <div key={c.id} className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div className="text-sm text-gray-800">{p.nama}</div>
                    <div className="text-sm text-green-600">{c.qty} kg · Rp {(p.harga * c.qty).toLocaleString()}</div>
                  </div>
                );
              })
            )}
            {cart.length > 0 && (
              <button onClick={() => { setCart([]); setShowCart(false); }}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-2xl text-sm hover:bg-green-700 transition-colors">
                Konfirmasi Penjualan · Rp {cart.reduce((s, c) => { const p = produkMarket.find(x => x.id === c.id)!; return s + p.harga * c.qty; }, 0).toLocaleString()}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-2 z-10 shadow-lg max-w-sm mx-auto">
        {navItems.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${active ? "text-green-600" : "text-gray-400"}`}>
              <item.icon size={19} />
              <span className="text-[10px]">{item.label}</span>
              {active && <div className="w-1 h-1 bg-green-500 rounded-full" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
