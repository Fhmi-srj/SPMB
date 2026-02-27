import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const fmt = (n) => n > 0 ? 'Rp' + Number(n).toLocaleString('id-ID') : '-';

export default function Beranda() {
    const [settings, setSettings] = useState({});
    const [biaya, setBiaya] = useState([]);
    const [beasiswa, setBeasiswa] = useState({});
    const [kontak, setKontak] = useState([]);
    const [totals, setTotals] = useState({ pondok: 0, smp: 0, ma: 0 });
    const [modal, setModal] = useState(null);
    const statsRef = useRef(null);
    const [countersAnimated, setCountersAnimated] = useState(false);
    const [counters, setCounters] = useState({ jenjang: 0, juz: 0, tahun: 0, kurikulum: 0 });

    useEffect(() => {
        fetch('/api/pengaturan/public').then(r => r.json()).then(d => { if (d.success) setSettings(d.data); }).catch(() => { });
        fetch('/api/biaya').then(r => r.json()).then(d => {
            if (d.success) {
                const all = [...(d.data?.pendaftaran || []), ...(d.data?.daftar_ulang || [])];
                setBiaya(all);
                let t = { pondok: 0, smp: 0, ma: 0 };
                all.forEach(b => { t.pondok += Number(b.biaya_pondok || 0); t.smp += Number(b.biaya_smp || 0); t.ma += Number(b.biaya_ma || 0); });
                setTotals(t);
            }
        }).catch(() => { });
        fetch('/api/beasiswa').then(r => r.json()).then(d => {
            if (d.success) {
                const grouped = {};
                (d.data || []).forEach(b => { if (!grouped[b.jenis]) grouped[b.jenis] = []; grouped[b.jenis].push(b); });
                setBeasiswa(grouped);
            }
        }).catch(() => { });
        fetch('/api/kontak').then(r => r.json()).then(d => { if (d.success) setKontak(d.data || []); }).catch(() => { });
    }, []);

    // Stats counter animation
    useEffect(() => {
        if (!statsRef.current || countersAnimated) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setCountersAnimated(true);
                const targets = { jenjang: 3, juz: 30, tahun: 6, kurikulum: 100 };
                Object.keys(targets).forEach(key => {
                    const target = targets[key];
                    let start = 0;
                    const increment = target / 120;
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= target) { setCounters(c => ({ ...c, [key]: target })); clearInterval(timer); }
                        else { setCounters(c => ({ ...c, [key]: Math.floor(start) })); }
                    }, 16);
                });
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, [countersAnimated]);

    const pendaftaranBuka = settings.status_pendaftaran === '1';

    const biayaIcons = { Tahfidz: 'fa-quran', Akademik: 'fa-award', 'Yatim/Piatu': 'fa-hand-holding-heart' };

    return (
        <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "'Inter', sans-serif", scrollBehavior: 'smooth' }}>
            {/* Sticky Topbar */}
            <div className="sticky top-0 z-50 text-white shadow-md" style={{ background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)' }}>
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-base sm:text-lg font-bold">SPMB Terpadu</h1>
                                <p className="text-xs opacity-80 hidden sm:block">Yayasan Almukarromah Pajomblangan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link to="/portal" className="bg-white text-[#E67E22] text-xs sm:text-sm font-semibold py-2 px-3 sm:px-4 rounded-lg shadow flex items-center gap-2 hover:-translate-y-0.5 transition-all">
                                <i className="fas fa-sign-in-alt"></i><span>Masuk</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Hero Section */}
                <section className="relative mb-8">
                    <div className="bg-gradient-to-br from-orange-50 via-white to-yellow-50 rounded-3xl p-6 sm:p-10 border border-orange-100 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="text-center lg:text-left">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                                    Sekolah Sambil <span className="text-[#E67E22]">Mondok</span>? <br />
                                    <span className="text-[#E67E22]">Bisa!</span>
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
                                    Pendidikan formal dari MI hingga MA yang terpadu dengan asrama pesantren dalam satu komplek lingkungan bernuansa Islami.
                                </p>
                                {pendaftaranBuka ? (
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                        <Link to="/daftar" className="inline-flex items-center justify-center gap-2 bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold py-3 px-6 rounded-xl shadow-lg text-sm sm:text-base transition-all hover:-translate-y-0.5">
                                            <i className="fas fa-file-alt"></i> Daftar Sekarang
                                        </Link>
                                        <Link to="/cek-status" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 text-sm sm:text-base transition-all">
                                            <i className="fas fa-search"></i> Cek Status
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                        <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 font-semibold py-3 px-6 rounded-xl">
                                            <i className="fas fa-times-circle"></i> Pendaftaran Ditutup
                                        </div>
                                        <Link to="/cek-status" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 text-sm sm:text-base transition-all">
                                            <i className="fas fa-search"></i> Cek Status
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center lg:justify-end">
                                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                                    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-110 cursor-pointer">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden mb-2">
                                            <img src="/images/logo-ma.png" alt="MA Alhikam" className="w-full h-full object-contain" />
                                        </div>
                                        <p className="text-xs font-semibold text-gray-700">MA Alhikam</p>
                                    </div>
                                    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all ring-2 ring-[#E67E22]/20 hover:scale-110 cursor-pointer">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden mb-2">
                                            <img src="/images/logo-pondok.png" alt="Ponpes Mambaul Huda" className="w-full h-full object-contain" />
                                        </div>
                                        <p className="text-xs font-semibold text-gray-700">Ponpes</p>
                                    </div>
                                    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-110 cursor-pointer">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden mb-2">
                                            <img src="/images/logo-smp.png" alt="SMP NU BP" className="w-full h-full object-contain" />
                                        </div>
                                        <p className="text-xs font-semibold text-gray-700">SMP NU</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Counter Section */}
                <section ref={statsRef} className="mb-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { val: counters.jenjang, label: 'Jenjang Pendidikan', suffix: '' },
                            { val: counters.juz, label: 'Juz Target Hafalan', suffix: '' },
                            { val: counters.tahun, label: 'Tahun Program', suffix: '' },
                            { val: counters.kurikulum, label: 'Kurikulum Pesantren', suffix: '%' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                <div className="text-2xl sm:text-3xl font-bold text-[#E67E22] mb-1">{s.val}{s.suffix}</div>
                                <div className="text-xs text-gray-500">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Left: Informasi Pendaftaran */}
                    <section>
                        <h3 className="text-gray-800 font-semibold text-base mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-[#E67E22] rounded-full"></span>Informasi Pendaftaran
                        </h3>
                        <div className="space-y-3">
                            {[
                                { icon: 'fa-file-invoice-dollar', title: 'Biaya Pendaftaran', desc: 'Informasi biaya pendaftaran dengan detail dan rinci', modal: 'biaya' },
                                { icon: 'fa-file-invoice', title: 'Brosur Utama', desc: 'Informasi lengkap pendaftaran dalam satu brosur', modal: 'brosur' },
                                { icon: 'fa-file-alt', title: 'Syarat & Berkas', desc: 'Rincian syarat dan berkas wajib untuk pendaftaran', modal: 'syarat' },
                                { icon: 'fa-graduation-cap', title: 'Beasiswa', desc: 'Informasi beasiswa pendidikan secara lengkap', modal: 'beasiswa' },
                            ].map((item, i) => (
                                <button key={i} onClick={() => setModal(item.modal)} className="flex items-center gap-4 w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-[#E67E22] hover:shadow-md transition-all cursor-pointer">
                                    <div className="w-12 h-12 bg-[#E67E22]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <i className={`fas ${item.icon} text-xl text-[#E67E22]`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-[#E67E22] font-semibold text-sm">{item.title}</h5>
                                        <p className="text-gray-500 text-xs">{item.desc}</p>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Right: Program Unggulan */}
                    <section>
                        <h3 className="text-gray-800 font-semibold text-base mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-[#E67E22] rounded-full"></span>Program Unggulan
                        </h3>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <div className="space-y-4">
                                {[
                                    { icon: 'fa-quran', title: 'Program Tahfidz', desc: 'Target 30 Juz dalam 6 tahun dengan metode modern' },
                                    { icon: 'fa-book-open', title: 'Kurikulum Terpadu', desc: 'Perpaduan kurikulum nasional dan pesantren salaf' },
                                    { icon: 'fa-home', title: 'Asrama Terpadu', desc: 'Sekolah dan asrama dalam satu kompleks pesantren' },
                                    { icon: 'fa-award', title: 'Beasiswa Prestasi', desc: 'Tersedia beasiswa untuk siswa berprestasi' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                                        <div className="w-10 h-10 bg-[#E67E22] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <i className={`fas ${item.icon} text-white`}></i>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-800 text-sm">{item.title}</h5>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Lokasi Section */}
                <section className="mb-6">
                    <h3 className="text-gray-800 font-semibold text-sm mb-3 flex items-center gap-2">
                        <span className="w-6 h-0.5 bg-[#E67E22] rounded-full"></span>Lokasi Kami
                    </h3>
                    <p className="text-gray-500 text-xs mb-3">PP Mambaul Huda Pajomblangan, Kedungwuni, Pekalongan</p>
                    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                        <iframe allowFullScreen className="w-full h-full" loading="lazy"
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d506919.5207899324!2d109.666159!3d-6.972853!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7022290d0c3a51%3A0x3fe69d4f394b9c58!2sPP%20Mamba'ul%20Huda%20Pajomblangan!5e0!3m2!1sen!2sid!4v1745034814265!5m2!1sen!2sid"
                            style={{ border: 0 }}></iframe>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">SPMB Terpadu</h3>
                                    <p className="text-sm text-gray-500">Yayasan Almukarromah Pajomblangan</p>
                                </div>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Hubungi Kami</h4>
                            <div className="flex flex-wrap gap-2">
                                {kontak.map(k => (
                                    <a key={k.id} href={k.link_wa || `https://wa.me/${(k.no_whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#E67E22] hover:bg-[#D35400] text-white text-xs font-medium py-2 px-3 rounded-lg transition-all">
                                        <i className="fab fa-whatsapp"></i>
                                        <span className="hidden sm:inline">{k.lembaga}</span>
                                        <span className="font-semibold">{k.nama}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="md:text-right">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">YAYASAN AL MUKARROMAH</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Jl. Pajomblangan Timur, Ds. Pajomblangan, Kec.<br />Kedungwuni, Kab. Pekalongan, Jawa Tengah
                            </p>
                            <div className="flex gap-2 md:justify-end">
                                {[
                                    { icon: 'fa-facebook-f', url: 'https://www.facebook.com/share/14Vs1VguYb1/' },
                                    { icon: 'fa-instagram', url: 'https://www.instagram.com/ppmambaulhuda/' },
                                    { icon: 'fa-tiktok', url: 'https://www.tiktok.com/@ppmambaulhuda' },
                                    { icon: 'fa-youtube', url: 'https://youtube.com/@ppmambaulhuda' },
                                ].map((s, i) => (
                                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                                        className="w-8 h-8 bg-[#E67E22] hover:bg-[#D35400] text-white rounded-lg flex items-center justify-center transition-all hover:-translate-y-1">
                                        <i className={`fab ${s.icon} text-sm`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#E67E22] text-white py-3">
                    <div className="max-w-6xl mx-auto px-4 text-center">
                        <p className="text-xs">© Copyright {new Date().getFullYear()} Yayasan Al Mukarromah</p>
                    </div>
                </div>
            </footer>

            {/* Modal Biaya */}
            {modal === 'biaya' && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="bg-white rounded-2xl max-w-[650px] w-full max-h-[90vh] overflow-hidden flex flex-col animate-[modalIn_0.3s_ease]">
                        <div className="flex items-center justify-between px-6 py-5 text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)' }}>
                            <div className="flex items-center gap-3">
                                <i className="fas fa-file-invoice-dollar text-xl"></i>
                                <div><h4 className="font-bold text-lg">Biaya Pendaftaran</h4><p className="text-xs opacity-80">PPDB {settings.tahun_ajaran || '2026/2027'}</p></div>
                            </div>
                            <button onClick={() => setModal(null)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr className="bg-[#E67E22] text-white font-semibold">
                                        <th className="p-2.5 text-left">No</th>
                                        <th className="p-2.5 text-left">Pembayaran</th>
                                        <th className="p-2.5">Pondok</th>
                                        <th className="p-2.5">SMP</th>
                                        <th className="p-2.5">MA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        let currentKat = '', no = 0;
                                        return biaya.map((b, i) => {
                                            const rows = [];
                                            if (currentKat !== b.kategori) {
                                                currentKat = b.kategori;
                                                rows.push(<tr key={`h-${i}`} className="bg-teal-50 font-semibold text-[#E67E22]"><td colSpan={5} className="p-2">{b.kategori === 'PENDAFTARAN' ? 'A. PENDAFTARAN' : 'B. DAFTAR ULANG'}</td></tr>);
                                            }
                                            no++;
                                            rows.push(
                                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                                                    <td className="p-2 border-b border-gray-200">{no}</td>
                                                    <td className="p-2 border-b border-gray-200">{b.nama_item}</td>
                                                    <td className="p-2 border-b border-gray-200 text-center">{fmt(b.biaya_pondok)}</td>
                                                    <td className="p-2 border-b border-gray-200 text-center">{fmt(b.biaya_smp)}</td>
                                                    <td className="p-2 border-b border-gray-200 text-center">{fmt(b.biaya_ma)}</td>
                                                </tr>
                                            );
                                            return rows;
                                        }).flat();
                                    })()}
                                    <tr className="bg-[#E67E22] text-white font-bold">
                                        <td colSpan={2} className="p-2.5">TOTAL</td>
                                        <td className="p-2.5 text-center">{fmt(totals.pondok)}</td>
                                        <td className="p-2.5 text-center">{fmt(totals.smp)}</td>
                                        <td className="p-2.5 text-center">{fmt(totals.ma)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="mt-4 bg-amber-50 border border-yellow-300 rounded-lg p-3 text-xs text-amber-800">
                                <p className="font-semibold mb-2"><i className="fas fa-info-circle mr-1"></i> Keterangan:</p>
                                <ul className="list-disc pl-5 space-y-1"><li>Infaq Bulanan Pondok Rp600.000/Bulan (Makan 3x, Asrama, Madrasah Diniyah, Laundry)</li></ul>
                                <p className="font-bold mt-3">Biaya Pondok + SMP: {fmt(totals.pondok + totals.smp)}</p>
                                <p className="font-bold">Biaya Pondok + MA: {fmt(totals.pondok + totals.ma)}</p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                            {settings.link_pdf_biaya && <a href={settings.link_pdf_biaya} target="_blank" rel="noopener noreferrer" className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition"><i className="fas fa-download"></i><span>Download PDF</span></a>}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Brosur */}
            {modal === 'brosur' && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="bg-white rounded-2xl max-w-[650px] w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-5 text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)' }}>
                            <div className="flex items-center gap-3"><i className="fas fa-file-invoice text-xl"></i><div><h4 className="font-bold text-lg">Brosur Utama</h4><p className="text-xs opacity-80">Informasi Lengkap PPDB</p></div></div>
                            <button onClick={() => setModal(null)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                                <div className="font-semibold text-[#E67E22] text-sm mb-2 flex items-center gap-2"><i className="fas fa-book-open"></i> Tentang Kami</div>
                                <p className="text-xs text-gray-600">Lembaga pendidikan yang memadukan Pondok Pesantren dengan Formal dari SMP sampai SMA dalam satu komplek.</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                                <div className="font-semibold text-[#E67E22] text-sm mb-2 flex items-center gap-2"><i className="fas fa-star"></i> Program Unggulan</div>
                                <p className="text-xs text-gray-600">Tahfidz Qur'an & Qiroatul Kutub. Target 6 tahun khatam 30 Juz / menguasai kitab kuning.</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                                <div className="font-semibold text-[#E67E22] text-sm mb-2 flex items-center gap-2"><i className="fas fa-calendar-alt"></i> Waktu Pendaftaran</div>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <div className="bg-[#E67E22]/10 rounded-lg p-3 text-center"><p className="text-xs font-semibold text-[#E67E22]">Gelombang 1</p><p className="text-xs text-gray-600">{settings.gelombang_1_start ? new Date(settings.gelombang_1_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' - ' + new Date(settings.gelombang_1_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Segera'}</p></div>
                                    <div className="bg-[#E67E22]/10 rounded-lg p-3 text-center"><p className="text-xs font-semibold text-[#E67E22]">Gelombang 2</p><p className="text-xs text-gray-600">{settings.gelombang_2_start ? new Date(settings.gelombang_2_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' - ' + new Date(settings.gelombang_2_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Segera'}</p></div>
                                </div>
                            </div>
                            <div className="bg-amber-50 border border-yellow-300 rounded-lg p-3 text-xs mt-3"><p className="font-semibold text-green-700"><i className="fas fa-gift mr-1"></i> GRATIS SERAGAM BATIK UNTUK GELOMBANG 1</p></div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                            {settings.link_pdf_brosur && <a href={settings.link_pdf_brosur} target="_blank" rel="noopener noreferrer" className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition"><i className="fas fa-download"></i><span>Download Brosur PDF</span></a>}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Syarat */}
            {modal === 'syarat' && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="bg-white rounded-2xl max-w-[650px] w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-5 text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)' }}>
                            <div className="flex items-center gap-3"><i className="fas fa-file-alt text-xl"></i><div><h4 className="font-bold text-lg">Syarat & Berkas</h4><p className="text-xs opacity-80">Berkas Pendaftaran</p></div></div>
                            <button onClick={() => setModal(null)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                                <div className="font-semibold text-[#E67E22] text-sm mb-2 flex items-center gap-2"><i className="fas fa-folder-open"></i> Berkas Wajib</div>
                                <ul className="space-y-0">
                                    {['FC Akta Kelahiran', 'FC Kartu Keluarga', 'FC KTP Orang Tua', 'FC Ijazah / SKHUN', 'Foto 3x4 Background Merah (4 Lembar)', 'Nomor NISN'].map((item, i) => (
                                        <li key={i} className="py-2 border-b border-gray-200 text-[13px] text-gray-700 flex items-start gap-2 last:border-0">
                                            <i className="fas fa-check-circle text-[#E67E22] mt-0.5 flex-shrink-0"></i>{item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-amber-50 border border-yellow-300 rounded-lg p-3 text-xs text-amber-800">
                                <p className="font-semibold mb-2"><i className="fas fa-exclamation-triangle mr-1"></i> Penting:</p>
                                <p>Berkas masuk ke <strong>STOPMAP</strong>: Hijau (SMP), Merah (MA)</p>
                            </div>
                            {kontak.filter(k => k.lembaga === 'MA').length > 0 && (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-3">
                                    <div className="font-semibold text-[#E67E22] text-sm mb-2 flex items-center gap-2"><i className="fas fa-phone-alt"></i> Hubungi Kami</div>
                                    {kontak.filter(k => k.lembaga === 'MA').map(k => (
                                        <div key={k.id}>
                                            <p className="text-xs text-gray-600 mb-3"><strong>{k.no_whatsapp}</strong> ({k.nama})</p>
                                            <a href={k.link_wa || `https://wa.me/${(k.no_whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 px-4 rounded-lg"><i className="fab fa-whatsapp"></i> Hubungi via WhatsApp</a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                            {settings.link_pdf_syarat && <a href={settings.link_pdf_syarat} target="_blank" rel="noopener noreferrer" className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition"><i className="fas fa-download"></i><span>Download PDF</span></a>}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Beasiswa */}
            {modal === 'beasiswa' && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="bg-white rounded-2xl max-w-[650px] w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-5 text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)' }}>
                            <div className="flex items-center gap-3"><i className="fas fa-graduation-cap text-xl"></i><div><h4 className="font-bold text-lg">Beasiswa MA Alhikam</h4><p className="text-xs opacity-80">Program Beasiswa</p></div></div>
                            <button onClick={() => setModal(null)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            {Object.entries(beasiswa).map(([jenis, items]) => (
                                <div key={jenis} className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-emerald-200 rounded-xl p-4 mb-3">
                                    <div className="font-bold text-[#E67E22] text-sm mb-1"><i className={`fas ${biayaIcons[jenis] || 'fa-star'} mr-2`}></i> Beasiswa {jenis}</div>
                                    <div className="text-xs text-teal-700 font-medium mb-2">{items[0]?.kategori || ''}</div>
                                    <div className="space-y-2 text-xs">
                                        {items.map((item, i) => (
                                            <div key={i} className="flex justify-between bg-white/60 rounded-lg p-2">
                                                <span>{item.syarat}</span>
                                                <span className="font-bold text-[#E67E22]">{item.benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="bg-amber-50 border border-yellow-300 rounded-lg p-3 text-xs text-amber-800 mt-3">
                                <p className="font-semibold"><i className="fas fa-info-circle mr-1"></i> Beasiswa tidak dapat digabungkan. Pilih satu jenis beasiswa saja.</p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                            {settings.link_beasiswa && <a href={settings.link_beasiswa} target="_blank" rel="noopener noreferrer" className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition"><i className="fas fa-external-link-alt"></i><span>Info Beasiswa Lengkap</span></a>}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            `}</style>
        </div>
    );
}
