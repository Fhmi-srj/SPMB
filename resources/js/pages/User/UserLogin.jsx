import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function UserLogin() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [forgotPhone, setForgotPhone] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Fetch CSRF cookie first (required by Sanctum statefulApi)
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post('/api/user/login', { phone, password });
            if (res.data.success) {
                localStorage.setItem('user_portal', JSON.stringify(res.data.data));
                navigate('/portal/dashboard');
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Login gagal', confirmButtonColor: '#E67E22' });
        } finally { setLoading(false); }
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post('/api/user/forgot-password', { no_hp: forgotPhone });
            if (res.data.success) {
                Swal.fire({ icon: 'success', title: 'Berhasil', text: res.data.message, confirmButtonColor: '#E67E22' });
                setShowForgot(false);
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Gagal mengirim', confirmButtonColor: '#E67E22' });
        } finally { setForgotLoading(false); }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Orange gradient header matching PHP */}
                    <div className="p-6 text-center" style={{ background: 'linear-gradient(to right, #E67E22, #F39C12)' }}>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fas fa-user-graduate text-3xl text-white"></i>
                        </div>
                        <h1 className="text-xl font-bold text-white">Portal Pendaftar</h1>
                        <p className="text-white/80 text-sm">Login untuk melihat status pendaftaran</p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Nomor WhatsApp</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <i className="fab fa-whatsapp"></i>
                                    </span>
                                    <div className="flex">
                                        <span className="bg-gray-100 border border-r-0 border-gray-300 pl-10 pr-2 py-3 rounded-l-lg text-gray-600 text-sm font-medium flex items-center">+62</span>
                                        <input type="text" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, ''))}
                                            placeholder="8xxxxxxxxxx" required minLength={9} maxLength={13}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <i className="fas fa-lock"></i>
                                    </span>
                                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                        placeholder="Masukkan password" required
                                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition text-sm" />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-100 disabled:opacity-70">
                                {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Masuk...</> : <><i className="fas fa-sign-in-alt mr-2"></i>Masuk</>}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <button onClick={() => setShowForgot(true)} className="text-[#E67E22] text-sm font-medium hover:underline">
                                <i className="fas fa-key mr-1"></i>Lupa Password?
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm">
                                Belum punya akun? <Link to="/daftar" className="text-[#E67E22] font-medium hover:underline">Daftar di sini</Link>
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 text-center border-t">
                        <Link to="/" className="text-sm text-gray-500 hover:text-[#E67E22]">
                            <i className="fas fa-arrow-left mr-1"></i>Kembali ke Website
                        </Link>
                    </div>
                </div>

                <p className="text-center text-gray-400 text-xs mt-4">
                    © {new Date().getFullYear()} SPMB Mambaul Huda Pajomblangan
                </p>
            </div>

            {/* Forgot Password Modal */}
            {showForgot && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 flex justify-between items-center" style={{ background: 'linear-gradient(to right, #E67E22, #F39C12)' }}>
                            <h3 className="text-lg font-bold text-white"><i className="fas fa-key mr-2"></i>Lupa Password</h3>
                            <button onClick={() => setShowForgot(false)} className="text-white/80 hover:text-white">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4">Masukkan nomor WhatsApp yang terdaftar. Password baru akan dikirim melalui WhatsApp.</p>
                            <form onSubmit={handleForgot} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Nomor WhatsApp</label>
                                    <div className="flex">
                                        <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-3 rounded-l-lg text-gray-600 text-sm font-medium flex items-center">+62</span>
                                        <input type="text" value={forgotPhone} onChange={e => setForgotPhone(e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, ''))}
                                            placeholder="8xxxxxxxxxx" required minLength={9} maxLength={13}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition text-sm" />
                                    </div>
                                </div>
                                <button type="submit" disabled={forgotLoading}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70">
                                    {forgotLoading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Mengirim...</> : <><i className="fab fa-whatsapp mr-2"></i>Kirim via WhatsApp</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
