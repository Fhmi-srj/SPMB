import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get('token');
    const [valid, setValid] = useState(null);
    const [nama, setNama] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) { setValid(false); return; }
        axios.get('/api/user/validate-token', { params: { token } })
            .then(res => { setValid(true); setNama(res.data.data.nama); })
            .catch(() => setValid(false));
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) { Swal.fire('Error', 'Konfirmasi password tidak cocok', 'error'); return; }
        setLoading(true);
        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/api/user/reset-password', { token, password, password_confirmation: confirm });
            Swal.fire('Berhasil', 'Password berhasil diubah. Silakan login.', 'success');
            navigate('/portal');
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Gagal', 'error');
        } finally { setLoading(false); }
    };

    if (valid === null) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔑</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Buat Password Baru</h1>
                    {valid && <p className="text-gray-500 mt-2">Halo, <strong>{nama}</strong></p>}
                </div>

                {!valid ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                        <p>Link sudah kadaluarsa atau tidak valid.</p>
                        <Link to="/portal" className="text-orange-500 hover:underline mt-2 inline-block">Kembali ke Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                                placeholder="Minimal 6 karakter" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6}
                                placeholder="Ulangi password" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-sm" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition disabled:opacity-70">
                            {loading ? 'Menyimpan...' : '💾 Simpan Password Baru'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
