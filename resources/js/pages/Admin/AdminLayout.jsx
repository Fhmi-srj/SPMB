import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

// Komponen SideLink dipindahkan ke luar agar tidak remount saat navigasi
const SideLink = ({ to, icon, label, badge: badgeCount, isActive }) => (
    <NavLink 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive(to) ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white'
        }`}
    >
        <i className={`${icon} w-5`}></i>
        <span className="flex-1">{label}</span>
        {badgeCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full">
                {badgeCount}
            </span>
        )}
    </NavLink>
);

export default function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropupOpen, setDropupOpen] = useState(false);

    const isActive = (path) => location.pathname.startsWith(path);
    const isSuperAdmin = user?.role === 'super_admin';
    const isAdminRole = ['super_admin', 'admin'].includes(user?.role);

    const roleBadge = {
        super_admin: { label: 'Super Admin', color: 'bg-red-500' },
        admin: { label: 'Admin', color: 'bg-blue-500' },
        panitia: { label: 'Panitia', color: 'bg-green-500' },
    };
    const badge = roleBadge[user?.role] || { label: 'User', color: 'bg-gray-500' };

    const handleLogout = async () => {
        const confirm = await Swal.fire({
            title: 'Logout?',
            text: 'Yakin ingin keluar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Logout',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#E67E22',
        });
        if (confirm.isConfirmed) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-64 bg-[#E67E22] text-white flex-col h-screen">
                <div className="p-4 border-b border-white/10">
                    <h1 className="font-bold text-lg">Admin SPMB</h1>
                    <p className="text-xs text-white/60">Mambaul Huda</p>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    <SideLink to="/admin/dashboard" icon="fas fa-tachometer-alt" label="Dashboard" isActive={isActive} />
                    <SideLink to="/admin/pendaftaran" icon="fas fa-users" label="Data Pendaftar" isActive={isActive} />
                    {isAdminRole && <SideLink to="/admin/rekap-pendaftaran" icon="fas fa-file-invoice" label="Rekap Pendaftaran" isActive={isActive} />}

                    {isAdminRole && (
                        <>
                            <div className="pt-2 mt-2 border-t border-white/10">
                                <p className="px-4 py-1 text-xs text-white/40 uppercase tracking-wider">Administrasi</p>
                            </div>
                            <SideLink to="/admin/biaya" icon="fas fa-money-bill" label="Biaya" isActive={isActive} />
                            <SideLink to="/admin/perlengkapan" icon="fas fa-box" label="Perlengkapan" isActive={isActive} />
                            <SideLink to="/admin/transaksi" icon="fas fa-money-bill-wave" label="Transaksi" isActive={isActive} />
                            <SideLink to="/admin/pos-keuangan" icon="fas fa-chart-pie" label="Pos Keuangan" isActive={isActive} />
                        </>
                    )}

                    <div className="pt-2 mt-2 border-t border-white/10">
                        <p className="px-4 py-1 text-xs text-white/40 uppercase tracking-wider">Lainnya</p>
                    </div>
                    <SideLink to="/admin/beasiswa" icon="fas fa-graduation-cap" label="Beasiswa" isActive={isActive} />
                    <SideLink to="/admin/kontak" icon="fas fa-phone-alt" label="Kontak" isActive={isActive} />
                    <SideLink to="/admin/pengaturan" icon="fas fa-cog" label="Pengaturan" isActive={isActive} />
                    {isAdminRole && <SideLink to="/admin/aktivitas" icon="fas fa-history" label="Log Aktivitas" isActive={isActive} />}

                    {isSuperAdmin && (
                        <>
                            <div className="pt-2 mt-2 border-t border-white/10">
                                <p className="px-4 py-1 text-xs text-white/40 uppercase tracking-wider">Super Admin</p>
                            </div>
                            <SideLink to="/admin/kelola-user" icon="fas fa-user-cog" label="Kelola User" isActive={isActive} />
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <NavLink to="/admin/profil" className="flex items-center gap-3 mb-3 hover:bg-white/10 p-2 -m-2 rounded-lg transition cursor-pointer">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">{user?.nama || 'Admin'}</p>
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${badge.color} text-white`}>{badge.label}</span>
                        </div>
                        <i className="fas fa-chevron-right text-white/40 text-xs"></i>
                    </NavLink>
                    <button onClick={handleLogout} className="block w-full text-center py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">
                        <i className="fas fa-sign-out-alt mr-2"></i>Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
                {/* Mobile Header */}
                <div className="md:hidden bg-[#E67E22] text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
                    <span className="font-bold">Admin SPMB</span>
                    <button onClick={handleLogout} className="text-xl"><i className="fas fa-sign-out-alt"></i></button>
                </div>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-gray-100/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-50">
                <div className="flex items-center justify-around px-2 py-1.5">
                    <NavLink to="/admin/dashboard" className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${isActive('/admin/dashboard') ? 'text-[#E67E22] scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300 ${isActive('/admin/dashboard') ? 'bg-[#E67E22]/10' : ''}`}>
                            <i className="fas fa-home text-lg"></i>
                        </div>
                        <span className="text-[10px] font-semibold tracking-wide">Home</span>
                    </NavLink>
                    <NavLink to="/admin/pendaftaran" className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${isActive('/admin/pendaftaran') ? 'text-[#E67E22] scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300 ${isActive('/admin/pendaftaran') ? 'bg-[#E67E22]/10' : ''}`}>
                            <i className="fas fa-users text-lg"></i>
                        </div>
                        <span className="text-[10px] font-semibold tracking-wide">Pendaftar</span>
                    </NavLink>
                    <button onClick={() => setDropupOpen(!dropupOpen)} className="flex flex-col items-center -mt-6 relative z-50 select-none">
                        <div className={`w-12 h-12 bg-gradient-to-tr ${dropupOpen ? 'from-red-500 to-rose-600 shadow-[0_4px_12px_rgba(239,68,68,0.3)]' : 'from-[#E67E22] to-[#FF9F43] shadow-[0_4px_12px_rgba(230,126,34,0.3)]'} rounded-full flex items-center justify-center transition-all duration-300 transform ${dropupOpen ? 'rotate-45' : ''}`}>
                            <i className="fas fa-plus text-white text-xl"></i>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 mt-1">Menu</span>
                    </button>
                    {isAdminRole ? (
                        <NavLink to="/admin/transaksi" className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${isActive('/admin/transaksi') ? 'text-[#E67E22] scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300 ${isActive('/admin/transaksi') ? 'bg-[#E67E22]/10' : ''}`}>
                                <i className="fas fa-money-bill-wave text-lg"></i>
                            </div>
                            <span className="text-[10px] font-semibold tracking-wide">Transaksi</span>
                        </NavLink>
                    ) : (
                        <NavLink to="/admin/beasiswa" className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${isActive('/admin/beasiswa') ? 'text-[#E67E22] scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300 ${isActive('/admin/beasiswa') ? 'bg-[#E67E22]/10' : ''}`}>
                                <i className="fas fa-graduation-cap text-lg"></i>
                            </div>
                            <span className="text-[10px] font-semibold tracking-wide">Beasiswa</span>
                        </NavLink>
                    )}
                    <NavLink to="/admin/pengaturan" className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${isActive('/admin/pengaturan') ? 'text-[#E67E22] scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300 ${isActive('/admin/pengaturan') ? 'bg-[#E67E22]/10' : ''}`}>
                            <i className="fas fa-cog text-lg"></i>
                        </div>
                        <span className="text-[10px] font-semibold tracking-wide">Setting</span>
                    </NavLink>
                </div>
            </nav>

            {/* Dropup Overlay */}
            {dropupOpen && <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 animate-fade-in" onClick={() => setDropupOpen(false)}></div>}

            {/* Dropup Menu */}
            {dropupOpen && (
                <div className="md:hidden fixed bottom-24 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 z-40 overflow-hidden animate-fade-in-up">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                            <h3 className="font-bold text-gray-800 text-sm tracking-wide">Pintasan Menu</h3>
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Akses Cepat</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {isAdminRole && (
                                <>
                                    <NavLink to="/admin/biaya" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                                            <i className="fas fa-money-bill text-lg"></i>
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">Biaya</span>
                                    </NavLink>
                                    <NavLink to="/admin/perlengkapan" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                                            <i className="fas fa-box text-lg"></i>
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">Perlengkapan</span>
                                    </NavLink>
                                    <NavLink to="/admin/pos-keuangan" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                                            <i className="fas fa-chart-pie text-lg"></i>
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">Pos Keuangan</span>
                                    </NavLink>
                                    <NavLink to="/admin/rekap-pendaftaran" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E67E22] flex items-center justify-center shadow-sm">
                                            <i className="fas fa-file-invoice text-lg"></i>
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">Rekap</span>
                                    </NavLink>
                                </>
                            )}
                            <NavLink to="/admin/beasiswa" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                    <i className="fas fa-graduation-cap text-lg"></i>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">Beasiswa</span>
                            </NavLink>
                            <NavLink to="/admin/kontak" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shadow-sm">
                                    <i className="fas fa-phone-alt text-lg"></i>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">Kontak</span>
                            </NavLink>
                            {isAdminRole && (
                                <NavLink to="/admin/aktivitas" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
                                        <i className="fas fa-history text-lg"></i>
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">Aktivitas</span>
                                </NavLink>
                            )}
                            {isSuperAdmin && (
                                <NavLink to="/admin/kelola-user" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                                        <i className="fas fa-user-cog text-lg"></i>
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">Kelola User</span>
                                </NavLink>
                            )}
                            <NavLink to="/admin/profil" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shadow-sm">
                                    <i className="fas fa-user text-lg"></i>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">Profil</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Animations for Dropup Menu */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(12px) scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
