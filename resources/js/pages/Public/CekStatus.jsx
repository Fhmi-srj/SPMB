import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const fmt = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

function DetailModal({ show, onClose, data }) {
    if (!show || !data) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-modal-zoom" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-bold text-gray-800">Rincian Status & Tagihan</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 overflow-y-auto space-y-4">
                    {/* Student Info Card */}
                    <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-2">
                        <div>
                            <h4 className="font-bold text-[#E67E22] text-sm uppercase tracking-wide">{data.nama}</h4>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">No. Reg: {data.no_registrasi || '-'}</p>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-800 rounded-md">{data.lembaga}</span>
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-700 rounded-md">{data.status_mukim}</span>
                        </div>
                        <div className="border-t border-orange-100/70 pt-2 space-y-1.5 text-xs text-gray-600">
                            <div>
                                <span className="font-semibold text-gray-500">Sekolah Asal:</span> {data.asal_sekolah || '-'}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500">Alamat:</span> {data.alamat || '-'}
                            </div>
                        </div>
                    </div>

                    {/* Bill breakdown */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                            <span className="text-gray-500">Biaya Sekolah ({data.lembaga})</span>
                            <span className="font-medium text-gray-800">{fmt(data.biaya_sekolah)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                            <span className="text-gray-500">Biaya Pondok</span>
                            <span className="font-medium text-gray-800">{fmt(data.biaya_pondok)}</span>
                        </div>
                        
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                            <span className="text-gray-500">Biaya Pemesanan Perlengkapan</span>
                            <span className="font-medium text-gray-800">{fmt(data.biaya_perlengkapan)}</span>
                        </div>
                        {data.perlengkapan_details && data.perlengkapan_details.length > 0 && (
                            <div className="bg-orange-50/20 rounded-xl p-3 border border-orange-100/50 space-y-1.5 mt-1">
                                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Daftar Perlengkapan Dipesan:</p>
                                {data.perlengkapan_details.map((x, idx) => (
                                    <div key={idx} className="flex justify-between text-[11px] text-gray-750">
                                        <span>• {x.nama_item}</span>
                                        <span className="font-semibold text-gray-600">{fmt(x.nominal)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between py-2 border-b border-gray-200 font-semibold bg-gray-50 px-2 rounded">
                            <span className="text-gray-700">Total Tagihan</span>
                            <span className="text-gray-900">{fmt(data.total_tagihan)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-gray-100 text-green-600 font-medium px-2">
                            <span>Total Pembayaran Disetujui (ACC)</span>
                            <span>{fmt(data.total_dibayar)}</span>
                        </div>
                        <div className="flex justify-between py-2.5 px-2 rounded-lg bg-orange-100/60 text-orange-950 font-bold border border-orange-200 mt-2">
                            <span>Sisa Kekurangan Pembayaran</span>
                            <span className={data.sisa_kekurangan > 0 ? "text-red-600" : "text-green-600"}>
                                {data.sisa_kekurangan > 0 ? fmt(data.sisa_kekurangan) : 'Lunas'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t p-4 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-semibold transition active:scale-95">Tutup</button>
                </div>
            </div>
        </div>
    );
}

export default function CekStatus() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null); // null = initial, [] = empty
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
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
            <header className="sticky top-0 z-50 text-white shadow-md" style={{ background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)' }}>
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="font-bold text-lg">Cek Status Pendaftaran</h1>
                            <p className="text-sm text-white/70 hidden sm:block">SPMB {tahunAjaran}</p>
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
                        <div className="w-16 h-16 bg-[#E67E22]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-search text-2xl text-[#E67E22]"></i>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Cari Status Pendaftaran</h2>
                        <p className="text-gray-500 text-sm">Masukkan nama lengkap untuk melihat status pendaftaran</p>
                    </div>
                    <div className="relative">
                        <input type="text" value={query} onChange={e => { setQuery(e.target.value); search(e.target.value.trim()); }} placeholder="Ketik nama pendaftar..." autoComplete="off"
                            className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl text-base focus:border-[#E67E22] focus:outline-none transition-all"
                            style={{ boxShadow: query ? '0 0 0 3px rgba(230,126,34,0.2)' : 'none' }} />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {loading ? <i className="fas fa-spinner animate-spin text-[#E67E22]"></i> : <i className="fas fa-search text-gray-400"></i>}
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
                                    <div key={i} onClick={() => { setSelectedItem(item); setShowDetail(true); }}
                                        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer hover:border-orange-200 hover:bg-orange-50/5 active:scale-[0.99]" 
                                        style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#E67E22]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <i className="fas fa-user text-[#E67E22]"></i>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{item.nama}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>{item.lembaga}</span><span>•</span><span>{date}</span>
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
                            <i className="fas fa-clipboard-list text-3xl text-[#E67E22]"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Cek Status Pendaftar</h3>
                        <p className="text-gray-500 text-sm">Ketik nama di kolom pencarian untuk melihat status</p>
                    </div>
                )}
            </main>

            {/* Detail Modal */}
            <DetailModal show={showDetail} onClose={() => setShowDetail(false)} data={selectedItem} />

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-4 mt-auto">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} SPMB Terpadu - Yayasan Almukarromah Pajomblangan</p>
                </div>
            </footer>

            <style>{`
                @keyframes fadeIn { 
                    from { opacity:0; transform:translateY(10px); } 
                    to { opacity:1; transform:translateY(0); } 
                }
                @keyframes modalZoom {
                    from { opacity:0; transform:scale(0.95); }
                    to { opacity:1; transform:scale(1); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out forwards;
                }
                .animate-modal-zoom {
                    animation: modalZoom 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
        </div>
    );
}
