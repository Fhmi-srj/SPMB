import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CekStatus() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null); // null = initial, [] = empty
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({});
    const timerRef = useRef(null);

    useEffect(() => {
        fetch('/api/pengaturan/public').then(r => r.json()).then(d => { if (d.success) setSettings(d.data); }).catch(() => { });
    }, []);

    const search = (q) => {
        if (q.length < 2) { setResults(null); return; }
        setLoading(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/cek-status?q=${encodeURIComponent(q)}`);
                const data = await res.json();
                setResults(data.success && data.data?.length > 0 ? data.data : []);
            } catch { setResults([]); }
            finally { setLoading(false); }
        }, 300);
    };

    const statusMap = {
        pending: { cls: 'bg-yellow-100 text-yellow-800', text: 'Menunggu Verifikasi', icon: 'fa-clock' },
        verified: { cls: 'bg-green-100 text-green-800', text: 'Terverifikasi', icon: 'fa-check-circle' },
        rejected: { cls: 'bg-red-100 text-red-800', text: 'Ditolak', icon: 'fa-times-circle' },
    };

    const tahunAjaran = settings.tahun_ajaran || '2026/2027';

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Sticky Topbar */}
            <header className="sticky top-0 z-50 text-white shadow-md" style={{ background: 'linear-gradient(135deg, #1B7A3D 0%, #27AE60 100%)' }}>
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="font-bold text-lg">Cek Status Pendaftaran</h1>
                            <p className="text-sm text-white/70 hidden sm:block">PSB {tahunAjaran}</p>
                        </div>
                    </div>
                    <Link to="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition flex items-center gap-2">
                        <i className="fas fa-home"></i><span className="hidden sm:inline">Home</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#1B7A3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-search text-2xl text-[#1B7A3D]"></i>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Cari Status Pendaftaran</h2>
                        <p className="text-gray-500 text-sm">Masukkan nama lengkap untuk melihat status pendaftaran</p>
                    </div>
                    <div className="relative">
                        <input type="text" value={query} onChange={e => { setQuery(e.target.value); search(e.target.value.trim()); }} placeholder="Ketik nama pendaftar..." autoComplete="off"
                            className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl text-base focus:border-[#1B7A3D] focus:outline-none transition-all"
                            style={{ boxShadow: query ? '0 0 0 3px rgba(230,126,34,0.2)' : 'none' }} />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {loading ? <i className="fas fa-spinner animate-spin text-[#1B7A3D]"></i> : <i className="fas fa-search text-gray-400"></i>}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">Minimal 2 karakter untuk mencari</p>
                </div>

                {/* Results */}
                {results !== null && results.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">Hasil Pencarian</h3>
                            <span className="text-sm text-gray-500">{results.length} hasil</span>
                        </div>
                        <div className="space-y-3">
                            {results.map((item, i) => {
                                const st = statusMap[item.status] || statusMap.pending;
                                const date = new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                                return (
                                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all" style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#1B7A3D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <i className="fas fa-user text-[#1B7A3D]"></i>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{item.nama}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>{date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${st.cls} px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5`}>
                                                <i className={`fas ${st.icon}`}></i><span>{st.text}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {results !== null && results.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-user-times text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Tidak Ditemukan</h3>
                        <p className="text-gray-500 text-sm">Tidak ada pendaftar dengan nama tersebut</p>
                    </div>
                )}

                {/* Initial State */}
                {results === null && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-clipboard-list text-3xl text-[#1B7A3D]"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Cek Status Pendaftar</h3>
                        <p className="text-gray-500 text-sm">Ketik nama di kolom pencarian untuk melihat status</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-4 mt-auto">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} PSB - PP Nurul Huda An-Najah Banin Banat</p>
                </div>
            </footer>

            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
    );
}
