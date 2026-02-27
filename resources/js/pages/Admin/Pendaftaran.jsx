import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = { pending: 'Pending', verified: 'Terverifikasi', rejected: 'Ditolak' };

function Modal({ show, onClose, children, title }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b">
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

function DetailRow({ label, value }) {
    if (!value && value !== 0) return null;
    return (
        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-50">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="col-span-2 text-sm font-medium text-gray-800">{value}</span>
        </div>
    );
}

export default function Pendaftaran() {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', lembaga: '', status: '', page: 1 });
    const [selected, setSelected] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({ ...filters, per_page: 15 }).toString();
        const res = await fetch(`/api/pendaftaran?${params}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        const d = await res.json();
        if (d.success) { setData(d.data); setMeta(d.meta); }
        setLoading(false);
    }, [token, filters]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const openDetail = (row) => { setSelected(row); setShowDetail(true); };
    const openEdit = (row) => {
        setSelected(row);
        setEditForm({ status: row.status, catatan_admin: row.catatan_admin ?? '' });
        setShowEdit(true);
    };

    const handleSaveEdit = async () => {
        setSaving(true);
        const res = await fetch(`/api/pendaftaran/${selected.id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(editForm),
        });
        const d = await res.json();
        setSaving(false);
        if (d.success) {
            setShowEdit(false);
            Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data diperbarui.', confirmButtonColor: '#E67E22', timer: 1500, showConfirmButton: false });
            fetchData();
        }
    };

    const handleDelete = async (row) => {
        const conf = await Swal.fire({
            title: 'Hapus Data?',
            html: `Hapus pendaftaran <b>${row.nama}</b>? Ini tidak bisa dibatalkan.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#ef4444',
        });
        if (!conf.isConfirmed) return;

        const res = await fetch(`/api/pendaftaran/${row.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        const d = await res.json();
        if (d.success) {
            Swal.fire({ icon: 'success', title: 'Dihapus', timer: 1500, showConfirmButton: false });
            fetchData();
        }
    };

    const handleNotifBerkas = async (row) => {
        const res = await fetch(`/api/pendaftaran/${row.id}/notify-berkas`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        const d = await res.json();
        Swal.fire({ icon: d.success ? 'success' : 'warning', title: d.success ? 'Terkirim' : 'Info', text: d.message, confirmButtonColor: '#E67E22' });
    };

    const handleExport = async () => {
        const params = new URLSearchParams({ lembaga: filters.lembaga, status: filters.status }).toString();
        const res = await fetch(`/api/pendaftaran/export/excel?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `data-pendaftar-${Date.now()}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Data Pendaftar</h2>
                    <p className="text-gray-500 text-sm">Kelola data pendaftaran siswa baru</p>
                </div>
                <button onClick={handleExport}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    <i className="fas fa-file-excel mr-2"></i>Export Excel
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="space-y-3">
                    <input type="text" placeholder="Cari nama, NISN, atau asal sekolah..."
                        value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-sm" />
                    <div className="flex flex-wrap gap-2">
                        <select value={filters.lembaga} onChange={e => setFilters(f => ({ ...f, lembaga: e.target.value, page: 1 }))}
                            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-sm">
                            <option value="">Semua Lembaga</option>
                            <option value="SMP NU BP">SMP NU BP</option>
                            <option value="MA ALHIKAM">MA ALHIKAM</option>
                        </select>
                        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
                            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-sm">
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="verified">Terverifikasi</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                        <button type="button" onClick={() => setFilters(f => ({ ...f, page: 1 }))}
                            className="bg-[#E67E22] text-white px-4 py-2 rounded-lg hover:bg-[#D35400] transition text-sm flex items-center gap-2">
                            <i className="fas fa-search"></i><span className="hidden sm:inline">Cari</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3 text-left">No. Reg</th>
                                    <th className="px-4 py-3 text-left">Nama</th>
                                    <th className="px-4 py-3 text-left">Lembaga</th>
                                    <th className="px-4 py-3 text-left">No. HP</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Tanggal</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.length === 0 ? (
                                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm"><i className="fas fa-inbox text-4xl mb-3 text-gray-300 block"></i><p>Tidak ada data pendaftaran</p></td></tr>
                                ) : data.map(row => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{row.no_registrasi}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-800">{row.nama}</div>
                                            <div className="text-xs text-gray-400">{row.asal_sekolah}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs">{row.lembaga}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{row.no_hp_wali}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[row.status]}`}>
                                                {STATUS_LABELS[row.status] ?? row.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{row.created_at ? new Date(row.created_at).toLocaleDateString('id') : '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => openDetail(row)} title="Detail" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"><i className="fas fa-eye text-xs"></i></button>
                                                <button onClick={() => openEdit(row)} title="Edit" className="p-1.5 text-[#E67E22] hover:bg-orange-100 rounded-lg transition"><i className="fas fa-edit text-xs"></i></button>
                                                <button onClick={() => handleNotifBerkas(row)} title="Kirim WA Berkas" className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition"><i className="fab fa-whatsapp text-xs"></i></button>
                                                <button onClick={() => handleDelete(row)} title="Hapus" className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"><i className="fas fa-trash text-xs"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Hal {meta.current_page} dari {meta.last_page}</span>
                        <div className="flex gap-1">
                            <button disabled={filters.page <= 1}
                                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">
                                ← Prev
                            </button>
                            <button disabled={filters.page >= meta.last_page}
                                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <Modal show={showDetail} onClose={() => setShowDetail(false)} title="Detail Pendaftaran">
                {selected && (
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Data Siswa</p>
                        <DetailRow label="No. Registrasi" value={selected.no_registrasi} />
                        <DetailRow label="Nama" value={selected.nama} />
                        <DetailRow label="Lembaga" value={selected.lembaga} />
                        <DetailRow label="NISN" value={selected.nisn} />
                        <DetailRow label="NIK" value={selected.nik} />
                        <DetailRow label="JK" value={selected.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                        <DetailRow label="TTL" value={`${selected.tempat_lahir ?? ''}, ${selected.tanggal_lahir ?? ''}`} />
                        <DetailRow label="Alamat" value={selected.alamat} />
                        <DetailRow label="Kota/Kab" value={selected.kota_kab} />
                        <DetailRow label="Asal Sekolah" value={selected.asal_sekolah} />
                        <DetailRow label="Status Mukim" value={selected.status_mukim} />

                        <p className="text-xs font-semibold text-gray-500 mt-4 mb-2 uppercase tracking-wide">Data Orang Tua</p>
                        <DetailRow label="Nama Ayah" value={selected.nama_ayah} />
                        <DetailRow label="Pekerjaan Ayah" value={selected.pekerjaan_ayah} />
                        <DetailRow label="Nama Ibu" value={selected.nama_ibu} />
                        <DetailRow label="Pekerjaan Ibu" value={selected.pekerjaan_ibu} />
                        <DetailRow label="No. HP Wali" value={selected.no_hp_wali} />

                        <p className="text-xs font-semibold text-gray-500 mt-4 mb-2 uppercase tracking-wide">Status Admin</p>
                        <DetailRow label="Status" value={STATUS_LABELS[selected.status]} />
                        <DetailRow label="Catatan" value={selected.catatan_admin} />
                    </div>
                )}
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEdit} onClose={() => setShowEdit(false)} title="Update Status Pendaftar">
                {selected && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Nama: <span className="font-bold">{selected.nama}</span></p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                            <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white">
                                <option value="pending">Pending</option>
                                <option value="verified">Terverifikasi</option>
                                <option value="rejected">Ditolak</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Admin</label>
                            <textarea rows={4} value={editForm.catatan_admin}
                                onChange={e => setEditForm(f => ({ ...f, catatan_admin: e.target.value }))}
                                placeholder="Catatan untuk pendaftar..."
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none resize-none"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowEdit(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition">
                                Batal
                            </button>
                            <button onClick={handleSaveEdit} disabled={saving}
                                className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-70 flex items-center justify-center gap-2">
                                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
