import { useState } from "react";
import {
  Truck, Plus, X, CheckCircle, Clock, AlertCircle, Package,
  Calendar, MapPin, Trash2, ChevronDown, FileText, Star
} from "lucide-react";

type Step = 1 | 2 | 3;
type StatusType = "menunggu" | "dikonfirmasi" | "dijadwalkan" | "selesai" | "dibatalkan";

interface Request {
  id: string;
  event: string;
  tanggal: string;
  jadwal: string;
  alamat: string;
  estimasi: number;
  jenis: string[];
  paket: string;
  harga: number;
  status: StatusType;
}

const paketList = [
  { id: "basic", label: "Basic", subLabel: "< 100 kg", harga: 150000, icon: "📦", features: ["1 kendaraan roda 3", "Jadwal fleksibel 3 hari ke depan", "Plastik & Kertas"], color: "border-gray-200 bg-white" },
  { id: "standard", label: "Standard", subLabel: "100–500 kg", harga: 350000, icon: "🚛", features: ["1 truk pickup", "Jadwal fleksibel 1 hari ke depan", "Semua jenis sampah daur ulang", "Laporan digital"], color: "border-green-300 bg-green-50", badge: "Populer" },
  { id: "premium", label: "Premium", subLabel: "500–2.000 kg", harga: 850000, icon: "🚚", features: ["2 kendaraan besar", "Penjadwalan prioritas", "Semua jenis sampah", "Tim khusus + laporan", "Sertifikat daur ulang"], color: "border-blue-300 bg-blue-50" },
  { id: "enterprise", label: "Enterprise", subLabel: "> 2.000 kg", harga: 0, icon: "🏭", features: ["Armada penuh sesuai kebutuhan", "Koordinator lapangan dedicated", "Semua layanan Premium", "Harga negosiasi"], color: "border-purple-300 bg-purple-50", custom: true },
];

const jenisOptions = ["Plastik", "Kertas / Kardus", "Logam / Besi", "Kaca", "Organik / Sisa Makanan", "B3 (Baterai, Cat)", "Elektronik / E-Waste", "Campuran"];

const mockRequests: Request[] = [
  { id: "RPB-240701", event: "Festival Kuliner Bogor 2026", tanggal: "2026-07-10", jadwal: "2026-07-12", alamat: "Jl. Sudirman No. 12, Bogor Tengah", estimasi: 320, jenis: ["Plastik", "Organik"], paket: "Standard", harga: 350000, status: "selesai" },
  { id: "RPB-240718", event: "Pernikahan Gedung Serbaguna RT 05", tanggal: "2026-07-18", jadwal: "2026-07-19", alamat: "Jl. Veteran No. 88, Bogor Utara", estimasi: 75, jenis: ["Plastik", "Kertas / Kardus"], paket: "Basic", harga: 150000, status: "selesai" },
  { id: "RPB-240724", event: "Bazaar Kemerdekaan RW 03", tanggal: "2026-07-24", jadwal: "2026-07-25", alamat: "Lapangan RW 03, Bogor Selatan", estimasi: 180, jenis: ["Plastik", "Logam / Besi"], paket: "Standard", harga: 350000, status: "dijadwalkan" },
  { id: "RPB-240728", event: "Sunatan Massal Masjid Al-Hidayah", tanggal: "2026-07-28", jadwal: "2026-07-29", alamat: "Jl. Ir. H. Juanda No. 45", estimasi: 50, jenis: ["Plastik", "Kertas / Kardus", "Organik"], paket: "Basic", harga: 150000, status: "dikonfirmasi" },
  { id: "RPB-240730", event: "Konser Musik Taman Kencana", tanggal: "2026-07-30", jadwal: "2026-08-01", alamat: "Taman Kencana, Bogor Tengah", estimasi: 800, jenis: ["Plastik", "Logam / Besi", "Kaca"], paket: "Premium", harga: 850000, status: "menunggu" },
];

