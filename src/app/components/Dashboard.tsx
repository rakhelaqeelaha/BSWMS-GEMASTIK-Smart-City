import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Package, Truck, Users, AlertCircle, Recycle, ShoppingCart, MapPin, Activity } from "lucide-react";

const weeklyData = [
  { day: "Sen", sampah: 12.4, setoran: 8.2, pickup: 15 },
  { day: "Sel", sampah: 18.7, setoran: 12.1, pickup: 22 },
  { day: "Rab", sampah: 15.3, setoran: 9.8, pickup: 18 },
  { day: "Kam", sampah: 22.1, setoran: 16.4, pickup: 28 },
  { day: "Jum", sampah: 19.8, setoran: 14.2, pickup: 24 },
  { day: "Sab", sampah: 28.5, setoran: 21.3, pickup: 35 },
  { day: "Min", sampah: 11.2, setoran: 7.6, pickup: 12 },
];

const sampahKomposisi = [
  { name: "Plastik", value: 38, color: "#22c55e" },
  { name: "Kertas", value: 25, color: "#3b82f6" },
  { name: "Logam", value: 15, color: "#f59e0b" },
  { name: "Kaca", value: 12, color: "#8b5cf6" },
  { name: "Organik", value: 10, color: "#ef4444" },
];

const monthlyTrend = [
  { bulan: "Jan", volume: 145, nilai: 28.5 },
  { bulan: "Feb", volume: 162, nilai: 31.2 },
  { bulan: "Mar", volume: 178, nilai: 35.8 },
  { bulan: "Apr", volume: 195, nilai: 40.1 },
  { bulan: "Mei", volume: 210, nilai: 43.7 },
  { bulan: "Jun", volume: 228, nilai: 47.2 },
];

const recentActivities = [
  { id: 1, type: "setoran", desc: "Setoran sampah plastik 12kg", lokasi: "Bank Sampah Sejahtera", waktu: "5 menit lalu", status: "selesai" },
  { id: 2, type: "pickup", desc: "Pickup terjadwal RT 03/05", lokasi: "Jl. Merdeka No.12", waktu: "12 menit lalu", status: "dalam_proses" },
  { id: 3, type: "order", desc: "Order marketplace kertas 50kg", lokasi: "CV Daur Ulang Jaya", waktu: "25 menit lalu", status: "menunggu" },
  { id: 4, type: "complaint", desc: "Pengaduan tumpukan sampah", lokasi: "RT 07/03 Kel. Sukamaju", waktu: "1 jam lalu", status: "ditinjau" },
  { id: 5, type: "setoran", desc: "Setoran logam bekas 8kg", lokasi: "Bank Sampah Mandiri", waktu: "1.5 jam lalu", status: "selesai" },
];

const topBankSampah = [
  { nama: "Bank Sampah Sejahtera", volume: 2840, anggota: 342, kecamatan: "Bogor Tengah" },
  { nama: "Bank Sampah Mandiri", volume: 2210, anggota: 287, kecamatan: "Bogor Timur" },
  { nama: "Bank Sampah Berkah", volume: 1980, anggota: 251, kecamatan: "Bogor Selatan" },
  { nama: "Bank Sampah Lestari", volume: 1740, anggota: 218, kecamatan: "Bogor Utara" },
  { nama: "Bank Sampah Hijau", volume: 1520, anggota: 196, kecamatan: "Tanah Sareal" },
];

function StatCard({ title, value, unit, change, icon: Icon, color }: {
  title: string; value: string; unit: string; change: number; icon: any; color: string;
}) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-2xl text-gray-900 mb-0.5">{value} <span className="text-sm text-gray-500">{unit}</span></div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
}

const statusColor: Record<string, string> = {
  selesai: "bg-green-100 text-green-700",
  dalam_proses: "bg-blue-100 text-blue-700",
  menunggu: "bg-amber-100 text-amber-700",
  ditinjau: "bg-red-100 text-red-600",
};

const statusLabel: Record<string, string> = {
  selesai: "Selesai",
  dalam_proses: "Diproses",
  menunggu: "Menunggu",
  ditinjau: "Ditinjau",
};

