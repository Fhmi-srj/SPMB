import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const fmt = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

export default function Dashboard() {
    const { token, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/statistics', {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        })
            .then(r => r.json())
            .then(d => { if (d.success) setStats(d.data); })
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#1B7A3D] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const canAccessAdmin = user?.role === 'super_admin' || user?.role === 'admin';

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-500 text-sm">Selamat datang, {user?.nama || 'Admin'}!</p>
            </div>

            {/* Stats Row 1 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#1B7A3D]/10 rounded-lg flex items-center justify-center">
                            <i className="fas fa-users text-[#1B7A3D] text-xl"></i>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{stats?.total ?? 0}</p>
                            <p className="text-xs text-gray-500">Total Pendaftar</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-male text-blue-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{stats?.per_gender?.['L'] ?? 0}</p>
                            <p className="text-xs text-gray-500">Santri Putra</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-female text-pink-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{stats?.per_gender?.['P'] ?? 0}</p>
                            <p className="text-xs text-gray-500">Santri Putri</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-clock text-yellow-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{stats?.per_status?.pending ?? 0}</p>
                            <p className="text-xs text-gray-500">Menunggu</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row 2 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-mars text-blue-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{stats?.per_gender?.L ?? 0}</p>
                            <p className="text-xs text-gray-500">Laki-laki</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-venus text-pink-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{stats?.per_gender?.P ?? 0}</p>
                            <p className="text-xs text-gray-500">Perempuan</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-check-circle text-green-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{stats?.per_status?.verified ?? 0}</p>
                            <p className="text-xs text-gray-500">Terverifikasi</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-times-circle text-red-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{stats?.per_status?.rejected ?? 0}</p>
                            <p className="text-xs text-gray-500">Ditolak</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pos Keuangan Summary (admin only) */}
            {canAccessAdmin && stats?.pos_keuangan && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">
                            <i className="fas fa-wallet text-[#1B7A3D] mr-2"></i>Pos Keuangan
                        </h3>
                        <Link to="/admin/pos-keuangan" className="text-sm text-[#1B7A3D] hover:text-[#145C2E]">
                            Lihat Detail <i className="fas fa-arrow-right ml-1"></i>
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Kategori</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Pemasukan</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Pengeluaran</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Sisa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {Object.entries(stats.pos_keuangan).map(([k, v]) => {
                                    const sisa = (v.pemasukan || 0) - (v.pengeluaran || 0);
                                    return (
                                        <tr key={k} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{k}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-600 whitespace-nowrap">{fmt(v.pemasukan)}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-600 whitespace-nowrap">{fmt(v.pengeluaran)}</td>
                                            <td className={`px-4 py-3 text-sm text-right font-semibold whitespace-nowrap ${sisa >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(sisa)}</td>
                                        </tr>
                                    );
                                })}
                                {(() => {
                                    const tp = Object.values(stats.pos_keuangan).reduce((s, v) => s + Number(v.pemasukan || 0), 0);
                                    const te = Object.values(stats.pos_keuangan).reduce((s, v) => s + Number(v.pengeluaran || 0), 0);
                                    const ts = tp - te;
                                    return (
                                        <tr className="bg-gray-50 font-bold">
                                            <td className="px-4 py-3 text-sm text-gray-800">TOTAL</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-800">{fmt(tp)}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-800">{fmt(te)}</td>
                                            <td className={`px-4 py-3 text-sm text-right ${ts >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(ts)}</td>
                                        </tr>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Monthly Chart */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fas fa-chart-bar text-[#1B7A3D] mr-2"></i>Pendaftaran 6 Bulan Terakhir</h3>
                    <div className="h-64">
                        {stats?.monthly && (
                            <Bar
                                data={{
                                    labels: stats.monthly.labels || [],
                                    datasets: [{
                                        label: 'Pendaftaran',
                                        data: stats.monthly.data || [],
                                        backgroundColor: 'rgba(230, 126, 34, 0.8)',
                                        borderRadius: 6,
                                    }],
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
                            />
                        )}
                    </div>
                </div>

                {/* Gender Chart */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fas fa-chart-pie text-[#1B7A3D] mr-2"></i>Distribusi Santri</h3>
                    <div className="h-64 flex items-center justify-center">
                        {stats?.per_gender && (
                            <Doughnut
                                data={{
                                    labels: ['Putra', 'Putri'],
                                    datasets: [{
                                        data: [stats.per_gender['L'] || 0, stats.per_gender['P'] || 0],
                                        backgroundColor: ['#3B82F6', '#EC4899'],
                                        borderWidth: 0,
                                    }],
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' } } }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Document Completion */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fas fa-folder-open text-[#1B7A3D] mr-2"></i>Kelengkapan Dokumen</h3>
                    <div className="space-y-3">
                        {stats?.doc_stats && Object.entries(stats.doc_stats).map(([field, count]) => {
                            const labels = { file_kk: 'Kartu Keluarga', file_ktp_ortu: 'KTP Orang Tua', file_akta: 'Akta Kelahiran', file_ijazah: 'Ijazah', file_sertifikat: 'Sertifikat' };
                            const total = stats.total || 1;
                            const pct = Math.round((count / total) * 100);
                            return (
                                <div key={field}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-600">{labels[field] || field}</span>
                                        <span className="text-gray-500">{count}/{stats.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-[#1B7A3D] h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Gender Chart */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fas fa-venus-mars text-[#1B7A3D] mr-2"></i>Distribusi Gender</h3>
                    <div className="h-48 flex items-center justify-center">
                        {stats?.per_gender && (
                            <Doughnut
                                data={{
                                    labels: ['Laki-laki', 'Perempuan'],
                                    datasets: [{
                                        data: [stats.per_gender.L || 0, stats.per_gender.P || 0],
                                        backgroundColor: ['#3B82F6', '#EC4899'],
                                        borderWidth: 0,
                                    }],
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'bottom' } } }}
                            />
                        )}
                    </div>
                </div>

                {/* Sumber Info Chart */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fas fa-bullhorn text-[#1B7A3D] mr-2"></i>Sumber Informasi</h3>
                    <div className="h-48">
                        {stats?.sumber_info && (
                            <Bar
                                data={{
                                    labels: Object.keys(stats.sumber_info),
                                    datasets: [{
                                        label: 'Jumlah',
                                        data: Object.values(stats.sumber_info),
                                        backgroundColor: ['rgba(230,126,34,0.8)', 'rgba(59,130,246,0.8)', 'rgba(16,185,129,0.8)', 'rgba(139,92,246,0.8)', 'rgba(236,72,153,0.8)'],
                                        borderRadius: 4,
                                    }],
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Two Column: Recent Registrations & Activity Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Registrations */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Pendaftaran Terbaru</h3>
                        <Link to="/admin/pendaftaran" className="text-[#1B7A3D] text-sm hover:underline">Lihat Semua</Link>
                    </div>
                    {(!stats?.latest || stats.latest.length === 0) ? (
                        <div className="p-8 text-center text-gray-500">
                            <i className="fas fa-inbox text-4xl mb-3"></i>
                            <p>Belum ada pendaftaran</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {stats.latest.map((row, i) => {
                                const stCls = { pending: 'bg-yellow-100 text-yellow-800', verified: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' }[row.status] || '';
                                const stText = { pending: 'Menunggu', verified: 'Verif', rejected: 'Tolak' }[row.status] || row.status;
                                const date = new Date(row.created_at);
                                return (
                                    <div key={i} className="p-3 hover:bg-gray-50 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm text-gray-800">{row.nama}</p>
                                            <p className="text-xs text-gray-500">{row.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stCls}`}>{stText}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Activity Log (admin only) */}
                {canAccessAdmin && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">Aktivitas Terbaru</h3>
                            <Link to="/admin/aktivitas" className="text-[#1B7A3D] text-sm hover:underline">Lihat Semua</Link>
                        </div>
                        {(!stats?.activity_log || stats.activity_log.length === 0) ? (
                            <div className="p-8 text-center text-gray-500">
                                <i className="fas fa-history text-4xl mb-3"></i>
                                <p>Belum ada aktivitas tercatat</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {stats.activity_log.map((log, i) => (
                                    <div key={i} className="p-3 hover:bg-gray-50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">{log.action}</span>
                                            <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{log.description}</p>
                                        <p className="text-xs text-gray-400">oleh {log.user?.nama || 'System'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
