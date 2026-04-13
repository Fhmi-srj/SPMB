import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext';

const API = '/api';

export default function KelolaUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // 'add' | 'edit' | 'resetPw' | 'delete'
    const [form, setForm] = useState({});
    const [selected, setSelected] = useState(null);

    const { token, user: currentUser } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };

    const fetchUsers = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/users`, { headers });
            setUsers(res.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/users`, form, { headers });
            Swal.fire({ icon: 'success', title: 'User berhasil ditambahkan!', timer: 1500, showConfirmButton: false });
            setModal(null); setForm({});
            fetchUsers();
        } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error'); }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API}/users/${form.id}`, form, { headers });
            Swal.fire({ icon: 'success', title: 'User berhasil diupdate!', timer: 1500, showConfirmButton: false });
            setModal(null); setForm({});
            fetchUsers();
        } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error'); }
    };

    const handleResetPw = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/users/${selected.id}/reset-password`, { new_password: form.new_password }, { headers });
            Swal.fire({ icon: 'success', title: 'Password berhasil direset!', timer: 1500, showConfirmButton: false });
            setModal(null); setForm({});
        } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error'); }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API}/users/${selected.id}`, { headers });
            Swal.fire({ icon: 'success', title: 'User berhasil dihapus!', timer: 1500, showConfirmButton: false });
            setModal(null);
            fetchUsers();
        } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error'); }
    };

    const openEdit = (user) => { setForm({ id: user.id, username: user.username, nama: user.nama, role: user.role }); setModal('edit'); };
    const openResetPw = (user) => { setSelected(user); setForm({ new_password: '' }); setModal('resetPw'); };
    const openDelete = (user) => { setSelected(user); setModal('delete'); };

    const roleBadge = (role) => {
        const cls = { super_admin: 'bg-red-100 text-red-700', admin: 'bg-blue-100 text-blue-700', panitia: 'bg-green-100 text-green-700' };
        const lbl = { super_admin: 'Super Admin', admin: 'Admin', panitia: 'Panitia' };
        return <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${cls[role] || 'bg-gray-100 text-gray-700'}`}>{lbl[role] || role}</span>;
    };

    const closeModal = () => { setModal(null); setForm({}); setSelected(null); };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#E67E22] border-t-transparent rounded-full"></div></div>;

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Kelola User</h2>
                    <p className="text-gray-500 text-sm">Kelola akun admin, tambah atau edit user</p>
                </div>
                <button onClick={() => { setForm({ username: '', nama: '', password: '', role: 'panitia' }); setModal('add'); }} className="bg-[#E67E22] hover:bg-[#d35400] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    <i className="fas fa-user-plus mr-2"></i>Tambah User
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dibuat</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user, idx) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                        {user.nama}
                                        {user.id === currentUser?.id && <span className="text-xs text-[#E67E22] font-normal ml-1">(Anda)</span>}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.username}</td>
                                    <td className="px-4 py-3 text-center">{roleBadge(user.role)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => openEdit(user)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => openResetPw(user)} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition" title="Reset Password"><i className="fas fa-key"></i></button>
                                        {user.id !== currentUser?.id && (
                                            <button onClick={() => openDelete(user)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition" title="Hapus"><i className="fas fa-trash"></i></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                                        <i className="fas fa-users text-3xl mb-2 text-gray-300 block"></i>
                                        <p>Belum ada user</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {modal === 'add' && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-bold text-gray-800">Tambah User Baru</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input type="text" value={form.nama || ''} onChange={e => setForm({ ...form, nama: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input type="text" value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                    <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select value={form.role || 'panitia'} onChange={e => setForm({ ...form, role: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none">
                                        <option value="panitia">Panitia</option>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end p-6 border-t bg-gray-50 rounded-b-xl">
                                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-[#E67E22] hover:bg-[#d35400] text-white rounded-lg transition">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {modal === 'edit' && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-bold text-gray-800">Edit User</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleEdit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input type="text" value={form.nama || ''} onChange={e => setForm({ ...form, nama: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input type="text" value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select value={form.role || 'panitia'} onChange={e => setForm({ ...form, role: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none">
                                        <option value="panitia">Panitia</option>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end p-6 border-t bg-gray-50 rounded-b-xl">
                                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-[#E67E22] hover:bg-[#d35400] text-white rounded-lg transition">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {modal === 'resetPw' && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className="bg-white rounded-xl max-w-sm w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-bold text-gray-800">Reset Password</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleResetPw}>
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-gray-600">Reset password untuk <strong>{selected?.nama}</strong></p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                                    <input type="password" value={form.new_password || ''} onChange={e => setForm({ ...form, new_password: e.target.value })} required minLength={6} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                    <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end p-6 border-t bg-gray-50 rounded-b-xl">
                                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition">Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete User Modal */}
            {modal === 'delete' && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-trash-alt text-red-500 text-2xl"></i>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Hapus User?</h3>
                        <p className="text-gray-500 text-sm mb-6">Yakin ingin menghapus <strong>{selected?.nama}</strong>? Tindakan ini tidak bisa dibatalkan.</p>
                        <div className="flex gap-3">
                            <button onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
