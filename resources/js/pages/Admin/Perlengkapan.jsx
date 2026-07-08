import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API = '/api';

export default function Perlengkapan() {
    const [items, setItems] = useState([]);
    const [peserta, setPeserta] = useState([]);
    const [searchNama, setSearchNama] = useState('');
    const [filterLembaga, setFilterLembaga] = useState('');
    const [loading, setLoading] = useState(true);

    // PDF printing state
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [printMode, setPrintMode] = useState('blank'); // 'blank' or 'filled'
    const [defaultTanggal, setDefaultTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [defaultKeterangan, setDefaultKeterangan] = useState('Lengkap');
    const [selectedPesertaIds, setSelectedPesertaIds] = useState([]);
    const [customStudentData, setCustomStudentData] = useState({});
    const [isPrinting, setIsPrinting] = useState(false);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const fetchData = useCallback(async () => {
        try {
            const [itemsRes, pesananRes] = await Promise.all([
                axios.get(`${API}/perlengkapan/items`, { headers }),
                axios.get(`${API}/perlengkapan/pesanan`, { headers, params: { search: searchNama, lembaga: filterLembaga } }),
            ]);
            const itemsData = itemsRes.data.success ? itemsRes.data.data : itemsRes.data;
            setItems(Array.isArray(itemsData) ? itemsData : []);
            
            const pesertaData = pesananRes.data.pendaftar || pesananRes.data.data || [];
            setPeserta(pesertaData);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [searchNama, filterLembaga]);

    // Filter students with orders
    const getStudentsWithOrders = useCallback(() => {
        return peserta.filter(p => {
            return items.some(item => p.perlengkapan && p.perlengkapan[item.id] == 1);
        });
    }, [peserta, items]);

    // Update selected IDs when participants are loaded
    useEffect(() => {
        const orderIds = getStudentsWithOrders().map(p => p.id);
        setSelectedPesertaIds(orderIds);
    }, [peserta, items, getStudentsWithOrders]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleExportPdf = async () => {
        const listToPrint = getStudentsWithOrders().filter(p => selectedPesertaIds.includes(p.id));
        if (listToPrint.length === 0) {
            Swal.fire('Perhatian', 'Pilih minimal satu santri untuk dicetak!', 'warning');
            return;
        }

        setIsPrinting(true);
        Swal.fire({
            title: 'Membuat PDF...',
            text: 'Mengolah data perlengkapan santri',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const customDataPayload = {};
            listToPrint.forEach(p => {
                customDataPayload[p.id] = {
                    tanggal_pengambilan: customStudentData[p.id]?.tanggal_pengambilan || defaultTanggal,
                    keterangan: customStudentData[p.id]?.keterangan || defaultKeterangan
                };
            });

            const res = await axios.get(`${API}/perlengkapan/export-pdf`, {
                headers,
                params: {
                    search: searchNama,
                    lembaga: filterLembaga,
                    mode: printMode,
                    tanggal_pengambilan: defaultTanggal,
                    keterangan: defaultKeterangan,
                    custom_data: JSON.stringify(customDataPayload)
                },
                responseType: 'blob'
            });

            Swal.close();
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `bukti-penerimaan-perlengkapan-${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            setShowPrintModal(false);
        } catch (err) {
            Swal.close();
            Swal.fire('Error', 'Gagal mengekspor PDF', 'error');
            console.error(err);
        } finally {
            setIsPrinting(false);
        }
    };

    const togglePerlengkapan = async (pesertaId, itemId, currentStatus, namaPeserta, namaItem) => {
        const newStatus = currentStatus ? 0 : 1;

        // 1. Optimistic Update (Ubah UI secara instan sebelum kirim request)
        setPeserta(prevPeserta =>
            prevPeserta.map(p => {
                if (p.id === pesertaId) {
                    return {
                        ...p,
                        perlengkapan: {
                            ...(p.perlengkapan || {}),
                            [itemId]: newStatus
                        }
                    };
                }
                return p;
            })
        );

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        try {
            await axios.post(`${API}/perlengkapan/pesanan/toggle`, {
                pendaftaran_id: pesertaId,
                perlengkapan_item_id: itemId,
                status: newStatus,
            }, { headers });

            Toast.fire({
                icon: 'success',
                title: `Status ${namaItem} untuk ${namaPeserta} berhasil diperbarui`
            });
        } catch (err) {
            // 2. Rollback jika request API gagal
            setPeserta(prevPeserta =>
                prevPeserta.map(p => {
                    if (p.id === pesertaId) {
                        return {
                            ...p,
                            perlengkapan: {
                                ...(p.perlengkapan || {}),
                                [itemId]: currentStatus ? 1 : 0
                            }
                        };
                    }
                    return p;
                })
            );

            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: err.response?.data?.message || 'Terjadi kesalahan saat menyimpan status'
            });
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchData();
    };

    const resetFilter = () => {
        setSearchNama('');
        setFilterLembaga('');
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#E67E22] border-t-transparent rounded-full"></div></div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Kelola Perlengkapan</h2>
                    <p className="text-gray-500 text-sm">Catat pemesanan perlengkapan tambahan per peserta</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={() => setShowPrintModal(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 shadow-sm active:scale-95">
                        <i className="fas fa-file-pdf"></i>
                        <span>Cetak PDF</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-2.5 sm:p-4 mb-4">
                <form onSubmit={handleFilter} className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                    <div>
                        <label className="block text-[10px] sm:text-sm font-medium text-gray-600 mb-0.5">Cari Nama</label>
                        <input type="text" value={searchNama} onChange={e => setSearchNama(e.target.value)} placeholder="Nama peserta..."
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-xs sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-[10px] sm:text-sm font-medium text-gray-600 mb-0.5">Lembaga</label>
                        <select value={filterLembaga} onChange={e => setFilterLembaga(e.target.value)}
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-xs sm:text-sm">
                            <option value="">Semua Lembaga</option>
                            <option value="SMP NU BP">SMP NU BP</option>
                            <option value="MA ALHIKAM">MA ALHIKAM</option>
                        </select>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-end gap-2 mt-1 md:mt-0">
                        <button type="submit" className="bg-[#E67E22] hover:bg-[#d35400] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition flex-1">
                            <i className="fas fa-search mr-1.5"></i>Filter
                        </button>
                        <button type="button" onClick={resetFilter} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition">
                            <i className="fas fa-redo"></i>
                        </button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-[11px] sm:text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">No</th>
                                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase sticky left-12 bg-gray-50 z-10">Nama</th>
                                <th className="px-2 py-2 sm:px-4 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase">JK</th>
                                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Lembaga</th>
                                {items.map(item => (
                                    <th key={item.id} className="px-2 py-2 sm:px-4 sm:py-3 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase leading-tight">{item.nama_item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {peserta.map((p, idx) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                    <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-800 sticky left-12 bg-white z-10 leading-tight">{p.nama}</td>
                                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-600 text-center">{p.jenis_kelamin === 'L' ? 'L' : 'P'}</td>
                                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-600">{p.lembaga}</td>
                                    {items.map(item => {
                                        const isChecked = p.perlengkapan && p.perlengkapan[item.id] == 1;
                                        return (
                                            <td key={item.id} className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                                                <label className="toggle-switch">
                                                    <input type="checkbox" checked={isChecked} onChange={() => togglePerlengkapan(p.id, item.id, isChecked, p.nama, item.nama_item)} />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            {peserta.length === 0 && (
                                <tr>
                                    <td colSpan={4 + items.length} className="px-2 py-8 text-center text-gray-500 text-xs sm:text-sm">
                                        <i className="fas fa-inbox text-2xl mb-2 text-gray-300 block"></i>
                                        <p>Tidak ada data peserta</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Cetak PDF */}
            {showPrintModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all scale-100 animate-fadeIn">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <i className="fas fa-print text-[#E67E22]"></i>
                                    Cetak Bukti Penerimaan Perlengkapan
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">Atur format cetak bukti penerimaan perlengkapan santri</p>
                            </div>
                            <button onClick={() => setShowPrintModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <i className="fas fa-times text-lg"></i>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {/* Pilihan Format */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Format Kolom Tanggal & Keterangan</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div onClick={() => setPrintMode('blank')}
                                        className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${printMode === 'blank' ? 'border-[#E67E22] bg-orange-50/30 ring-2 ring-[#E67E22]/20' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${printMode === 'blank' ? 'border-[#E67E22]' : 'border-gray-300'}`}>
                                            {printMode === 'blank' && <div className="w-2 h-2 rounded-full bg-[#E67E22]"></div>}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">Format Kosong (Tulis Tangan)</p>
                                            <p className="text-xs text-gray-500 mt-1">Kolom tanggal pengambilan dan keterangan akan dicetak kosong (garis titik-titik) untuk diisi manual.</p>
                                        </div>
                                    </div>
                                    <div onClick={() => setPrintMode('filled')}
                                        className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${printMode === 'filled' ? 'border-[#E67E22] bg-orange-50/30 ring-2 ring-[#E67E22]/20' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${printMode === 'filled' ? 'border-[#E67E22]' : 'border-gray-300'}`}>
                                            {printMode === 'filled' && <div className="w-2 h-2 rounded-full bg-[#E67E22]"></div>}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">Isi Otomatis (Sistem)</p>
                                            <p className="text-xs text-gray-500 mt-1">Tanggal pengambilan dan keterangan diisi dari sistem (bisa diatur massal atau kustom per santri).</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Default Inputs (Filled Mode Only) */}
                            {printMode === 'filled' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-orange-50/20 rounded-xl border border-orange-100/50">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Pengambilan Default</label>
                                        <input type="date" value={defaultTanggal} onChange={e => setDefaultTanggal(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Keterangan Default</label>
                                        <input type="text" value={defaultKeterangan} onChange={e => setDefaultKeterangan(e.target.value)} placeholder="Misal: Lengkap, Lunas, dll"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none text-sm" />
                                    </div>
                                </div>
                            )}

                            {/* Daftar Santri */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Daftar Penerima Perlengkapan ({getStudentsWithOrders().length})</label>
                                    <span className="text-xs text-[#E67E22] bg-orange-50 px-2.5 py-1 rounded-full font-semibold">
                                        Terpilih: {selectedPesertaIds.length} santri
                                    </span>
                                </div>
                                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-[320px] overflow-y-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                            <tr>
                                                <th className="p-3 w-10 text-center">
                                                    <input type="checkbox"
                                                        checked={getStudentsWithOrders().length > 0 && selectedPesertaIds.length === getStudentsWithOrders().length}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedPesertaIds(getStudentsWithOrders().map(p => p.id));
                                                            } else {
                                                                setSelectedPesertaIds([]);
                                                            }
                                                        }}
                                                        className="rounded border-gray-300 text-[#E67E22] focus:ring-[#E67E22]" />
                                                </th>
                                                <th className="p-3">Nama Santri</th>
                                                <th className="p-3">Lembaga</th>
                                                <th className="p-3">Pesanan</th>
                                                {printMode === 'filled' && (
                                                    <>
                                                        <th className="p-3 w-[150px]">Tanggal</th>
                                                        <th className="p-3 w-[150px]">Keterangan</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {getStudentsWithOrders().map(p => {
                                                const orderedItems = items
                                                    .filter(item => p.perlengkapan && p.perlengkapan[item.id] == 1)
                                                    .map(item => item.nama_item)
                                                    .join(', ');

                                                const isSelected = selectedPesertaIds.includes(p.id);

                                                return (
                                                    <tr key={p.id} className={`hover:bg-gray-50/50 ${isSelected ? 'bg-orange-50/10' : ''}`}>
                                                        <td className="p-3 text-center">
                                                            <input type="checkbox"
                                                                checked={isSelected}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedPesertaIds(prev => [...prev, p.id]);
                                                                    } else {
                                                                        setSelectedPesertaIds(prev => prev.filter(id => id !== p.id));
                                                                    }
                                                                }}
                                                                className="rounded border-gray-300 text-[#E67E22] focus:ring-[#E67E22]" />
                                                        </td>
                                                        <td className="p-3 font-medium text-gray-900">{p.nama}</td>
                                                        <td className="p-3 text-gray-500">{p.lembaga}</td>
                                                        <td className="p-3 text-gray-600 truncate max-w-[180px]">{orderedItems}</td>
                                                        {printMode === 'filled' && (
                                                            <>
                                                                <td className="p-2">
                                                                    <input type="date"
                                                                        value={customStudentData[p.id]?.tanggal_pengambilan || defaultTanggal}
                                                                        onChange={(e) => {
                                                                            setCustomStudentData(prev => ({
                                                                                ...prev,
                                                                                [p.id]: {
                                                                                    ...prev[p.id],
                                                                                    tanggal_pengambilan: e.target.value
                                                                                }
                                                                            }));
                                                                        }}
                                                                        disabled={!isSelected}
                                                                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-[#E67E22] outline-none disabled:bg-gray-50" />
                                                                </td>
                                                                <td className="p-2">
                                                                    <input type="text"
                                                                        value={customStudentData[p.id]?.keterangan || defaultKeterangan}
                                                                        placeholder="Keterangan"
                                                                        onChange={(e) => {
                                                                            setCustomStudentData(prev => ({
                                                                                ...prev,
                                                                                [p.id]: {
                                                                                    ...prev[p.id],
                                                                                    keterangan: e.target.value
                                                                                }
                                                                            }));
                                                                        }}
                                                                        disabled={!isSelected}
                                                                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-[#E67E22] outline-none disabled:bg-gray-50" />
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                            {getStudentsWithOrders().length === 0 && (
                                                <tr>
                                                    <td colSpan={printMode === 'filled' ? 6 : 4} className="p-8 text-center text-gray-500">
                                                        <i className="fas fa-exclamation-circle text-xl text-gray-300 block mb-1"></i>
                                                        Tidak ada data santri yang memesan perlengkapan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setShowPrintModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition active:scale-95">
                                Batal
                            </button>
                            <button onClick={handleExportPdf}
                                disabled={getStudentsWithOrders().length === 0 || selectedPesertaIds.length === 0 || isPrinting}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition active:scale-95 flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none">
                                <i className="fas fa-file-pdf"></i>
                                {isPrinting ? 'Mengekspor...' : 'Unduh PDF'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Switch CSS */}
            <style>{`
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #ccc;
                    transition: .3s;
                    border-radius: 24px;
                }
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }
                input:checked + .toggle-slider {
                    background-color: #10b981;
                }
                input:checked + .toggle-slider:before {
                    transform: translateX(20px);
                }
            `}</style>
        </div>
    );
}
