import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API = '/api';
const fmt = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');

export default function PosKeuangan() {
    const [data, setData] = useState([]);
    const [totals, setTotals] = useState({});
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState(null);
    const [filterLembaga, setFilterLembaga] = useState('');
    const [filterStatusPondok, setFilterStatusPondok] = useState('');
    const [filterStatusPembayaran, setFilterStatusPembayaran] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API}/pos-keuangan`, { headers });
            setData(res.data.data || []);
            setTotals(res.data.totals || {});
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const uniqueLembaga = React.useMemo(() => {
        const set = new Set(data.map(r => r.lembaga).filter(Boolean));
        return Array.from(set).sort();
    }, [data]);

    const uniqueStatusPondok = React.useMemo(() => {
        const set = new Set(data.map(r => r.status_mukim).filter(Boolean));
        return Array.from(set).sort();
    }, [data]);

    const getRowStatusPembayaran = (row) => {
        const t = Number(row.total_tagihan || 0);
        const p = Number(row.total_pembayaran || 0);
        if (t <= 0) return 'Lunas';
        if (p <= 0) return 'Belum Bayar';
        if (p >= t) return 'Lunas';
        return 'Cicil';
    };

    const filteredAndSorted = React.useMemo(() => {
        let result = data.filter(row => {
            const matchesSearch = !search || row.nama?.toLowerCase().includes(search.toLowerCase());
            const matchesLembaga = !filterLembaga || row.lembaga === filterLembaga;
            const matchesStatusPondok = !filterStatusPondok || row.status_mukim === filterStatusPondok;
            const matchesStatusPembayaran = !filterStatusPembayaran || getRowStatusPembayaran(row) === filterStatusPembayaran;
            return matchesSearch && matchesLembaga && matchesStatusPondok && matchesStatusPembayaran;
        });

        if (sortField && sortDirection) {
            result = [...result].sort((a, b) => {
                let valA, valB;
                if (sortField === 'status_pembayaran') {
                    valA = getRowStatusPembayaran(a);
                    valB = getRowStatusPembayaran(b);
                } else {
                    valA = a[sortField];
                    valB = b[sortField];
                }

                if (valA === undefined || valA === null) valA = '';
                if (valB === undefined || valB === null) valB = '';

                const isNumeric = (typeof valA === 'number' || typeof valB === 'number' || 
                                   (!isNaN(Number(valA)) && !isNaN(Number(valB)))) && 
                                  !['nama', 'lembaga', 'status_mukim', 'status_pembayaran'].includes(sortField);

                if (isNumeric) {
                    const numA = Number(valA);
                    const numB = Number(valB);
                    return sortDirection === 'asc' ? numA - numB : numB - numA;
                } else {
                    const strA = String(valA).toLowerCase();
                    const strB = String(valB).toLowerCase();
                    if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
                    if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                }
            });
        }

        return result;
    }, [data, search, filterLembaga, filterStatusPondok, filterStatusPembayaran, sortField, sortDirection]);

    const calculatedTotals = React.useMemo(() => {
        let total_ma = 0;
        let total_smp = 0;
        let total_pondok = 0;
        let total_perlengkapan = 0;
        let total_registrasi = 0;
        let total_sisa = 0;

        filteredAndSorted.forEach(row => {
            total_registrasi += Number(row.pos_registrasi || 0);
            total_ma += Number(row.pos_ma || 0);
            total_smp += Number(row.pos_smp || 0);
            total_pondok += Number(row.pos_pondok || 0);
            total_perlengkapan += Number(row.pos_perlengkapan || 0);
            total_sisa += Number(row.pos_sisa || 0);
        });

        return {
            total_ma,
            total_smp,
            total_pondok,
            total_perlengkapan,
            total_registrasi,
            total_sisa
        };
    }, [filteredAndSorted]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (field) => {
        if (sortField !== field) return <i className="fas fa-sort text-gray-300 ml-1 text-[9px]"></i>;
        if (sortDirection === 'asc') return <i className="fas fa-sort-up text-[#E67E22] ml-1 text-[10px]"></i>;
        if (sortDirection === 'desc') return <i className="fas fa-sort-down text-[#E67E22] ml-1 text-[10px]"></i>;
        return <i className="fas fa-sort text-gray-300 ml-1 text-[9px]"></i>;
    };

    const hasActiveFilters = filterLembaga || filterStatusPondok || filterStatusPembayaran || search || sortField;
    const handleResetAll = () => {
        setFilterLembaga('');
        setFilterStatusPondok('');
        setFilterStatusPembayaran('');
        setSearch('');
        setSortField('');
        setSortDirection(null);
    };

    const exportToExcel = () => {
        const tableEl = document.getElementById('posKeuanganTable');
        const wb = XLSX.utils.table_to_book(tableEl, { sheet: "Pos Keuangan" });
        XLSX.writeFile(wb, 'Pos_Keuangan_' + new Date().toISOString().split('T')[0] + '.xlsx');
    };

    const statusPembayaranBadge = (tagihan, pembayaran) => {
        const t = Number(tagihan || 0);
        const p = Number(pembayaran || 0);
        
        let label = 'Lunas';
        let colorClass = 'bg-green-100 text-green-700';
        
        if (t <= 0) {
            label = 'Lunas';
            colorClass = 'bg-green-100 text-green-700';
        } else if (p <= 0) {
            label = 'Belum Bayar';
            colorClass = 'bg-red-100 text-red-700';
        } else if (p >= t) {
            label = 'Lunas';
            colorClass = 'bg-green-100 text-green-700';
        } else {
            label = 'Cicil';
            colorClass = 'bg-yellow-100 text-yellow-700';
        }
        
        return (
            <span className={`inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full ${colorClass}`}>
                {label}
            </span>
        );
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#E67E22] border-t-transparent rounded-full"></div></div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Pos Keuangan</h2>
                <p className="text-gray-500 text-sm">Pembagian keuangan dari pembayaran pendaftar</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-3 sm:p-5 text-white">
                    <p className="text-blue-100 text-[10px] sm:text-sm mb-1">Total MA</p>
                    <h3 className="text-sm sm:text-2xl font-bold">{fmt(calculatedTotals.total_ma)}</h3>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-3 sm:p-5 text-white">
                    <p className="text-green-100 text-[10px] sm:text-sm mb-1">Total SMP</p>
                    <h3 className="text-sm sm:text-2xl font-bold">{fmt(calculatedTotals.total_smp)}</h3>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-3 sm:p-5 text-white">
                    <p className="text-purple-100 text-[10px] sm:text-sm mb-1">Total Pondok</p>
                    <h3 className="text-sm sm:text-2xl font-bold">{fmt(calculatedTotals.total_pondok)}</h3>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-3 sm:p-5 text-white">
                    <p className="text-orange-100 text-[10px] sm:text-sm mb-1">Total Perlengkapan</p>
                    <h3 className="text-sm sm:text-2xl font-bold">{fmt(calculatedTotals.total_perlengkapan)}</h3>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="flex flex-col gap-4">
                    {/* Top Row: Search and Export */}
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        <div className="flex-1 w-full relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama siswa..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] outline-none transition" />
                        </div>
                        {hasActiveFilters && (
                            <button onClick={handleResetAll} className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm">
                                <i className="fas fa-filter-circle-xmark"></i>
                                <span>Reset Filter</span>
                            </button>
                        )}
                        <button onClick={exportToExcel} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm">
                            <i className="fas fa-file-excel"></i>
                            <span>Export Excel</span>
                        </button>
                    </div>

                    {/* Bottom Row: Filters with Icons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                        {/* Lembaga Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fas fa-university text-[#E67E22] text-xs"></i>
                            </div>
                            <select value={filterLembaga} onChange={e => setFilterLembaga(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] outline-none transition appearance-none cursor-pointer">
                                <option value="">Filter Lembaga (Semua)</option>
                                {uniqueLembaga.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fas fa-chevron-down text-[10px]"></i>
                            </div>
                        </div>

                        {/* Status Pondok Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fas fa-home text-[#E67E22] text-xs"></i>
                            </div>
                            <select value={filterStatusPondok} onChange={e => setFilterStatusPondok(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] outline-none transition appearance-none cursor-pointer">
                                <option value="">Filter Status Pondok (Semua)</option>
                                {uniqueStatusPondok.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fas fa-chevron-down text-[10px]"></i>
                            </div>
                        </div>

                        {/* Status Pembayaran Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fas fa-receipt text-[#E67E22] text-xs"></i>
                            </div>
                            <select value={filterStatusPembayaran} onChange={e => setFilterStatusPembayaran(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] outline-none transition appearance-none cursor-pointer">
                                <option value="">Filter Status Pembayaran (Semua)</option>
                                <option value="Lunas">Lunas</option>
                                <option value="Cicil">Cicil</option>
                                <option value="Belum Bayar">Belum Bayar</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fas fa-chevron-down text-[10px]"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table id="posKeuanganTable" className="w-full text-[11px] sm:text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-2 sm:px-3 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">No</th>
                                <th onClick={() => handleSort('nama')} className="cursor-pointer hover:bg-gray-100 px-2 py-2 sm:px-3 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase sticky left-12 bg-gray-50 z-10 select-none">
                                    <span className="flex items-center">Nama {renderSortIcon('nama')}</span>
                                </th>
                                <th onClick={() => handleSort('lembaga')} className="cursor-pointer hover:bg-gray-100 px-2 py-2 sm:px-3 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase select-none">
                                    <span className="flex items-center">Lembaga {renderSortIcon('lembaga')}</span>
                                </th>
                                <th onClick={() => handleSort('status_mukim')} className="cursor-pointer hover:bg-gray-100 px-2 py-2 sm:px-3 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase select-none">
                                    <span className="flex items-center">Status Pondok {renderSortIcon('status_mukim')}</span>
                                </th>
                                <th onClick={() => handleSort('total_tagihan')} className="cursor-pointer hover:bg-gray-100 px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase select-none">
                                    <span className="flex items-center justify-end">Tagihan {renderSortIcon('total_tagihan')}</span>
                                </th>
                                <th onClick={() => handleSort('total_pembayaran')} className="cursor-pointer hover:bg-gray-100 px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase select-none">
                                    <span className="flex items-center justify-end">Pembayaran {renderSortIcon('total_pembayaran')}</span>
                                </th>
                                <th onClick={() => handleSort('status_pembayaran')} className="cursor-pointer hover:bg-gray-100 px-2 py-2 sm:px-3 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase select-none">
                                    <span className="flex items-center justify-center">Status {renderSortIcon('status_pembayaran')}</span>
                                </th>
                                <th onClick={() => handleSort('pos_registrasi')} className="cursor-pointer hover:bg-blue-100/50 px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase bg-gray-50 select-none">
                                    <span className="flex items-center justify-end">Registrasi {renderSortIcon('pos_registrasi')}</span>
                                </th>
                                <th onClick={() => handleSort('pos_ma')} className="cursor-pointer hover:bg-blue-100/50 px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase bg-blue-50 select-none">
                                    <span className="flex items-center justify-end">MA {renderSortIcon('pos_ma')}</span>
                                </th>
                                <th onClick={() => handleSort('pos_smp')} className="cursor-pointer hover:bg-green-100/50 px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase bg-green-50 select-none">
                                    <span className="flex items-center justify-end">SMP {renderSortIcon('pos_smp')}</span>
                                </th>
                                <th onClick={() => handleSort('pos_pondok')} className="cursor-pointer hover:bg-purple-100/50 px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase bg-purple-50 select-none">
                                    <span className="flex items-center justify-end">Pondok {renderSortIcon('pos_pondok')}</span>
                                </th>
                                <th onClick={() => handleSort('pos_perlengkapan')} className="cursor-pointer hover:bg-orange-100/50 px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase bg-orange-50 select-none">
                                    <span className="flex items-center justify-end">Perlengkapan {renderSortIcon('pos_perlengkapan')}</span>
                                </th>
                                <th onClick={() => handleSort('pos_sisa')} className="cursor-pointer hover:bg-red-100/50 px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase bg-red-50 select-none">
                                    <span className="flex items-center justify-end">Sisa {renderSortIcon('pos_sisa')}</span>
                                </th>
                            </tr>

                            {/* Total Row */}
                            <tr className="bg-[#E67E22] text-white font-bold">
                                <td colSpan={7} className="px-2 py-2 sm:px-3 sm:py-3 text-[10px] sm:text-sm">TOTAL</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-sm">{fmt(calculatedTotals.total_registrasi)}</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-sm">{fmt(calculatedTotals.total_ma)}</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-sm">{fmt(calculatedTotals.total_smp)}</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-sm">{fmt(calculatedTotals.total_pondok)}</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-sm">{fmt(calculatedTotals.total_perlengkapan)}</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-[10px] sm:text-sm">{fmt(calculatedTotals.total_sisa)}</td>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAndSorted.map((row, idx) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-gray-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 font-medium text-gray-800 sticky left-12 bg-white z-10 leading-tight">{row.nama}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-gray-600">{row.lembaga}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-gray-600 leading-tight">{row.status_mukim}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-gray-600">{fmt(row.total_tagihan)}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-right font-semibold text-green-600">{fmt(row.total_pembayaran)}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-center">{statusPembayaranBadge(row.total_tagihan, row.total_pembayaran)}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-gray-700 bg-gray-50">{fmt(row.pos_registrasi)}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-blue-700 bg-blue-50">{fmt(row.pos_ma)}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-green-700 bg-green-50">{fmt(row.pos_smp)}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-purple-700 bg-purple-50">{fmt(row.pos_pondok)}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-orange-700 bg-orange-50">{fmt(row.pos_perlengkapan)}</td>
                                    <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-red-700 bg-red-50">{fmt(row.pos_sisa)}</td>
                                </tr>
                            ))}
                            {filteredAndSorted.length === 0 && (
                                <tr><td colSpan={13} className="px-3 py-8 text-center text-gray-500">Tidak ada data</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
