import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext';

const fmt = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

function DetailModal({ show, onClose, data }) {
    if (!show || !data) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 transform scale-100 transition-all duration-300 animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-bold text-gray-800">Rincian Tagihan</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="p-5 overflow-y-auto space-y-4">
                    <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-2">
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{data.nama}</h4>
                            <p className="text-xs text-gray-500 font-mono">{data.no_registrasi || '-'}</p>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-orange-100 text-orange-800 rounded-md">{data.lembaga}</span>
                            <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-gray-100 text-gray-800 rounded-md">{data.status_mukim}</span>
                        </div>
                        <div className="border-t border-orange-100/70 pt-2 space-y-1 text-xs text-gray-600">
                            <div>
                                <span className="font-semibold text-gray-500">Sekolah Asal:</span> {data.asal_sekolah || '-'}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500">Alamat:</span> {data.alamat || '-'}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                            <span className="text-gray-500">Biaya Sekolah (Mambaul Huda)</span>
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
                                    <div key={idx} className="flex justify-between text-[11px] text-gray-700">
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
                        <div className="flex justify-between py-2.5 px-2 rounded-lg bg-orange-100/60 text-orange-950 font-bold border border-orange-200">
                            <span>Sisa Kekurangan Pembayaran</span>
                            <span className={data.sisa_kekurangan > 0 ? "text-red-600" : "text-green-600"}>
                                {data.sisa_kekurangan > 0 ? fmt(data.sisa_kekurangan) : 'Lunas'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="border-t p-4 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-semibold transition">Tutup</button>
                </div>
            </div>
        </div>
    );
}

