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
            confirmButtonColor: '#1B7A3D',
        });
        if (confirm.isConfirmed) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-64 bg-[#1B7A3D] text-white flex-col h-screen">
                <div className="p-4 border-b border-white/10">
                    <h1 className="font-bold text-lg leading-tight">PSB Nurul Huda</h1>
                    <p className="text-xs text-white/60">An Najah Banin Banat</p>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    <SideLink to="/admin/dashboard" icon="fas fa-tachometer-alt" label="Dashboard" isActive={isActive} />
                    <SideLink to="/admin/pendaftaran" icon="fas fa-users" label="Data Pendaftar" isActive={isActive} />

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
                <div className="md:hidden bg-[#1B7A3D] text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
                    <span className="font-bold text-sm">PSB Nurul Huda An Najah</span>
                    <button onClick={handleLogout} className="text-xl"><i className="fas fa-sign-out-alt"></i></button>
                </div>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="flex items-end justify-around px-2 pt-2 pb-3">
                    <NavLink to="/admin/dashboard" className={`flex flex-col items-center gap-1 px-3 py-2 ${isActive('/admin/dashboard') ? 'text-[#1B7A3D]' : 'text-gray-500'} transition`}>
                        <i className="fas fa-home text-xl"></i>
                        <span className="text-xs font-medium">Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/pendaftaran" className={`flex flex-col items-center gap-1 px-3 py-2 ${isActive('/admin/pendaftaran') ? 'text-[#1B7A3D]' : 'text-gray-500'} transition`}>
                        <i className="fas fa-users text-xl"></i>
                        <span className="text-xs font-medium">Pendaftar</span>
                    </NavLink>
                    <button onClick={() => setDropupOpen(!dropupOpen)} className="flex flex-col items-center -mt-6 relative">
                        <div className="w-14 h-14 bg-[#1B7A3D] rounded-full flex items-center justify-center shadow-lg hover:bg-[#145C2E] transition">
                            <i className={`fas ${dropupOpen ? 'fa-times' : 'fa-plus'} text-white text-2xl`}></i>
                        </div>
                        <span className="text-xs font-medium text-gray-500 mt-1">Menu</span>
                    </button>
                    {isAdminRole && (
                        <NavLink to="/admin/transaksi" className={`flex flex-col items-center gap-1 px-3 py-2 ${isActive('/admin/transaksi') ? 'text-[#1B7A3D]' : 'text-gray-500'} transition`}>
                            <i className="fas fa-money-bill-wave text-xl"></i>
                            <span className="text-xs font-medium">Transaksi</span>
                        </NavLink>
                    )}

                    <NavLink to="/admin/pengaturan" className={`flex flex-col items-center gap-1 px-3 py-2 ${isActive('/admin/pengaturan') ? 'text-[#1B7A3D]' : 'text-gray-500'} transition`}>
                        <i className="fas fa-cog text-xl"></i>
                        <span className="text-xs font-medium">Pengaturan</span>
                    </NavLink>
                </div>
            </nav>

            {/* Dropup Overlay */}
            {dropupOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setDropupOpen(false)}></div>}

            {/* Dropup Menu */}
            {dropupOpen && (
                <div className="md:hidden fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800">Menu Lainnya</h3>
                            <button onClick={() => setDropupOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {isAdminRole && (
                                <>
                                    <NavLink to="/admin/biaya" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition text-gray-600">
                                        <i className="fas fa-money-bill text-2xl"></i>
                                        <span className="text-xs font-medium text-center">Biaya</span>
                                    </NavLink>
                                    <NavLink to="/admin/perlengkapan" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition text-gray-600">
                                        <i className="fas fa-box text-2xl"></i>
                                        <span className="text-xs font-medium text-center">Perlengkapan</span>
                                    </NavLink>
                                    <NavLink to="/admin/pos-keuangan" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition text-gray-600">
                                        <i className="fas fa-chart-pie text-2xl"></i>
                                        <span className="text-xs font-medium text-center">Pos Keuangan</span>
                                    </NavLink>
                                </>
                            )}

                            <NavLink to="/admin/kontak" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition text-gray-600">
                                <i className="fas fa-phone-alt text-2xl"></i>
                                <span className="text-xs font-medium text-center">Kontak</span>
                            </NavLink>
                            <NavLink to="/admin/aktivitas" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition text-gray-600">
                                <i className="fas fa-history text-2xl"></i>
                                <span className="text-xs font-medium text-center">Log Aktivitas</span>
                            </NavLink>
                            {isSuperAdmin && (
                                <NavLink to="/admin/kelola-user" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition text-gray-600">
                                    <i className="fas fa-user-cog text-2xl"></i>
                                    <span className="text-xs font-medium text-center">Kelola User</span>
                                </NavLink>
                            )}
                            <NavLink to="/admin/profil" onClick={() => setDropupOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition text-gray-600">
                                <i className="fas fa-user text-2xl"></i>
                                <span className="text-xs font-medium text-center">Profil</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
