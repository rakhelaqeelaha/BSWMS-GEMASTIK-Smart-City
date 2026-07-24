import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Recycle, Building2, ShoppingBag, Truck,
  MessageSquare, Bot, Settings, Bell, Search, ChevronLeft,
  ChevronRight, User, Users, Menu, LogOut, BarChart3, Map,
  ChevronDown, Check, Smartphone, UserCog, X, AlertTriangle,
  Info, CheckCircle, Trash2
} from "lucide-react";
import { ThemeProvider, useTheme, type ColorTheme, type Language } from "./ThemeContext";
import { Dashboard } from "./components/Dashboard";
import { BankSampah } from "./components/BankSampah";
import { TPS3R } from "./components/TPS3R";
import { Marketplace } from "./components/Marketplace";
import { Logistics } from "./components/Logistics";
import { CitizenServices } from "./components/CitizenServices";
import { AIChat } from "./components/AIChat";
import { Analitik } from "./components/Analitik";
import { Pengguna } from "./components/Pengguna";
import { Pengaturan } from "./components/Pengaturan";
import { UserDashboard } from "./components/UserDashboard";
import { RequestPickupBerbayar } from "./components/RequestPickupBerbayar";
import { PetaSampah } from "./components/PetaSampah";

type PageId = "dashboard" | "bank-sampah" | "tps3r" | "marketplace" | "logistics" | "request-pickup" | "peta-sampah" | "citizen" | "ai-chat" | "analytics" | "users" | "settings";

interface Notif {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: "warning" | "info" | "success";
  read: boolean;
}

const initNotifs: Notif[] = [
  { id: 1, title: "Pengaduan baru masuk", desc: "RT 07/03 Kel. Sukamaju melaporkan tumpukan sampah", time: "5 mnt", type: "warning", read: false },
  { id: 2, title: "TPS Bogor Timur penuh", desc: "Kapasitas 97% — segera jadwalkan pengangkutan", time: "12 mnt", type: "warning", read: false },
  { id: 3, title: "Pickup terlambat", desc: "Order ORD-240720 delay 45 menit dari jadwal", time: "28 mnt", type: "warning", read: true },
  { id: 4, title: "Bank Sampah baru terdaftar", desc: "Bank Sampah Melati — Bogor Utara berhasil diaktifkan", time: "1 jam", type: "success", read: true },
  { id: 5, title: "Setoran menunggu verifikasi", desc: "5 setoran anggota perlu persetujuan admin", time: "2 jam", type: "info", read: false },
];

const navTranslations: Record<PageId, Record<Language, string>> = {
  "dashboard":     { id: "Command Center",   en: "Command Center" },
  "bank-sampah":   { id: "Bank Sampah",       en: "Waste Bank" },
  "tps3r":         { id: "TPS 3R",            en: "TPS 3R" },
  "marketplace":   { id: "Marketplace",       en: "Marketplace" },
  "logistics":     { id: "Pickup & Logistik", en: "Pickup & Logistics" },
  "request-pickup":{ id: "Pickup Berbayar",   en: "Paid Pickup" },
  "peta-sampah":   { id: "Peta & Tracker",    en: "Map & Tracker" },
  "citizen":       { id: "Layanan Warga",     en: "Citizen Services" },
  "ai-chat":       { id: "LOOP AI",           en: "LOOP AI" },
  "analytics":     { id: "Analitik",          en: "Analytics" },
  "users":         { id: "Pengguna & Peran",  en: "Users & Roles" },
  "settings":      { id: "Pengaturan",        en: "Settings" },
};

const sectionTranslations: Record<string, Record<Language, string>> = {
  "Utama":         { id: "Utama",        en: "Main" },
  "Operasional":   { id: "Operasional",  en: "Operations" },
  "Layanan":       { id: "Layanan",      en: "Services" },
  "ASISTEN":       { id: "ASISTEN",      en: "ASSISTANT" },
  "Administrasi":  { id: "Administrasi", en: "Administration" },
};

const sidebarGradient: Record<ColorTheme, string> = {
  green:  "from-gray-900 to-green-950",
  blue:   "from-gray-900 to-blue-950",
  purple: "from-gray-900 to-purple-950",
  teal:   "from-gray-900 to-teal-950",
  indigo: "from-gray-900 to-indigo-950",
};

const navItems: Array<{ id: PageId; icon: any; badge?: string; section?: string }> = [
  { id: "dashboard",     icon: LayoutDashboard, section: "Utama" },
  { id: "bank-sampah",   icon: Recycle,         section: "Operasional" },
  { id: "tps3r",         icon: Building2 },
  { id: "marketplace",   icon: ShoppingBag },
  { id: "logistics",     icon: Truck },
  { id: "request-pickup",icon: Truck },
  { id: "peta-sampah",   icon: Map },
  { id: "citizen",       icon: MessageSquare,   badge: "19", section: "Layanan" },
  { id: "ai-chat",       icon: Bot,             section: "ASISTEN" },
  { id: "analytics",     icon: BarChart3,       section: "Administrasi" },
  { id: "users",         icon: Users },
  { id: "settings",      icon: Settings },
];

