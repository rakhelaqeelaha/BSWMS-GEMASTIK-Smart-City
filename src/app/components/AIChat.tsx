import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, BookOpen, RefreshCw, ThumbsUp, ThumbsDown, Copy, Lightbulb } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: string[];
};

const suggestedQuestions = [
  "Bagaimana cara mendaftarkan bank sampah baru?",
  "Apa saja jenis sampah yang diterima di TPS 3R Bogor Tengah?",
  "Bagaimana mekanisme pembayaran setoran sampah?",
  "Apa regulasi terkait pengelolaan sampah di Kota Bogor?",
  "Bagaimana cara melacak status pickup sampah saya?",
  "Berapa harga sampah plastik PET saat ini?",
];

const mockResponses: Record<string, { content: string; sources?: string[] }> = {
  default: {
    content: "Terima kasih atas pertanyaan Anda. Berdasarkan basis pengetahuan BSWMS LOOP, saya akan membantu menjawab pertanyaan terkait pengelolaan sampah, bank sampah, TPS 3R, marketplace material daur ulang, dan layanan warga di Kota Bogor. Silakan ajukan pertanyaan spesifik Anda.",
    sources: ["Panduan BSWMS LOOP v1.0"],
  },
  "bank sampah": {
    content: "Untuk mendaftarkan Bank Sampah baru di Kota Bogor, berikut langkah-langkahnya:\n\n1. **Persiapan Dokumen**: Siapkan akta pendirian kelompok, KTP pengurus, dan foto lokasi\n2. **Pengajuan Online**: Buka menu 'Daftarkan Bank Sampah' di BSWMS LOOP dan isi formulir pendaftaran\n3. **Verifikasi Lapangan**: Tim Dinas Lingkungan Hidup akan melakukan verifikasi lokasi (3-5 hari kerja)\n4. **Aktivasi**: Setelah disetujui, akun bank sampah Anda akan aktif dan dapat mulai menerima setoran\n\nBank sampah harus memenuhi persyaratan minimal: luas 25m², kapasitas penimbangan ≥50kg/hari, dan memiliki minimal 30 anggota aktif.",
    sources: ["Perda Kota Bogor No. 9/2012", "Panduan Operasional Bank Sampah BSWMS", "SK Dinas LH No. 045/2024"],
  },
  "harga plastik": {
    content: "Daftar harga sampah plastik terkini (per Juli 2026) di Kota Bogor:\n\n| Jenis Plastik | Harga/kg |\n|---|---|\n| PET (Botol Minuman) | Rp 2.000 - 2.500 |\n| HDPE (Botol Sabun) | Rp 1.800 - 2.200 |\n| PP (Ember, Toples) | Rp 1.500 - 1.800 |\n| PVC | Rp 500 - 800 |\n| Plastik Campuran | Rp 800 - 1.200 |\n\nHarga dapat berubah setiap minggu berdasarkan pasar. Cek harga real-time di menu Marketplace.",
    sources: ["Data Harga Marketplace BSWMS", "Bank Sampah Induk Kota Bogor - Update 24/07/2026"],
  },
  "regulasi": {
    content: "Regulasi pengelolaan sampah yang berlaku di Kota Bogor:\n\n**Nasional:**\n- UU No. 18 Tahun 2008 tentang Pengelolaan Sampah\n- PP No. 81 Tahun 2012 tentang Pengelolaan Sampah Rumah Tangga\n- Perpres No. 97 Tahun 2017 tentang Kebijakan dan Strategi Nasional Pengelolaan Sampah\n\n**Daerah:**\n- Perda Kota Bogor No. 9 Tahun 2012 tentang Pengelolaan Sampah\n- Perwali Kota Bogor No. 48 Tahun 2021 tentang Bank Sampah\n\n**Teknis:**\n- SNI 19-2454-2002 Tata Cara Teknik Operasional Pengelolaan Sampah Perkotaan",
    sources: ["Perpustakaan Regulasi BSWMS LOOP", "JDIH Kota Bogor"],
  },
};

