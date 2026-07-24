import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Recycle, Building2, ShoppingBag, Truck,
  MessageSquare, Bot, Settings, Bell, Search, ChevronLeft,
  ChevronRight, User, Users, Menu, LogOut, BarChart3, Map,
  ChevronDown, Check, Smartphone, UserCog
} from "lucide-react";
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

const navItems: Array<{
  id: PageId;
  label: string;
  icon: any;
  badge?: string;
  section?: string;
}> = [
  { id: "dashboard", label: "Command Center", icon: LayoutDashboard, section: "Utama" },
  { id: "bank-sampah", label: "Bank Sampah", icon: Recycle, section: "Operasional" },
  { id: "tps3r", label: "TPS 3R", icon: Building2 },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "logistics", label: "Pickup & Logistik", icon: Truck },
  { id: "request-pickup", label: "Pickup Berbayar", icon: Truck },
  { id: "peta-sampah", label: "Peta & Tracker", icon: Map },
  { id: "citizen", label: "Layanan Warga", icon: MessageSquare, badge: "19", section: "Layanan" },
  { id: "ai-chat", label: "LOOP AI", icon: Bot, section: "ASISTEN" },
  { id: "analytics", label: "Analitik", icon: BarChart3, section: "Administrasi" },
  { id: "users", label: "Pengguna & Peran", icon: Users },
  { id: "settings", label: "Pengaturan", icon: Settings },
];


function AccountDropdown({
  accounts,
  activeId,
  onSwitch,
  onClose,
}: {
  accounts: ReadonlyArray<{ id: string; name: string; role: string; org: string; avatar: string; avatarColor: string; icon: any }>;
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
        {accounts.map(acc => {
          const isActive = acc.id === activeId;
          const AccIcon = acc.icon;
          return (
            <button
              key={acc.id}
              onClick={() => onSwitch(acc.id as "admin" | "user")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-gray-50 border border-gray-100"
                  : "hover:bg-gray-50 border border-transparent"
              }`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${acc.avatarColor} flex items-center justify-center shrink-0 shadow-sm`}>
                <span className="text-white">{acc.avatar}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-800">{acc.name}</span>
                  {isActive && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Aktif</span>
                  )}
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
                <div className="text-[10px] text-gray-400 group-hover:text-gray-600 shrink-0 border border-gray-200 group-hover:border-gray-300 rounded-lg px-2 py-1 transition-colors">
                  Masuk
                </div>
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

const accounts = [
  {
    id: "admin",
    name: "Admin Sistem",
    role: "Super Admin",
    org: "Dinas LH Kota Bogor",
    avatar: "A",
    avatarColor: "from-green-500 to-emerald-600",
    icon: UserCog,
  },
  {
    id: "user",
    name: "Budi Santoso",
    role: "Warga",
    org: "Bank Sampah Sejahtera · BS-0142",
    avatar: "B",
    avatarColor: "from-blue-500 to-indigo-600",
    icon: Smartphone,
  },
] as const;

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications] = useState(5);
  const [viewMode, setViewMode] = useState<"admin" | "user">("admin");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


  const activeAccount = accounts.find(a => a.id === viewMode)!;

  function renderPage() {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "bank-sampah": return <BankSampah />;
      case "tps3r": return <TPS3R />;
      case "marketplace": return <Marketplace />;
      case "logistics": return <Logistics />;
      case "request-pickup": return <RequestPickupBerbayar />;
      case "peta-sampah": return <PetaSampah />;
      case "citizen": return <CitizenServices />;
      case "ai-chat": return <AIChat />;
      case "analytics": return <Analitik />;
      case "users": return <Pengguna />;
      case "settings": return <Pengaturan />;
    }
  }

  if (viewMode === "user") {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
        {/* User mode topbar */}
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
          {/* Account switcher in user mode */}
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setShowAccountMenu(v => !v)}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 transition-colors">
              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${activeAccount.avatarColor} flex items-center justify-center`}>
                <span className="text-white text-[10px]">{activeAccount.avatar}</span>
              </div>
              <span className="text-xs text-gray-700">{activeAccount.name}</span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform ${showAccountMenu ? "rotate-180" : ""}`} />
            </button>
            {showAccountMenu && (
              <AccountDropdown
                accounts={accounts}
                activeId={viewMode}
                onSwitch={(id) => { setViewMode(id); setShowAccountMenu(false); }}
                onClose={() => setShowAccountMenu(false)}
              />
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
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
          <Recycle size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-semibold text-base leading-none">LOOP</div>
            <div className="text-green-300 text-xs mt-0.5">BSWMS Platform</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {navItems.map((item) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          const isActive = activePage === item.id;
          return (
            <div key={item.id}>
              {showSection && !collapsed && (
                <div className="text-green-400/60 text-xs px-3 py-2 mt-2 mb-0.5 uppercase tracking-widest">{item.section}</div>
              )}
              <button
                onClick={() => { setActivePage(item.id); setMobileOpen(false); }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group relative ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-green-100/70 hover:bg-white/10 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`}>
                <item.icon size={18} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{item.badge}</span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px]">
                    {item.badge}
                  </span>
                )}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-400 rounded-r-full" />}
              </button>
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
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
          <button className="p-1.5 text-green-300/60 hover:text-green-200 transition-colors">
            <LogOut size={14} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-gradient-to-b from-gray-900 to-green-950 transition-all duration-300 shrink-0 ${collapsed ? "w-16" : "w-64"}`}>
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-gradient-to-b from-gray-900 to-green-950 transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shrink-0 shadow-sm">
          <button
            onClick={() => setMobileOpen(m => !m)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden transition-colors">
            <Menu size={20} />
          </button>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg hidden lg:flex transition-colors">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div className="flex-1 flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Cari data, fasilitas, warga..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-gray-50 w-72"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={18} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                  {notifications}
                </span>
              )}
            </button>
            {/* Account Switcher */}
            <div className="relative pl-2 border-l border-gray-100" ref={accountMenuRef}>
              <button
                onClick={() => setShowAccountMenu(v => !v)}
                className="flex items-center gap-2.5 hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors group">
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
                <AccountDropdown
                  accounts={accounts}
                  activeId={viewMode}
                  onSwitch={(id) => { setViewMode(id); setShowAccountMenu(false); }}
                  onClose={() => setShowAccountMenu(false)}
                />
              )}
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100 px-6 py-2 flex items-center gap-2 text-xs text-gray-400">
          <span className="text-green-600">BSWMS LOOP</span>
          <span>/</span>
          <span className="text-gray-600">{currentPage?.label || "Dashboard"}</span>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
