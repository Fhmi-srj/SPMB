import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './pages/Auth/Login';

// Admin Pages
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import Pendaftaran from './pages/Admin/Pendaftaran';

import Biaya from './pages/Admin/Biaya';
import Kontak from './pages/Admin/Kontak';
import Pengaturan from './pages/Admin/Pengaturan';
import Aktivitas from './pages/Admin/Aktivitas';
import Transaksi from './pages/Admin/Transaksi';
import Perlengkapan from './pages/Admin/Perlengkapan';
import PosKeuangan from './pages/Admin/PosKeuangan';
import KelolaUser from './pages/Admin/KelolaUser';
import Profil from './pages/Admin/Profil';

// Public Pages
import Beranda from './pages/Public/Beranda';
import FormPendaftaran from './pages/Public/FormPendaftaran';
import CekStatus from './pages/Public/CekStatus';
import KartuPeserta from './pages/Public/KartuPeserta';



function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Auth */}
                <Route path="/login" element={<Login />} />

                {/* Admin Panel (protected) */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Routes>
                                    <Route index element={<Navigate to="dashboard" replace />} />
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="pendaftaran" element={<Pendaftaran />} />
                                    <Route path="transaksi" element={<Transaksi />} />
                                    <Route path="perlengkapan" element={<Perlengkapan />} />
                                    <Route path="pos-keuangan" element={<PosKeuangan />} />

                                    <Route path="biaya" element={<Biaya />} />
                                    <Route path="kontak" element={<Kontak />} />
                                    <Route path="kelola-user" element={<KelolaUser />} />
                                    <Route path="pengaturan" element={<Pengaturan />} />
                                    <Route path="profil" element={<Profil />} />
                                    <Route path="aktivitas" element={<Aktivitas />} />
                                </Routes>
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Public Pages */}
                <Route path="/" element={<Beranda />} />
                <Route path="/daftar" element={<FormPendaftaran />} />
                <Route path="/cek-status" element={<CekStatus />} />
                <Route path="/kartu-peserta" element={<KartuPeserta />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