export default function RekapPendaftaran() {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({ total_pendaftar: 0, total_lengkap_berkas: 0, total_tagihan: 0, total_kekurangan: 0, total_pemasukan: 0, total_pengeluaran: 0, saldo_tersedia: 0 });
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [search, setSearch] = useState('');
    const [lembaga, setLembaga] = useState('');
    const [statusMukim, setStatusMukim] = useState('');
    const [page, setPage] = useState(1);

    // Modal state
    const [detailData, setDetailData] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/pendaftaran/rekap', {
                headers,
                params: { search, lembaga, status_mukim: statusMukim, page, per_page: 15 }
            });
            if (res.data.success) {
                setData(res.data.data || []);
                setMeta(res.data.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 });
                setSummary(res.data.summary || { total_pendaftar: 0, total_lengkap_berkas: 0, total_tagihan: 0, total_kekurangan: 0, total_pemasukan: 0, total_pengeluaran: 0, saldo_tersedia: 0 });
            }
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'Gagal memuat data rekap', 'error');
        } finally {
            setLoading(false);
        }
    }, [token, search, lembaga, statusMukim, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleLembagaChange = (e) => {
        setLembaga(e.target.value);
        setPage(1);
    };

    const handleStatusMukimChange = (e) => {
        setStatusMukim(e.target.value);
        setPage(1);
    };

    const handleExportExcel = async () => {
        try {
            Swal.fire({ title: 'Membuat Excel...', didOpen: () => Swal.showLoading(), allowOutsideClick: false });
            const res = await axios.get('/api/pendaftaran/rekap/excel', {
                headers,
                params: { search, lembaga, status_mukim: statusMukim },
                responseType: 'blob'
            });
            Swal.close();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `rekap-pendaftaran-${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            Swal.close();
            Swal.fire('Error', 'Gagal ekspor Excel', 'error');
        }
    };

    const handleExportPdf = async () => {
        try {
            Swal.fire({ title: 'Membuat PDF...', didOpen: () => Swal.showLoading(), allowOutsideClick: false });
            const res = await axios.get('/api/pendaftaran/rekap/pdf', {
                headers,
                params: { search, lembaga, status_mukim: statusMukim },
                responseType: 'blob'
            });
            Swal.close();
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `rekap-pendaftaran-${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            Swal.close();
            Swal.fire('Error', 'Gagal ekspor PDF', 'error');
        }
    };

    const handleViewDetail = async (item) => {
        setLoadingDetail(true);
        try {
            const res = await axios.get(`/api/transaksi/tagihan/${item.id}`, { headers });
            setDetailData({
                ...res.data,
                nama: item.nama,
                no_registrasi: item.no_registrasi,
                alamat: item.alamat,
                asal_sekolah: item.asal_sekolah
            });
            setShowDetail(true);
        } catch (e) {
            Swal.fire('Error', 'Gagal memuat rincian tagihan', 'error');
        } finally {
            setLoadingDetail(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Rekap Pendaftaran</h2>
                    <p className="text-gray-500 text-sm">Ringkasan status berkas dan rincian keuangan pendaftar</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button onClick={handleExportPdf} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm">
                        <i className="fas fa-file-pdf"></i>
                        <span>Cetak PDF</span>
                    </button>
                    <button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm">
                        <i className="fas fa-file-excel"></i>
                        <span>Ekspor Excel</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#E67E22] flex items-center justify-center text-base flex-shrink-0">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="min-w-0">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider truncate">Total Pendaftar</p>
                        <h3 className="text-lg font-bold text-gray-800 truncate">{summary.total_pendaftar}</h3>
                    </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-base flex-shrink-0">
                        <i className="fas fa-file-signature"></i>
                    </div>
                    <div className="min-w-0">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider truncate">Berkas Lengkap</p>
                        <h3 className="text-lg font-bold text-gray-800 truncate">{summary.total_lengkap_berkas}</h3>
                    </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base flex-shrink-0">
                        <i className="fas fa-file-invoice-dollar"></i>
                    </div>
                    <div className="min-w-0">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider truncate">Total Tagihan</p>
                        <h3 className="text-lg font-bold text-gray-800 truncate">{fmt(summary.total_tagihan)}</h3>
                    </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-base flex-shrink-0">
                        <i className="fas fa-comment-dollar"></i>
                    </div>
                    <div className="min-w-0">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider truncate">Kekurangan</p>
                        <h3 className="text-lg font-bold text-amber-600 truncate">{fmt(summary.total_kekurangan)}</h3>
                    </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-base flex-shrink-0">
                        <i className="fas fa-hand-holding-usd"></i>
                    </div>
                    <div className="min-w-0">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider truncate">Uang Masuk</p>
                        <h3 className="text-lg font-bold text-teal-600 truncate">{fmt(summary.total_pemasukan)}</h3>
                    </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-base flex-shrink-0">
                        <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className="min-w-0">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider truncate">Uang Keluar</p>
                        <h3 className="text-lg font-bold text-rose-600 truncate">{fmt(summary.total_pengeluaran)}</h3>
                    </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-base flex-shrink-0">
                        <i className="fas fa-wallet"></i>
                    </div>
                    <div className="min-w-0">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider truncate">Saldo Tersedia</p>
                        <h3 className="text-lg font-bold text-indigo-600 truncate">{fmt(summary.saldo_tersedia)}</h3>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cari Nama, Reg, Alamat, Wali, Sekolah</label>
                        <div className="relative">
                            <input type="text" value={search} onChange={handleSearchChange} placeholder="Ketik nama, registrasi, alamat, wali, sekolah..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#E67E22] focus:border-[#E67E22] transition" />
                            <i className="fas fa-search absolute left-3 top-3 text-gray-400 text-xs"></i>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Filter Lembaga</label>
                        <select value={lembaga} onChange={handleLembagaChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#E67E22] focus:border-[#E67E22] transition">
                            <option value="">Semua Lembaga</option>
                            <option value="SMP NU BP">SMP NU BP</option>
                            <option value="MA ALHIKAM">MA ALHIKAM</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Filter Status Mukim</label>
                        <select value={statusMukim} onChange={handleStatusMukimChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#E67E22] focus:border-[#E67E22] transition">
                            <option value="">Semua Status Mukim</option>
                            <option value="PONDOK PP MAMBAUL HUDA">PONDOK PP MAMBAUL HUDA</option>
                            <option value="PONDOK SELAIN PP MAMBAUL HUDA">PONDOK SELAIN PP MAMBAUL HUDA</option>
                            <option value="TIDAK PONDOK">TIDAK PONDOK</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                                <th className="p-4 text-center" width="4%">No</th>
                                <th className="p-4" width="10%">No. Reg</th>
                                <th className="p-4" width="15%">Nama Calon</th>
                                <th className="p-4" width="15%">Alamat</th>
                                <th className="p-4 text-center" width="10%">Status Berkas</th>
                                <th className="p-4 text-right text-gray-400 font-medium text-[9px]" width="8%">Tagihan</th>
                                <th className="p-4 text-right text-gray-400 font-medium text-[9px]" width="8%">Pemesanan</th>
                                <th className="p-4 text-right text-gray-800 font-bold" width="10%">Total Tagihan</th>
                                <th className="p-4 text-right text-gray-800 font-bold" width="10%">Pembayaran</th>
                                <th className="p-4 text-right text-gray-800 font-bold" width="10%">Kekurangan</th>
                                <th className="p-4 text-center" width="8%">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="11" className="p-10 text-center text-gray-400">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#E67E22] border-t-transparent rounded-full animate-spin"></div>
                                            <span>Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="p-10 text-center text-gray-400">Tidak ada data pendaftaran ditemukan</td>
                                </tr>
                            ) : (
                                data.map((item, index) => {
                                    const rowNum = (page - 1) * 15 + index + 1;
                                    return (
                                        <tr key={item.id} onClick={() => handleViewDetail(item)} className="hover:bg-gray-50/50 transition cursor-pointer">
                                            <td className="p-4 text-center text-gray-500 font-medium">{rowNum}</td>
                                            <td className="p-4 font-mono font-bold text-gray-900">{item.no_registrasi || '-'}</td>
                                            <td className="p-4 font-semibold text-gray-800">
                                                <div>{item.nama}</div>
                                                <div className="text-[10px] text-gray-400 font-semibold uppercase">{item.lembaga}</div>
                                            </td>
                                            <td className="p-4 text-gray-500 leading-normal max-w-xs truncate" title={item.alamat}>
                                                {item.alamat || '-'}
                                            </td>
                                            <td className="p-4 text-center">
                                                {item.status_berkas === 'Lengkap' ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800" title="Semua berkas lengkap">
                                                        Lengkap
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800" title={item.status_berkas_detail}>
                                                        Belum Lengkap
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right text-xs text-gray-400 font-normal whitespace-nowrap">{fmt(item.tagihan)}</td>
                                            <td className="p-4 text-right text-xs text-gray-400 font-normal whitespace-nowrap">{fmt(item.pemesanan)}</td>
                                            <td className="p-4 text-right text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">{fmt(item.total_tagihan)}</td>
                                            <td className={`p-4 text-right text-xs sm:text-sm whitespace-nowrap ${item.total_dibayar > 0 ? 'text-emerald-600 font-bold' : 'text-gray-300 font-medium'}`}>{fmt(item.total_dibayar)}</td>
                                            <td className="p-4 text-right text-xs sm:text-sm whitespace-nowrap">
                                                {item.kekurangan > 0 ? (
                                                    <span className="text-rose-600 font-bold">{fmt(item.kekurangan)}</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                        Lunas
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => handleViewDetail(item)} className="p-1 px-2.5 bg-orange-50 hover:bg-[#E67E22] text-[#E67E22] hover:text-white rounded-lg text-xs font-semibold border border-orange-100/80 transition-all flex items-center gap-1 mx-auto shadow-sm">
                                                    <i className="fas fa-info-circle"></i>
                                                    <span>Rincian</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 bg-gray-50/50">
                        <div className="text-xs text-gray-500 font-medium">
                            Menampilkan <span className="font-semibold text-gray-700">{data.length}</span> dari <span className="font-semibold text-gray-700">{meta.total}</span> data
                        </div>
                        <div className="flex gap-1.5">
                            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50 text-gray-600 transition disabled:opacity-50 select-none">
                                <i className="fas fa-chevron-left mr-1"></i> Prev
                            </button>
                            <span className="px-3 py-1.5 text-xs font-bold text-gray-700 flex items-center bg-white border border-gray-200 rounded-lg select-none">
                                {page} / {meta.last_page}
                            </span>
                            <button onClick={() => setPage(p => Math.min(p + 1, meta.last_page))} disabled={page === meta.last_page} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50 text-gray-600 transition disabled:opacity-50 select-none">
                                Next <i className="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            <DetailModal show={showDetail} onClose={() => { setShowDetail(false); setDetailData(null); }} data={detailData} />
        </div>
    );
}
