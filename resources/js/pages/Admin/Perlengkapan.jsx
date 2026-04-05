import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API = '/api';

export default function Perlengkapan() {
    const [items, setItems] = useState([]);
    const [peserta, setPeserta] = useState([]);
    const [searchNama, setSearchNama] = useState('');
    const [filterLembaga, setFilterLembaga] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = useCallback(async () => {
        try {
            const [itemsRes, pesananRes] = await Promise.all([
                axios.get(`${API}/perlengkapan/items`, { headers }),
                axios.get(`${API}/perlengkapan/pesanan`, { headers, params: { search: searchNama, lembaga: filterLembaga } }),
            ]);
            setItems(itemsRes.data.data || []);
            setPeserta(pesananRes.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [searchNama, filterLembaga]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const togglePerlengkapan = async (pesertaId, itemId, currentStatus, namaPeserta, namaItem) => {
        const newStatus = currentStatus ? 0 : 1;
        const actionText = newStatus ? 'menambahkan' : 'membatalkan';

        const result = await Swal.fire({
            title: 'Konfirmasi',
            html: `Yakin ingin <strong>${actionText}</strong> perlengkapan<br><strong>${namaItem}</strong><br>untuk <strong>${namaPeserta}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan',
            cancelButtonText: 'Batal',
        });

        if (!result.isConfirmed) return;

        try {
            await axios.post(`${API}/perlengkapan/pesanan/toggle`, {
                pendaftaran_id: pesertaId,
                perlengkapan_item_id: itemId,
                status: newStatus,
            }, { headers });
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Status perlengkapan berhasil diupdate', timer: 1500, showConfirmButton: false });
            fetchData();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal!', text: err.response?.data?.message || 'Terjadi kesalahan' });
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchData();
    };

    const resetFilter = () => {
        setSearchNama('');
        setFilterLembaga('');
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#E67E22] border-t-transparent rounded-full"></div></div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Kelola Perlengkapan</h2>
                <p className="text-gray-500 text-sm">Catat pemesanan perlengkapan tambahan per peserta</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cari Nama</label>
                        <input type="text" value={searchNama} onChange={e => setSearchNama(e.target.value)} placeholder="Nama peserta..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lembaga</label>
                        <select value={filterLembaga} onChange={e => setFilterLembaga(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none">
                            <option value="">Semua Lembaga</option>
                            <option value="SMP NU BP">SMP NU BP</option>
                            <option value="MA ALHIKAM">MA ALHIKAM</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-2">
                        <button type="submit" className="bg-[#E67E22] hover:bg-[#d35400] text-white px-4 py-2 rounded-lg text-sm font-medium transition flex-1">
                            <i className="fas fa-search mr-2"></i>Filter
                        </button>
                        <button type="button" onClick={resetFilter} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                            <i className="fas fa-redo"></i>
                        </button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-12 bg-gray-50 z-10">Nama</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">JK</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lembaga</th>
                                {items.map(item => (
                                    <th key={item.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">{item.nama_item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {peserta.map((p, idx) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800 sticky left-12 bg-white z-10">{p.nama}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{p.jenis_kelamin === 'L' ? 'L' : 'P'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{p.lembaga}</td>
                                    {items.map(item => {
                                        const isChecked = p.perlengkapan && p.perlengkapan[item.id] == 1;
                                        return (
                                            <td key={item.id} className="px-4 py-3 text-center">
                                                <label className="toggle-switch">
                                                    <input type="checkbox" checked={isChecked} onChange={() => togglePerlengkapan(p.id, item.id, isChecked, p.nama, item.nama_item)} />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            {peserta.length === 0 && (
                                <tr>
                                    <td colSpan={4 + items.length} className="px-4 py-8 text-center text-gray-500 text-sm">
                                        <i className="fas fa-inbox text-3xl mb-2 text-gray-300 block"></i>
                                        <p>Tidak ada data peserta</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Toggle Switch CSS */}
            <style>{`
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #ccc;
                    transition: .3s;
                    border-radius: 24px;
                }
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }
                input:checked + .toggle-slider {
                    background-color: #10b981;
                }
                input:checked + .toggle-slider:before {
                    transform: translateX(20px);
                }
            `}</style>
        </div>
    );
}
