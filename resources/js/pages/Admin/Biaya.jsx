import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const fmt = (n) => n > 0 ? 'Rp' + Number(n).toLocaleString('id-ID') : '-';

export default function Biaya() {
    const { token } = useAuth();
    const [biayaList, setBiayaList] = useState([]);
    const [perlengkapanList, setPerlengkapanList] = useState([]);
    const [loading, setLoading] = useState(true);
    // Biaya modals
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [form, setForm] = useState({ kategori: 'PENDAFTARAN', nama_item: '', biaya: 0, urutan: 0 });
    // Perlengkapan modals
    const [showAddP, setShowAddP] = useState(false);
    const [showEditP, setShowEditP] = useState(false);
    const [showDeleteP, setShowDeleteP] = useState(false);
    const [editingP, setEditingP] = useState(null);
    const [deletingP, setDeletingP] = useState(null);
    const [formP, setFormP] = useState({ nama_item: '', nominal: 0, urutan: 0 });
    const [saving, setSaving] = useState(false);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const [biayaRes, perlRes] = await Promise.all([
            fetch('/api/biaya', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('/api/perlengkapan/items', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
        ]);
        const biayaD = await biayaRes.json();
        if (biayaD.success) {
            const all = [...(biayaD.data?.pendaftaran || []), ...(biayaD.data?.daftar_ulang || [])];
            all.sort((a, b) => {
                if (a.kategori === b.kategori) return (a.urutan || 0) - (b.urutan || 0);
                return a.kategori === 'PENDAFTARAN' ? -1 : 1;
            });
            setBiayaList(all);
        }
        if (perlRes) {
            const perlD = await perlRes.json();
            if (perlD.success) setPerlengkapanList(perlD.data || []);
        }
        setLoading(false);
    }, [token]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Biaya CRUD
    const handleBiayaSubmit = async (e, isEdit) => {
        e.preventDefault(); setSaving(true);
        const url = isEdit ? `/api/biaya/${editing.id}` : '/api/biaya';
        const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const d = await res.json(); setSaving(false);
        if (d.success) { isEdit ? setShowEdit(false) : setShowAdd(false); Swal.fire({ icon: 'success', title: 'Berhasil', timer: 1500, showConfirmButton: false }); fetchAll(); }
    };

    const handleBiayaDelete = async (e) => {
        e.preventDefault(); setSaving(true);
        await fetch(`/api/biaya/${deleting.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        setSaving(false); setShowDelete(false);
        Swal.fire({ icon: 'success', title: 'Dihapus', timer: 1200, showConfirmButton: false }); fetchAll();
    };

    // Perlengkapan CRUD
    const handlePerlSubmit = async (e, isEdit) => {
        e.preventDefault(); setSaving(true);
        const url = isEdit ? `/api/perlengkapan/items/${editingP.id}` : '/api/perlengkapan/items';
        const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(formP) });
        const d = await res.json(); setSaving(false);
        if (d.success) { isEdit ? setShowEditP(false) : setShowAddP(false); Swal.fire({ icon: 'success', title: 'Berhasil', timer: 1500, showConfirmButton: false }); fetchAll(); }
    };

    const handlePerlDelete = async (e) => {
        e.preventDefault(); setSaving(true);
        await fetch(`/api/perlengkapan/items/${deletingP.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        setSaving(false); setShowDeleteP(false);
        Swal.fire({ icon: 'success', title: 'Dihapus', timer: 1200, showConfirmButton: false }); fetchAll();
    };

    // Totals
    const totals = biayaList.reduce((t, b) => t + (b.biaya || 0), 0);

    // Render table rows with category headers
    const renderBiayaRows = () => {
        let currentKat = '';
        let no = 1;
        return biayaList.map(row => {
            const items = [];
            if (currentKat !== row.kategori) {
                currentKat = row.kategori;
                items.push(
                    <tr key={`cat-${row.kategori}`} className="bg-[#1B7A3D]/5">
                        <td colSpan={7} className="px-4 py-2 font-semibold text-[#1B7A3D] text-sm">
                            {row.kategori === 'PENDAFTARAN' ? 'A. PENDAFTARAN' : 'B. DAFTAR ULANG'}
                        </td>
                    </tr>
                );
            }
            items.push(
                <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{no++}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.kategori}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.nama_item}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">{fmt(row.biaya)}</td>
                    <td className="px-4 py-3 text-center">
                        <button onClick={() => { setEditing(row); setForm({ ...row }); setShowEdit(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><i className="fas fa-edit"></i></button>
                        <button onClick={() => { setDeleting(row); setShowDelete(true); }} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"><i className="fas fa-trash"></i></button>
                    </td>
                </tr>
            );
            return items;
        }).flat();
    };

    // Modal helper
    const ModalWrapper = ({ show, onClose, title, children }) => show ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                </div>
                {children}
            </div>
        </div>
    ) : null;

    const DeleteModal = ({ show, onClose, onSubmit, name }) => show ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-trash-alt text-red-500 text-2xl"></i>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Hapus Item?</h3>
                <p className="text-gray-500 text-sm mb-6">Yakin ingin menghapus <strong>{name}</strong>?</p>
                <form onSubmit={onSubmit} className="flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                    <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-70">Hapus</button>
                </form>
            </div>
        </div>
    ) : null;

    const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7A3D] focus:border-transparent outline-none";

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Kelola Biaya</h2>
                    <p className="text-gray-500 text-sm">Atur biaya pendaftaran dan daftar ulang</p>
                </div>
                <button onClick={() => { setForm({ kategori: 'PENDAFTARAN', nama_item: '', biaya: 0, urutan: 0 }); setShowAdd(true); }}
                    className="bg-[#1B7A3D] hover:bg-[#145C2E] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    <i className="fas fa-plus mr-2"></i>Tambah Item
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-32"><div className="w-8 h-8 border-4 border-[#1B7A3D] border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <>
                    {/* Biaya Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Item</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Biaya</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {renderBiayaRows()}
                                    <tr className="bg-[#1B7A3D] text-white font-bold">
                                        <td colSpan={3} className="px-4 py-3 text-sm">TOTAL</td>
                                        <td className="px-4 py-3 text-sm text-right">Rp{totals.toLocaleString('id-ID')}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Perlengkapan Tambahan Section */}
                    <div className="mt-8">
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Perlengkapan Tambahan</h3>
                                <p className="text-gray-500 text-sm">Kelola perlengkapan tambahan (kasur, almari, bantal, dll)</p>
                            </div>
                            <button onClick={() => { setFormP({ nama_item: '', nominal: 0, urutan: 0 }); setShowAddP(true); }}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                                <i className="fas fa-plus mr-2"></i>Tambah Perlengkapan
                            </button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Perlengkapan</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nominal</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Urutan</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {perlengkapanList.length === 0 ? (
                                            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                                                <i className="fas fa-box-open text-3xl mb-2 text-gray-300 block"></i>
                                                <p>Belum ada perlengkapan tambahan</p>
                                            </td></tr>
                                        ) : perlengkapanList.map((item, i) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.nama_item}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 text-right">Rp{Number(item.nominal).toLocaleString('id-ID')}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.urutan}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button onClick={() => { setEditingP(item); setFormP({ nama_item: item.nama_item, nominal: item.nominal, urutan: item.urutan }); setShowEditP(true); }}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><i className="fas fa-edit"></i></button>
                                                    <button onClick={() => { setDeletingP(item); setShowDeleteP(true); }}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"><i className="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Biaya Add Modal */}
            <ModalWrapper show={showAdd} onClose={() => setShowAdd(false)} title="Tambah Item Biaya">
                <form onSubmit={e => handleBiayaSubmit(e, false)}>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))} className={inputCls}>
                                <option value="PENDAFTARAN">Pendaftaran</option>
                                <option value="DAFTAR_ULANG">Daftar Ulang</option>
                            </select>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Item</label>
                            <input type="text" value={form.nama_item} onChange={e => setForm(f => ({ ...f, nama_item: e.target.value }))} required className={inputCls} /></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Biaya (Rp)</label>
                            <input type="number" value={form.biaya} onChange={e => setForm(f => ({ ...f, biaya: e.target.value }))} className={inputCls} />
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                            <input type="number" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: e.target.value }))} className={inputCls} /></div>
                    </div>
                    <div className="flex gap-3 p-4 border-t bg-gray-50">
                        <button type="button" onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                        <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#1B7A3D] hover:bg-[#145C2E] text-white rounded-lg text-sm font-medium transition disabled:opacity-70">Simpan</button>
                    </div>
                </form>
            </ModalWrapper>

            {/* Biaya Edit Modal */}
            <ModalWrapper show={showEdit} onClose={() => setShowEdit(false)} title="Edit Item Biaya">
                <form onSubmit={e => handleBiayaSubmit(e, true)}>
                    <div className="p-4 space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))} className={inputCls}>
                                <option value="PENDAFTARAN">Pendaftaran</option><option value="DAFTAR_ULANG">Daftar Ulang</option>
                            </select></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Item</label>
                            <input type="text" value={form.nama_item} onChange={e => setForm(f => ({ ...f, nama_item: e.target.value }))} required className={inputCls} /></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Biaya (Rp)</label>
                            <input type="number" value={form.biaya} onChange={e => setForm(f => ({ ...f, biaya: e.target.value }))} className={inputCls} />
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                            <input type="number" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: e.target.value }))} className={inputCls} /></div>
                    </div>
                    <div className="flex gap-3 p-4 border-t bg-gray-50">
                        <button type="button" onClick={() => setShowEdit(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                        <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#1B7A3D] hover:bg-[#145C2E] text-white rounded-lg text-sm font-medium transition disabled:opacity-70">Update</button>
                    </div>
                </form>
            </ModalWrapper>

            <DeleteModal show={showDelete} onClose={() => setShowDelete(false)} onSubmit={handleBiayaDelete} name={deleting?.nama_item} />

            {/* Perlengkapan Add Modal */}
            <ModalWrapper show={showAddP} onClose={() => setShowAddP(false)} title="Tambah Perlengkapan">
                <form onSubmit={e => handlePerlSubmit(e, false)}>
                    <div className="p-4 space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Perlengkapan</label>
                            <input type="text" value={formP.nama_item} onChange={e => setFormP(f => ({ ...f, nama_item: e.target.value }))} required placeholder="Contoh: Kasur, Almari, Bantal" className={inputCls} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                            <input type="number" value={formP.nominal} onChange={e => setFormP(f => ({ ...f, nominal: e.target.value }))} min="0" className={inputCls} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                            <input type="number" value={formP.urutan} onChange={e => setFormP(f => ({ ...f, urutan: e.target.value }))} min="0" className={inputCls} /></div>
                    </div>
                    <div className="flex gap-3 p-4 border-t bg-gray-50">
                        <button type="button" onClick={() => setShowAddP(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                        <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#1B7A3D] hover:bg-[#145C2E] text-white rounded-lg text-sm font-medium transition disabled:opacity-70">Simpan</button>
                    </div>
                </form>
            </ModalWrapper>

            {/* Perlengkapan Edit Modal */}
            <ModalWrapper show={showEditP} onClose={() => setShowEditP(false)} title="Edit Perlengkapan">
                <form onSubmit={e => handlePerlSubmit(e, true)}>
                    <div className="p-4 space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Perlengkapan</label>
                            <input type="text" value={formP.nama_item} onChange={e => setFormP(f => ({ ...f, nama_item: e.target.value }))} required className={inputCls} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                            <input type="number" value={formP.nominal} onChange={e => setFormP(f => ({ ...f, nominal: e.target.value }))} min="0" className={inputCls} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                            <input type="number" value={formP.urutan} onChange={e => setFormP(f => ({ ...f, urutan: e.target.value }))} min="0" className={inputCls} /></div>
                    </div>
                    <div className="flex gap-3 p-4 border-t bg-gray-50">
                        <button type="button" onClick={() => setShowEditP(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Batal</button>
                        <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#1B7A3D] hover:bg-[#145C2E] text-white rounded-lg text-sm font-medium transition disabled:opacity-70">Update</button>
                    </div>
                </form>
            </ModalWrapper>

            <DeleteModal show={showDeleteP} onClose={() => setShowDeleteP(false)} onSubmit={handlePerlDelete} name={deletingP?.nama_item} />
        </div>
    );
}
