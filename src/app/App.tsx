import { useState } from "react";
import {
  LayoutDashboard, Recycle, Building2, ShoppingBag, Truck,
  MessageSquare, Bot, Settings, Bell, Search, ChevronLeft,
  ChevronRight, User, Menu, X, LogOut, Users, BarChart3, Shield
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

type PageId = "dashboard" | "bank-sampah" | "tps3r" | "marketplace" | "logistics" | "citizen" | "ai-chat" | "analytics" | "users" | "settings";

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
  { id: "citizen", label: "Layanan Warga", icon: MessageSquare, badge: "19", section: "Layanan" },
  { id: "ai-chat", label: "LOOP AI", icon: Bot, section: "ASISTEN" },
  { id: "analytics", label: "Analitik", icon: BarChart3, section: "Administrasi" },
  { id: "users", label: "Pengguna & Peran", icon: Users },
  { id: "settings", label: "Pengaturan", icon: Settings },
];


export default function App() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications] = useState(5);

  function renderPage() {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "bank-sampah": return <BankSampah />;
      case "tps3r": return <TPS3R />;
      case "marketplace": return <Marketplace />;
      case "logistics": return <Logistics />;
      case "citizen": return <CitizenServices />;
      case "ai-chat": return <AIChat />;
      case "analytics": return <Analitik />;
      case "users": return <Pengguna />;
      case "settings": return <Pengaturan />;
    }
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
            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm text-gray-800 leading-none">Admin Sistem</div>
                <div className="text-xs text-gray-400 mt-0.5">Super Admin</div>
              </div>
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