const statusConfig: Record<StatusType, { label: string; color: string; icon: any }> = {
  menunggu: { label: "Menunggu Konfirmasi", color: "bg-amber-100 text-amber-700", icon: Clock },
  dikonfirmasi: { label: "Dikonfirmasi", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  dijadwalkan: { label: "Dijadwalkan", color: "bg-purple-100 text-purple-700", icon: Calendar },
  selesai: { label: "Selesai", color: "bg-green-100 text-green-700", icon: CheckCircle },
  dibatalkan: { label: "Dibatalkan", color: "bg-red-100 text-red-700", icon: X },
};

export function RequestPickupBerbayar() {
  const [tab, setTab] = useState<"daftar" | "baru">("daftar");
  const [step, setStep] = useState<Step>(1);
  const [selectedPaket, setSelectedPaket] = useState("");
  const [selectedJenis, setSelectedJenis] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusType | "semua">("semua");
  const [detailItem, setDetailItem] = useState<Request | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ event: "", tanggal: "", waktu: "", alamat: "", estimasi: "", catatan: "" });

  const filtered = filterStatus === "semua" ? mockRequests : mockRequests.filter(r => r.status === filterStatus);

  const toggleJenis = (j: string) => setSelectedJenis(prev => prev.includes(j) ? prev.filter(x => x !== j) : [...prev, j]);

  const canNext1 = form.event && form.tanggal && form.waktu && form.alamat && form.estimasi;
  const canNext2 = selectedJenis.length > 0 && selectedPaket;

  const handleSubmit = () => { setSubmitted(true); };

  const resetForm = () => {
    setStep(1); setSelectedPaket(""); setSelectedJenis([]); setSubmitted(false);
    setForm({ event: "", tanggal: "", waktu: "", alamat: "", estimasi: "", catatan: "" });
    setTab("daftar");
  };

  const paketSelected = paketList.find(p => p.id === selectedPaket);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Request Pickup Berbayar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Layanan pengangkutan sampah khusus untuk acara dan event</p>
        </div>
        <button onClick={() => { setTab("baru"); setStep(1); setSubmitted(false); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm transition-colors">
          <Plus size={15} /> Request Baru
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Request", value: mockRequests.length, color: "text-gray-900" },
          { label: "Dijadwalkan", value: mockRequests.filter(r => r.status === "dijadwalkan").length, color: "text-purple-600" },
          { label: "Menunggu", value: mockRequests.filter(r => r.status === "menunggu").length, color: "text-amber-600" },
          { label: "Selesai Bulan Ini", value: mockRequests.filter(r => r.status === "selesai").length, color: "text-green-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className={`text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["daftar", "baru"] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); if (t === "baru") setStep(1); }}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "daftar" ? "Daftar Request" : "Buat Request Baru"}
          </button>
        ))}
      </div>

      {/* ===== DAFTAR ===== */}
      {tab === "daftar" && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {(["semua", "menunggu", "dikonfirmasi", "dijadwalkan", "selesai", "dibatalkan"] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterStatus === s ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-300"}`}>
                {s === "semua" ? "Semua" : statusConfig[s].label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                {["ID", "Nama Acara", "Tgl Acara", "Paket", "Estimasi", "Nilai", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => {
                  const sc = statusConfig[r.status];
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{r.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-800">{r.event}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={10} />{r.alamat.slice(0, 28)}…</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.tanggal}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.paket === "Premium" ? "bg-blue-100 text-blue-700" : r.paket === "Enterprise" ? "bg-purple-100 text-purple-700" : r.paket === "Standard" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {r.paket}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.estimasi} kg</td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {r.harga > 0 ? `Rp ${r.harga.toLocaleString()}` : <span className="text-xs text-purple-600">Negosiasi</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${sc.color}`}>
                          <StatusIcon size={10} />{sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setDetailItem(r)} className="text-xs text-green-600 hover:text-green-700 border border-green-200 hover:bg-green-50 px-2 py-1 rounded-lg transition-colors">
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== FORM BARU ===== */}
      {tab === "baru" && !submitted && (
        <div className="max-w-2xl space-y-5">
          {/* Stepper */}
          <div className="flex items-center gap-2">
            {[
              { n: 1 as Step, label: "Detail Acara" },
              { n: 2 as Step, label: "Jenis & Paket" },
              { n: 3 as Step, label: "Konfirmasi" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${step >= s.n ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {step > s.n ? <CheckCircle size={14} /> : s.n}
                </div>
                <span className={`text-sm ${step === s.n ? "text-gray-800" : "text-gray-400"}`}>{s.label}</span>
                {i < 2 && <div className={`flex-none w-8 h-0.5 rounded ${step > s.n ? "bg-green-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Detail Acara */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-gray-800">Detail Acara / Event</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Nama Acara / Event *</label>
                  <input value={form.event} onChange={e => setForm(f => ({ ...f, event: e.target.value }))}
                    placeholder="Contoh: Festival Kuliner RT 05, Pernikahan, dll." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tanggal Acara *</label>
                    <input type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Waktu Pickup yang Diinginkan *</label>
                    <input type="time" value={form.waktu} onChange={e => setForm(f => ({ ...f, waktu: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Alamat Lengkap *</label>
                  <textarea value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))}
                    rows={2} placeholder="Jalan, nomor, kelurahan, kecamatan..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Estimasi Volume Sampah (kg) *</label>
                  <input type="number" min="1" value={form.estimasi} onChange={e => setForm(f => ({ ...f, estimasi: e.target.value }))}
                    placeholder="Contoh: 150" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
                  <p className="text-xs text-gray-400 mt-1">Volume mempengaruhi rekomendasi paket layanan</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Catatan Tambahan</label>
                  <textarea value={form.catatan} onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
                    rows={2} placeholder="Instruksi khusus, lokasi parkir truk, dll." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 resize-none" />
                </div>
              </div>
              <button disabled={!canNext1} onClick={() => setStep(2)}
                className="w-full bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2.5 rounded-xl text-sm hover:bg-green-700 transition-colors">
                Lanjut ke Jenis Sampah →
              </button>
            </div>
          )}

          {/* Step 2: Jenis & Paket */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-5">
              <h2 className="text-gray-800">Jenis Sampah & Pilih Paket</h2>

              <div>
                <label className="block text-xs text-gray-600 mb-2">Jenis Sampah yang Akan Diangkut *</label>
                <div className="flex flex-wrap gap-2">
                  {jenisOptions.map(j => (
                    <button key={j} onClick={() => toggleJenis(j)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedJenis.includes(j) ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-300"}`}>
                      {j}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-2">Pilih Paket Layanan *</label>
                {form.estimasi && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3 text-xs text-amber-700">
                    Estimasi volume Anda {form.estimasi} kg — kami rekomendasikan paket <strong>{parseInt(form.estimasi) < 100 ? "Basic" : parseInt(form.estimasi) < 500 ? "Standard" : parseInt(form.estimasi) < 2000 ? "Premium" : "Enterprise"}</strong>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paketList.map(p => (
                    <div key={p.id} onClick={() => setSelectedPaket(p.id)}
                      className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedPaket === p.id ? "border-green-500 bg-green-50" : p.color} hover:shadow-md`}>
                      {p.badge && <span className="absolute top-2 right-2 text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full">{p.badge}</span>}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{p.icon}</span>
                        <div>
                          <div className="text-sm text-gray-900">{p.label}</div>
                          <div className="text-xs text-gray-500">{p.subLabel}</div>
                        </div>
                        <div className="ml-auto text-right">
                          {p.custom ? <div className="text-xs text-purple-600">Harga<br />Negosiasi</div> : (
                            <div><div className="text-sm text-green-700">Rp {p.harga.toLocaleString()}</div><div className="text-xs text-gray-400">per acara</div></div>
                          )}
                        </div>
                      </div>
                      <ul className="space-y-0.5">
                        {p.features.map(f => (
                          <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <CheckCircle size={10} className="text-green-500 mt-0.5 shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-none border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  ← Kembali
                </button>
                <button disabled={!canNext2} onClick={() => setStep(3)}
                  className="flex-1 bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2.5 rounded-xl text-sm hover:bg-green-700 transition-colors">
                  Lanjut ke Konfirmasi →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Konfirmasi */}
          {step === 3 && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-gray-800">Konfirmasi Request</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {[
                  { label: "Nama Acara", value: form.event },
                  { label: "Tanggal Acara", value: form.tanggal },
                  { label: "Waktu Pickup", value: form.waktu },
                  { label: "Alamat", value: form.alamat },
                  { label: "Estimasi Volume", value: `${form.estimasi} kg` },
                  { label: "Jenis Sampah", value: selectedJenis.join(", ") },
                  { label: "Paket Layanan", value: paketSelected?.label || "" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="text-gray-800 text-right max-w-xs">{row.value}</span>
                  </div>
                ))}
              </div>
              {paketSelected && !paketSelected.custom && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <span className="text-sm text-green-800">Total Biaya Layanan</span>
                  <span className="text-lg text-green-700">Rp {paketSelected.harga.toLocaleString()}</span>
                </div>
              )}
              {paketSelected?.custom && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-700">
                  Tim kami akan menghubungi Anda untuk negosiasi harga Enterprise dalam 1x24 jam.
                </div>
              )}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                Konfirmasi request akan diproses dalam 2 jam kerja. Pembayaran dilakukan setelah konfirmasi dari tim kami.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-none border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  ← Kembali
                </button>
                <button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm transition-colors">
                  Kirim Request Pickup
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== SUBMITTED ===== */}
      {tab === "baru" && submitted && (
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-gray-900">Request Terkirim!</h2>
          <p className="text-sm text-gray-500">ID Request Anda: <strong className="font-mono text-green-700">RPB-240801</strong></p>
          <p className="text-sm text-gray-500">Tim kami akan menghubungi Anda dalam 2 jam kerja untuk konfirmasi dan detail pembayaran.</p>
          <button onClick={resetForm} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm transition-colors">
            Kembali ke Daftar Request
          </button>
        </div>
      )}

      {/* Detail Drawer */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setDetailItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">Detail Request</h3>
              <button onClick={() => setDetailItem(null)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-2">
              {[
                { label: "ID", value: detailItem.id },
                { label: "Nama Acara", value: detailItem.event },
                { label: "Tanggal Acara", value: detailItem.tanggal },
                { label: "Jadwal Pickup", value: detailItem.jadwal },
                { label: "Alamat", value: detailItem.alamat },
                { label: "Estimasi Volume", value: `${detailItem.estimasi} kg` },
                { label: "Jenis Sampah", value: detailItem.jenis.join(", ") },
                { label: "Paket", value: detailItem.paket },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm border-b border-gray-50 py-1.5 last:border-0">
                  <span className="text-gray-500">{r.label}</span>
                  <span className="text-gray-800 text-right">{r.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
              <span className="text-sm text-gray-600">Nilai Layanan</span>
              <span className="text-green-700">Rp {detailItem.harga.toLocaleString()}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${statusConfig[detailItem.status].color}`}>
              <span>Status:</span><strong>{statusConfig[detailItem.status].label}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
