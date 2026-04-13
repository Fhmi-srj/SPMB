import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext';

const API = '/api';
const fmt = (n) => 'Rp ' + (n || 0).toLocaleString('id-ID');

export default function Transaksi() {
    const { token, user } = useAuth();
    
    const [tab, setTab] = useState('pemasukan');
    const [pemasukan, setPemasukan] = useState([]);
    const [pengeluaran, setPengeluaran] = useState([]);
    const [summary, setSummary] = useState({ total_masuk: 0, total_keluar: 0, saldo: 0 });
    const [periode, setPeriode] = useState('semua');
    const [showModal, setShowModal] = useState(null); // 'pemasukan' | 'pengeluaran' | 'edit_pemasukan' | 'edit_pengeluaran'
    const [form, setForm] = useState({});
    const [searchPeserta, setSearchPeserta] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [tagihanInfo, setTagihanInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [kategoriList, setKategoriList] = useState(['Registrasi', 'MA', 'SMP', 'Pondok', 'Perlengkapan', 'Lainnya']);

    const isSuperAdmin = user?.role === 'super_admin';

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = useCallback(async () => {
        try {
            const [res1, res2] = await Promise.all([
                axios.get(`${API}/transaksi/pemasukan`, { headers, params: { periode } }),
                axios.get(`${API}/transaksi/pengeluaran`, { headers, params: { periode } }),
            ]);
            setPemasukan(res1.data.data || []);
            setPengeluaran(res2.data.data || []);
            
            const total_masuk = res1.data.summary?.total_approved || 0;
            const total_keluar = res2.data.summary?.total_approved || 0;
            setSummary({ total_masuk, total_keluar, saldo: total_masuk - total_keluar });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [periode, token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const searchPesertaFn = async (q) => {
        setSearchPeserta(q);
        if (q.length < 1) { setSearchResults([]); return; }
        try {
            const res = await axios.get(`${API}/transaksi/search-peserta`, { headers, params: { q } });
            setSearchResults(res.data.data || []);
        } catch { }
    };

    const selectPeserta = async (p) => {
        setForm({ ...form, pendaftaran_id: p.id });
        setSearchPeserta(p.nama + (p.no_registrasi ? ` (${p.no_registrasi})` : ''));
        setSearchResults([]);
        // Load tagihan
        try {
            const res = await axios.get(`${API}/transaksi/tagihan/${p.id}`, { headers });
            setTagihanInfo(res.data);
        } catch { }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const action = showModal;
        try {
            if (action === 'pemasukan') {
                await axios.post(`${API}/transaksi/pemasukan`, form, { headers });
            } else if (action === 'edit_pemasukan') {
                await axios.put(`${API}/transaksi/pemasukan/${form.id}`, form, { headers });
            } else if (action === 'pengeluaran') {
                await axios.post(`${API}/transaksi/pengeluaran`, form, { headers });
            } else if (action === 'edit_pengeluaran') {
                await axios.put(`${API}/transaksi/pengeluaran/${form.id}`, form, { headers });
            }
            Swal.fire({ icon: 'success', title: 'Berhasil!', timer: 1500, showConfirmButton: false });
            setShowModal(null); setForm({}); setTagihanInfo(null); setSearchPeserta('');
            fetchData();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error');
        }
    };

    const handleDelete = async (type, id) => {
        const ok = await Swal.fire({ title: 'Yakin ingin menghapus transaksi ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#E67E22', confirmButtonText: 'Ya, Hapus', cancelButtonText: 'Batal' });
        if (!ok.isConfirmed) return;
        try {
            await axios.delete(`${API}/transaksi/${type}/${id}`, { headers });
            Swal.fire({ icon: 'success', title: 'Berhasil dihapus!', timer: 1500, showConfirmButton: false });
            fetchData();
        } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error'); }
    };

    const handleApprove = async (type, id) => {
        try {
            await axios.post(`${API}/transaksi/${type}/${id}/approve`, {}, { headers });
            Swal.fire({ icon: 'success', title: 'Berhasil di-ACC!', timer: 1500, showConfirmButton: false });
            fetchData();
        } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error'); }
    };

    const handleReject = async (type, id) => {
        const { value: catatan } = await Swal.fire({ title: 'Alasan Penolakan', input: 'textarea', inputPlaceholder: 'Masukkan alasan (opsional)', showCancelButton: true, confirmButtonColor: '#E67E22', confirmButtonText: 'Tolak', cancelButtonText: 'Batal' });
        if (catatan === undefined) return;
        try {
            await axios.post(`${API}/transaksi/${type}/${id}/reject`, { catatan_approval: catatan }, { headers });
            Swal.fire({ icon: 'success', title: 'Transaksi ditolak', timer: 1500, showConfirmButton: false });
            fetchData();
        } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error'); }
    };

    const openEditPemasukan = (row) => {
        setForm({ id: row.id, pendaftaran_id: row.pendaftaran_id, tanggal: row.tanggal, nominal: row.nominal, jenis_pembayaran: row.jenis_pembayaran, keterangan: row.keterangan || '' });
        setSearchPeserta(row.nama || '');
        setShowModal('edit_pemasukan');
    };
    const openEditPengeluaran = (row) => {
        setForm({ id: row.id, tanggal: row.tanggal, nominal: row.nominal, kategori: row.kategori, keterangan: row.keterangan || '' });
        setShowModal('edit_pengeluaran');
    };

    const today = new Date().toISOString().split('T')[0];

    const statusBadge = (status) => {
        const cls = { approved: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700' };
        const lbl = { approved: 'ACC', pending: 'Pending', rejected: 'Ditolak' };
        return <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${cls[status] || 'bg-gray-100 text-gray-700'}`}>{lbl[status] || status}</span>;
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#E67E22] border-t-transparent rounded-full"></div></div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Transaksi Keuangan</h2>
                <p className="text-gray-500 text-sm">Kelola pemasukan dan pengeluaran SPMB</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm mb-1">Total Pemasukan</p>
                            <h3 className="text-2xl font-bold">{fmt(summary.total_masuk)}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg"><i className="fas fa-arrow-down text-2xl"></i></div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm mb-1">Total Pengeluaran</p>
                            <h3 className="text-2xl font-bold">{fmt(summary.total_keluar)}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg"><i className="fas fa-arrow-up text-2xl"></i></div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm mb-1">Saldo</p>
                            <h3 className="text-2xl font-bold">{fmt(summary.saldo)}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg"><i className="fas fa-wallet text-2xl"></i></div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="flex flex-wrap gap-2 items-center">
                    <label className="text-sm font-medium text-gray-700">Periode:</label>
                    <select value={periode} onChange={e => setPeriode(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none">
                        <option value="semua">Semua</option>
                        <option value="hari_ini">Hari Ini</option>
                        <option value="minggu_ini">Minggu Ini</option>
                        <option value="bulan_ini">Bulan Ini</option>
                    </select>
                    <button onClick={fetchData} className="bg-[#E67E22] hover:bg-[#d35400] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        <i className="fas fa-filter mr-2"></i>Terapkan
                    </button>
                    <button onClick={() => setPeriode('semua')} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        <i className="fas fa-redo"></i>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex w-full">
                        <button onClick={() => setTab('pemasukan')} className={`flex-1 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${tab === 'pemasukan' ? 'bg-[#E67E22] text-white border-[#E67E22]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent'}`}>
                            <i className="fas fa-arrow-down mr-2"></i>Pemasukan
                        </button>
                        <button onClick={() => setTab('pengeluaran')} className={`flex-1 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${tab === 'pengeluaran' ? 'bg-[#E67E22] text-white border-[#E67E22]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent'}`}>
                            <i className="fas fa-arrow-up mr-2"></i>Pengeluaran
                        </button>
                    </nav>
                </div>

                {/* Pemasukan Tab */}
                {tab === 'pemasukan' && (
                    <div className="p-6">
                        <button onClick={() => { setForm({ tanggal: today, nominal: '', jenis_pembayaran: '', keterangan: '' }); setSearchPeserta(''); setTagihanInfo(null); setShowModal('pemasukan'); }} className="bg-[#E67E22] hover:bg-[#d35400] text-white px-4 py-2 rounded-lg text-sm font-medium mb-4 transition">
                            <i className="fas fa-plus mr-2"></i>Tambah Pemasukan
                        </button>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Input</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nominal</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pemasukan.map(row => (
                                        <tr key={row.id} className={`hover:bg-gray-50 ${row.status === 'rejected' ? 'opacity-60' : ''}`}>
                                            <td className="px-4 py-3 text-sm font-mono text-gray-600">{row.invoice}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                <div>{row.tanggal ? new Date(row.tanggal).toLocaleDateString('id-ID') : '-'}</div>
                                                {row.input_nama && <div className="text-xs text-gray-400">oleh: {row.input_nama}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.nama}</td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">{fmt(row.nominal)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{row.jenis_pembayaran}</td>
                                            <td className="px-4 py-3 text-center">
                                                {statusBadge(row.status)}
                                                {row.status === 'approved' && row.approved_at && <div className="text-xs text-gray-400 mt-1">{new Date(row.approved_at).toLocaleDateString('id-ID')}</div>}
                                                {row.status === 'rejected' && row.catatan_approval && <div className="text-xs text-red-500 mt-1">{row.catatan_approval}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                {isSuperAdmin && row.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleApprove('pemasukan', row.id)} className="text-green-600 hover:text-green-800 mr-1" title="ACC"><i className="fas fa-check-circle"></i></button>
                                                        <button onClick={() => handleReject('pemasukan', row.id)} className="text-red-600 hover:text-red-800 mr-1" title="Tolak"><i className="fas fa-times-circle"></i></button>
                                                    </>
                                                )}
                                                {isSuperAdmin && (
                                                    <>
                                                        <button onClick={() => openEditPemasukan(row)} className="text-blue-600 hover:text-blue-800 mr-1" title="Edit"><i className="fas fa-edit"></i></button>
                                                        <button onClick={() => handleDelete('pemasukan', row.id)} className="text-red-600 hover:text-red-800" title="Hapus"><i className="fas fa-trash"></i></button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {pemasukan.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">Tidak ada data pemasukan</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pengeluaran Tab */}
                {tab === 'pengeluaran' && (
                    <div className="p-6">
                        <button onClick={() => { setForm({ tanggal: today, nominal: '', kategori: '', keterangan: '' }); setShowModal('pengeluaran'); }} className="bg-[#E67E22] hover:bg-[#d35400] text-white px-4 py-2 rounded-lg text-sm font-medium mb-4 transition">
                            <i className="fas fa-plus mr-2"></i>Tambah Pengeluaran
                        </button>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Input</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nominal</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pengeluaran.map(row => (
                                        <tr key={row.id} className={`hover:bg-gray-50 ${row.status === 'rejected' ? 'opacity-60' : ''}`}>
                                            <td className="px-4 py-3 text-sm font-mono text-gray-600">{row.invoice}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                <div>{row.tanggal ? new Date(row.tanggal).toLocaleDateString('id-ID') : '-'}</div>
                                                {row.input_nama && <div className="text-xs text-gray-400">oleh: {row.input_nama}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">{fmt(row.nominal)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{row.kategori}</td>
                                            <td className="px-4 py-3 text-center">
                                                {statusBadge(row.status)}
                                                {row.status === 'approved' && row.approved_at && <div className="text-xs text-gray-400 mt-1">{new Date(row.approved_at).toLocaleDateString('id-ID')}</div>}
                                                {row.status === 'rejected' && row.catatan_approval && <div className="text-xs text-red-500 mt-1">{row.catatan_approval}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                {isSuperAdmin && row.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleApprove('pengeluaran', row.id)} className="text-green-600 hover:text-green-800 mr-1" title="ACC"><i className="fas fa-check-circle"></i></button>
                                                        <button onClick={() => handleReject('pengeluaran', row.id)} className="text-red-600 hover:text-red-800 mr-1" title="Tolak"><i className="fas fa-times-circle"></i></button>
                                                    </>
                                                )}
                                                {isSuperAdmin && (
                                                    <>
                                                        <button onClick={() => openEditPengeluaran(row)} className="text-blue-600 hover:text-blue-800 mr-1" title="Edit"><i className="fas fa-edit"></i></button>
                                                        <button onClick={() => handleDelete('pengeluaran', row.id)} className="text-red-600 hover:text-red-800" title="Hapus"><i className="fas fa-trash"></i></button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {pengeluaran.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">Tidak ada data pengeluaran</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Pemasukan */}
            {(showModal === 'pemasukan' || showModal === 'edit_pemasukan') && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">{showModal === 'edit_pemasukan' ? 'Edit Pemasukan' : 'Tambah Pemasukan'}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            {showModal === 'pemasukan' && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Peserta *</label>
                                        <input type="text" value={searchPeserta} onChange={e => searchPesertaFn(e.target.value)} placeholder="Ketik nama atau no. registrasi..." autoComplete="off"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                        {searchResults.length > 0 && (
                                            <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                                                {searchResults.map(p => (
                                                    <button type="button" key={p.id} onClick={() => selectPeserta(p)} className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b border-gray-100">
                                                        <span className="font-medium">{p.nama}</span>
                                                        {p.no_registrasi && <span className="text-gray-500 ml-2">({p.no_registrasi})</span>}
                                                        <span className="text-xs text-gray-400 ml-2">{p.lembaga}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {tagihanInfo && (
                                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <h4 className="font-semibold text-blue-800 mb-3">Rincian Tagihan</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between"><span className="text-gray-700">Biaya Sekolah:</span><span className="font-semibold">{fmt(tagihanInfo.biaya_sekolah)}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-700">Biaya Perlengkapan:</span><span className="font-semibold">{fmt(tagihanInfo.biaya_perlengkapan)}</span></div>
                                                <div className="flex justify-between border-t border-blue-300 pt-2 mt-2"><span className="font-semibold text-gray-800">Total Tagihan:</span><span className="font-bold text-blue-800">{fmt(tagihanInfo.total_tagihan)}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-700">Sudah Dibayar:</span><span className="font-semibold text-green-600">{fmt(tagihanInfo.total_dibayar)}</span></div>
                                                <div className="flex justify-between border-t border-blue-300 pt-2 mt-2"><span className="font-semibold text-gray-800">Sisa Kekurangan:</span><span className="font-bold text-red-600">{fmt(tagihanInfo.sisa_kekurangan)}</span></div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                                    <input type="date" value={form.tanggal || ''} onChange={e => setForm({ ...form, tanggal: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nominal *</label>
                                    <input type="number" value={form.nominal || ''} onChange={e => setForm({ ...form, nominal: e.target.value })} required placeholder="Masukkan nominal" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Pembayaran *</label>
                                <select value={form.jenis_pembayaran || ''} onChange={e => setForm({ ...form, jenis_pembayaran: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none">
                                    <option value="">Pilih Jenis</option>
                                    <option value="Transfer">Transfer</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                                <textarea value={form.keterangan || ''} onChange={e => setForm({ ...form, keterangan: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none"></textarea>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => { setShowModal(null); setTagihanInfo(null); setSearchPeserta(''); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-[#E67E22] hover:bg-[#d35400] text-white rounded-lg transition">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Pengeluaran */}
            {(showModal === 'pengeluaran' || showModal === 'edit_pengeluaran') && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">{showModal === 'edit_pengeluaran' ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                                    <input type="date" value={form.tanggal || ''} onChange={e => setForm({ ...form, tanggal: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nominal *</label>
                                    <input type="number" value={form.nominal || ''} onChange={e => setForm({ ...form, nominal: e.target.value })} required placeholder="Masukkan nominal" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                                <select value={form.kategori || ''} onChange={e => setForm({ ...form, kategori: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none">
                                    <option value="">Pilih Kategori</option>
                                    {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                                <textarea value={form.keterangan || ''} onChange={e => setForm({ ...form, keterangan: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none"></textarea>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setShowModal(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-[#E67E22] hover:bg-[#d35400] text-white rounded-lg transition">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
