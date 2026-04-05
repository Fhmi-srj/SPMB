import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(form.username, form.password);
            if (res.success) {
                navigate('/admin/dashboard', { replace: true });
            } else {
                Swal.fire({ icon: 'error', title: 'Login Gagal', text: res.message, confirmButtonColor: '#E67E22' });
            }
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan. Coba lagi.', confirmButtonColor: '#E67E22' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Orange gradient header matching PHP */}
                    <div className="p-6 text-center" style={{ background: 'linear-gradient(to right, #E67E22, #F39C12)' }}>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fas fa-user-shield text-3xl text-white"></i>
                        </div>
                        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                        <p className="text-white/80 text-sm">SPMB Mambaul Huda</p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <i className="fas fa-user"></i>
                                    </span>
                                    <input
                                        type="text"
                                        value={form.username}
                                        onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                        placeholder="Masukkan username"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition text-sm"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <i className="fas fa-lock"></i>
                                    </span>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        placeholder="Masukkan password"
                                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition text-sm"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPass(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-100 disabled:opacity-70"
                            >
                                {loading ? (
                                    <><i className="fas fa-spinner fa-spin mr-2"></i>Masuk...</>
                                ) : (
                                    <><i className="fas fa-sign-in-alt mr-2"></i>Masuk</>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/" className="text-sm text-gray-500 hover:text-[#E67E22]">
                                <i className="fas fa-arrow-left mr-1"></i>Kembali ke Website
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-400 text-xs mt-4">
                    © {new Date().getFullYear()} SPMB Mambaul Huda Pajomblangan
                </p>
            </div>
        </div>
    );
}