const accounts = [
  { id: "admin", name: "Admin Sistem",   role: "Super Admin", org: "Dinas LH Kota Bogor",             avatar: "A", avatarColor: "from-green-500 to-emerald-600", icon: UserCog },
  { id: "user",  name: "Rakhel Imut",    role: "Warga",       org: "Bank Sampah Sejahtera · BS-0142", avatar: "R", avatarColor: "from-blue-500 to-indigo-600",   icon: Smartphone },
] as const;

function NotifIcon({ type }: { type: Notif["type"] }) {
  if (type === "warning") return <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />;
  if (type === "success")  return <CheckCircle  size={14} className="text-green-500 shrink-0 mt-0.5" />;
  return <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />;
}

function AccountDropdown({
  accounts: accs, activeId, onSwitch, onClose,
}: {
  accounts: typeof accounts;
  activeId: string;
  onSwitch: (id: "admin" | "user") => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/60 z-50 overflow-hidden">
      <div className="px-4 pt-3 pb-2 border-b border-gray-50">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Ganti Akun</p>
      </div>
      <div className="p-2 space-y-1">
        {accs.map(acc => {
          const isActive = acc.id === activeId;
          const AccIcon = acc.icon;
          return (
            <button key={acc.id} onClick={() => onSwitch(acc.id as "admin" | "user")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive ? "bg-gray-50 border border-gray-100" : "hover:bg-gray-50 border border-transparent"}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${acc.avatarColor} flex items-center justify-center shrink-0 shadow-sm`}>
                <span className="text-white">{acc.avatar}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-800">{acc.name}</span>
                  {isActive && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Aktif</span>}
                </div>
                <div className="text-xs text-gray-500 truncate">{acc.org}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <AccIcon size={10} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400">{acc.role}</span>
                </div>
              </div>
              {isActive ? (
                <Check size={15} className="text-green-500 shrink-0" />
              ) : (
                <div className="text-[10px] text-gray-400 group-hover:text-gray-600 shrink-0 border border-gray-200 group-hover:border-gray-300 rounded-lg px-2 py-1 transition-colors">Masuk</div>
              )}
            </button>
          );
        })}
      </div>
      <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5">
          <LogOut size={12} /> Keluar
        </button>
        <span className="text-xs text-gray-300">BSWMS LOOP v1.0</span>
      </div>
    </div>
  );
}

function AppInner() {
  const { colorTheme, language } = useTheme();
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"admin" | "user">("admin");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(initNotifs);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const notifPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) setShowAccountMenu(false);
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node)) setShowNotifPanel(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const t = (id: PageId) => navTranslations[id][language];
  const ts = (s: string) => sectionTranslations[s]?.[language] ?? s;
  const unread = notifs.filter(n => !n.read).length;
  const activeAccount = accounts.find(a => a.id === viewMode)!;

  function renderPage() {
    switch (activePage) {
      case "dashboard":     return <Dashboard />;
      case "bank-sampah":   return <BankSampah />;
      case "tps3r":         return <TPS3R />;
      case "marketplace":   return <Marketplace />;
      case "logistics":     return <Logistics />;
      case "request-pickup":return <RequestPickupBerbayar />;
      case "peta-sampah":   return <PetaSampah />;
      case "citizen":       return <CitizenServices />;
      case "ai-chat":       return <AIChat />;
      case "analytics":     return <Analitik />;
      case "users":         return <Pengguna />;
      case "settings":      return <Pengaturan />;
    }
  }

  if (viewMode === "user") {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
        <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Recycle size={14} className="text-white" />
            </div>
            <div>
              <span className="text-sm text-gray-800">LOOP</span>
              <span className="text-xs text-gray-400 ml-1.5">· Akun Warga</span>
            </div>
          </div>
          <div className="relative" ref={accountMenuRef}>
            <button onClick={() => setShowAccountMenu(v => !v)}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 transition-colors">
              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${activeAccount.avatarColor} flex items-center justify-center`}>
                <span className="text-white text-[10px]">{activeAccount.avatar}</span>
              </div>
              <span className="text-xs text-gray-700">{activeAccount.name}</span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform ${showAccountMenu ? "rotate-180" : ""}`} />
            </button>
            {showAccountMenu && (
              <AccountDropdown accounts={accounts} activeId={viewMode}
                onSwitch={(id) => { setViewMode(id); setShowAccountMenu(false); }}
                onClose={() => setShowAccountMenu(false)} />
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden max-w-sm mx-auto w-full relative border-x border-gray-200 bg-white shadow-xl">
          <UserDashboard />
        </div>
      </div>
    );
  }

  const currentPage = navItems.find(n => n.id === activePage);
  let lastSection = "";

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
          <Recycle size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white text-base leading-none" style={{ fontWeight: 600 }}>LOOP</div>
            <div className="text-green-300 text-xs mt-0.5">BSWMS Platform</div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {navItems.map((item) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          const isActive = activePage === item.id;
          return (
            <div key={item.id}>
              {showSection && !collapsed && (
                <div className="text-green-400/60 text-xs px-3 py-2 mt-2 mb-0.5 uppercase tracking-widest">
                  {ts(item.section!)}
                </div>
              )}
              <button
                onClick={() => { setActivePage(item.id); setMobileOpen(false); }}
                title={collapsed ? t(item.id) : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group relative ${
                  isActive ? "bg-white/15 text-white" : "text-green-100/70 hover:bg-white/10 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`}>
                <item.icon size={18} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{t(item.id)}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{item.badge}</span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px]">{item.badge}</span>
                )}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-400 rounded-r-full" />}
              </button>
            </div>
          );
        })}
      </nav>

      <div className={`px-3 py-4 border-t border-white/10 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shrink-0">
          <User size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm truncate">Admin Sistem</div>
            <div className="text-green-300 text-xs truncate">Dinas LH Kota Bogor</div>
          </div>
        )}
        {!collapsed && (
          <button className="p-1.5 text-green-300/60 hover:text-green-200 transition-colors"><LogOut size={14} /></button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`hidden lg:flex flex-col bg-gradient-to-b ${sidebarGradient[colorTheme]} transition-all duration-300 shrink-0 ${collapsed ? "w-16" : "w-64"}`}>
        {sidebarContent}
      </aside>

      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-gradient-to-b ${sidebarGradient[colorTheme]} transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shrink-0 shadow-sm">
          <button onClick={() => setMobileOpen(m => !m)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden transition-colors">
            <Menu size={20} />
          </button>
          <button onClick={() => setCollapsed(c => !c)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg hidden lg:flex transition-colors">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div className="flex-1 flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder={language === "id" ? "Cari data, fasilitas, warga..." : "Search data, facilities, residents..."}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-gray-50 w-72" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative" ref={notifPanelRef}>
              <button onClick={() => setShowNotifPanel(v => !v)}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">{unread}</span>
                )}
              </button>
              {showNotifPanel && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/60 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-50">
                    <div>
                      <span className="text-sm text-gray-800">{language === "id" ? "Notifikasi" : "Notifications"}</span>
                      {unread > 0 && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{unread} {language === "id" ? "baru" : "new"}</span>}
                    </div>
                    {notifs.length > 0 && (
                      <button onClick={() => setNotifs([])} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                        <Trash2 size={11} /> {language === "id" ? "Hapus semua" : "Clear all"}
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <div className="py-10 text-center">
                        <Bell size={28} className="text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">{language === "id" ? "Tidak ada notifikasi" : "No notifications"}</p>
                      </div>
                    ) : (
                      notifs.map(n => (
                        <div key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group ${!n.read ? "bg-blue-50/30" : ""}`}>
                          <NotifIcon type={n.type} />
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs ${!n.read ? "text-gray-800" : "text-gray-600"}`}>{n.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.desc}</div>
                            <div className="text-[10px] text-gray-400 mt-1">{n.time} {language === "id" ? "yang lalu" : "ago"}</div>
                          </div>
                          <button onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-lg transition-all shrink-0">
                            <X size={12} className="text-gray-500" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2.5 border-t border-gray-50">
                    <button onClick={() => { setNotifs(n => n.map(x => ({ ...x, read: true }))); }}
                      className="text-xs text-green-600 hover:text-green-700 transition-colors">
                      {language === "id" ? "Tandai semua sudah dibaca" : "Mark all as read"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Account Switcher */}
            <div className="relative pl-2 border-l border-gray-100" ref={accountMenuRef}>
              <button onClick={() => setShowAccountMenu(v => !v)}
                className="flex items-center gap-2.5 hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeAccount.avatarColor} flex items-center justify-center shrink-0 shadow-sm`}>
                  <span className="text-white text-sm">{activeAccount.avatar}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm text-gray-800 leading-none">{activeAccount.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{activeAccount.role}</div>
                </div>
                <ChevronDown size={14} className={`hidden sm:block text-gray-400 transition-transform ${showAccountMenu ? "rotate-180" : ""}`} />
              </button>
              {showAccountMenu && (
                <AccountDropdown accounts={accounts} activeId={viewMode}
                  onSwitch={(id) => { setViewMode(id); setShowAccountMenu(false); }}
                  onClose={() => setShowAccountMenu(false)} />
              )}
            </div>
          </div>
        </header>

        <div className="bg-white border-b border-gray-100 px-6 py-2 flex items-center gap-2 text-xs text-gray-400">
          <span className="text-green-600">BSWMS LOOP</span>
          <span>/</span>
          <span className="text-gray-600">{currentPage ? t(currentPage.id) : "Dashboard"}</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
