import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = { pending: 'Pending', verified: 'Terverifikasi', rejected: 'Ditolak' };

function Modal({ show, onClose, children, title, footer }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 sm:p-5 border-b flex-shrink-0">
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                </div>
                <div className="p-4 sm:p-5 overflow-y-auto flex-1 pb-16 sm:pb-20">
                    {children}
                </div>
                {footer && (
                    <div className="border-t p-4 bg-gray-50 flex gap-3 flex-shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}



export default function Pendaftaran() {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', lembaga: '', status: '', page: 1 });
    const [searchInput, setSearchInput] = useState('');
    const [selected, setSelected] = useState(null);

    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [sort, setSort] = useState({ column: 'no_registrasi', direction: 'asc' });
    const searchTimer = React.useRef(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // Clear selection when data changes
    useEffect(() => {
        setSelectedIds([]);
    }, [data]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/pendaftaran', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    ...filters,
                    sort_by: sort.column,
                    sort_dir: sort.direction,
                    per_page: 15
                }
            });
            if (res.data.success) {
                setData(res.data.data);
                setMeta(res.data.meta);
            }
        } catch (err) {
            console.error('fetchData error:', err);
        } finally {
            setLoading(false);
        }
    }, [token, filters, sort]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Fix #27: Cleanup search timer on unmount
    useEffect(() => {
        return () => clearTimeout(searchTimer.current);
    }, []);

    // Debounce search input
    const handleSearchInput = (value) => {
        setSearchInput(value);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setFilters(f => ({ ...f, search: value, page: 1 }));
        }, 300);
    };

    const handleSort = (column) => {
        setSort(prev => {
            const isSame = prev.column === column;
            const direction = isSame && prev.direction === 'asc' ? 'desc' : 'asc';
            return { column, direction };
        });
        setFilters(f => ({ ...f, page: 1 }));
    };

    const handleSelectRow = (e, id) => {
        if (e.target.checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(data.map(row => row.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleBulkVerify = async () => {
        const conf = await Swal.fire({
            title: 'Verifikasi Masal?',
            html: `Apakah Anda yakin ingin memverifikasi <b>${selectedIds.length}</b> pendaftar yang terpilih?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Verifikasi',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#E67E22',
            cancelButtonColor: '#aaa',
        });
        if (!conf.isConfirmed) return;

        Swal.fire({
            title: 'Memproses Verifikasi...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const res = await axios.post('/api/pendaftaran/verify-bulk', { ids: selectedIds }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                Swal.fire({ 
                    icon: 'success', 
                    title: 'Berhasil', 
                    text: res.data.message, 
                    confirmButtonColor: '#E67E22',
                    timer: 2000,
                    showConfirmButton: false
                });
                setSelectedIds([]);
                fetchData();
            } else {
                Swal.fire({ icon: 'error', title: 'Gagal', text: res.data.message || 'Gagal memverifikasi.', confirmButtonColor: '#E67E22' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Terjadi kesalahan jaringan.', confirmButtonColor: '#E67E22' });
        }
    };

    const renderHeader = (label, column) => {
        const isSorted = sort.column === column;
        return (
            <th 
                className="px-2 py-2 sm:px-4 sm:py-3 text-left cursor-pointer hover:bg-gray-100 transition select-none"
                onClick={() => handleSort(column)}
            >
                <div className="flex items-center gap-1.5">
                    <span>{label}</span>
                    <span className="text-gray-400 text-[10px]">
                        {!isSorted ? (
                            <i className="fas fa-sort"></i>
                        ) : sort.direction === 'asc' ? (
                            <i className="fas fa-sort-up text-[#E67E22] text-xs"></i>
                        ) : (
                            <i className="fas fa-sort-down text-[#E67E22] text-xs"></i>
                        )}
                    </span>
                </div>
            </th>
        );
    };



    const setEdit = (k, v) => setEditForm(prev => ({ ...prev, [k]: v }));

    const openEdit = (row) => {
        setSelected(row);
        let tglLahir = '';
        if (row.tanggal_lahir) {
            tglLahir = row.tanggal_lahir.substring(0, 10);
        }
        let tglLahirAyah = '';
        if (row.tanggal_lahir_ayah) {
            tglLahirAyah = row.tanggal_lahir_ayah.substring(0, 10);
        }
        let tglLahirIbu = '';
        if (row.tanggal_lahir_ibu) {
            tglLahirIbu = row.tanggal_lahir_ibu.substring(0, 10);
        }
        setEditForm({
            ...row,
            tanggal_lahir: tglLahir,
            tanggal_lahir_ayah: tglLahirAyah,
            tanggal_lahir_ibu: tglLahirIbu,
            catatan_admin: row.catatan_admin ?? ''
        });
        setShowEdit(true);
    };

    const handleSaveEdit = async () => {
        setSaving(true);
        try {
            const res = await axios.put(`/api/pendaftaran/${selected.id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setShowEdit(false);
                Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data diperbarui.', confirmButtonColor: '#E67E22', timer: 1500, showConfirmButton: false });
                fetchData();
            } else {
                Swal.fire({ icon: 'error', title: 'Gagal', text: res.data.message || 'Gagal memperbarui data.', confirmButtonColor: '#E67E22' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Terjadi kesalahan jaringan.', confirmButtonColor: '#E67E22' });
        } finally {
            setSaving(false);
        }
    };

    const handleUploadFile = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(field, file);

        Swal.fire({
            title: 'Mengunggah Berkas...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const res = await axios.post(`/api/pendaftaran/${selected.id}/upload-dokumen`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.success) {
                const updatedData = res.data.data;
                setSelected(updatedData);
                setEditForm(prev => ({
                    ...prev,
                    file_kk: updatedData.file_kk,
                    file_ktp_ortu: updatedData.file_ktp_ortu,
                    file_akta: updatedData.file_akta,
                    file_ijazah: updatedData.file_ijazah,
                    file_sertifikat: updatedData.file_sertifikat,
                }));
                Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Berkas berhasil diperbarui.', timer: 1500, showConfirmButton: false });
                fetchData();
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Gagal mengunggah berkas.', confirmButtonColor: '#E67E22' });
        }
    };

    const renderEditDocInput = (label, field, currentFilename, folder = 'dokumen') => {
        return (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100 last:border-0">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-700">{label}</span>
                    {currentFilename ? (
                        <a 
                            href={`/storage/uploads/${folder}/${currentFilename}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 inline-flex items-center gap-1 transition"
                        >
                            <i className="fas fa-file-alt"></i> Lihat berkas saat ini
                        </a>
                    ) : (
                        <span className="text-xs text-red-500 font-medium italic mt-1 flex items-center gap-1">
                            <i className="fas fa-times-circle"></i> Belum diunggah
                        </span>
                    )}
                </div>
                <div className="flex items-center">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition border border-gray-300 inline-flex items-center gap-1">
                        <i className="fas fa-upload"></i>
                        <span>{currentFilename ? 'Ganti File' : 'Pilih File'}</span>
                        <input 
                            type="file" 
                            onChange={e => handleUploadFile(e, field)} 
                            className="hidden" 
                            accept=".jpg,.jpeg,.png,.pdf" 
                        />
                    </label>
                </div>
            </div>
        );
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

        try {
            const res = await axios.delete(`/api/pendaftaran/${row.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                Swal.fire({ icon: 'success', title: 'Dihapus', timer: 1500, showConfirmButton: false });
                fetchData();
            } else {
                Swal.fire({ icon: 'error', title: 'Gagal', text: res.data.message || 'Gagal menghapus.', confirmButtonColor: '#E67E22' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Terjadi kesalahan jaringan.', confirmButtonColor: '#E67E22' });
        }
    };

    const handleNotifBerkas = async (row) => {
        try {
            const res = await axios.post(`/api/pendaftaran/${row.id}/notify-berkas`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire({ icon: res.data.success ? 'success' : 'warning', title: res.data.success ? 'Terkirim' : 'Info', text: res.data.message, confirmButtonColor: '#E67E22' });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Terjadi kesalahan jaringan.', confirmButtonColor: '#E67E22' });
        }
    };

    const handleExport = async () => {
        try {
            const res = await axios.get('/api/pendaftaran/export/excel', {
                headers: { Authorization: `Bearer ${token}` },
                params: { lembaga: filters.lembaga, status: filters.status },
                responseType: 'blob'
            });
            const url = URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `data-pendaftar-${Date.now()}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat export.', confirmButtonColor: '#E67E22' });
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Data Pendaftar</h2>
                    <p className="text-gray-500 text-sm">Kelola data pendaftaran siswa baru</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    {selectedIds.length > 0 && (
                        <button onClick={handleBulkVerify}
                            className="bg-[#E67E22] hover:bg-[#D35400] text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm">
                            <i className="fas fa-check-double"></i>
                            <span>Verifikasi Masal ({selectedIds.length})</span>
                        </button>
                    )}
                    <button onClick={handleExport}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                        <i className="fas fa-file-excel"></i>
                        <span>Export Excel</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="space-y-3">
                    <div className="relative">
                        <input type="text" placeholder="Cari nama, NISN, atau asal sekolah..."
                            value={searchInput} onChange={e => handleSearchInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { clearTimeout(searchTimer.current); setFilters(f => ({ ...f, search: searchInput, page: 1 })); } }}
                            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-sm transition-all" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {loading && <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>}
                            {searchInput && !loading && (
                                <button onClick={() => { setSearchInput(''); setFilters(f => ({ ...f, search: '', page: 1 })); }} className="text-gray-400 hover:text-gray-600">
                                    <i className="fas fa-times-circle"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select value={filters.lembaga} onChange={e => setFilters(f => ({ ...f, lembaga: e.target.value, page: 1 }))}
                            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-sm bg-white">
                            <option value="">Semua Lembaga</option>
                            <option value="SMP NU BP">SMP NU BP</option>
                            <option value="MA ALHIKAM">MA ALHIKAM</option>
                        </select>
                        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
                            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-sm bg-white">
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="verified">Terverifikasi</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                        <button type="button" onClick={() => { clearTimeout(searchTimer.current); setFilters(f => ({ ...f, search: searchInput, page: 1 })); }}
                            className="bg-[#E67E22] text-white px-6 py-2 rounded-lg hover:bg-[#D35400] transition text-sm font-medium flex items-center gap-2">
                            <i className="fas fa-search"></i><span>Cari</span>
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
                        <table className="w-full text-xs sm:text-sm">
                            <thead className="bg-gray-50 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">
                                <tr>
                                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center w-10">
                                        <input 
                                            type="checkbox" 
                                            checked={data.length > 0 && selectedIds.length === data.length}
                                            onChange={handleSelectAll}
                                            className="rounded text-[#E67E22] focus:ring-[#E67E22] h-4 w-4 border-gray-300 cursor-pointer"
                                        />
                                    </th>
                                    {renderHeader('No. Reg', 'no_registrasi')}
                                    {renderHeader('Nama', 'nama')}
                                    {renderHeader('Lembaga', 'lembaga')}
                                    {renderHeader('No. HP', 'no_hp_wali')}
                                    {renderHeader('Status', 'status')}
                                    {renderHeader('Tanggal', 'created_at')}
                                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.length === 0 ? (
                                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500 text-sm"><i className="fas fa-inbox text-4xl mb-3 text-gray-300 block"></i><p>Tidak ada data pendaftaran</p></td></tr>
                                ) : data.map(row => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition">
                                        <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(row.id)}
                                                onChange={(e) => handleSelectRow(e, row.id)}
                                                className="rounded text-[#E67E22] focus:ring-[#E67E22] h-4 w-4 border-gray-300 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-2 py-2 sm:px-4 sm:py-3 font-mono text-[10px] sm:text-xs text-gray-500">{row.no_registrasi}</td>
                                        <td className="px-2 py-2 sm:px-4 sm:py-3">
                                            <div className="font-medium text-[11px] sm:text-sm text-gray-800 leading-tight">{row.nama}</div>
                                            <div className="text-[10px] sm:text-xs text-gray-400 leading-tight mt-0.5">{row.asal_sekolah}</div>
                                        </td>
                                        <td className="px-2 py-2 sm:px-4 sm:py-3">
                                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] sm:text-xs">{row.lembaga}</span>
                                        </td>
                                        <td className="px-2 py-2 sm:px-4 sm:py-3">
                                            {row.no_hp_wali ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[11px] sm:text-sm text-gray-600">{row.no_hp_wali}</span>
                                                    <a 
                                                        href={`https://wa.me/${row.no_hp_wali.replace(/\D/g, '').replace(/^0/, '62')}`} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="text-green-500 hover:text-green-700 transition"
                                                        title="Hubungi via WhatsApp"
                                                    >
                                                        <i className="fab fa-whatsapp text-xs"></i>
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">-</span>
                                            )}
                                        </td>
                                        <td className="px-2 py-2 sm:px-4 sm:py-3">
                                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${STATUS_COLORS[row.status]}`}>
                                                {STATUS_LABELS[row.status] ?? row.status}
                                            </span>
                                        </td>
                                        <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-500 text-[10px] sm:text-xs">{row.created_at ? new Date(row.created_at).toLocaleDateString('id') : '-'}</td>
                                        <td className="px-2 py-2 sm:px-4 sm:py-3">
                                            <div className="flex items-center justify-center gap-0.5">
                                                <button onClick={() => openEdit(row)} title="Edit" className="p-1 text-[#E67E22] hover:bg-orange-100 rounded transition"><i className="fas fa-edit text-[10px] sm:text-xs"></i></button>
                                                <button onClick={() => handleNotifBerkas(row)} title="Kirim WA Berkas" className="p-1 text-green-600 hover:bg-green-100 rounded transition"><i className="fab fa-whatsapp text-[10px] sm:text-xs"></i></button>
                                                <button onClick={() => handleDelete(row)} title="Hapus" className="p-1 text-red-600 hover:bg-red-100 rounded transition"><i className="fas fa-trash text-[10px] sm:text-xs"></i></button>
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



            {/* Edit Modal */}
            <Modal 
                show={showEdit} 
                onClose={() => setShowEdit(false)} 
                title="Edit Data Pendaftaran"
                footer={(
                    <>
                        <button type="button" onClick={() => setShowEdit(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition bg-white">
                            Batal
                        </button>
                        <button type="button" onClick={handleSaveEdit} disabled={saving}
                            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition disabled:opacity-70 flex items-center justify-center gap-2 shadow-md">
                            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </>
                )}
            >
                {selected && (
                    <div className="space-y-4 text-left">
                        {/* Data Siswa */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Data Calon Siswa</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Lengkap *</label>
                                    <input type="text" value={editForm.nama || ''} onChange={e => setEdit('nama', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Lembaga *</label>
                                    <select value={editForm.lembaga || ''} onChange={e => setEdit('lembaga', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" required>
                                        <option value="SMP NU BP">SMP NU BP</option>
                                        <option value="MA ALHIKAM">MA ALHIKAM</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">NISN</label>
                                    <input type="text" value={editForm.nisn || ''} onChange={e => setEdit('nisn', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">NIK</label>
                                    <input type="text" value={editForm.nik || ''} onChange={e => setEdit('nik', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Jenis Kelamin *</label>
                                    <select value={editForm.jenis_kelamin || ''} onChange={e => setEdit('jenis_kelamin', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" required>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Tempat Lahir</label>
                                    <input type="text" value={editForm.tempat_lahir || ''} onChange={e => setEdit('tempat_lahir', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal Lahir</label>
                                    <input type="date" value={editForm.tanggal_lahir || ''} onChange={e => setEdit('tanggal_lahir', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Asal Sekolah</label>
                                    <input type="text" value={editForm.asal_sekolah || ''} onChange={e => setEdit('asal_sekolah', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Status Mukim *</label>
                                    <select value={editForm.status_mukim || ''} onChange={e => setEdit('status_mukim', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" required>
                                        <option value="PONDOK PP MAMBAUL HUDA">Pondok PP Mambaul Huda</option>
                                        <option value="PONDOK SELAIN PP MAMBAUL HUDA">Pondok Selain PP Mambaul Huda</option>
                                        <option value="TIDAK PONDOK">Tidak Pondok</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Alamat Lengkap</label>
                                    <textarea rows={2} value={editForm.alamat || ''} onChange={e => setEdit('alamat', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* Data Orang Tua */}
                        <div className="pt-2 border-t">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Data Orang Tua / Wali</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Ayah</label>
                                    <input type="text" value={editForm.nama_ayah || ''} onChange={e => setEdit('nama_ayah', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Pekerjaan Ayah</label>
                                    <input type="text" value={editForm.pekerjaan_ayah || ''} onChange={e => setEdit('pekerjaan_ayah', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Ibu</label>
                                    <input type="text" value={editForm.nama_ibu || ''} onChange={e => setEdit('nama_ibu', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Pekerjaan Ibu</label>
                                    <input type="text" value={editForm.pekerjaan_ibu || ''} onChange={e => setEdit('pekerjaan_ibu', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">No. HP Wali *</label>
                                    <input type="text" value={editForm.no_hp_wali || ''} onChange={e => setEdit('no_hp_wali', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" required />
                                </div>
                            </div>
                        </div>

                        {/* Status Admin */}
                        <div className="pt-2 border-t">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Status Verifikasi</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Status Pendaftaran *</label>
                                    <select value={editForm.status || ''} onChange={e => setEdit('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white" required>
                                        <option value="pending">Pending</option>
                                        <option value="verified">Terverifikasi</option>
                                        <option value="rejected">Ditolak</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Catatan Admin</label>
                                    <textarea rows={3} value={editForm.catatan_admin || ''} onChange={e => setEdit('catatan_admin', e.target.value)}
                                        placeholder="Catatan untuk pendaftar..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* Kelengkapan Berkas */}
                        <div className="pt-2 border-t">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Kelengkapan Berkas</h4>
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-1">
                                {renderEditDocInput('Kartu Keluarga (KK)', 'file_kk', editForm.file_kk)}
                                {renderEditDocInput('KTP Orang Tua', 'file_ktp_ortu', editForm.file_ktp_ortu)}
                                {renderEditDocInput('Akta Kelahiran', 'file_akta', editForm.file_akta)}
                                {renderEditDocInput('Ijazah / SKL', 'file_ijazah', editForm.file_ijazah)}
                                {renderEditDocInput('Sertifikat Prestasi', 'file_sertifikat', editForm.file_sertifikat, 'sertifikat')}
                            </div>
                        </div>

                        {/* Tombol Aksi moved to Modal footer */}
                    </div>
                )}
            </Modal>
        </div>
    );
}
