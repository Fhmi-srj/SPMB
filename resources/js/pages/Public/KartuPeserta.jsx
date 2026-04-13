import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function KartuPeserta() {
    const [noHp, setNoHp] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const printRef = useRef();

    const handleCek = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setData(null);
        try {
            // Fetch CSRF cookie first (required by Sanctum statefulApi)
            await fetch('/sanctum/csrf-cookie', { credentials: 'same-origin' });
            const xsrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            const res = await fetch('/api/pendaftaran/cek-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}),
                },
                body: JSON.stringify({ no_hp: noHp }),
                credentials: 'same-origin',
            });
            const d = await res.json();
            setLoading(false);
            if (d.success && d.data.status === 'verified') { setData(d.data); }
            else if (d.success && d.data.status !== 'verified') { setError('Kartu peserta hanya tersedia untuk pendaftar yang sudah diverifikasi.'); }
            else { setError(d.message ?? 'Data tidak ditemukan'); }
        } catch {
            setLoading(false);
            setError('Terjadi kesalahan jaringan');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition">← Beranda</Link>
                    <h1 className="text-2xl font-bold text-gray-800 mt-3">Kartu Peserta</h1>
                    <p className="text-gray-500 text-sm mt-1">Masukkan No. HP Wali untuk mencetak kartu</p>
                </div>

                {!data && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <form onSubmit={handleCek} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">No. HP Wali</label>
                                <input type="tel" value={noHp} onChange={e => setNoHp(e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none" />
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-70 flex items-center justify-center gap-2">
                                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                {loading ? 'Mencari...' : '🔍 Tampilkan Kartu'}
                            </button>
                        </form>
                        {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}
                    </div>
                )}

                {data && (
                    <div>
                        {/* Kartu Peserta */}
                        <div ref={printRef} className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 overflow-hidden print:shadow-none">
                            {/* Header Kartu */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 text-white">
                                <div className="text-center">
                                    <div className="font-bold text-lg">KARTU PESERTA</div>
                                    <div className="text-orange-100 text-sm">PP. Mambaul Huda</div>
                                    <div className="text-orange-100 text-sm">{data.lembaga}</div>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* No Registrasi */}
                                <div className="text-center mb-5">
                                    <div className="text-xs text-gray-500 mb-1">NOMOR REGISTRASI</div>
                                    <div className="text-3xl font-bold text-orange-500 font-mono">{data.no_registrasi}</div>
                                </div>

                                {/* Info */}
                                <div className="space-y-2.5 border-t border-gray-100 pt-4">
                                    {[
                                        { l: 'Nama Lengkap', v: data.nama },
                                        { l: 'Lembaga', v: data.lembaga },
                                        { l: 'Status', v: '✅ Diterima' },
                                        { l: 'Tanggal Daftar', v: data.created_at ? new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' },
                                    ].map(({ l, v }) => (
                                        <div key={l} className="flex justify-between text-sm">
                                            <span className="text-gray-500">{l}</span>
                                            <span className="font-medium text-gray-800 text-right max-w-2/3">{v}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Notice */}
                                <div className="mt-5 p-3 bg-orange-50 rounded-xl text-xs text-orange-700 text-center">
                                    Kartu ini sebagai bukti pendaftaran resmi. Harap dibawa saat proses daftar ulang.
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setData(null)}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition">
                                Cari Lain
                            </button>
                            <button onClick={handlePrint}
                                className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2">
                                🖨️ Cetak Kartu
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
