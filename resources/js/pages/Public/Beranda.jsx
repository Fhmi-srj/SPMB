import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const fmt = (n) => n > 0 ? 'Rp' + Number(n).toLocaleString('id-ID') : '-';

// Color constants
const C = {
    primary: '#1B7A3D',
    primaryDark: '#145C2E',
    primaryLight: '#27AE60',
    gradient: 'linear-gradient(135deg, #1B7A3D 0%, #27AE60 100%)',
    gradientDark: 'linear-gradient(135deg, #145C2E 0%, #1B7A3D 100%)',
    gold: '#D4A843',
};

export default function Beranda() {
    const [settings, setSettings] = useState({});
    const [biaya, setBiaya] = useState([]);

    const [kontak, setKontak] = useState([]);
    const [totals, setTotals] = useState(0);
    const [modal, setModal] = useState(null);
    const statsRef = useRef(null);
    const [countersAnimated, setCountersAnimated] = useState(false);
    const [counters, setCounters] = useState({ jenjang: 0, juz: 0, tahun: 0, kurikulum: 0 });
    const [scrolled, setScrolled] = useState(false);
    const [heroVisible, setHeroVisible] = useState(false);

    useEffect(() => {
        fetch('/api/pengaturan/public').then(r => r.json()).then(d => { if (d.success) setSettings(d.data); }).catch(() => { });
        fetch('/api/biaya').then(r => r.json()).then(d => {
            if (d.success) {
                const all = [...(d.data?.pendaftaran || []), ...(d.data?.daftar_ulang || [])];
                setBiaya(all);
                let t = 0;
                all.forEach(b => { t += Number(b.biaya || 0); });
                setTotals(t);
            }
        }).catch(() => { });

        fetch('/api/kontak').then(r => r.json()).then(d => { if (d.success) setKontak(d.data || []); }).catch(() => { });

        // Scroll listener for navbar
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);

        // Hero entrance animation
        setTimeout(() => setHeroVisible(true), 100);

        return () => window.removeEventListener('scroll', handleScroll);
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

    const pendaftaranBuka = settings.status_pendaftaran ? settings.status_pendaftaran === '1' : true;

    const biayaIcons = { Tahfidz: 'fa-quran', Akademik: 'fa-award', 'Yatim/Piatu': 'fa-hand-holding-heart' };

    return (
        <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", scrollBehavior: 'smooth', background: '#FAFFFE' }}>

            {/* ── NAVBAR ── */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
                style={{
                    background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    boxShadow: scrolled ? '0 2px 20px rgba(27,122,61,0.12)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(27,122,61,0.08)' : 'none',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo-pondok.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                            <div>
                                <h1 className="text-sm sm:text-base font-bold transition-colors duration-300"
                                    style={{ color: scrolled ? C.primary : '#fff' }}>
                                    PP Nurul Huda An-Najah
                                </h1>
                                <p className="text-[10px] sm:text-xs transition-colors duration-300"
                                    style={{ color: scrolled ? '#6B7280' : 'rgba(255,255,255,0.8)' }}>
                                    Simbang Kulon, Buaran
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-5">
                            <a href="#info" className="hidden sm:flex items-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg transition-all"
                                style={{ color: scrolled ? C.primary : '#fff' }}>
                                Informasi
                            </a>
                            <a href="#program" className="hidden sm:flex items-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg transition-all"
                                style={{ color: scrolled ? C.primary : '#fff' }}>
                                Program
                            </a>
                            <a href="#lokasi" className="hidden sm:flex items-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg transition-all"
                                style={{ color: scrolled ? C.primary : '#fff' }}>
                                Lokasi
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── HERO SECTION (Full Screen) ── */}
            <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img src="/images/hero-bg.png" alt="Pondok Pesantren"
                        className="w-full h-full object-cover"
                        style={{ filter: 'brightness(0.4)' }} />
                    {/* Green overlay gradient */}
                    <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(180deg, rgba(27,122,61,0.65) 0%, rgba(20,92,46,0.80) 60%, rgba(10,50,25,0.95) 100%)' }}></div>
                    {/* Decorative pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-24 sm:pt-0 sm:pb-0 my-auto"
                    style={{
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
                        transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}>
                    {/* Logo */}
                    <div className="mb-6 sm:mb-8 flex justify-center"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'scale(1)' : 'scale(0.8)',
                            transition: 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s',
                        }}>
                        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full bg-white/10 backdrop-blur-md p-3 sm:p-4 ring-2 ring-white/20 shadow-2xl">
                            <img src="/images/logo-pondok.png" alt="Logo PP Nurul Huda An-Najah" className="w-full h-full object-contain drop-shadow-lg" />
                        </div>
                    </div>

                    {/* Pondok Name */}
                    <div className="mb-2 sm:mb-3">
                        <p className="text-white/70 text-xs sm:text-sm font-medium tracking-[0.25em] uppercase mb-2 sm:mb-3"
                            style={{
                                opacity: heroVisible ? 1 : 0,
                                transition: 'all 1s ease 0.4s',
                            }}>
                            Pondok Pesantren
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
                            style={{
                                textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                                opacity: heroVisible ? 1 : 0,
                                transition: 'all 1s ease 0.5s',
                            }}>
                            Nurul Huda An-Najah
                        </h1>
                    </div>

                    {/* Yayasan Name */}
                    <p className="text-white/60 text-xs sm:text-sm font-medium tracking-wider mb-4 sm:mb-6"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transition: 'all 1s ease 0.6s',
                        }}>
                        Yayasan Al Mukarromah · Simbang Kulon, Buaran, Pekalongan
                    </p>

                    {/* Divider */}
                    <div className="flex justify-center mb-6 sm:mb-8"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transition: 'all 1s ease 0.65s',
                        }}>
                        <div className="w-16 sm:w-24 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}></div>
                    </div>

                    {/* Tagline */}
                    <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transition: 'all 1s ease 0.7s',
                        }}>
                        Mencetak generasi Qur'ani yang berakhlaqul karimah, unggul dalam ilmu agama dan pengetahuan umum
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 1s ease 0.8s',
                        }}>
                        {pendaftaranBuka ? (
                            <>
                                <Link to="/daftar"
                                    className="group inline-flex items-center justify-center gap-2.5 text-white font-bold py-3.5 px-8 sm:py-4 sm:px-10 rounded-2xl shadow-2xl text-sm sm:text-base transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(27,122,61,0.4)]"
                                    style={{ background: C.gradient }}>
                                    <i className="fas fa-file-alt transition-transform group-hover:scale-110"></i>
                                    Daftar Sekarang
                                    <i className="fas fa-arrow-right text-xs ml-1 transition-transform group-hover:translate-x-1"></i>
                                </Link>
                                <Link to="/cek-status"
                                    className="inline-flex items-center justify-center gap-2 font-semibold py-3.5 px-8 sm:py-4 sm:px-10 rounded-2xl text-sm sm:text-base transition-all hover:-translate-y-1"
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                    }}>
                                    <i className="fas fa-search"></i>
                                    Cek Status Pendaftaran
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="inline-flex items-center justify-center gap-2 bg-red-500/20 backdrop-blur-sm text-white font-semibold py-3.5 px-8 rounded-2xl border border-red-400/30">
                                    <i className="fas fa-times-circle"></i> Pendaftaran Ditutup
                                </div>
                                <Link to="/cek-status"
                                    className="inline-flex items-center justify-center gap-2 font-semibold py-3.5 px-8 rounded-2xl text-sm transition-all hover:-translate-y-1"
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                    }}>
                                    <i className="fas fa-search"></i> Cek Status
                                </Link>
                            </>
                        )}
                    </div>

                    {/* PSB Badge */}
                    <div className="mt-8 sm:mt-12"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transition: 'all 1s ease 1s',
                        }}>
                        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 text-xs font-medium py-2 px-5 rounded-full border border-white/15">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            PSB Tahun Ajaran {settings.tahun_ajaran || '2026/2027'} — {pendaftaranBuka ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
                        </span>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                    <a href="#stats" className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors">
                        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
                        <i className="fas fa-chevron-down text-sm"></i>
                    </a>
                </div>
            </section>

            {/* ── STATS COUNTER ── */}
            <section ref={statsRef} id="stats" className="relative z-20 py-12 sm:py-16" style={{ background: '#FAFFFE' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                        {[
                            { val: counters.jenjang, label: 'Jenjang Pendidikan', icon: 'fa-layer-group', suffix: '' },
                            { val: counters.juz, label: 'Juz Target Hafalan', icon: 'fa-quran', suffix: '' },
                            { val: counters.tahun, label: 'Tahun Program', icon: 'fa-calendar-check', suffix: '' },
                            { val: counters.kurikulum, label: 'Kurikulum Pesantren', icon: 'fa-percentage', suffix: '%' },
                        ].map((s, i) => (
                            <div key={i}
                                className="bg-white rounded-2xl p-5 sm:p-6 text-center shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group"
                                style={{ backdropFilter: 'blur(20px)' }}>
                                <div className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                    style={{ background: `${C.primary}15` }}>
                                    <i className={`fas ${s.icon} text-sm`} style={{ color: C.primary }}></i>
                                </div>
                                <div className="text-2xl sm:text-3xl font-extrabold mb-1" style={{ color: C.primary }}>{s.val}{s.suffix}</div>
                                <div className="text-[10px] sm:text-xs text-gray-500 font-medium">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── INFORMATION SECTION ── */}
            <section id="info" className="py-16 sm:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12 sm:mb-16">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase mb-3 py-1.5 px-4 rounded-full"
                            style={{ color: C.primary, background: `${C.primary}10` }}>
                            <i className="fas fa-info-circle"></i> Informasi
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-3">
                            Informasi <span style={{ color: C.primary }}>Pendaftaran</span>
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                            Semua yang perlu kamu ketahui tentang pendaftaran santri baru PP Nurul Huda An-Najah
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
                        {[
                            { icon: 'fa-file-invoice-dollar', title: 'Biaya Pendaftaran', desc: 'Detail biaya pendaftaran dan daftar ulang secara rinci', modal: 'biaya' },
                            { icon: 'fa-file-invoice', title: 'Brosur Utama', desc: 'Informasi lengkap pendaftaran dalam satu brosur', modal: 'brosur' },
                            { icon: 'fa-file-alt', title: 'Syarat & Berkas', desc: 'Rincian syarat dan berkas wajib untuk pendaftaran', modal: 'syarat' },

                        ].map((item, i) => (
                            <button key={i} onClick={() => setModal(item.modal)}
                                className="group relative flex flex-col items-center text-center p-6 sm:p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
                                style={{ overflow: 'hidden' }}>
                                {/* Hover glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: `radial-gradient(circle at 50% 0%, ${C.primary}08 0%, transparent 70%)` }}></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                                        style={{ background: `${C.primary}10`, color: C.primary }}>
                                        <i className={`fas ${item.icon} text-xl`}></i>
                                    </div>
                                    <h5 className="font-bold text-gray-800 text-sm mb-2">{item.title}</h5>
                                    <p className="text-gray-500 text-xs leading-relaxed mb-4">{item.desc}</p>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                                        style={{ color: C.primary }}>
                                        Lihat Detail <i className="fas fa-arrow-right text-[10px]"></i>
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PROGRAM UNGGULAN ── */}
            <section id="program" className="py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, #F0FFF4 0%, #FAFFFE 100%)' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase mb-3 py-1.5 px-4 rounded-full"
                            style={{ color: C.primary, background: `${C.primary}10` }}>
                            <i className="fas fa-star"></i> Keunggulan
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-3">
                            Program <span style={{ color: C.primary }}>Unggulan</span>
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                            Kurikulum terpadu antara ilmu agama dan pengetahuan umum
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        {[
                            { icon: 'fa-quran', title: 'Program Tahfidz', desc: 'Target 30 Juz dalam 6 tahun dengan metode modern dan bimbingan intensif dari ustadz berpengalaman', color: '#059669' },
                            { icon: 'fa-book-open', title: 'Kurikulum Terpadu', desc: 'Perpaduan kurikulum nasional dan pesantren salaf yang menghasilkan lulusan berkompeten', color: '#0284C7' },
                            { icon: 'fa-mosque', title: 'Asrama Terpadu', desc: 'Sekolah dan asrama dalam satu kompleks pesantren dengan lingkungan Islami yang kondusif', color: '#7C3AED' },

                        ].map((item, i) => (
                            <div key={i}
                                className="group relative flex items-start gap-5 p-6 sm:p-7 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                                style={{ minHeight: '120px' }}>
                                {/* Accent line */}
                                <div className="absolute top-0 left-0 w-1 h-full rounded-r-full transition-all duration-500 group-hover:w-1.5"
                                    style={{ background: item.color }}></div>
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                                    style={{ background: `${item.color}12` }}>
                                    <i className={`fas ${item.icon} text-xl`} style={{ color: item.color }}></i>
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-gray-800 text-base mb-1.5">{item.title}</h5>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── LOKASI ── */}
            <section id="lokasi" className="py-16 sm:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase mb-3 py-1.5 px-4 rounded-full"
                            style={{ color: C.primary, background: `${C.primary}10` }}>
                            <i className="fas fa-map-marker-alt"></i> Lokasi
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-3">
                            Lokasi <span style={{ color: C.primary }}>Kami</span>
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                            PP Nurul Huda An-Najah Banin Banat, Simbang Kulon, Buaran, Pekalongan
                        </p>
                    </div>
                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
                        <iframe allowFullScreen className="w-full h-full" loading="lazy"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7259185693315!2d109.65763597481913!3d-6.923331167764469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7026abeaaaaaab%3A0x9ccf113c3a297263!2sPondok%20Pesantren%20Nurul%20Huda%20An-Najah%20Banin%20Banat!5e0!3m2!1sid!2sid!4v1776490674687!5m2!1sid!2sid"
                            style={{ border: 0 }}></iframe>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: C.gradientDark }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Col 1 */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <img src="/images/logo-pondok.png" alt="Logo" className="w-10 h-10 object-contain" />
                                <div>
                                    <h3 className="text-base font-bold text-white">PP Nurul Huda An-Najah</h3>
                                    <p className="text-xs text-white/50">Penerimaan Santri Baru</p>
                                </div>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed mb-4">
                                Mencetak generasi Qur'ani yang berakhlaqul karimah, unggul dalam ilmu agama dan pengetahuan umum.
                            </p>
                        </div>

                        {/* Col 2 - Kontak */}
                        <div>
                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-6 h-0.5 bg-white/30 rounded-full"></span>
                                Hubungi Kami
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {kontak.map(k => (
                                    <a key={k.id} href={k.link_wa || `https://wa.me/${(k.no_whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium py-2 px-3 rounded-lg transition-all border border-white/10">
                                        <i className="fab fa-whatsapp text-green-400"></i>
                                        <span>{k.nama}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Col 3 - Alamat */}
                        <div>
                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-6 h-0.5 bg-white/30 rounded-full"></span>
                                Yayasan Al Mukarromah
                            </h4>
                            <p className="text-xs text-white/60 leading-relaxed mb-5">
                                Gg. 2, Tanjung, Simbang Kulon, Kec. Buaran, Kabupaten Pekalongan, Jawa Tengah 51171
                            </p>
                            <div className="flex gap-2">
                                {[
                                    { icon: 'fa-facebook-f', url: 'https://www.facebook.com/share/14Vs1VguYb1/' },
                                    { icon: 'fa-instagram', url: 'https://www.instagram.com/ppmambaulhuda/' },
                                    { icon: 'fa-tiktok', url: 'https://www.tiktok.com/@ppmambaulhuda' },
                                    { icon: 'fa-youtube', url: 'https://youtube.com/@ppmambaulhuda' },
                                ].map((s, i) => (
                                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 bg-white/10 hover:bg-white/25 text-white rounded-xl flex items-center justify-center transition-all hover:-translate-y-1 border border-white/10">
                                        <i className={`fab ${s.icon} text-sm`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom bar */}
                <div className="border-t border-white/10">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <p className="text-xs text-white/40">© {new Date().getFullYear()} Yayasan Al Mukarromah. All rights reserved.</p>
                        <p className="text-xs text-white/40">PSB PP Nurul Huda An-Najah</p>
                    </div>
                </div>
            </footer>

            {/* ══════════════════════ MODALS ══════════════════════ */}

            {/* Modal Biaya */}
            {modal === 'biaya' && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-center p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="bg-white rounded-2xl max-w-[650px] w-full max-h-[90vh] overflow-hidden flex flex-col animate-[modalIn_0.3s_ease]">
                        <div className="flex items-center justify-between px-6 py-5 text-white flex-shrink-0" style={{ background: C.gradient }}>
                            <div className="flex items-center gap-3">
                                <i className="fas fa-file-invoice-dollar text-xl"></i>
                                <div><h4 className="font-bold text-lg">Biaya Pendaftaran</h4><p className="text-xs opacity-80">PSB {settings.tahun_ajaran || '2026/2027'}</p></div>
                            </div>
                            <button onClick={() => setModal(null)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr className="text-white font-semibold" style={{ background: C.primary }}>
                                        <th className="p-2.5 text-left rounded-tl-lg">No</th>
                                        <th className="p-2.5 text-left">Pembayaran</th>
                                        <th className="p-2.5 text-right rounded-tr-lg">Biaya</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        let currentKat = '', no = 0;
                                        return biaya.map((b, i) => {
                                            const rows = [];
                                            if (currentKat !== b.kategori) {
                                                currentKat = b.kategori;
                                                rows.push(<tr key={`h-${i}`} className="font-semibold" style={{ background: '#F0FFF4', color: C.primary }}><td colSpan={3} className="p-2">{b.kategori === 'PENDAFTARAN' ? 'A. PENDAFTARAN' : 'B. DAFTAR ULANG'}</td></tr>);
                                            }
                                            no++;
                                            rows.push(
                                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                                                    <td className="p-2 border-b border-gray-200">{no}</td>
                                                    <td className="p-2 border-b border-gray-200">{b.nama_item}</td>
                                                    <td className="p-2 border-b border-gray-200 text-right">{fmt(b.biaya)}</td>
                                                </tr>
                                            );
                                            return rows;
                                        }).flat();
                                    })()}
                                    <tr className="text-white font-bold" style={{ background: C.primary }}>
                                        <td colSpan={2} className="p-2.5 rounded-bl-lg">TOTAL</td>
                                        <td className="p-2.5 text-right rounded-br-lg">{fmt(totals)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="mt-4 border rounded-xl p-3 text-xs" style={{ background: '#F0FFF4', borderColor: '#A7F3D0', color: '#065F46' }}>
                                <p className="font-semibold mb-2"><i className="fas fa-info-circle mr-1"></i> Keterangan:</p>
                                <ul className="list-disc pl-5 space-y-1"><li>Infaq Bulanan Pondok Rp600.000/Bulan (Makan 3x, Asrama, Madrasah Diniyah, Laundry)</li></ul>
                                <p className="font-bold mt-3">Total Biaya PSB: {fmt(totals)}</p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                            {settings.link_pdf_biaya && <a href={settings.link_pdf_biaya} target="_blank" rel="noopener noreferrer" className="w-full text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition hover:opacity-90" style={{ background: C.gradient }}><i className="fas fa-download"></i><span>Download PDF</span></a>}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Brosur */}
            {modal === 'brosur' && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-center p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="bg-white rounded-2xl max-w-[650px] w-full max-h-[90vh] overflow-hidden flex flex-col animate-[modalIn_0.3s_ease]">
                        <div className="flex items-center justify-between px-6 py-5 text-white flex-shrink-0" style={{ background: C.gradient }}>
                            <div className="flex items-center gap-3"><i className="fas fa-file-invoice text-xl"></i><div><h4 className="font-bold text-lg">Brosur Utama</h4><p className="text-xs opacity-80">Informasi Lengkap PSB</p></div></div>
                            <button onClick={() => setModal(null)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-3">
                                <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: C.primary }}><i className="fas fa-book-open"></i> Tentang Kami</div>
                                <p className="text-xs text-gray-600">Lembaga pendidikan yang memadukan Pondok Pesantren dengan Formal dari SMP sampai SMA dalam satu komplek.</p>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-3">
                                <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: C.primary }}><i className="fas fa-star"></i> Program Unggulan</div>
                                <p className="text-xs text-gray-600">Tahfidz Qur'an & Qiroatul Kutub. Target 6 tahun khatam 30 Juz / menguasai kitab kuning.</p>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-3">
                                <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: C.primary }}><i className="fas fa-calendar-alt"></i> Waktu Pendaftaran</div>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <div className="rounded-lg p-3 text-center" style={{ background: `${C.primary}10` }}><p className="text-xs font-semibold" style={{ color: C.primary }}>Gelombang 1</p><p className="text-xs text-gray-600">{settings.gelombang_1_start ? new Date(settings.gelombang_1_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' - ' + new Date(settings.gelombang_1_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Segera'}</p></div>
                                    <div className="rounded-lg p-3 text-center" style={{ background: `${C.primary}10` }}><p className="text-xs font-semibold" style={{ color: C.primary }}>Gelombang 2</p><p className="text-xs text-gray-600">{settings.gelombang_2_start ? new Date(settings.gelombang_2_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' - ' + new Date(settings.gelombang_2_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Segera'}</p></div>
                                </div>
                            </div>
                            <div className="border rounded-lg p-3 text-xs mt-3" style={{ background: '#F0FFF4', borderColor: '#A7F3D0' }}><p className="font-semibold" style={{ color: C.primary }}><i className="fas fa-gift mr-1"></i> GRATIS SERAGAM BATIK UNTUK GELOMBANG 1</p></div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                            {settings.link_pdf_brosur && <a href={settings.link_pdf_brosur} target="_blank" rel="noopener noreferrer" className="w-full text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition hover:opacity-90" style={{ background: C.gradient }}><i className="fas fa-download"></i><span>Download Brosur PDF</span></a>}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Syarat */}
            {modal === 'syarat' && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-center p-4" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="bg-white rounded-2xl max-w-[650px] w-full max-h-[90vh] overflow-hidden flex flex-col animate-[modalIn_0.3s_ease]">
                        <div className="flex items-center justify-between px-6 py-5 text-white flex-shrink-0" style={{ background: C.gradient }}>
                            <div className="flex items-center gap-3"><i className="fas fa-file-alt text-xl"></i><div><h4 className="font-bold text-lg">Syarat & Berkas</h4><p className="text-xs opacity-80">Berkas Pendaftaran</p></div></div>
                            <button onClick={() => setModal(null)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-3">
                                <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: C.primary }}><i className="fas fa-folder-open"></i> Berkas Wajib</div>
                                <ul className="space-y-0">
                                    {['FC Akta Kelahiran', 'FC Kartu Keluarga', 'FC KTP Orang Tua', 'FC Ijazah / SKHUN', 'Foto 3x4 Background Merah (4 Lembar)', 'Nomor NISN'].map((item, i) => (
                                        <li key={i} className="py-2 border-b border-gray-200 text-[13px] text-gray-700 flex items-start gap-2 last:border-0">
                                            <i className="fas fa-check-circle mt-0.5 flex-shrink-0" style={{ color: C.primary }}></i>{item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="border rounded-lg p-3 text-xs" style={{ background: '#FEF9C3', borderColor: '#FDE047', color: '#92400E' }}>
                                <p className="font-semibold mb-2"><i className="fas fa-exclamation-triangle mr-1"></i> Penting:</p>
                                <p>Berkas dikumpulkan dalam <strong>STOPMAP</strong></p>
                            </div>
                            {kontak.length > 0 && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-3">
                                    <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: C.primary }}><i className="fas fa-phone-alt"></i> Hubungi Kami</div>
                                    {kontak.map(k => (
                                        <div key={k.id}>
                                            <p className="text-xs text-gray-600 mb-3"><strong>{k.no_whatsapp}</strong> ({k.nama})</p>
                                            <a href={k.link_wa || `https://wa.me/${(k.no_whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 px-4 rounded-lg"><i className="fab fa-whatsapp"></i> Hubungi via WhatsApp</a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                            {settings.link_pdf_syarat && <a href={settings.link_pdf_syarat} target="_blank" rel="noopener noreferrer" className="w-full text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition hover:opacity-90" style={{ background: C.gradient }}><i className="fas fa-download"></i><span>Download PDF</span></a>}
                        </div>
                    </div>
                </div>
            )}



            <style>{`
                @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                html { scroll-behavior: smooth; }
            `}</style>
        </div>
    );
}