const activityIcon: Record<string, { icon: any; color: string }> = {
  setoran: { icon: Recycle, color: "bg-green-100 text-green-600" },
  pickup: { icon: Truck, color: "bg-blue-100 text-blue-600" },
  order: { icon: ShoppingCart, color: "bg-purple-100 text-purple-600" },
  complaint: { icon: AlertCircle, color: "bg-red-100 text-red-600" },
};

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Command Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview sistem pengelolaan sampah Kota Bogor</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <Activity size={14} className="text-green-600" />
          <span className="text-green-700">Live · Diperbarui baru saja</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Volume Hari Ini" value="128.4" unit="ton" change={12.3} icon={Recycle} color="bg-green-500" />
        <StatCard title="Pickup Aktif" value="47" unit="armada" change={8.1} icon={Truck} color="bg-blue-500" />
        <StatCard title="Warga Terdaftar" value="24,381" unit="orang" change={5.4} icon={Users} color="bg-purple-500" />
        <StatCard title="Nilai Transaksi" value="Rp 48.2" unit="juta" change={-2.1} icon={ShoppingCart} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Bank Sampah Aktif" value="312" unit="unit" change={3.2} icon={MapPin} color="bg-teal-500" />
        <StatCard title="TPS 3R Beroperasi" value="28" unit="fasilitas" change={0} icon={Package} color="bg-indigo-500" />
        <StatCard title="Pengaduan Terbuka" value="19" unit="kasus" change={-15.3} icon={AlertCircle} color="bg-rose-500" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 mb-1">Volume & Setoran Mingguan</h3>
          <p className="text-xs text-gray-400 mb-4">Ton sampah diolah vs disetor per hari</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Area key="area-sampah" type="monotone" dataKey="sampah" stroke="#22c55e" strokeWidth={2} fill="#22c55e" fillOpacity={0.1} name="Volume Harian (ton)" />
              <Area key="area-setoran" type="monotone" dataKey="setoran" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.1} name="Setoran Harian (ton)" />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 mb-1">Komposisi Sampah</h3>
          <p className="text-xs text-gray-400 mb-4">Berdasarkan jenis material</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={sampahKomposisi} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {sampahKomposisi.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `${val}%`} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {sampahKomposisi.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
                <span className="text-xs text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 mb-1">Tren Bulanan</h3>
          <p className="text-xs text-gray-400 mb-4">Volume (ton) & Nilai Transaksi (juta Rp)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyTrend} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Bar key="bar-volume" dataKey="volume" fill="#22c55e" radius={[4, 4, 0, 0]} name="Volume Bulanan (ton)" />
              <Bar key="bar-nilai" dataKey="nilai" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Nilai Transaksi (juta Rp)" />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 mb-1">Top 5 Bank Sampah</h3>
          <p className="text-xs text-gray-400 mb-4">Berdasarkan volume bulan ini</p>
          <div className="space-y-3">
            {topBankSampah.map((bs, i) => (
              <div key={bs.nama} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white shrink-0 ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-700" : "bg-gray-200"}`}>
                  <span className={i < 3 ? "text-white" : "text-gray-600"}>{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800 truncate">{bs.nama}</div>
                  <div className="text-xs text-gray-400">{bs.kecamatan} · {bs.anggota} anggota</div>
                </div>
                <div className="text-sm text-green-600 shrink-0">{bs.volume.toLocaleString()} kg</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-gray-800 mb-4">Aktivitas Terkini</h3>
        <div className="space-y-3">
          {recentActivities.map((act) => {
            const actInfo = activityIcon[act.type];
            const IconComp = actInfo.icon;
            return (
              <div key={act.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className={`p-2 rounded-lg shrink-0 ${actInfo.color}`}>
                  <IconComp size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800">{act.desc}</div>
                  <div className="text-xs text-gray-400">{act.lokasi}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[act.status]}`}>{statusLabel[act.status]}</span>
                  <span className="text-xs text-gray-400">{act.waktu}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
