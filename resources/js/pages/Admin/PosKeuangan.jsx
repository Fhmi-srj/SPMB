import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API = '/api';
const fmt = (n) => 'Rp' + (n || 0).toLocaleString('id-ID');

export default function PosKeuangan() {
    const [data, setData] = useState([]);
    const [totals, setTotals] = useState({});
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API}/pos-keuangan`, { headers });
            setData(res.data.data || []);
            setTotals(res.data.summary || {});
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const filtered = data.filter(r => r.nama?.toLowerCase().includes(search.toLowerCase()));

    const exportToExcel = () => {
        const tableEl = document.getElementById('posKeuanganTable');
        const wb = XLSX.utils.table_to_book(tableEl, { sheet: "Pos Keuangan" });
        XLSX.writeFile(wb, 'Pos_Keuangan_' + new Date().toISOString().split('T')[0] + '.xlsx');
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B7A3D] border-t-transparent rounded-full"></div></div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Pos Keuangan</h2>
                <p className="text-gray-500 text-sm">Pembagian keuangan dari pembayaran pendaftar</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white md:col-span-2">
                    <p className="text-green-100 text-sm mb-1">Total Biaya/Pondok</p>
                    <h3 className="text-2xl font-bold">{fmt(totals.total_pondok)}</h3>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white md:col-span-2">
                    <p className="text-orange-100 text-sm mb-1">Total Perlengkapan</p>
                    <h3 className="text-2xl font-bold">{fmt(totals.total_perlengkapan)}</h3>
                </div>
            </div>

            {/* Search and Export */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-search text-gray-400"></i>
                        </div>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama siswa..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7A3D] focus:border-[#1B7A3D] outline-none transition" />
                    </div>
                    <button onClick={exportToExcel} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 whitespace-nowrap">
                        <i className="fas fa-file-excel"></i>
                        <span>Export Excel</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table id="posKeuanganTable" className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">No</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-12 bg-gray-50 z-10">Nama Santri</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tagihan</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pembayaran</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-green-50">Biaya/Pondok</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-orange-50">Perlengkapan</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-red-50">Sisa</th>
                            </tr>
                            {/* Total Row */}
                            <tr className="bg-[#1B7A3D] text-white font-bold">
                                <td colSpan={4} className="px-3 py-3">TOTAL</td>
                                <td className="px-3 py-3 text-right">{fmt(totals.total_pondok)}</td>
                                <td className="px-3 py-3 text-right">{fmt(totals.total_perlengkapan)}</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((row, idx) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-3 text-gray-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                    <td className="px-3 py-3 font-medium text-gray-800 sticky left-12 bg-white z-10">{row.nama}</td>
                                    <td className="px-3 py-3 text-right text-gray-600">{fmt(row.total_tagihan)}</td>
                                    <td className="px-3 py-3 text-right font-semibold text-green-600">{fmt(row.total_pembayaran)}</td>
                                    <td className="px-3 py-3 text-right text-green-700 bg-green-50">{fmt(row.pos_pondok)}</td>
                                    <td className="px-3 py-3 text-right text-orange-700 bg-orange-50">{fmt(row.pos_perlengkapan)}</td>
                                    <td className="px-3 py-3 text-right text-red-700 bg-red-50">{fmt(row.pos_sisa)}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
