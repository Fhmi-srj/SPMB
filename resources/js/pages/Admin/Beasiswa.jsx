import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

export default function Beasiswa() {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [form, setForm] = useState({ jenis: '', kategori: '', syarat: '', benefit: '', urutan: 0 });
    const [saving, setSaving] = useState(false);

    const fetch_ = useCallback(async () => {
        setLoading(true);
        const res = await fetch('/api/beasiswa', { headers: { Authorization: `Bearer ${token}` } });
        const d = await res.json();
        if (d.success) setData(d.data);
        setLoading(false);
    }, [token]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const openAdd = () => { setForm({ jenis: '', kategori: '', syarat: '', benefit: '', urutan: 0 }); setShowAdd(true); };
    const openEdit = (row) => { setEditing(row); setForm({ jenis: row.jenis, kategori: row.kategori, syarat: row.syarat, benefit: row.benefit, urutan: row.urutan ?? 0 }); setShowEdit(true); };
    const openDelete = (row) => { setDeleting(row); setShowDelete(true); };

    const handleAdd = async (e) => {
        e.preventDefault(); setSaving(true);
        const res = await fetch('/api/beasiswa', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const d = await res.json(); setSaving(false);
        if (d.success) { setShowAdd(false); Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data beasiswa berhasil ditambahkan!', timer: 1500, showConfirmButton: false }); fetch_(); }
    };

    const handleEdit = async (e) => {
        e.preventDefault(); setSaving(true);
        const res = await fetch(`/api/beasiswa/${editing.id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const d = await res.json(); setSaving(false);
        if (d.success) { setShowEdit(false); Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data beasiswa berhasil diupdate!', timer: 1500, showConfirmButton: false }); fetch_(); }
    };

    const handleDelete = async (e) => {
        e.preventDefault(); setSaving(true);
        await fetch(`/api/beasiswa/${deleting.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        setSaving(false); setShowDelete(false);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data beasiswa berhasil dihapus!', timer: 1500, showConfirmButton: false });
        fetch_();
    };

    const FormFields = () => (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Beasiswa</label>
                <input type="text" value={form.jenis} onChange={e => setForm(f => ({ ...f, jenis: e.target.value }))} required placeholder="Contoh: Tahfidz, Akademik"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input type="text" value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))} required placeholder="Contoh: Penghafal Al-Quran"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Syarat</label>
                <input type="text" value={form.syarat} onChange={e => setForm(f => ({ ...f, syarat: e.target.value }))} required placeholder="Contoh: Hafal 1-5 Juz"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefit</label>
                <input type="text" value={form.benefit} onChange={e => setForm(f => ({ ...f, benefit: e.target.value }))} required placeholder="Contoh: Gratis SPP 1 Bulan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                <input type="number" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
            </div>
        </>
    );

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Kelola Beasiswa</h2>
                    <p className="text-gray-500 text-sm">Atur jenis dan ketentuan beasiswa</p>
                </div>
                <button onClick={openAdd} className="bg-[#E67E22] hover:bg-[#D35400] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    <i className="fas fa-plus mr-2"></i>Tambah Beasiswa
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-32"><div className="w-8 h-8 border-4 border-[#E67E22] border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Syarat</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Benefit</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-10 text-gray-400">Belum ada data beasiswa</td></tr>
                                ) : data.map((row, i) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-[#E67E22]/10 text-[#E67E22] rounded-full text-xs font-medium">{row.jenis}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{row.kategori}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.syarat}</td>
                                        <td className="px-4 py-3 text-sm text-green-600 font-medium">{row.benefit}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => openEdit(row)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => openDelete(row)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAdd && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-gray-800">Tambah Beasiswa</h3>
                            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className="p-4 space-y-4"><FormFields /></div>
                            <div className="flex gap-3 p-4 border-t bg-gray-50">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#E67E22] hover:bg-[#D35400] text-white rounded-lg text-sm font-medium transition disabled:opacity-70">
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEdit && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-gray-800">Edit Beasiswa</h3>
                            <button onClick={() => setShowEdit(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleEdit}>
                            <div className="p-4 space-y-4"><FormFields /></div>
                            <div className="flex gap-3 p-4 border-t bg-gray-50">
                                <button type="button" onClick={() => setShowEdit(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#E67E22] hover:bg-[#D35400] text-white rounded-lg text-sm font-medium transition disabled:opacity-70">
                                    {saving ? 'Menyimpan...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDelete && deleting && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-trash-alt text-red-500 text-2xl"></i>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Hapus Beasiswa?</h3>
                        <p className="text-gray-500 text-sm mb-6">Yakin ingin menghapus <strong>{deleting.syarat}</strong>?</p>
                        <form onSubmit={handleDelete} className="flex gap-3">
                            <button type="button" onClick={() => setShowDelete(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-70">Hapus</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
