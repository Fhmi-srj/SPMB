import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const API = '/api';

export default function UserDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [docs, setDocs] = useState({});
    const [canEdit, setCanEdit] = useState(false);
    const [tagihan, setTagihan] = useState(null);
    const [tab, setTab] = useState('identitas');
    const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', new_password_confirmation: '' });
    const [loading, setLoading] = useState(true);

    const portal = JSON.parse(localStorage.getItem('user_portal') || 'null');
    const userId = portal?.user_id || portal?.user?.id;

    useEffect(() => {
        if (!userId) { navigate('/portal'); return; }
        fetchDashboard();
        fetchTagihan();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await axios.post(`${API}/user/dashboard`, { user_id: userId });
            setData(res.data.data); setDocs(res.data.documents); setCanEdit(res.data.can_edit);
        } catch { navigate('/portal'); }
        finally { setLoading(false); }
    };

    const fetchTagihan = async () => {
        try { const res = await axios.get(`${API}/user/tagihan`, { params: { id: userId } }); setTagihan(res.data); } catch { }
    };

    const updateField = async (field, value) => {
        if (!canEdit) return;
        try { await axios.post(`${API}/user/update-field`, { user_id: userId, field, value }); }
        catch (e) { Swal.fire('Error', e.response?.data?.message || 'Gagal', 'error'); fetchDashboard(); }
    };

    const uploadFile = async (field, file) => {
        if (!canEdit) return;
        const fd = new FormData();
        fd.append('user_id', userId); fd.append('field', field); fd.append('file', file);
        try {
            const res = await axios.post(`${API}/user/upload-file`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            Swal.fire('Berhasil', 'File berhasil diupload', 'success');
            fetchDashboard();
        } catch (e) { Swal.fire('Error', e.response?.data?.message || 'Gagal upload', 'error'); }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/user/change-password`, { user_id: userId, ...pwForm });
            setPwForm({ old_password: '', new_password: '', new_password_confirmation: '' });
            Swal.fire('Berhasil', 'Password berhasil diubah', 'success');
        } catch (e) { Swal.fire('Error', e.response?.data?.message || 'Gagal', 'error'); }
    };

    const handleLogout = () => { localStorage.removeItem('user_portal'); navigate('/portal'); };
    const fmt = (n) => 'Rp' + (n || 0).toLocaleString('id-ID');

    const EditableField = ({ label, field, type = 'text', options }) => {
        const val = data?.[field] || '';
        return (
            <div className="py-2 border-b border-gray-50">
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                {canEdit ? (
                    options ? (
                        <select value={val} onChange={e => { updateField(field, e.target.value); setData({ ...data, [field]: e.target.value }); }}
                            className="w-full border rounded-lg px-3 py-2 text-sm">
                            <option value="">Pilih...</option>
                            {options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    ) : type === 'textarea' ? (
                        <textarea value={val} onBlur={e => updateField(field, e.target.value)} onChange={e => setData({ ...data, [field]: e.target.value })}
                            rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    ) : (
                        <input type={type} value={val} onBlur={e => updateField(field, e.target.value)} onChange={e => setData({ ...data, [field]: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm" />
                    )
                ) : (
                    <p className="text-sm text-gray-800">{val || '-'}</p>
                )}
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>;
    if (!data) return null;

    const statusColor = { pending: 'bg-yellow-100 text-yellow-800', verified: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 md:p-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">🎓 Portal Pendaftar</h1>
                        <p className="text-orange-100 text-sm">Halo, {data.nama}</p>
                    </div>
                    <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition">Logout</button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 md:p-6">
                {/* Status & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <p className="text-xs text-gray-500">Status Pendaftaran</p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${statusColor[data.status] || ''}`}>{data.status}</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <p className="text-xs text-gray-500">No. Registrasi</p>
                        <p className="mt-1 text-lg font-bold text-gray-800">{data.no_registrasi || '-'}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <p className="text-xs text-gray-500">Lembaga</p>
                        <p className="mt-1 text-lg font-bold text-gray-800">{data.lembaga}</p>
                    </div>
                </div>

                {/* Tagihan */}
                {tagihan && (
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">💰 Ringkasan Tagihan</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div><p className="text-gray-500 text-xs">Total Tagihan</p><p className="font-bold">{fmt(tagihan.total_tagihan)}</p></div>
                            <div><p className="text-gray-500 text-xs">Sudah Dibayar</p><p className="font-bold text-green-600">{fmt(tagihan.total_dibayar)}</p></div>
                            <div><p className="text-gray-500 text-xs">Sisa</p><p className="font-bold text-red-600">{fmt(tagihan.sisa_kekurangan)}</p></div>
                            <div><p className="text-gray-500 text-xs">Perlengkapan</p><p className="font-bold">{fmt(tagihan.biaya_perlengkapan)}</p></div>
                        </div>
                    </div>
                )}

                {/* Catatan Admin */}
                {data.catatan_admin && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-blue-800 mb-1">📝 Catatan dari Admin</h3>
                        <p className="text-blue-700 text-sm">{data.catatan_admin}</p>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="flex border-b overflow-x-auto">
                        {['identitas', 'keluarga', 'pendidikan', 'berkas', 'keamanan'].map(t => (
                            <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${tab === t ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}>
                                {t === 'identitas' && '👤'}{t === 'keluarga' && '👨‍👩‍👦'}{t === 'pendidikan' && '🏫'}{t === 'berkas' && '📁'}{t === 'keamanan' && '🔒'} {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="p-4 md:p-6">
                        {tab === 'identitas' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <EditableField label="Nama Lengkap" field="nama" />
                                <EditableField label="NIK" field="nik" />
                                <EditableField label="NISN" field="nisn" />
                                <EditableField label="No. KK" field="no_kk" />
                                <EditableField label="Tempat Lahir" field="tempat_lahir" />
                                <EditableField label="Tanggal Lahir" field="tanggal_lahir" type="date" />
                                <EditableField label="Jenis Kelamin" field="jenis_kelamin" options={['L', 'P']} />
                                <EditableField label="Jumlah Saudara" field="jumlah_saudara" type="number" />
                                <EditableField label="Provinsi" field="provinsi" />
                                <EditableField label="Kota/Kabupaten" field="kota_kab" />
                                <EditableField label="Kecamatan" field="kecamatan" />
                                <EditableField label="Kelurahan/Desa" field="kelurahan_desa" />
                                <div className="md:col-span-2"><EditableField label="Alamat" field="alamat" type="textarea" /></div>
                            </div>
                        )}
                        {tab === 'keluarga' && (
                            <div className="space-y-6">
                                <div><h4 className="font-semibold text-gray-700 mb-3">Data Ayah</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                        <EditableField label="Nama Ayah" field="nama_ayah" />
                                        <EditableField label="NIK Ayah" field="nik_ayah" />
                                        <EditableField label="Tempat Lahir" field="tempat_lahir_ayah" />
                                        <EditableField label="Tanggal Lahir" field="tanggal_lahir_ayah" type="date" />
                                        <EditableField label="Pekerjaan" field="pekerjaan_ayah" />
                                        <EditableField label="Penghasilan" field="penghasilan_ayah" />
                                    </div>
                                </div>
                                <div><h4 className="font-semibold text-gray-700 mb-3">Data Ibu</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                        <EditableField label="Nama Ibu" field="nama_ibu" />
                                        <EditableField label="NIK Ibu" field="nik_ibu" />
                                        <EditableField label="Tempat Lahir" field="tempat_lahir_ibu" />
                                        <EditableField label="Tanggal Lahir" field="tanggal_lahir_ibu" type="date" />
                                        <EditableField label="Pekerjaan" field="pekerjaan_ibu" />
                                        <EditableField label="Penghasilan" field="penghasilan_ibu" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {tab === 'pendidikan' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <EditableField label="Asal Sekolah" field="asal_sekolah" />
                                <EditableField label="Lembaga Tujuan" field="lembaga" options={['SMP NU BP', 'MA ALHIKAM']} />
                                <EditableField label="Status Mukim" field="status_mukim" options={['PONDOK PP MAMBAUL HUDA', 'PONDOK SELAIN PP MAMBAUL HUDA', 'TIDAK PONDOK']} />
                                <EditableField label="PIP/PKH" field="pip_pkh" />
                                <EditableField label="Prestasi" field="prestasi" />
                                <EditableField label="Tingkat Prestasi" field="tingkat_prestasi" options={['KABUPATEN', 'PROVINSI', 'NASIONAL']} />
                                <EditableField label="Juara" field="juara" options={['1', '2', '3']} />
                                <EditableField label="Sumber Info" field="sumber_info" />
                            </div>
                        )}
                        {tab === 'berkas' && (
                            <div className="space-y-4">
                                {Object.entries(docs).map(([field, info]) => (
                                    <div key={field} className="flex items-center justify-between border rounded-lg p-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{info.label} {info.required && <span className="text-red-500">*</span>}</p>
                                            <p className={`text-xs ${info.uploaded ? 'text-green-600' : 'text-gray-400'}`}>{info.uploaded ? `✅ ${info.filename}` : '❌ Belum diupload'}</p>
                                        </div>
                                        {canEdit && (
                                            <label className="bg-orange-50 text-orange-600 hover:bg-orange-100 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition">
                                                📤 Upload
                                                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => { if (e.target.files[0]) uploadFile(field, e.target.files[0]); }} />
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {tab === 'keamanan' && (
                            <div className="max-w-md">
                                <h4 className="font-semibold text-gray-700 mb-3">Ubah Password</h4>
                                <form onSubmit={changePassword} className="space-y-4">
                                    <div><label className="block text-sm text-gray-600 mb-1">Password Lama</label>
                                        <input type="password" value={pwForm.old_password} onChange={e => setPwForm({ ...pwForm, old_password: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                                    <div><label className="block text-sm text-gray-600 mb-1">Password Baru</label>
                                        <input type="password" value={pwForm.new_password} onChange={e => setPwForm({ ...pwForm, new_password: e.target.value })} required minLength={6} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                                    <div><label className="block text-sm text-gray-600 mb-1">Konfirmasi Password</label>
                                        <input type="password" value={pwForm.new_password_confirmation} onChange={e => setPwForm({ ...pwForm, new_password_confirmation: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                                    <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm">Ubah Password</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
