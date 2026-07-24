import { useState } from "react";
import { Save, Bell, Shield, Globe, Database, Palette, Mail, Phone, MapPin, Building, ChevronRight, Check } from "lucide-react";
import { useTheme, type ColorTheme, type Language } from "../ThemeContext";

type Section = "umum" | "notifikasi" | "keamanan" | "integrasi" | "tampilan";

const menuSections: Array<{ id: Section; label: string; labelEn: string; icon: any; desc: string; descEn: string }> = [
  { id: "umum",       label: "Informasi Umum",  labelEn: "General Info",       icon: Building,  desc: "Profil instansi dan kontak",         descEn: "Organization profile & contact" },
  { id: "notifikasi", label: "Notifikasi",       labelEn: "Notifications",      icon: Bell,      desc: "Kanal dan aturan notifikasi",        descEn: "Channels & notification rules" },
  { id: "keamanan",   label: "Keamanan",         labelEn: "Security",           icon: Shield,    desc: "Sesi, password, dan audit",          descEn: "Sessions, password & audit" },
  { id: "integrasi",  label: "Integrasi API",    labelEn: "API Integration",    icon: Database,  desc: "Koneksi sistem eksternal",           descEn: "External system connections" },
  { id: "tampilan",   label: "Tampilan",         labelEn: "Appearance",         icon: Palette,   desc: "Tema dan preferensi UI",             descEn: "Theme & UI preferences" },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${value ? "bg-green-500" : "bg-gray-300"}`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function UncontrolledToggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <Toggle value={on} onChange={setOn} />;
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

const colorOptions: Array<{ id: ColorTheme; nama: string; namaEn: string; kelas: string; ring: string }> = [
  { id: "green",  nama: "Hijau (Default)", namaEn: "Green (Default)", kelas: "bg-green-600",  ring: "ring-green-500" },
  { id: "blue",   nama: "Biru",            namaEn: "Blue",            kelas: "bg-blue-600",   ring: "ring-blue-500" },
  { id: "purple", nama: "Ungu",            namaEn: "Purple",          kelas: "bg-violet-600", ring: "ring-violet-500" },
  { id: "teal",   nama: "Teal",            namaEn: "Teal",            kelas: "bg-teal-600",   ring: "ring-teal-500" },
  { id: "indigo", nama: "Indigo",          namaEn: "Indigo",          kelas: "bg-indigo-600", ring: "ring-indigo-500" },
];

export function Pengaturan() {
  const { colorTheme, setColorTheme, darkMode, setDarkMode, language, setLanguage } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>("umum");
  const [saved, setSaved] = useState(false);

  const id = language === "id";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">{id ? "Pengaturan Sistem" : "System Settings"}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{id ? "Konfigurasi platform BSWMS LOOP" : "Configure the BSWMS LOOP platform"}</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${saved ? "bg-green-100 text-green-700 border border-green-300" : "bg-green-600 hover:bg-green-700 text-white"}`}>
          <Save size={14} />
          {saved ? (id ? "Tersimpan!" : "Saved!") : (id ? "Simpan Perubahan" : "Save Changes")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Menu */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2">
          {menuSections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors text-left ${activeSection === s.id ? "bg-green-50 text-green-700" : "hover:bg-gray-50 text-gray-600"}`}>
              <div className="flex items-center gap-3">
                <s.icon size={16} className={activeSection === s.id ? "text-green-600" : "text-gray-400"} />
                <div>
                  <div className="text-sm">{id ? s.label : s.labelEn}</div>
                  <div className="text-xs text-gray-400">{id ? s.desc : s.descEn}</div>
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
              <SectionCard title={id ? "Profil Instansi" : "Organization Profile"} desc={id ? "Informasi resmi pengelola sistem" : "Official system manager information"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: id ? "Nama Instansi" : "Organization Name", value: "Dinas Lingkungan Hidup Kota Bogor", icon: Building },
                    { label: id ? "Kota / Kabupaten" : "City / Regency",  value: "Kota Bogor",                      icon: MapPin },
                    { label: id ? "Email Resmi" : "Official Email",       value: "dlh@bogorkota.go.id",             icon: Mail },
                    { label: id ? "Telepon" : "Phone",                    value: "(0251) 8321-007",                  icon: Phone },
                    { label: "Website",                                    value: "dlh.bogorkota.go.id",             icon: Globe },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="text-xs text-gray-500 mb-1 flex items-center gap-1.5 block">
                        <f.icon size={12} />{f.label}
                      </label>
                      <input defaultValue={f.value}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title={id ? "Cakupan Wilayah" : "Coverage Area"} desc={id ? "Kecamatan yang dikelola dalam sistem" : "Districts managed in the system"}>
                <div className="flex flex-wrap gap-2">
                  {["Bogor Tengah", "Bogor Timur", "Bogor Selatan", "Bogor Utara", "Bogor Barat", "Tanah Sareal"].map(k => (
                    <span key={k} className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                      <MapPin size={10} />{k}
                    </span>
                  ))}
                  <button className="text-xs text-gray-500 border border-dashed border-gray-300 px-3 py-1 rounded-full hover:border-green-400 hover:text-green-600 transition-colors">
                    + {id ? "Tambah Kecamatan" : "Add District"}
                  </button>
                </div>
              </SectionCard>
            </>
          )}

          {activeSection === "notifikasi" && (
            <>
              <SectionCard title={id ? "Kanal Notifikasi" : "Notification Channels"} desc={id ? "Aktifkan kanal pengiriman notifikasi" : "Enable notification delivery channels"}>
                <FieldRow label="Email" sub={id ? "Kirim notifikasi via email terdaftar" : "Send notifications via registered email"}><UncontrolledToggle defaultOn={true} /></FieldRow>
                <FieldRow label="WhatsApp / SMS" sub={id ? "Notifikasi ke nomor HP pengguna" : "Notifications to user phone numbers"}><UncontrolledToggle defaultOn={true} /></FieldRow>
                <FieldRow label="Push Notification" sub={id ? "Notifikasi browser dan aplikasi mobile" : "Browser & mobile app notifications"}><UncontrolledToggle defaultOn={false} /></FieldRow>
                <FieldRow label="Telegram Bot" sub={id ? "Teruskan notifikasi ke grup Telegram" : "Forward notifications to Telegram group"}><UncontrolledToggle defaultOn={false} /></FieldRow>
              </SectionCard>

              <SectionCard title={id ? "Aturan Notifikasi" : "Notification Rules"} desc={id ? "Pilih kejadian yang memicu notifikasi" : "Choose events that trigger notifications"}>
                <FieldRow label={id ? "Pengaduan baru masuk" : "New complaint received"} sub={id ? "Notifikasi ke admin dan petugas terkait" : "Notify admin and related officers"}><UncontrolledToggle defaultOn={true} /></FieldRow>
                <FieldRow label={id ? "Pengaduan prioritas tinggi" : "High priority complaint"} sub={id ? "Alert langsung ke koordinator" : "Direct alert to coordinator"}><UncontrolledToggle defaultOn={true} /></FieldRow>
                <FieldRow label={id ? "Pickup terlambat > 30 menit" : "Pickup delayed > 30 minutes"} sub={id ? "Alert ke koordinator logistik" : "Alert logistics coordinator"}><UncontrolledToggle defaultOn={true} /></FieldRow>
                <FieldRow label={id ? "TPS 3R kapasitas > 90%" : "TPS 3R capacity > 90%"} sub={id ? "Peringatan overload fasilitas" : "Facility overload warning"}><UncontrolledToggle defaultOn={true} /></FieldRow>
                <FieldRow label={id ? "Order marketplace dibuat" : "Marketplace order created"} sub={id ? "Notifikasi ke penjual terkait" : "Notify related seller"}><UncontrolledToggle defaultOn={false} /></FieldRow>
                <FieldRow label={id ? "Setoran bank sampah diverifikasi" : "Waste bank deposit verified"} sub={id ? "Konfirmasi ke nasabah" : "Confirmation to member"}><UncontrolledToggle defaultOn={true} /></FieldRow>
              </SectionCard>
            </>
          )}

          {activeSection === "keamanan" && (
            <>
              <SectionCard title={id ? "Kebijakan Kata Sandi" : "Password Policy"} desc={id ? "Aturan keamanan untuk semua akun" : "Security rules for all accounts"}>
                <FieldRow label={id ? "Panjang minimum kata sandi" : "Minimum password length"} sub={id ? "Karakter minimal yang disyaratkan" : "Minimum required characters"}>
                  <input type="number" defaultValue={8} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                </FieldRow>
                <FieldRow label={id ? "Wajib kombinasi karakter" : "Require character combination"} sub={id ? "Huruf besar, kecil, angka, simbol" : "Uppercase, lowercase, numbers, symbols"}><UncontrolledToggle defaultOn={true} /></FieldRow>
                <FieldRow label={id ? "Kadaluarsa kata sandi (hari)" : "Password expiry (days)"} sub={id ? "0 = tidak pernah kadaluarsa" : "0 = never expires"}>
                  <input type="number" defaultValue={90} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                </FieldRow>
                <FieldRow label={id ? "Autentikasi dua faktor (2FA)" : "Two-factor authentication (2FA)"} sub={id ? "OTP via email atau SMS" : "OTP via email or SMS"}><UncontrolledToggle defaultOn={false} /></FieldRow>
              </SectionCard>

              <SectionCard title={id ? "Sesi & Akses" : "Sessions & Access"} desc={id ? "Konfigurasi batas waktu sesi login" : "Configure login session timeout"}>
                <FieldRow label={id ? "Timeout sesi (menit)" : "Session timeout (minutes)"} sub={id ? "Otomatis logout saat tidak aktif" : "Auto logout when inactive"}>
                  <input type="number" defaultValue={60} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                </FieldRow>
                <FieldRow label={id ? "Izinkan multi-sesi" : "Allow multi-session"} sub={id ? "Login dari beberapa perangkat sekaligus" : "Login from multiple devices simultaneously"}><UncontrolledToggle defaultOn={true} /></FieldRow>
                <FieldRow label={id ? "Rekam audit log" : "Record audit log"} sub={id ? "Catat semua aktivitas pengguna" : "Log all user activities"}><UncontrolledToggle defaultOn={true} /></FieldRow>
                <FieldRow label={id ? "Tampilkan IP login" : "Show login IP"} sub={id ? "Tampilkan IP terakhir di profil pengguna" : "Show last IP in user profile"}><UncontrolledToggle defaultOn={false} /></FieldRow>
              </SectionCard>
            </>
          )}

          {activeSection === "integrasi" && (
            <>
              <SectionCard title={id ? "Integrasi Aktif" : "Active Integrations"} desc={id ? "Koneksi ke sistem dan API eksternal" : "Connections to external systems & APIs"}>
                {[
                  { nama: "SIPD Kota Bogor",          tipe: "Government API",    status: "terhubung",       url: "api.sipd.bogorkota.go.id" },
                  { nama: "Midtrans Payment",          tipe: "Payment Gateway",  status: "terhubung",       url: "api.midtrans.com" },
                  { nama: "Google Maps Platform",      tipe: "Maps & Geocoding", status: "terhubung",       url: "maps.googleapis.com" },
                  { nama: "WhatsApp Business API",     tipe: "Messaging",        status: "tidak_terhubung", url: "graph.facebook.com" },
                  { nama: "SIAK Dukcapil",             tipe: id ? "Data Kependudukan" : "Population Data", status: "tidak_terhubung", url: "api.dukcapil.go.id" },
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
                      {int.status === "terhubung" ? (id ? "Konfigurasi" : "Configure") : (id ? "Hubungkan" : "Connect")}
                    </button>
                  </div>
                ))}
              </SectionCard>

              <SectionCard title={id ? "Kunci API Sistem" : "System API Keys"} desc={id ? "Token untuk akses API BSWMS LOOP" : "Tokens for BSWMS LOOP API access"}>
                <div className="space-y-3">
                  {[
                    { label: id ? "API Key Produksi" : "Production API Key",    value: "bswms_live_••••••••••••••••xK2p" },
                    { label: id ? "API Key Pengembangan" : "Development API Key", value: "bswms_test_••••••••••••••••mR8q" },
                  ].map(k => (
                    <div key={k.label}>
                      <label className="text-xs text-gray-500 block mb-1">{k.label}</label>
                      <div className="flex gap-2">
                        <input readOnly value={k.value} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 font-mono text-gray-600" />
                        <button className="text-xs border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">{id ? "Salin" : "Copy"}</button>
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
              {/* Tema Warna — now functional */}
              <SectionCard title={id ? "Tema Warna" : "Color Theme"} desc={id ? "Warna utama antarmuka platform" : "Primary color for the platform interface"}>
                <div className="flex flex-wrap gap-3 py-2">
                  {colorOptions.map(t => (
                    <button key={t.id} onClick={() => setColorTheme(t.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm transition-all ${
                        colorTheme === t.id ? `border-current bg-gray-50 ${t.ring} ring-2 ring-offset-1` : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <div className={`w-4 h-4 rounded-full ${t.kelas} flex items-center justify-center`}>
                        {colorTheme === t.id && <Check size={10} className="text-white" />}
                      </div>
                      {id ? t.nama : t.namaEn}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">{id ? "Perubahan langsung terlihat di sidebar navigasi." : "Changes are immediately visible in the navigation sidebar."}</p>
              </SectionCard>

              {/* Preferensi Tampilan — dark mode & language now functional */}
              <SectionCard title={id ? "Preferensi Tampilan" : "Display Preferences"} desc={id ? "Konfigurasi antarmuka pengguna" : "User interface configuration"}>
                <FieldRow label={id ? "Mode Gelap (Dark Mode)" : "Dark Mode"} sub={id ? "Aktifkan tema gelap secara global" : "Enable dark theme globally"}>
                  <Toggle value={darkMode} onChange={setDarkMode} />
                </FieldRow>
                <FieldRow label={id ? "Sidebar compact" : "Compact sidebar"} sub={id ? "Tampilkan sidebar dalam mode ikon saja" : "Show sidebar in icon-only mode"}>
                  <UncontrolledToggle defaultOn={false} />
                </FieldRow>
                <FieldRow label={id ? "Animasi transisi" : "Transition animation"} sub={id ? "Aktifkan animasi perpindahan halaman" : "Enable page transition animations"}>
                  <UncontrolledToggle defaultOn={true} />
                </FieldRow>
                <FieldRow label={id ? "Tampilkan breadcrumb" : "Show breadcrumb"} sub={id ? "Navigasi lokasi di atas halaman" : "Location navigation above page"}>
                  <UncontrolledToggle defaultOn={true} />
                </FieldRow>
                <FieldRow label={id ? "Bahasa antarmuka" : "Interface language"}>
                  <select value={language} onChange={e => setLanguage(e.target.value as Language)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </FieldRow>
              </SectionCard>

              <SectionCard title={id ? "Format Regional" : "Regional Format"} desc={id ? "Pengaturan format tanggal dan angka" : "Date and number format settings"}>
                <FieldRow label={id ? "Format Tanggal" : "Date Format"}>
                  <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                    <option>MM/DD/YYYY</option>
                  </select>
                </FieldRow>
                <FieldRow label={id ? "Format Angka" : "Number Format"}>
                  <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    <option>1.000.000,00 (ID)</option>
                    <option>1,000,000.00 (EN)</option>
                  </select>
                </FieldRow>
                <FieldRow label={id ? "Zona Waktu" : "Time Zone"}>
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
