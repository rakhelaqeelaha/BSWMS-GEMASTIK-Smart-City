import { useState } from "react";
import { Save, Bell, Shield, Globe, Database, Palette, Mail, Phone, MapPin, Building, ChevronRight } from "lucide-react";

type Section = "umum" | "notifikasi" | "keamanan" | "integrasi" | "tampilan";

const menuSections: Array<{ id: Section; label: string; icon: any; desc: string }> = [
  { id: "umum", label: "Informasi Umum", icon: Building, desc: "Profil instansi dan kontak" },
  { id: "notifikasi", label: "Notifikasi", icon: Bell, desc: "Kanal dan aturan notifikasi" },
  { id: "keamanan", label: "Keamanan", icon: Shield, desc: "Sesi, password, dan audit" },
  { id: "integrasi", label: "Integrasi API", icon: Database, desc: "Koneksi sistem eksternal" },
  { id: "tampilan", label: "Tampilan", icon: Palette, desc: "Tema dan preferensi UI" },
];

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(o => !o)}
      className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${on ? "bg-green-500" : "bg-gray-300"}`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function SectionCard({ children, title, desc }: { children: React.ReactNode; title: string; desc?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-gray-800">{title}</h3>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function FieldRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <div className="text-sm text-gray-700">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );
}

export function Pengaturan() {
  const [activeSection, setActiveSection] = useState<Section>("umum");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Pengaturan Sistem</h1>
          <p className="text-sm text-gray-500 mt-0.5">Konfigurasi platform BSWMS LOOP</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${saved ? "bg-green-100 text-green-700 border border-green-300" : "bg-green-600 hover:bg-green-700 text-white"}`}>
          <Save size={14} />
          {saved ? "Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Menu */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2">
          {menuSections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors text-left ${activeSection === s.id ? "bg-green-50 text-green-700" : "hover:bg-gray-50 text-gray-600"}`}>
              <div className="flex items-center gap-3">
                <s.icon size={16} className={activeSection === s.id ? "text-green-600" : "text-gray-400"} />
                <div>
                  <div className="text-sm">{s.label}</div>
                  <div className="text-xs text-gray-400">{s.desc}</div>
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-300 shrink-0" />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-4">

          {activeSection === "umum" && (
            <>
              <SectionCard title="Profil Instansi" desc="Informasi resmi pengelola sistem">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Nama Instansi", value: "Dinas Lingkungan Hidup Kota Bogor", icon: Building },
                    { label: "Kota / Kabupaten", value: "Kota Bogor", icon: MapPin },
                    { label: "Email Resmi", value: "dlh@bogorkota.go.id", icon: Mail },
                    { label: "Telepon", value: "(0251) 8321-007", icon: Phone },
                    { label: "Website", value: "dlh.bogorkota.go.id", icon: Globe },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="text-xs text-gray-500 mb-1 flex items-center gap-1.5 block">
                        <f.icon size={12} />{f.label}
                      </label>
                      <input
                        defaultValue={f.value}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Cakupan Wilayah" desc="Kecamatan yang dikelola dalam sistem">
                <div className="flex flex-wrap gap-2">
                  {["Bogor Tengah", "Bogor Timur", "Bogor Selatan", "Bogor Utara", "Bogor Barat", "Tanah Sareal"].map(k => (
                    <span key={k} className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                      <MapPin size={10} />{k}
                    </span>
                  ))}
                  <button className="text-xs text-gray-500 border border-dashed border-gray-300 px-3 py-1 rounded-full hover:border-green-400 hover:text-green-600 transition-colors">
                    + Tambah Kecamatan
                  </button>
                </div>
              </SectionCard>
            </>
          )}

          {activeSection === "notifikasi" && (
            <>
              <SectionCard title="Kanal Notifikasi" desc="Aktifkan kanal pengiriman notifikasi">
                <FieldRow label="Email" sub="Kirim notifikasi via email terdaftar"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="WhatsApp / SMS" sub="Notifikasi ke nomor HP pengguna"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="Push Notification" sub="Notifikasi browser dan aplikasi mobile"><Toggle defaultOn={false} /></FieldRow>
                <FieldRow label="Telegram Bot" sub="Teruskan notifikasi ke grup Telegram"><Toggle defaultOn={false} /></FieldRow>
              </SectionCard>

              <SectionCard title="Aturan Notifikasi" desc="Pilih kejadian yang memicu notifikasi">
                <FieldRow label="Pengaduan baru masuk" sub="Notifikasi ke admin dan petugas terkait"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="Pengaduan prioritas tinggi" sub="Alert langsung ke koordinator"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="Pickup terlambat > 30 menit" sub="Alert ke koordinator logistik"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="TPS 3R kapasitas > 90%" sub="Peringatan overload fasilitas"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="Order marketplace dibuat" sub="Notifikasi ke penjual terkait"><Toggle defaultOn={false} /></FieldRow>
                <FieldRow label="Setoran bank sampah diverifikasi" sub="Konfirmasi ke nasabah"><Toggle defaultOn={true} /></FieldRow>
              </SectionCard>
            </>
          )}

          {activeSection === "keamanan" && (
            <>
              <SectionCard title="Kebijakan Kata Sandi" desc="Aturan keamanan untuk semua akun">
                <FieldRow label="Panjang minimum kata sandi" sub="Karakter minimal yang disyaratkan">
                  <input type="number" defaultValue={8} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                </FieldRow>
                <FieldRow label="Wajib kombinasi karakter" sub="Huruf besar, kecil, angka, simbol"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="Kadaluarsa kata sandi (hari)" sub="0 = tidak pernah kadaluarsa">
                  <input type="number" defaultValue={90} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                </FieldRow>
                <FieldRow label="Autentikasi dua faktor (2FA)" sub="OTP via email atau SMS"><Toggle defaultOn={false} /></FieldRow>
              </SectionCard>

              <SectionCard title="Sesi & Akses" desc="Konfigurasi batas waktu sesi login">
                <FieldRow label="Timeout sesi (menit)" sub="Otomatis logout saat tidak aktif">
                  <input type="number" defaultValue={60} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                </FieldRow>
                <FieldRow label="Izinkan multi-sesi" sub="Login dari beberapa perangkat sekaligus"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="Rekam audit log" sub="Catat semua aktivitas pengguna"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="Tampilkan IP login" sub="Tampilkan IP terakhir di profil pengguna"><Toggle defaultOn={false} /></FieldRow>
              </SectionCard>
            </>
          )}

          {activeSection === "integrasi" && (
            <>
              <SectionCard title="Integrasi Aktif" desc="Koneksi ke sistem dan API eksternal">
                {[
                  { nama: "SIPD Kota Bogor", tipe: "Government API", status: "terhubung", url: "api.sipd.bogorkota.go.id" },
                  { nama: "Midtrans Payment", tipe: "Payment Gateway", status: "terhubung", url: "api.midtrans.com" },
                  { nama: "Google Maps Platform", tipe: "Maps & Geocoding", status: "terhubung", url: "maps.googleapis.com" },
                  { nama: "WhatsApp Business API", tipe: "Messaging", status: "tidak_terhubung", url: "graph.facebook.com" },
                  { nama: "SIAK Dukcapil", tipe: "Data Kependudukan", status: "tidak_terhubung", url: "api.dukcapil.go.id" },
                ].map(int => (
                  <div key={int.nama} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${int.status === "terhubung" ? "bg-green-500" : "bg-gray-300"}`} />
                      <div>
                        <div className="text-sm text-gray-800">{int.nama}</div>
                        <div className="text-xs text-gray-400">{int.tipe} · {int.url}</div>
                      </div>
                    </div>
                    <button className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${int.status === "terhubung" ? "border-gray-200 text-gray-500 hover:bg-gray-50" : "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"}`}>
                      {int.status === "terhubung" ? "Konfigurasi" : "Hubungkan"}
                    </button>
                  </div>
                ))}
              </SectionCard>

              <SectionCard title="Kunci API Sistem" desc="Token untuk akses API BSWMS LOOP">
                <div className="space-y-3">
                  {[
                    { label: "API Key Produksi", value: "bswms_live_••••••••••••••••xK2p" },
                    { label: "API Key Pengembangan", value: "bswms_test_••••••••••••••••mR8q" },
                  ].map(k => (
                    <div key={k.label}>
                      <label className="text-xs text-gray-500 block mb-1">{k.label}</label>
                      <div className="flex gap-2">
                        <input readOnly value={k.value} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 font-mono text-gray-600" />
                        <button className="text-xs border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">Salin</button>
                        <button className="text-xs border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">Reset</button>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </>
          )}

          {activeSection === "tampilan" && (
            <>
              <SectionCard title="Tema Warna" desc="Warna utama antarmuka platform">
                <div className="flex flex-wrap gap-3 py-2">
                  {[
                    { nama: "Hijau (Default)", kelas: "bg-green-600", aktif: true },
                    { nama: "Biru", kelas: "bg-blue-600", aktif: false },
                    { nama: "Ungu", kelas: "bg-violet-600", aktif: false },
                    { nama: "Teal", kelas: "bg-teal-600", aktif: false },
                    { nama: "Indigo", kelas: "bg-indigo-600", aktif: false },
                  ].map(t => (
                    <button key={t.nama} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm transition-all ${t.aktif ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className={`w-4 h-4 rounded-full ${t.kelas}`} />
                      {t.nama}
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Preferensi Tampilan" desc="Konfigurasi antarmuka pengguna">
                <FieldRow label="Mode Gelap (Dark Mode)" sub="Aktifkan tema gelap secara global"><Toggle defaultOn={false} /></FieldRow>
                <FieldRow label="Sidebar compact" sub="Tampilkan sidebar dalam mode ikon saja"><Toggle defaultOn={false} /></FieldRow>
                <FieldRow label="Animasi transisi" sub="Aktifkan animasi perpindahan halaman"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="Tampilkan breadcrumb" sub="Navigasi lokasi di atas halaman"><Toggle defaultOn={true} /></FieldRow>
                <FieldRow label="Bahasa antarmuka">
                  <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    <option>Bahasa Indonesia</option>
                    <option>English</option>
                  </select>
                </FieldRow>
              </SectionCard>

              <SectionCard title="Format Regional" desc="Pengaturan format tanggal dan angka">
                <FieldRow label="Format Tanggal">
                  <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                    <option>MM/DD/YYYY</option>
                  </select>
                </FieldRow>
                <FieldRow label="Format Angka">
                  <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    <option>1.000.000,00 (ID)</option>
                    <option>1,000,000.00 (EN)</option>
                  </select>
                </FieldRow>
                <FieldRow label="Zona Waktu">
                  <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    <option>WIB (UTC+7)</option>
                    <option>WITA (UTC+8)</option>
                    <option>WIT (UTC+9)</option>
                  </select>
                </FieldRow>
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
