import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API = '/api';

export default function Profil() {
    const [profile, setProfile] = useState({ nama: '', username: '', role: '' });
    const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API}/profil`, { headers });
            setProfile(res.data.data || {});
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API}/profil`, { nama: profile.nama, username: profile.username }, { headers });
            Swal.fire({ icon: 'success', title: 'Profil berhasil diupdate!', timer: 1500, showConfirmButton: false });
            // Update localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.nama = profile.nama;
            user.username = profile.username;
            localStorage.setItem('user', JSON.stringify(user));
        } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error'); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (pwForm.new_password !== pwForm.confirm_password) {
            Swal.fire('Error', 'Konfirmasi password tidak cocok!', 'error');
            return;
        }
        try {
            await axios.put(`${API}/profil/password`, pwForm, { headers });
            Swal.fire({ icon: 'success', title: 'Password berhasil diubah!', timer: 1500, showConfirmButton: false });
            setPwForm({ current_password: '', new_password: '', confirm_password: '' });
        } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error'); }
    };

    const togglePw = (field) => setShowPw({ ...showPw, [field]: !showPw[field] });

    const roleBadge = () => {
        const cls = { super_admin: ['Super Admin', 'bg-red-100 text-red-700'], admin: ['Admin', 'bg-blue-100 text-blue-700'], panitia: ['Panitia', 'bg-green-100 text-green-700'] };
        const [label, color] = cls[profile.role] || ['User', 'bg-gray-100 text-gray-700'];
        return <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${color}`}>{label}</span>;
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#E67E22] border-t-transparent rounded-full"></div></div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profil Admin</h2>
                <p className="text-gray-500 text-sm">Kelola informasi akun Anda</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-[#E67E22]/5 px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-[#E67E22]"><i className="fas fa-user mr-2"></i>Informasi Profil</h3>
                    </div>
                    <form onSubmit={handleUpdateProfile} className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            {roleBadge()}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" value={profile.nama || ''} onChange={e => setProfile({ ...profile, nama: e.target.value })} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" value={profile.username || ''} onChange={e => setProfile({ ...profile, username: e.target.value })} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                        </div>
                        <button type="submit" className="w-full bg-[#E67E22] hover:bg-[#d35400] text-white font-semibold py-2 rounded-lg transition">
                            <i className="fas fa-save mr-2"></i>Simpan Perubahan
                        </button>
                    </form>
                </div>

                {/* Password Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-yellow-50 px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-yellow-700"><i className="fas fa-key mr-2"></i>Ubah Password</h3>
                    </div>
                    <form onSubmit={handleChangePassword} className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                            <div className="relative">
                                <input type={showPw.current ? 'text' : 'password'} value={pwForm.current_password} onChange={e => setPwForm({ ...pwForm, current_password: e.target.value })} required
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                <button type="button" onClick={() => togglePw('current')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i className={`fas ${showPw.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                            <div className="relative">
                                <input type={showPw.new ? 'text' : 'password'} value={pwForm.new_password} onChange={e => setPwForm({ ...pwForm, new_password: e.target.value })} required minLength={6}
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                <button type="button" onClick={() => togglePw('new')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i className={`fas ${showPw.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                            <div className="relative">
                                <input type={showPw.confirm ? 'text' : 'password'} value={pwForm.confirm_password} onChange={e => setPwForm({ ...pwForm, confirm_password: e.target.value })} required
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none" />
                                <button type="button" onClick={() => togglePw('confirm')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i className={`fas ${showPw.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition">
                            <i className="fas fa-key mr-2"></i>Ubah Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
