<!-- Modal Edit Pemasukan -->
<div id="modalEditPemasukan"
    class="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-800">Edit Pemasukan</h3>
        </div>
        <form method="POST" class="p-6">
            <input type="hidden" name="action" value="edit_pemasukan">
            <input type="hidden" id="edit_pemasukan_id" name="id">
            <input type="hidden" id="edit_pemasukan_pendaftaran_id" name="pendaftaran_id">

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Peserta</label>
                <input type="text" id="edit_pemasukan_nama" readonly
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed">
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                    <input type="date" id="edit_pemasukan_tanggal" name="tanggal" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nominal *</label>
                    <input type="text" id="edit_pemasukan_nominal" name="nominal" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Pembayaran *</label>
                <select id="edit_pemasukan_jenis" name="jenis_pembayaran" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                    <option value="">Pilih Jenis</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Cash">Cash</option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <textarea id="edit_pemasukan_keterangan" name="keterangan" rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onclick="document.getElementById('modalEditPemasukan').classList.add('hidden')"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Batal
                </button>
                <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                    Update
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Edit Pengeluaran -->
<div id="modalEditPengeluaran"
    class="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-800">Edit Pengeluaran</h3>
        </div>
        <form method="POST" class="p-6">
            <input type="hidden" name="action" value="edit_pengeluaran">
            <input type="hidden" id="edit_pengeluaran_id" name="id">

            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                    <input type="date" id="edit_pengeluaran_tanggal" name="tanggal" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nominal *</label>
                    <input type="text" id="edit_pengeluaran_nominal" name="nominal" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                <select id="edit_pengeluaran_kategori" name="kategori" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                    <option value="">Pilih Kategori</option>
                    <?php foreach ($kategoriList as $kat): ?>
                        <option value="<?= htmlspecialchars($kat) ?>">
                            <?= htmlspecialchars($kat) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <textarea id="edit_pengeluaran_keterangan" name="keterangan" rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onclick="document.getElementById('modalEditPengeluaran').classList.add('hidden')"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Batal
                </button>
                <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                    Update
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    // Edit Pemasukan Function
    function editPemasukan(id, pendaftaran_id, tanggal, nominal, jenis, keterangan, nama) {
        document.getElementById('edit_pemasukan_id').value = id;
        document.getElementById('edit_pemasukan_pendaftaran_id').value = pendaftaran_id;
        document.getElementById('edit_pemasukan_nama').value = nama;
        document.getElementById('edit_pemasukan_tanggal').value = tanggal;
        document.getElementById('edit_pemasukan_nominal').value = formatRupiah(nominal.toString());
        document.getElementById('edit_pemasukan_jenis').value = jenis;
        document.getElementById('edit_pemasukan_keterangan').value = keterangan;
        document.getElementById('modalEditPemasukan').classList.remove('hidden');
    }

    // Edit Pengeluaran Function
    function editPengeluaran(id, tanggal, nominal, kategori, keterangan) {
        document.getElementById('edit_pengeluaran_id').value = id;
        document.getElementById('edit_pengeluaran_tanggal').value = tanggal;
        document.getElementById('edit_pengeluaran_nominal').value = formatRupiah(nominal.toString());
        document.getElementById('edit_pengeluaran_kategori').value = kategori;
        document.getElementById('edit_pengeluaran_keterangan').value = keterangan;
        document.getElementById('modalEditPengeluaran').classList.remove('hidden');
    }
</script>