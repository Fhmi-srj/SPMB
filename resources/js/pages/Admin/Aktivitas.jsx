import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ACTION_COLORS = {
    LOGIN: 'bg-green-100 text-green-800',
    LOGOUT: 'bg-gray-100 text-gray-800',
    CREATE: 'bg-blue-100 text-blue-800',
    UPDATE: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    STATUS_UPDATE: 'bg-blue-100 text-blue-800',
    PROFILE_UPDATE: 'bg-yellow-100 text-yellow-800',
    PASSWORD_CHANGE: 'bg-purple-100 text-purple-800',
};

export default function Aktivitas() {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ action: '', from: '', to: '' });
    const [actions, setActions] = useState([]);

    const fetch_ = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({ page, per_page: 20 });
        if (filters.action) params.set('action', filters.action);
        if (filters.from) params.set('from', filters.from);
        if (filters.to) params.set('to', filters.to);
        const res = await fetch(`/api/activity-log?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        if (d.success) {
            setData(d.data);
            setMeta(d.meta || {});
            if (d.actions) setActions(d.actions);
        }
        setLoading(false);
    }, [token, page, filters]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const handleFilter = (e) => {
        e.preventDefault();
        setPage(1);
        fetch_();
    };

    const clearFilters = () => {
        setFilters({ action: '', from: '', to: '' });
        setPage(1);
    };

    const totalPages = meta.last_page || 1;
    const total = meta.total || 0;
    const from = meta.from || 0;
    const to = meta.to || 0;

    // Generate page numbers (show current ± 2)
    const pageNumbers = [];
    const startP = Math.max(1, page - 2);
    const endP = Math.min(totalPages, page + 2);
    for (let p = startP; p <= endP; p++) pageNumbers.push(p);

    const formatDate = (d) => {
        if (!d) return '-';
        const dt = new Date(d);
        const day = dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const time = dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return { day, time };
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Log Aktivitas</h2>
                <p className="text-gray-500 text-sm">Riwayat aktivitas admin di sistem</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <select value={filters.action} onChange={e => setFilters(f => ({ ...f, action: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none">
                        <option value="">Semua Aksi</option>
                        {actions.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} placeholder="Dari tanggal"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                    <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} placeholder="Sampai tanggal"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-[#E67E22] text-white px-4 py-2 rounded-lg hover:bg-[#D35400] transition">
                            <i className="fas fa-search mr-2"></i>Filter
                        </button>
                        <button type="button" onClick={clearFilters} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-[#E67E22] border-t-transparent rounded-full animate-spin"></div></div>
                ) : data.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <i className="fas fa-history text-4xl mb-3 block"></i>
                        <p>Belum ada aktivitas tercatat</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.map(row => {
                                        const dt = formatDate(row.created_at);
                                        const color = ACTION_COLORS[row.action] ?? 'bg-gray-100 text-gray-700';
                                        return (
                                            <tr key={row.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {dt.day}<br /><span className="text-xs">{dt.time}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                    {row.user?.nama ?? row.admin_nama ?? 'System'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{row.action}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{row.description}</td>
                                                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{row.ip_address}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-sm text-gray-500">
                                Menampilkan {from}-{to} dari {total} log
                            </p>
                            {totalPages > 1 && (
                                <div className="flex gap-1">
                                    {page > 1 && (
                                        <button onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                    )}
                                    {pageNumbers.map(p => (
                                        <button key={p} onClick={() => setPage(p)}
                                            className={`px-3 py-1 border rounded-lg text-sm ${p === page ? 'bg-[#E67E22] text-white border-[#E67E22]' : 'border-gray-300 hover:bg-gray-50'}`}>
                                            {p}
                                        </button>
                                    ))}
                                    {page < totalPages && (
                                        <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
