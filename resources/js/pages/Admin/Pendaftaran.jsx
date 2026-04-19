import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = { pending: 'Pending', verified: 'Terverifikasi', rejected: 'Ditolak' };

function Modal({ show, onClose, children, title, wide }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div className={`bg-white rounded-xl shadow-xl w-full ${wide ? 'max-w-4xl' : 'max-w-2xl'} max-h-[90vh] overflow-hidden flex flex-col my-4`} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b bg-[#1B7A3D] text-white rounded-t-xl flex-shrink-0">
                    <h3 className="font-bold">{title}</h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white"><i className="fas fa-times"></i></button>
                </div>
                <div className="p-5 overflow-y-auto flex-1">{children}</div>
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
    
    const getHeaders = (isJson = false) => {
        const xsrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
        const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
        if (xsrfToken) headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
        if (isJson) headers['Content-Type'] = 'application/json';
        return headers;
    };
    
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', status: '', page: 1 });
    const [searchInput, setSearchInput] = useState('');
    const [selected, setSelected] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const searchTimer = React.useRef(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ ...filters, per_page: 15 }).toString();
            const res = await fetch(`/api/pendaftaran?${params}`, {
                headers: getHeaders(),
            });
            const d = await res.json();
            if (d.success) { setData(d.data); setMeta(d.meta); }
        } catch (err) {
            console.error('fetchData error:', err);
        } finally {
            setLoading(false);
        }
    }, [token, filters]);

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

    const openDetail = (row) => { setSelected(row); setShowDetail(true); };
    const openEdit = (row) => {
        setSelected(row);
        setEditForm({
            nama: row.nama || '', lembaga: row.lembaga || '', nisn: row.nisn || '', nik: row.nik || '', no_kk: row.no_kk || '',
            tempat_lahir: row.tempat_lahir || '', tanggal_lahir: row.tanggal_lahir || '', jenis_kelamin: row.jenis_kelamin || 'L',
            jumlah_saudara: row.jumlah_saudara ?? '', asal_sekolah: row.asal_sekolah || '',
            provinsi: row.provinsi || '', kota_kab: row.kota_kab || '', kecamatan: row.kecamatan || '', kelurahan_desa: row.kelurahan_desa || '',
            alamat: row.alamat || '', status_mukim: row.status_mukim || '', pip_pkh: row.pip_pkh || '', sumber_info: row.sumber_info || '',
            prestasi: row.prestasi || '', tingkat_prestasi: row.tingkat_prestasi || '', juara: row.juara || '',
            nama_ayah: row.nama_ayah || '', nik_ayah: row.nik_ayah || '', tempat_lahir_ayah: row.tempat_lahir_ayah || '',
            tanggal_lahir_ayah: row.tanggal_lahir_ayah || '', pekerjaan_ayah: row.pekerjaan_ayah || '', penghasilan_ayah: row.penghasilan_ayah || '',
            nama_ibu: row.nama_ibu || '', nik_ibu: row.nik_ibu || '', tempat_lahir_ibu: row.tempat_lahir_ibu || '',
            tanggal_lahir_ibu: row.tanggal_lahir_ibu || '', pekerjaan_ibu: row.pekerjaan_ibu || '', penghasilan_ibu: row.penghasilan_ibu || '',
            no_hp_wali: row.no_hp_wali || '', status: row.status || 'pending', catatan_admin: row.catatan_admin || '',
        });
        setShowEdit(true);
    };

    const handleSaveEdit = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/pendaftaran/${selected.id}`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify(editForm),
            });
            const d = await res.json();
            if (d.success) {
                setShowEdit(false);
                Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data diperbarui.', confirmButtonColor: '#1B7A3D', timer: 1500, showConfirmButton: false });
                fetchData();
            } else {
                Swal.fire({ icon: 'error', title: 'Gagal', text: d.message || 'Gagal memperbarui data.', confirmButtonColor: '#1B7A3D' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan jaringan.', confirmButtonColor: '#1B7A3D' });
        } finally {
            setSaving(false);
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

        try {
            const res = await fetch(`/api/pendaftaran/${row.id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            const d = await res.json();
            if (d.success) {
                Swal.fire({ icon: 'success', title: 'Dihapus', timer: 1500, showConfirmButton: false });
                fetchData();
            } else {
                Swal.fire({ icon: 'error', title: 'Gagal', text: d.message || 'Gagal menghapus.', confirmButtonColor: '#1B7A3D' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan jaringan.', confirmButtonColor: '#1B7A3D' });
        }
    };

    const handleNotifBerkas = async (row) => {
        const res = await fetch(`/api/pendaftaran/${row.id}/notify-berkas`, {
            method: 'POST',
            headers: getHeaders(),
        });
        const d = await res.json();
        Swal.fire({ icon: d.success ? 'success' : 'warning', title: d.success ? 'Terkirim' : 'Info', text: d.message, confirmButtonColor: '#1B7A3D' });
    };

    const handleExport = async () => {
        try {
            const params = new URLSearchParams({ status: filters.status }).toString();
            const res = await fetch(`/api/pendaftaran/export/excel?${params}`, {
                headers: getHeaders(),
            });
            if (!res.ok) {
                Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal mengexport data.', confirmButtonColor: '#1B7A3D' });
                return;
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `data-pendaftar-${Date.now()}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat export.', confirmButtonColor: '#1B7A3D' });
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Data Pendaftar</h2>
                    <p className="text-gray-500 text-sm">Kelola data pendaftaran santri baru</p>
                </div>
                <button onClick={handleExport}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    <i className="fas fa-file-excel mr-2"></i>Export Excel
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="space-y-3">
                    <div className="relative">
                        <input type="text" placeholder="Cari nama, NISN, atau asal sekolah..."
                            value={searchInput} onChange={e => handleSearchInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { clearTimeout(searchTimer.current); setFilters(f => ({ ...f, search: searchInput, page: 1 })); } }}
                            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7A3D] focus:border-transparent outline-none text-sm transition-all" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {loading && <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>}
                            {searchInput && !loading && (
                                <button onClick={() => { setSearchInput(''); setFilters(f => ({ ...f, search: '', page: 1 })); }} className="text-gray-400 hover:text-gray-600">
                                    <i className="fas fa-times-circle"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
                            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7A3D] focus:border-transparent outline-none text-sm bg-white">
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="verified">Terverifikasi</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                        <button type="button" onClick={() => { clearTimeout(searchTimer.current); setFilters(f => ({ ...f, search: searchInput, page: 1 })); }}
                            className="bg-[#1B7A3D] text-white px-6 py-2 rounded-lg hover:bg-[#145C2E] transition text-sm font-medium flex items-center gap-2">
                            <i className="fas fa-search"></i><span>Cari</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                                <tr>
                                    <th className="px-3 py-3 text-left sticky left-0 bg-gray-50 z-10">No. Reg</th>
                                    <th className="px-3 py-3 text-left sticky left-[88px] bg-gray-50 z-10">Nama</th>
                                    <th className="px-3 py-3 text-left">Lembaga</th>
                                    <th className="px-3 py-3 text-center">L/P</th>
                                    <th className="px-3 py-3 text-left">NISN</th>
                                    <th className="px-3 py-3 text-left">TTL</th>
                                    <th className="px-3 py-3 text-center">Jml Saudara</th>
                                    <th className="px-3 py-3 text-left">No. KK</th>
                                    <th className="px-3 py-3 text-left">NIK</th>
                                    <th className="px-3 py-3 text-left">Alamat</th>
                                    <th className="px-3 py-3 text-left">Provinsi</th>
                                    <th className="px-3 py-3 text-left">Kota/Kab</th>
                                    <th className="px-3 py-3 text-left">Kecamatan</th>
                                    <th className="px-3 py-3 text-left">Kelurahan</th>
                                    <th className="px-3 py-3 text-left">Asal Sekolah</th>
                                    <th className="px-3 py-3 text-left">Prestasi</th>
                                    <th className="px-3 py-3 text-left">Tingkat</th>
                                    <th className="px-3 py-3 text-left">Juara</th>
                                    <th className="px-3 py-3 text-left">PIP/PKH</th>

                                    <th className="px-3 py-3 text-left">Sumber Info</th>
                                    <th className="px-3 py-3 text-left">Nama Ayah</th>
                                    <th className="px-3 py-3 text-left">Pekerjaan Ayah</th>
                                    <th className="px-3 py-3 text-left">Penghasilan Ayah</th>
                                    <th className="px-3 py-3 text-left">Nama Ibu</th>
                                    <th className="px-3 py-3 text-left">Pekerjaan Ibu</th>
                                    <th className="px-3 py-3 text-left">Penghasilan Ibu</th>
                                    <th className="px-3 py-3 text-left">No. HP Wali</th>
                                    <th className="px-3 py-3 text-center">Berkas</th>
                                    <th className="px-3 py-3 text-left">Status</th>
                                    <th className="px-3 py-3 text-left">Catatan</th>
                                    <th className="px-3 py-3 text-left">Tanggal</th>
                                    <th className="px-3 py-3 text-center sticky right-0 bg-gray-50 z-10">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.length === 0 ? (
                                    <tr><td colSpan={33} className="px-4 py-8 text-center text-gray-500 text-sm"><i className="fas fa-inbox text-4xl mb-3 text-gray-300 block"></i><p>Tidak ada data pendaftaran</p></td></tr>
                                ) : data.map(row => {
                                    const berkasCount = ['file_kk', 'file_ktp_ortu', 'file_akta', 'file_ijazah', 'file_sertifikat'].filter(f => row[f]).length;
                                    return (
                                    <tr key={row.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-3 py-2.5 font-mono text-xs text-gray-500 sticky left-0 bg-white z-10">{row.no_registrasi}</td>
                                        <td className="px-3 py-2.5 sticky left-[88px] bg-white z-10">
                                            <div className="font-medium text-gray-800 text-xs">{row.nama}</div>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{row.lembaga || '-'}</span>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.jenis_kelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                                {row.jenis_kelamin}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.nisn || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.tempat_lahir || ''}{row.tempat_lahir && row.tanggal_lahir ? ', ' : ''}{row.tanggal_lahir ? row.tanggal_lahir.split('-').reverse().join('-') : '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600 text-center">{row.jumlah_saudara ?? '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600 font-mono">{row.no_kk || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600 font-mono">{row.nik || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600 max-w-[200px] truncate" title={row.alamat}>{row.alamat || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.provinsi || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.kota_kab || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.kecamatan || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.kelurahan_desa || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.asal_sekolah || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.prestasi || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.tingkat_prestasi || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.juara || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.pip_pkh || '-'}</td>

                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.sumber_info || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.nama_ayah || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.pekerjaan_ayah || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.penghasilan_ayah || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.nama_ibu || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.pekerjaan_ibu || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.penghasilan_ibu || '-'}</td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.no_hp_wali || '-'}</td>
                                        <td className="px-3 py-2.5 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${berkasCount >= 4 ? 'bg-green-100 text-green-700' : berkasCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                {berkasCount}/5
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[row.status]}`}>
                                                {STATUS_LABELS[row.status] ?? row.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-xs text-gray-600 max-w-[150px] truncate" title={row.catatan_admin}>{row.catatan_admin || '-'}</td>
                                        <td className="px-3 py-2.5 text-gray-500 text-xs">{row.created_at ? new Date(row.created_at).toLocaleDateString('id') : '-'}</td>
                                        <td className="px-3 py-2.5 sticky right-0 bg-white z-10">
                                            <div className="flex items-center justify-center gap-1">
                                                <a href={`/kartu-peserta?id=${row.id}`} target="_blank" rel="noopener noreferrer" title="Cetak Kartu" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"><i className="fas fa-id-card text-xs"></i></a>
                                                <button onClick={() => openEdit(row)} title="Edit" className="p-1.5 text-[#1B7A3D] hover:bg-green-100 rounded-lg transition"><i className="fas fa-edit text-xs"></i></button>
                                                <button onClick={() => handleNotifBerkas(row)} title="Kirim WA Berkas" className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition"><i className="fab fa-whatsapp text-xs"></i></button>
                                                <button onClick={() => handleDelete(row)} title="Hapus" className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"><i className="fas fa-trash text-xs"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })}
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

                        <DetailRow label="NISN" value={selected.nisn} />
                        <DetailRow label="NIK" value={selected.nik} />
                        <DetailRow label="JK" value={selected.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                        <DetailRow label="TTL" value={`${selected.tempat_lahir ?? ''}, ${selected.tanggal_lahir ? selected.tanggal_lahir.split('-').reverse().join('-') : ''}`} />
                        <DetailRow label="Alamat" value={selected.alamat} />
                        <DetailRow label="Kota/Kab" value={selected.kota_kab} />
                        <DetailRow label="Asal Sekolah" value={selected.asal_sekolah} />


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
            <Modal show={showEdit} onClose={() => setShowEdit(false)} title="Edit Data Pendaftar" wide>
                {selected && (
                    <div className="space-y-4">
                        {/* Data Calon Siswa */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-700 mb-3 text-sm"><i className="fas fa-user text-[#1B7A3D] mr-2"></i>Data Calon Siswa</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap *</label>
                                    <input type="text" value={editForm.nama} onChange={e => setEditForm(f => ({ ...f, nama: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Lembaga</label>
                                    <select value={editForm.lembaga} onChange={e => setEditForm(f => ({ ...f, lembaga: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none bg-white">
                                        <option value="">Pilih</option>
                                        <option value="Simbang">Simbang</option>
                                        <option value="Non-Simbang">Non-Simbang</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">NISN</label>
                                    <input type="text" value={editForm.nisn} onChange={e => setEditForm(f => ({ ...f, nisn: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">NIK</label>
                                    <input type="text" value={editForm.nik} onChange={e => setEditForm(f => ({ ...f, nik: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">No. KK</label>
                                    <input type="text" value={editForm.no_kk} onChange={e => setEditForm(f => ({ ...f, no_kk: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tempat Lahir</label>
                                    <input type="text" value={editForm.tempat_lahir} onChange={e => setEditForm(f => ({ ...f, tempat_lahir: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Lahir</label>
                                    <input type="date" value={editForm.tanggal_lahir} onChange={e => setEditForm(f => ({ ...f, tanggal_lahir: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Jenis Kelamin *</label>
                                    <select value={editForm.jenis_kelamin} onChange={e => setEditForm(f => ({ ...f, jenis_kelamin: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none bg-white">
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Jumlah Saudara</label>
                                    <input type="number" min="0" value={editForm.jumlah_saudara} onChange={e => setEditForm(f => ({ ...f, jumlah_saudara: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Asal Sekolah</label>
                                    <input type="text" value={editForm.asal_sekolah} onChange={e => setEditForm(f => ({ ...f, asal_sekolah: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Provinsi</label>
                                    <input type="text" value={editForm.provinsi} onChange={e => setEditForm(f => ({ ...f, provinsi: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Kota/Kabupaten</label>
                                    <input type="text" value={editForm.kota_kab} onChange={e => setEditForm(f => ({ ...f, kota_kab: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Kecamatan</label>
                                    <input type="text" value={editForm.kecamatan} onChange={e => setEditForm(f => ({ ...f, kecamatan: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Kelurahan/Desa</label>
                                    <input type="text" value={editForm.kelurahan_desa} onChange={e => setEditForm(f => ({ ...f, kelurahan_desa: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Detail Alamat</label>
                                    <textarea rows={2} value={editForm.alamat} onChange={e => setEditForm(f => ({ ...f, alamat: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none resize-none" />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">PIP/PKH</label>
                                    <input type="text" value={editForm.pip_pkh} onChange={e => setEditForm(f => ({ ...f, pip_pkh: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Sumber Info</label>
                                    <input type="text" value={editForm.sumber_info} onChange={e => setEditForm(f => ({ ...f, sumber_info: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Prestasi */}
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-yellow-700 mb-3 text-sm"><i className="fas fa-trophy mr-2"></i>Prestasi</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Prestasi</label>
                                    <input type="text" value={editForm.prestasi} onChange={e => setEditForm(f => ({ ...f, prestasi: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tingkat</label>
                                    <select value={editForm.tingkat_prestasi} onChange={e => setEditForm(f => ({ ...f, tingkat_prestasi: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none bg-white">
                                        <option value="">Pilih</option>
                                        <option value="KABUPATEN">Kabupaten</option>
                                        <option value="PROVINSI">Provinsi</option>
                                        <option value="NASIONAL">Nasional</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Juara</label>
                                    <select value={editForm.juara} onChange={e => setEditForm(f => ({ ...f, juara: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none bg-white">
                                        <option value="">Pilih</option>
                                        <option value="1">Juara 1</option>
                                        <option value="2">Juara 2</option>
                                        <option value="3">Juara 3</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Data Ayah */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-700 mb-3 text-sm"><i className="fas fa-male mr-2"></i>Data Ayah</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Nama Ayah</label>
                                    <input type="text" value={editForm.nama_ayah} onChange={e => setEditForm(f => ({ ...f, nama_ayah: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">NIK Ayah</label>
                                    <input type="text" value={editForm.nik_ayah} onChange={e => setEditForm(f => ({ ...f, nik_ayah: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tempat Lahir</label>
                                    <input type="text" value={editForm.tempat_lahir_ayah} onChange={e => setEditForm(f => ({ ...f, tempat_lahir_ayah: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Lahir</label>
                                    <input type="date" value={editForm.tanggal_lahir_ayah} onChange={e => setEditForm(f => ({ ...f, tanggal_lahir_ayah: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Pekerjaan</label>
                                    <input type="text" value={editForm.pekerjaan_ayah} onChange={e => setEditForm(f => ({ ...f, pekerjaan_ayah: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Penghasilan</label>
                                    <select value={editForm.penghasilan_ayah} onChange={e => setEditForm(f => ({ ...f, penghasilan_ayah: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                                        <option value="">Pilih</option>
                                        <option value="< 1 Juta">&lt; 1 Juta</option>
                                        <option value="1-3 Juta">1-3 Juta</option>
                                        <option value="3-5 Juta">3-5 Juta</option>
                                        <option value="> 5 Juta">&gt; 5 Juta</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Data Ibu */}
                        <div className="bg-pink-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-pink-700 mb-3 text-sm"><i className="fas fa-female mr-2"></i>Data Ibu</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Nama Ibu</label>
                                    <input type="text" value={editForm.nama_ibu} onChange={e => setEditForm(f => ({ ...f, nama_ibu: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">NIK Ibu</label>
                                    <input type="text" value={editForm.nik_ibu} onChange={e => setEditForm(f => ({ ...f, nik_ibu: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tempat Lahir</label>
                                    <input type="text" value={editForm.tempat_lahir_ibu} onChange={e => setEditForm(f => ({ ...f, tempat_lahir_ibu: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Lahir</label>
                                    <input type="date" value={editForm.tanggal_lahir_ibu} onChange={e => setEditForm(f => ({ ...f, tanggal_lahir_ibu: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Pekerjaan</label>
                                    <input type="text" value={editForm.pekerjaan_ibu} onChange={e => setEditForm(f => ({ ...f, pekerjaan_ibu: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Penghasilan</label>
                                    <select value={editForm.penghasilan_ibu} onChange={e => setEditForm(f => ({ ...f, penghasilan_ibu: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                                        <option value="">Pilih</option>
                                        <option value="< 1 Juta">&lt; 1 Juta</option>
                                        <option value="1-3 Juta">1-3 Juta</option>
                                        <option value="3-5 Juta">3-5 Juta</option>
                                        <option value="> 5 Juta">&gt; 5 Juta</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Kontak & Status */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-700 mb-3 text-sm"><i className="fas fa-phone mr-2"></i>Kontak & Status</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">No. HP Wali *</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={editForm.no_hp_wali} onChange={e => setEditForm(f => ({ ...f, no_hp_wali: e.target.value }))} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                        <a href={`https://wa.me/${(editForm.no_hp_wali || '').replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition" title="WhatsApp">
                                            <i className="fab fa-whatsapp"></i>
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Status Pendaftaran</label>
                                    <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                                        <option value="pending">Pending</option>
                                        <option value="verified">Terverifikasi</option>
                                        <option value="rejected">Ditolak</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Dokumen */}
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-purple-700 text-sm"><i className="fas fa-file-pdf mr-2"></i>Dokumen (PDF/JPG/PNG, Max 2MB)</h4>
                                <button type="button" onClick={() => handleNotifBerkas(selected)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition">
                                    <i className="fab fa-whatsapp mr-1"></i>WA Kekurangan Berkas
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {['file_kk', 'file_ktp_ortu', 'file_akta', 'file_ijazah'].map(field => {
                                    const labels = { file_kk: 'Kartu Keluarga', file_ktp_ortu: 'KTP Orang Tua', file_akta: 'Akta Kelahiran', file_ijazah: 'Ijazah (Opsional)' };
                                    const hasFile = selected[field];
                                    return (
                                        <div key={field} className="bg-white p-3 rounded-lg border">
                                            <label className="block text-xs font-medium text-gray-700 mb-2">{labels[field]}</label>
                                            {hasFile ? (
                                                <div className="flex items-center gap-2 text-xs mb-2">
                                                    <span className="text-green-600"><i className="fas fa-check-circle"></i></span>
                                                    <span className="text-gray-600 truncate flex-1">{selected[field]}</span>
                                                    <a href={`/storage/uploads/dokumen/${selected[field]}`} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                                                        <i className="fas fa-eye mr-1"></i>Lihat
                                                    </a>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-red-500 mb-2"><i className="fas fa-times-circle mr-1"></i>Belum ada file yang diupload</p>
                                            )}
                                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={async e => {
                                                const file = e.target.files[0]; if (!file) return;
                                                const fd = new FormData(); fd.append(field, file);
                                                const res = await fetch(`/api/pendaftaran/${selected.id}/upload-dokumen`, {
                                                    method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd
                                                });
                                                const d = await res.json();
                                                if (d.success) { Swal.fire({ icon: 'success', title: 'Berhasil', text: 'File berhasil diupload.', timer: 1500, showConfirmButton: false }); fetchData(); }
                                            }} className="w-full text-xs border border-gray-300 rounded bg-white file:mr-2 file:py-1 file:px-2 file:border-0 file:text-xs file:bg-purple-100 file:text-purple-700" />
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-500 mt-3"><i className="fas fa-info-circle mr-1"></i>Upload file baru akan mengganti file lama. Kosongkan jika tidak ingin mengubah.</p>
                        </div>

                        {/* Pesan untuk Pendaftar */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                                <i className="fas fa-comment-alt"></i>Pesan untuk Pendaftar
                            </h4>
                            <textarea rows={3} value={editForm.catatan_admin}
                                onChange={e => setEditForm(f => ({ ...f, catatan_admin: e.target.value }))}
                                placeholder="Tulis catatan/alasan untuk pendaftar (misal: dokumen belum lengkap, foto tidak jelas, dll). Pesan ini akan muncul di dashboard pendaftar."
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none resize-none"
                            />
                            <p className="text-xs text-blue-500 mt-2"><i className="fas fa-info-circle mr-1"></i>Pesan ini akan tampil di dashboard user jika status pending/ditolak</p>
                            <button type="button" onClick={() => handleNotifBerkas(selected)} className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center justify-center gap-2">
                                <i className="fab fa-whatsapp text-lg"></i>Kirim Ucapan Selamat via WhatsApp
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t">
                            <button onClick={() => setShowEdit(false)} className="flex-1 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-sm">
                                Batal
                            </button>
                            <button onClick={handleSaveEdit} disabled={saving}
                                className="flex-1 py-2.5 bg-[#1B7A3D] hover:bg-[#145C2E] text-white rounded-xl text-sm font-medium transition disabled:opacity-70 flex items-center justify-center gap-2">
                                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                <i className="fas fa-save mr-1"></i>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