function getResponse(message: string): { content: string; sources?: string[] } {
  const lower = message.toLowerCase();
  if (lower.includes("bank sampah") || lower.includes("daftar")) return mockResponses["bank sampah"];
  if (lower.includes("harga") || lower.includes("plastik") || lower.includes("sampah")) return mockResponses["harga plastik"];
  if (lower.includes("regulasi") || lower.includes("perda") || lower.includes("aturan") || lower.includes("hukum")) return mockResponses["regulasi"];
  return mockResponses["default"];
}

function formatContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-medium text-gray-800 mt-2 mb-1">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return <li key={i} className="ml-4 text-gray-700 text-sm">{line.slice(2)}</li>;
    }
    if (line.match(/^\d+\./)) {
      return <li key={i} className="ml-4 text-gray-700 text-sm list-decimal">{line.replace(/^\d+\.\s*/, "")}</li>;
    }
    if (line.includes("|")) {
      const cells = line.split("|").filter(c => c.trim());
      if (cells.length > 0 && !line.includes("---")) {
        return (
          <div key={i} className="grid grid-cols-2 text-xs border-b border-gray-100 py-1">
            {cells.map((c, j) => <span key={j} className={j === 0 ? "text-gray-500" : "text-gray-800"}>{c.trim()}</span>)}
          </div>
        );
      }
      return null;
    }
    if (line.trim() === "") return <div key={i} className="h-1" />;
    return <p key={i} className="text-gray-700 text-sm leading-relaxed">{line}</p>;
  });
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: "Halo! Saya **LOOP AI** — asisten cerdas berbasis RAG untuk platform pengelolaan sampah Kota Bogor.\n\nSaya dapat membantu Anda dengan:\n- Informasi operasional bank sampah dan TPS 3R\n- Harga material daur ulang terkini\n- Regulasi dan kebijakan pengelolaan sampah\n- Panduan penggunaan platform BSWMS LOOP\n- Analisis data dan laporan\n\nApa yang ingin Anda ketahui?",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      sources: ["Sistem BSWMS LOOP v1.0"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const resp = getResponse(text);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: resp.content,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      sources: resp.sources,
    };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-gray-900">LOOP AI Assistant</h1>
          <p className="text-sm text-gray-500 mt-0.5">AI berbasis RAG untuk pengelolaan sampah cerdas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            RAG Online
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                  <div className={`rounded-xl px-4 py-3 ${msg.role === "user" ? "bg-green-600 text-white ml-auto" : "bg-gray-50 border border-gray-100"}`}>
                    {msg.role === "assistant" ? (
                      <div className="space-y-0.5">{formatContent(msg.content)}</div>
                    ) : (
                      <p className="text-sm text-white">{msg.content}</p>
                    )}
                  </div>
                  {msg.sources && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {msg.sources.map(s => (
                        <span key={s} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <BookOpen size={10} />{s}
                        </span>
                      ))}
                    </div>
                  )}
                  {msg.role === "assistant" && msg.id !== "0" && (
                    <div className="flex items-center gap-2 mt-2">
                      <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"><ThumbsUp size={12} /></button>
                      <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"><ThumbsDown size={12} /></button>
                      <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"><Copy size={12} /></button>
                    </div>
                  )}
                  <div className="text-xs text-gray-300 mt-1 px-1">{msg.timestamp}</div>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Tanya sesuatu tentang pengelolaan sampah..."
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 text-white rounded-xl transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-gray-800 mb-3 flex items-center gap-2">
              <Lightbulb size={16} className="text-amber-500" />
              Pertanyaan Populer
            </h3>
            <div className="space-y-2">
              {suggestedQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left text-xs text-gray-600 hover:text-green-700 bg-gray-50 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-green-200">
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-gray-800 mb-3">Sumber Pengetahuan</h3>
            <div className="space-y-2">
              {[
                { nama: "Peraturan & Kebijakan", items: 48, icon: "📜" },
                { nama: "Panduan Operasional", items: 124, icon: "📋" },
                { nama: "Data Harga Pasar", items: 312, icon: "💰" },
                { nama: "FAQ Warga", items: 89, icon: "❓" },
                { nama: "Laporan & Analitik", items: 67, icon: "📊" },
              ].map(s => (
                <div key={s.nama} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 flex items-center gap-1.5">{s.icon} {s.nama}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{s.items}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setMessages([messages[0]])}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} />
            Reset Percakapan
          </button>
        </div>
      </div>
    </div>
  );
}
