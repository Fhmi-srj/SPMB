import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const inputCls = "w-full py-3 px-4 border border-gray-200 rounded-xl text-sm outline-none transition-all uppercase focus:border-[#E67E22] focus:shadow-[0_0_0_3px_rgba(230,126,34,0.1)]";
const selectCls = inputCls + " bg-white";

export default function FormPendaftaran() {
    const nav = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({});
    const [files, setFiles] = useState({});
    const [showPw, setShowPw] = useState({ pw: false, confirm: false });

    // Region data
    const [provinsi, setProvinsi] = useState([]);
    const [kota, setKota] = useState([]);
    const [kecamatan, setKecamatan] = useState([]);
    const [kelurahan, setKelurahan] = useState([]);

    const [settings, setSettings] = useState({});

    useEffect(() => {
        fetch('/api/pengaturan/public').then(r => r.json()).then(d => { if (d.success) setSettings(d.data); }).catch(() => { });
        // Load draft
        const draft = localStorage.getItem('pendaftaran_draft');
        if (draft) {
            try { setForm(JSON.parse(draft)); } catch { }
        }
        // Load provinsi
        fetch('/api/wilayah?type=provinsi').then(r => r.json()).then(d => setProvinsi(d || [])).catch(() => { });
    }, []);

    // Save draft
    useEffect(() => {
        if (Object.keys(form).length > 0) localStorage.setItem('pendaftaran_draft', JSON.stringify(form));
    }, [form]);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const setFile = (k, f) => setFiles(p => ({ ...p, [k]: f }));

    const loadKota = async (provName) => {
        const prov = provinsi.find(p => p.name === provName);
        if (!prov) return;
        try { const res = await fetch(`/api/wilayah?type=kota&id=${prov.id}`); setKota(await res.json() || []); } catch { }
        setKecamatan([]); setKelurahan([]);
    };

    const loadKecamatan = async (kotaName) => {
        const k = kota.find(x => x.name === kotaName);
        if (!k) return;
        try { const res = await fetch(`/api/wilayah?type=kecamatan&id=${k.id}`); setKecamatan(await res.json() || []); } catch { }
        setKelurahan([]);
    };

    const loadKelurahan = async (kecName) => {
        const k = kecamatan.find(x => x.name === kecName);
        if (!k) return;
        try { const res = await fetch(`/api/wilayah?type=kelurahan&id=${k.id}`); setKelurahan(await res.json() || []); } catch { }
    };

    const pendaftaranBuka = settings.status_pendaftaran === '1';
    const tahunAjaran = settings.tahun_ajaran || '2026/2027';

    const validate = (s) => {
        const errors = [];
        if (s === 1) {
            if (!form.nama?.trim()) errors.push('Nama Lengkap harus diisi');
            if (!form.lembaga) errors.push('Lembaga yang Dituju harus diisi');
            if (!form.jenis_kelamin) errors.push('Jenis Kelamin harus diisi');
            if (!form.status_mukim) errors.push('Status Mukim harus diisi');
            if (!form.provinsi) errors.push('Provinsi harus diisi');
            if (!form.kota_kab) errors.push('Kota/Kabupaten harus diisi');
            if (!form.kecamatan) errors.push('Kecamatan harus diisi');
            if (!form.kelurahan_desa) errors.push('Kelurahan/Desa harus diisi');
        }
        if (s === 2) {
            if (!form.no_hp_wali?.trim()) errors.push('No. HP WhatsApp Wali harus diisi');
            else if (form.no_hp_wali.length < 9) errors.push('No. HP minimal 9 digit');
            if (!form.password?.trim()) errors.push('Password harus diisi');
            else if (form.password.length < 6) errors.push('Password minimal 6 karakter');
            if (form.password !== form.password_confirm) errors.push('Konfirmasi Password tidak cocok');
        }
        return errors;
    };

    const nextStep = (from) => {
        const errs = validate(from);
        if (errs.length > 0) {
            Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', html: '<ul class="text-left text-sm space-y-1">' + errs.map(e => `<li>• ${e}</li>`).join('') + '</ul>' });
            return;
        }
        setStep(from + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = (from) => { setStep(from - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
            Object.entries(files).forEach(([k, v]) => { if (v) fd.append(k, v); });

            const res = await fetch('/api/pendaftaran', { method: 'POST', body: fd });
            const data = await res.json();

            if (data.success) {
                localStorage.removeItem('pendaftaran_draft');
                Swal.fire({
                    icon: 'success', title: 'Pendaftaran Berhasil!',
                    html: `<div class="text-left">
                        <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <p class="text-sm"><i class="fas fa-user text-green-600 mr-2"></i><strong>${form.nama}</strong> telah terdaftar</p>
                            <p class="text-sm mt-1"><i class="fas fa-ticket-alt text-green-600 mr-2"></i>No. Registrasi: <strong class="text-green-700">${data.data?.no_registrasi || '-'}</strong></p>
                        </div>
                        <div class="bg-orange-50 rounded-lg p-3">
                            <p class="text-xs text-gray-600"><i class="fas fa-info-circle text-orange-500 mr-1"></i>Login dengan No. HP <strong class="text-orange-600">${form.no_hp_wali}</strong> dan password Anda.</p>
                        </div>
                    </div>`,
                    confirmButtonColor: '#E67E22', confirmButtonText: 'Kembali ke Beranda'
                }).then(() => nav('/'));
            } else {
                Swal.fire('Error', data.message || 'Gagal mengirim pendaftaran', 'error');
            }
        } catch { Swal.fire('Error', 'Terjadi kesalahan jaringan', 'error'); }
        finally { setLoading(false); }
    };

    const progressPct = step === 1 ? 0 : step === 2 ? 50 : 100;

    if (!pendaftaranBuka && settings.status_pendaftaran !== undefined) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-lg">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><i className="fas fa-times-circle text-red-500 text-4xl"></i></div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Pendaftaran Ditutup</h2>
                    <p className="text-gray-500 text-sm mb-6">Maaf, pendaftaran saat ini sedang ditutup.</p>
                    <Link to="/" className="block w-full bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold py-3 rounded-xl transition">Kembali ke Beranda</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Sticky Topbar */}
            <header className="sticky top-0 z-50 text-white shadow-md" style={{ background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)' }}>
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div><h1 className="font-bold text-lg">PPDB {tahunAjaran}</h1><p className="text-sm text-white/70 hidden sm:block">PP Mambaul Huda Pajomblangan</p></div>
                    <Link to="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition flex items-center gap-2"><i className="fas fa-home"></i><span className="hidden sm:inline">Home</span></Link>
                </div>
                <div className="border-t border-white/10">
                    <div className="max-w-4xl mx-auto px-4 py-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                                <div className="hidden sm:flex items-center gap-1 text-xs text-white/70"><span>{progressPct}%</span></div>
                                <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden"><div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div></div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3].map(s => (
                                    <React.Fragment key={s}>
                                        {s > 1 && <div className="w-4 h-0.5 bg-white/30"></div>}
                                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${step === s ? 'bg-white text-[#E67E22]' : step > s ? 'bg-green-400 text-white' : 'bg-white/30 text-white/70'}`}>{s}</span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6">
                <form onSubmit={handleSubmit}>
                    {/* Step 1: Data Calon Siswa */}
                    {step === 1 && (
                        <div>
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-1">Data Calon Siswa</h2>
                                <p className="text-sm text-gray-500 mb-6">Lengkapi data diri calon siswa dengan benar</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                                        <input type="text" value={form.nama || ''} onChange={e => set('nama', e.target.value)} className={inputCls} placeholder="Masukkan nama lengkap" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Lembaga yang Dituju <span className="text-red-500">*</span></label>
                                        <select value={form.lembaga || ''} onChange={e => set('lembaga', e.target.value)} className={selectCls}>
                                            <option value="">Pilih Lembaga</option><option value="SMP NU BP">SMP NU BP</option><option value="MA ALHIKAM">MA ALHIKAM</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">NISN</label>
                                        <input type="text" value={form.nisn || ''} onChange={e => set('nisn', e.target.value)} className={inputCls} placeholder="Nomor Induk Siswa Nasional" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir</label>
                                        <input type="text" value={form.tempat_lahir || ''} onChange={e => set('tempat_lahir', e.target.value)} className={inputCls} placeholder="Kota kelahiran" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                                        <input type="date" value={form.tanggal_lahir || ''} onChange={e => set('tanggal_lahir', e.target.value)} className={inputCls} style={{ textTransform: 'none' }} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin <span className="text-red-500">*</span></label>
                                        <select value={form.jenis_kelamin || ''} onChange={e => set('jenis_kelamin', e.target.value)} className={selectCls}>
                                            <option value="">Pilih</option><option value="L">Laki-laki</option><option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Saudara</label>
                                        <input type="number" value={form.jumlah_saudara || '0'} onChange={e => set('jumlah_saudara', e.target.value)} className={inputCls} min="0" style={{ textTransform: 'none' }} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">No. Kartu Keluarga</label>
                                        <input type="text" value={form.no_kk || ''} onChange={e => set('no_kk', e.target.value)} className={inputCls} placeholder="16 digit nomor KK" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">NIK</label>
                                        <input type="text" value={form.nik || ''} onChange={e => set('nik', e.target.value)} className={inputCls} placeholder="16 digit NIK" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Provinsi <span className="text-red-500">*</span></label>
                                        <select value={form.provinsi || ''} onChange={e => { set('provinsi', e.target.value); set('kota_kab', ''); set('kecamatan', ''); set('kelurahan_desa', ''); setKota([]); setKecamatan([]); setKelurahan([]); if (e.target.value) loadKota(e.target.value); }} className={selectCls}>
                                            <option value="">-- Pilih Provinsi --</option>
                                            {provinsi.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ opacity: form.provinsi ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Kota/Kabupaten <span className="text-red-500">*</span></label>
                                        <select value={form.kota_kab || ''} onChange={e => { set('kota_kab', e.target.value); set('kecamatan', ''); set('kelurahan_desa', ''); setKecamatan([]); setKelurahan([]); if (e.target.value) loadKecamatan(e.target.value); }} className={selectCls} disabled={!form.provinsi}>
                                            <option value="">{form.provinsi ? '-- Pilih Kota/Kabupaten --' : '⬆ Pilih Provinsi terlebih dahulu'}</option>
                                            {kota.map(k => <option key={k.id} value={k.name}>{k.name}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ opacity: form.kota_kab ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan <span className="text-red-500">*</span></label>
                                        <select value={form.kecamatan || ''} onChange={e => { set('kecamatan', e.target.value); set('kelurahan_desa', ''); setKelurahan([]); if (e.target.value) loadKelurahan(e.target.value); }} className={selectCls} disabled={!form.kota_kab}>
                                            <option value="">{form.kota_kab ? '-- Pilih Kecamatan --' : '⬆ Pilih Kota/Kabupaten terlebih dahulu'}</option>
                                            {kecamatan.map(k => <option key={k.id} value={k.name}>{k.name}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ opacity: form.kecamatan ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Kelurahan/Desa <span className="text-red-500">*</span></label>
                                        <select value={form.kelurahan_desa || ''} onChange={e => set('kelurahan_desa', e.target.value)} className={selectCls} disabled={!form.kecamatan}>
                                            <option value="">{form.kecamatan ? '-- Pilih Kelurahan/Desa --' : '⬆ Pilih Kecamatan terlebih dahulu'}</option>
                                            {kelurahan.map(k => <option key={k.id} value={k.name}>{k.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Detail Alamat</label>
                                        <textarea value={form.alamat || ''} onChange={e => set('alamat', e.target.value)} className={inputCls} rows={2} placeholder="RT/RW, Nama Jalan, Nomor Rumah, dll" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Asal Sekolah</label>
                                        <input type="text" value={form.asal_sekolah || ''} onChange={e => set('asal_sekolah', e.target.value)} className={inputCls} placeholder="Nama sekolah sebelumnya" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status Mukim <span className="text-red-500">*</span></label>
                                        <select value={form.status_mukim || ''} onChange={e => set('status_mukim', e.target.value)} className={selectCls}>
                                            <option value="">Pilih Status</option>
                                            <option value="PONDOK PP MAMBAUL HUDA">Pondok PP Mambaul Huda</option>
                                            <option value="PONDOK SELAIN PP MAMBAUL HUDA">Pondok Selain PP Mambaul Huda</option>
                                            <option value="TIDAK PONDOK">Tidak Pondok</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Prestasi */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                                <h3 className="text-md font-bold text-gray-800 mb-1">Prestasi (Opsional)</h3>
                                <p className="text-sm text-gray-500 mb-4">Jika memiliki prestasi akademik/non-akademik</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Prestasi</label>
                                        <input type="text" value={form.prestasi || ''} onChange={e => set('prestasi', e.target.value)} className={inputCls} placeholder="Contoh: Lomba MTQ, Olimpiade Matematika" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat</label>
                                        <select value={form.tingkat_prestasi || ''} onChange={e => set('tingkat_prestasi', e.target.value)} className={selectCls}>
                                            <option value="">Pilih Tingkat</option><option value="KABUPATEN">Kabupaten</option><option value="PROVINSI">Provinsi</option><option value="NASIONAL">Nasional</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Juara</label>
                                        <select value={form.juara || ''} onChange={e => set('juara', e.target.value)} className={selectCls}>
                                            <option value="">Pilih Juara</option><option value="1">Juara 1</option><option value="2">Juara 2</option><option value="3">Juara 3</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Sertifikat</label>
                                        <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${files.file_sertifikat ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-[#E67E22] hover:bg-orange-50/20'}`}
                                            onClick={() => document.getElementById('file_sertifikat').click()}>
                                            <i className={`fas ${files.file_sertifikat ? 'fa-check-circle text-green-500' : 'fa-cloud-upload-alt text-gray-400'} text-3xl mb-2`}></i>
                                            <p className="text-sm text-gray-500">{files.file_sertifikat?.name || 'Klik untuk upload sertifikat (JPG, PNG, PDF, max 5MB)'}</p>
                                            <input type="file" id="file_sertifikat" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={e => setFile('file_sertifikat', e.target.files[0])} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tambahan */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                                <h3 className="text-md font-bold text-gray-800 mb-4">Informasi Tambahan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">No. PIP/PKH</label><input type="text" value={form.pip_pkh || ''} onChange={e => set('pip_pkh', e.target.value)} className={inputCls} placeholder="Jika memiliki" /></div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sumber Informasi</label>
                                        <select value={form.sumber_info || ''} onChange={e => set('sumber_info', e.target.value)} className={selectCls}>
                                            <option value="">Pilih</option><option value="ALUMNI">Alumni</option><option value="KELUARGA">Keluarga</option><option value="TEMAN">Teman</option><option value="SOSIAL MEDIA">Sosial Media</option><option value="BROSUR">Brosur</option><option value="LAINNYA">Lainnya</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button type="button" onClick={() => nextStep(1)} className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold py-3 rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg">
                                Lanjutkan <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    )}

                    {/* Step 2: Data Wali */}
                    {step === 2 && (
                        <div>
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-1">Data Ayah</h2>
                                <p className="text-sm text-gray-500 mb-6">Lengkapi data ayah/wali</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Nama Ayah</label><input type="text" value={form.nama_ayah || ''} onChange={e => set('nama_ayah', e.target.value)} className={inputCls} placeholder="Nama lengkap ayah" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir</label><input type="text" value={form.tempat_lahir_ayah || ''} onChange={e => set('tempat_lahir_ayah', e.target.value)} className={inputCls} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label><input type="date" value={form.tanggal_lahir_ayah || ''} onChange={e => set('tanggal_lahir_ayah', e.target.value)} className={inputCls} style={{ textTransform: 'none' }} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">NIK Ayah</label><input type="text" value={form.nik_ayah || ''} onChange={e => set('nik_ayah', e.target.value)} className={inputCls} placeholder="16 digit NIK" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Pekerjaan</label><input type="text" value={form.pekerjaan_ayah || ''} onChange={e => set('pekerjaan_ayah', e.target.value)} className={inputCls} /></div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Penghasilan</label>
                                        <select value={form.penghasilan_ayah || ''} onChange={e => set('penghasilan_ayah', e.target.value)} className={selectCls}>
                                            <option value="">Pilih Range</option><option value="< 1 Juta">{'< 1 Juta'}</option><option value="1-3 Juta">1-3 Juta</option><option value="3-5 Juta">3-5 Juta</option><option value="> 5 Juta">{'> 5 Juta'}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-1">Data Ibu</h2>
                                <p className="text-sm text-gray-500 mb-6">Lengkapi data ibu</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Nama Ibu</label><input type="text" value={form.nama_ibu || ''} onChange={e => set('nama_ibu', e.target.value)} className={inputCls} placeholder="Nama lengkap ibu" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir</label><input type="text" value={form.tempat_lahir_ibu || ''} onChange={e => set('tempat_lahir_ibu', e.target.value)} className={inputCls} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label><input type="date" value={form.tanggal_lahir_ibu || ''} onChange={e => set('tanggal_lahir_ibu', e.target.value)} className={inputCls} style={{ textTransform: 'none' }} /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">NIK Ibu</label><input type="text" value={form.nik_ibu || ''} onChange={e => set('nik_ibu', e.target.value)} className={inputCls} placeholder="16 digit NIK" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Pekerjaan</label><input type="text" value={form.pekerjaan_ibu || ''} onChange={e => set('pekerjaan_ibu', e.target.value)} className={inputCls} /></div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Penghasilan</label>
                                        <select value={form.penghasilan_ibu || ''} onChange={e => set('penghasilan_ibu', e.target.value)} className={selectCls}>
                                            <option value="">Pilih Range</option><option value="< 1 Juta">{'< 1 Juta'}</option><option value="1-3 Juta">1-3 Juta</option><option value="3-5 Juta">3-5 Juta</option><option value="> 5 Juta">{'> 5 Juta'}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Dokumen */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                                <h3 className="text-md font-bold text-gray-800 mb-1">Upload Dokumen</h3>
                                <p className="text-sm text-gray-500 mb-4">Upload dokumen dalam format PDF atau Gambar (JPG, PNG, max 2MB)</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[['file_kk', 'Kartu Keluarga (KK)'], ['file_ktp_ortu', 'KTP Orang Tua'], ['file_akta', 'Akta Kelahiran'], ['file_ijazah', 'Ijazah (Opsional)']].map(([key, label]) => (
                                        <div key={key}><label className="block text-sm font-medium text-gray-700 mb-2">{label}</label><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(key, e.target.files[0])} className={inputCls + " text-sm"} style={{ textTransform: 'none' }} /></div>
                                    ))}
                                </div>
                            </div>

                            {/* Kontak Wali */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                                <h3 className="text-md font-bold text-gray-800 mb-4">Kontak Wali</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">No. HP WhatsApp Wali <span className="text-red-500">*</span></label>
                                    <div className="flex">
                                        <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 rounded-l-xl text-gray-600 text-sm font-medium">+62</span>
                                        <input type="tel" value={form.no_hp_wali || ''} onChange={e => set('no_hp_wali', e.target.value.replace(/\D/g, ''))} className={inputCls + " rounded-l-none flex-1"} placeholder="8xxxxxxxxxx" style={{ textTransform: 'none' }} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Contoh: 812345678 (tanpa 0 di depan). Nomor ini akan menjadi username untuk login.</p>
                                </div>
                            </div>

                            {/* Buat Akun */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border-2 border-[#E67E22]/20">
                                <h3 className="text-md font-bold text-gray-800 mb-1"><i className="fas fa-user-lock text-[#E67E22] mr-2"></i>Buat Akun</h3>
                                <p className="text-sm text-gray-500 mb-4">Buat password untuk mengakses portal pendaftar</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input type={showPw.pw ? 'text' : 'password'} value={form.password || ''} onChange={e => set('password', e.target.value)} className={inputCls + " pr-10"} placeholder="Minimal 6 karakter" style={{ textTransform: 'none' }} />
                                            <button type="button" onClick={() => setShowPw(p => ({ ...p, pw: !p.pw }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><i className={`fas ${showPw.pw ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input type={showPw.confirm ? 'text' : 'password'} value={form.password_confirm || ''} onChange={e => set('password_confirm', e.target.value)} className={inputCls + " pr-10"} placeholder="Ulangi password" style={{ textTransform: 'none' }} />
                                            <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><i className={`fas ${showPw.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3"><i className="fas fa-info-circle mr-1"></i>Setelah mendaftar, Anda dapat login menggunakan No. HP dan password ini untuk melihat/mengedit data pendaftaran.</p>
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => prevStep(2)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition"><i className="fas fa-arrow-left mr-2"></i> Kembali</button>
                                <button type="button" onClick={() => nextStep(2)} className="flex-1 bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold py-3 rounded-xl transition">Lanjutkan <i className="fas fa-arrow-right ml-2"></i></button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Konfirmasi */}
                    {step === 3 && (
                        <div>
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-1">Konfirmasi Data</h2>
                                <p className="text-sm text-gray-500 mb-6">Periksa kembali data sebelum mengirim</p>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    {[
                                        ['Nama', form.nama], ['Lembaga', form.lembaga], ['Jenis Kelamin', form.jenis_kelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'],
                                        ['Alamat', [form.kelurahan_desa, form.kecamatan, form.kota_kab, form.provinsi].filter(Boolean).join(', ') || '-'],
                                        ['Status Mukim', form.status_mukim], ['Nama Ayah', form.nama_ayah], ['Nama Ibu', form.nama_ibu], ['No. HP Wali', form.no_hp_wali],
                                    ].map(([label, val], i) => (
                                        <div key={i} className={`flex justify-between p-3 ${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                            <span className="text-sm text-gray-500">{label}</span>
                                            <span className="text-sm font-medium text-gray-800">{(val || '-').toString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
                                    <div><p className="text-sm font-semibold text-yellow-800">Perhatian!</p><p className="text-xs text-yellow-700">Pastikan semua data sudah benar. Data yang sudah dikirim tidak dapat diubah.</p></div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => prevStep(3)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition"><i className="fas fa-arrow-left mr-2"></i> Kembali</button>
                                <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                                    {loading ? <><i className="fas fa-spinner animate-spin mr-2"></i>Mengirim...</> : <><i className="fas fa-paper-plane mr-2"></i>Kirim Pendaftaran</>}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
