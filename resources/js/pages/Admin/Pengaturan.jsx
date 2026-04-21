import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

export default function Pengaturan() {
    const { token } = useAuth();
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetch_ = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/pengaturan', { headers: { Authorization: `Bearer ${token}` } });
            const d = await res.json();
            if (d.success) setSettings(d.data);
        } catch (err) {
            console.error('Gagal memuat pengaturan:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/pengaturan/bulk', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            });
            const d = await res.json();
            Swal.fire({ icon: d.success ? 'success' : 'error', title: d.success ? 'Berhasil' : 'Gagal', text: d.success ? 'Pengaturan berhasil disimpan!' : d.message, confirmButtonColor: '#1B7A3D', timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan jaringan. Silakan coba lagi.', confirmButtonColor: '#1B7A3D' });
        } finally {
            setSaving(false);
        }
    };

    const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B7A3D] focus:border-transparent outline-none";
    const dateInputCls = "w-full px-2 py-1 border border-gray-300 rounded text-sm";

    return (
        <div className="relative">
            {/* Loading overlay - doesn't unmount children */}
            {loading && (
                <div className="absolute inset-0 bg-white/70 z-20 flex justify-center items-center rounded-xl">
                    <div className="w-10 h-10 border-4 border-[#1B7A3D] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Pengaturan</h2>
                <p className="text-gray-500 text-sm">Atur konfigurasi website</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6">
                {/* Status Pendaftaran */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fas fa-toggle-on mr-2 text-[#1B7A3D]"></i>Status Pendaftaran</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-700">Buka Pendaftaran</p>
                            <p className="text-sm text-gray-500">Jika dimatikan, form pendaftaran tidak bisa diakses</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.status_pendaftaran === '1'}
                                onChange={e => setSettings(s => ({ ...s, status_pendaftaran: e.target.checked ? '1' : '0' }))}
                                className="sr-only peer" />
                            <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#1B7A3D] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
                        </label>
                    </div>
                </div>

                {/* Tahun Ajaran */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fas fa-calendar mr-2 text-[#1B7A3D]"></i>Tahun Ajaran</h3>
                    <input type="text" value={settings.tahun_ajaran ?? ''} onChange={e => setSettings(s => ({ ...s, tahun_ajaran: e.target.value }))}
                        placeholder="2026/2027" className={inputCls} />
                </div>

                {/* Jadwal Pendaftaran */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fas fa-clock mr-2 text-[#1B7A3D]"></i>Jadwal Pendaftaran</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-lg p-3">
                            <p className="font-medium text-gray-700 mb-2">Gelombang 1</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-gray-500">Mulai</label>
                                    <input type="date" value={settings.gelombang_1_start ?? ''} onChange={e => setSettings(s => ({ ...s, gelombang_1_start: e.target.value }))} className={dateInputCls} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Selesai</label>
                                    <input type="date" value={settings.gelombang_1_end ?? ''} onChange={e => setSettings(s => ({ ...s, gelombang_1_end: e.target.value }))} className={dateInputCls} />
                                </div>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3">
                            <p className="font-medium text-gray-700 mb-2">Gelombang 2</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-gray-500">Mulai</label>
                                    <input type="date" value={settings.gelombang_2_start ?? ''} onChange={e => setSettings(s => ({ ...s, gelombang_2_start: e.target.value }))} className={dateInputCls} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Selesai</label>
                                    <input type="date" value={settings.gelombang_2_end ?? ''} onChange={e => setSettings(s => ({ ...s, gelombang_2_end: e.target.value }))} className={dateInputCls} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Link Download PDF */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fas fa-link mr-2 text-[#1B7A3D]"></i>Link Download PDF</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link PDF Biaya</label>
                            <input type="url" value={settings.link_pdf_biaya ?? ''} onChange={e => setSettings(s => ({ ...s, link_pdf_biaya: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link PDF Brosur</label>
                            <input type="url" value={settings.link_pdf_brosur ?? ''} onChange={e => setSettings(s => ({ ...s, link_pdf_brosur: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link PDF Syarat</label>
                            <input type="url" value={settings.link_pdf_syarat ?? ''} onChange={e => setSettings(s => ({ ...s, link_pdf_syarat: e.target.value }))} className={inputCls} />
                        </div>
                    </div>
                </div>

                {/* Grup WhatsApp */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fab fa-whatsapp mr-2 text-green-600"></i>WhatsApp Automasi</h3>
                    
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div>
                            <p className="font-medium text-gray-700">Layanan WhatsApp Otomatis</p>
                            <p className="text-sm text-gray-500">Kirim notifikasi otomatis saat pendaftaran atau status berubah (MPWA)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.wa_otomatis === '1'}
                                onChange={e => setSettings(s => ({ ...s, wa_otomatis: e.target.checked ? '1' : '0' }))}
                                className="sr-only peer" />
                            <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Grup WA Pendaftar</label>
                        <input type="url" value={settings.link_grup_wa ?? ''} onChange={e => setSettings(s => ({ ...s, link_grup_wa: e.target.value }))}
                            placeholder="https://chat.whatsapp.com/..." className={inputCls} />
                        <p className="text-xs text-gray-500 mt-1">Link ini akan ditampilkan setelah pendaftar berhasil mendaftar</p>
                    </div>
                </div>

                {/* Sosial Media */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-4"><i className="fas fa-share-alt mr-2 text-[#1B7A3D]"></i>Sosial Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <i className="fab fa-facebook-f text-blue-600"></i> Facebook
                            </label>
                            <input type="url" value={settings.link_facebook ?? ''} onChange={e => setSettings(s => ({ ...s, link_facebook: e.target.value }))}
                                placeholder="https://facebook.com/..." className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <i className="fab fa-instagram text-pink-600"></i> Instagram
                            </label>
                            <input type="url" value={settings.link_instagram ?? ''} onChange={e => setSettings(s => ({ ...s, link_instagram: e.target.value }))}
                                placeholder="https://instagram.com/..." className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <i className="fab fa-tiktok text-black"></i> TikTok
                            </label>
                            <input type="url" value={settings.link_tiktok ?? ''} onChange={e => setSettings(s => ({ ...s, link_tiktok: e.target.value }))}
                                placeholder="https://tiktok.com/@..." className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <i className="fab fa-youtube text-red-600"></i> YouTube
                            </label>
                            <input type="url" value={settings.link_youtube ?? ''} onChange={e => setSettings(s => ({ ...s, link_youtube: e.target.value }))}
                                placeholder="https://youtube.com/@..." className={inputCls} />
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={saving}
                    className="w-full bg-[#1B7A3D] hover:bg-[#145C2E] text-white font-semibold py-3 rounded-lg transition disabled:opacity-70 flex items-center justify-center gap-2">
                    {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    <i className="fas fa-save"></i>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
            </form>
        </div>
    );
}

