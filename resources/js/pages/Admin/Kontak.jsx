import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

export default function Kontak() {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [form, setForm] = useState({ lembaga: '', nama: '', no_whatsapp: '', link_wa: '' });
    const [saving, setSaving] = useState(false);

    const fetch_ = useCallback(async () => {
        setLoading(true);
        const res = await fetch('/api/kontak', { headers: { Authorization: `Bearer ${token}` } });
        const d = await res.json();
        if (d.success) setData(d.data);
        setLoading(false);
    }, [token]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const openAdd = () => { setForm({ lembaga: '', nama: '', no_whatsapp: '', link_wa: '' }); setShowAdd(true); };
    const openEdit = (row) => { setEditing(row); setForm({ lembaga: row.lembaga, nama: row.nama, no_whatsapp: row.no_whatsapp, link_wa: row.link_wa ?? '' }); setShowEdit(true); };
    const openDelete = (row) => { setDeleting(row); setShowDelete(true); };

    const handleAdd = async (e) => {
        e.preventDefault(); setSaving(true);
        const res = await fetch('/api/kontak', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const d = await res.json(); setSaving(false);
        if (d.success) { setShowAdd(false); Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Kontak berhasil ditambahkan!', timer: 1500, showConfirmButton: false }); fetch_(); }
    };

    const handleEdit = async (e) => {
        e.preventDefault(); setSaving(true);
        const res = await fetch(`/api/kontak/${editing.id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const d = await res.json(); setSaving(false);
        if (d.success) { setShowEdit(false); Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Kontak berhasil diupdate!', timer: 1500, showConfirmButton: false }); fetch_(); }
    };

    const handleDelete = async (e) => {
        e.preventDefault(); setSaving(true);
        await fetch(`/api/kontak/${deleting.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        setSaving(false); setShowDelete(false);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Kontak berhasil dihapus!', timer: 1500, showConfirmButton: false });
        fetch_();
    };

    const FormFields = () => (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lembaga</label>
                <input type="text" value={form.lembaga} onChange={e => setForm(f => ({ ...f, lembaga: e.target.value }))} required placeholder="SMP/MA/PONPES"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input type="text" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} required placeholder="Nama kontak"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No WhatsApp</label>
                <input type="text" value={form.no_whatsapp} onChange={e => setForm(f => ({ ...f, no_whatsapp: e.target.value }))} required placeholder="08xxxxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link WA (opsional)</label>
                <input type="url" value={form.link_wa} onChange={e => setForm(f => ({ ...f, link_wa: e.target.value }))} placeholder="https://wa.link/xxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
            </div>
        </>
    );

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Kelola Kontak</h2>
                    <p className="text-gray-500 text-sm">Atur kontak WhatsApp per lembaga</p>
                </div>
                <button onClick={openAdd} className="bg-[#E67E22] hover:bg-[#D35400] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    <i className="fas fa-plus mr-2"></i>Tambah Kontak
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-32"><div className="w-8 h-8 border-4 border-[#E67E22] border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.map(row => (
                        <div key={row.id} className="bg-white rounded-xl shadow-sm p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <i className="fab fa-whatsapp text-green-600 text-2xl"></i>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openEdit(row)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => openDelete(row)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-[#E67E22]/10 text-[#E67E22] rounded-full text-xs font-medium">{row.lembaga}</span>
                            <h3 className="font-semibold text-gray-800 mt-2">{row.nama}</h3>
                            <p className="text-gray-500 text-sm">{row.no_whatsapp}</p>
                            {row.link_wa && (
                                <a href={row.link_wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-green-600 text-xs mt-2 hover:underline">
                                    <i className="fas fa-external-link-alt"></i>Buka Link
                                </a>
                            )}
                        </div>
                    ))}
                    {data.length === 0 && <div className="col-span-3 text-center py-10 text-gray-400">Belum ada data kontak</div>}
                </div>
            )}

            {/* Add Modal */}
            {showAdd && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-gray-800">Tambah Kontak</h3>
                            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className="p-4 space-y-4"><FormFields /></div>
                            <div className="flex gap-3 p-4 border-t bg-gray-50">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#E67E22] hover:bg-[#D35400] text-white rounded-lg text-sm font-medium transition disabled:opacity-70">Simpan</button>
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
                            <h3 className="font-semibold text-gray-800">Edit Kontak</h3>
                            <button onClick={() => setShowEdit(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleEdit}>
                            <div className="p-4 space-y-4"><FormFields /></div>
                            <div className="flex gap-3 p-4 border-t bg-gray-50">
                                <button type="button" onClick={() => setShowEdit(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#E67E22] hover:bg-[#D35400] text-white rounded-lg text-sm font-medium transition disabled:opacity-70">Update</button>
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
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Hapus Kontak?</h3>
                        <p className="text-gray-500 text-sm mb-6">Yakin ingin menghapus <strong>{deleting.nama}</strong>?</p>
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
