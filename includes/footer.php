<?php
/**
 * Footer Component
 * 
 * Requires $kontakList array to be defined before including this file
 * Optional: $footerMaxWidth (default: 'max-w-6xl') untuk mengatur lebar container
 * Optional: $footerExtraClass (default: '') untuk class tambahan pada footer
 */

$footerMaxWidth = $footerMaxWidth ?? 'max-w-6xl';
$footerExtraClass = $footerExtraClass ?? '';
?>

<!-- Footer -->
<footer class="bg-gray-50 border-t border-gray-200 <?= $footerExtraClass ?>">
    <!-- Main Footer -->
    <div class="<?= $footerMaxWidth ?> mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left: Logo & Info -->
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">SPMB Terpadu</h3>
                        <p class="text-sm text-gray-500">Yayasan Almukarromah Pajomblangan</p>
                    </div>
                </div>

                <!-- Contact Buttons -->
                <?php if (!empty($kontakList)): ?>
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Hubungi Kami</h4>
                <div class="flex flex-wrap gap-2">
                    <?php foreach ($kontakList as $kontak): ?>
                        <a href="<?= htmlspecialchars($kontak['link_wa'] ?: 'https://wa.me/' . preg_replace('/[^0-9]/', '', $kontak['no_whatsapp'])) ?>"
                            target="_blank"
                            class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs font-medium py-2 px-3 rounded-lg transition-all">
                            <i class="fab fa-whatsapp"></i>
                            <span class="hidden sm:inline"><?= htmlspecialchars($kontak['lembaga']) ?></span>
                            <span class="font-semibold"><?= htmlspecialchars($kontak['nama']) ?></span>
                        </a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>

            <!-- Right: Address & Social -->
            <div class="md:text-right">
                <h4 class="text-sm font-bold text-gray-700 mb-2">YAYASAN AL MUKARROMAH</h4>
                <p class="text-sm text-gray-500 mb-4">
                    Jl. Pajomblangan Timur, Ds. Pajomblangan, Kec.<br>
                    Kedungwuni, Kab. Pekalongan, Jawa Tengah
                </p>

                <!-- Social Media -->
                <div class="flex gap-2 md:justify-end">
                    <a href="https://www.facebook.com/share/14Vs1VguYb1/" target="_blank"
                        class="w-8 h-8 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center transition-all">
                        <i class="fab fa-facebook-f text-sm"></i>
                    </a>
                    <a href="https://www.instagram.com/ppmambaulhuda?igsh=bXQ4MG1tZm4zZm00" target="_blank"
                        class="w-8 h-8 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center transition-all">
                        <i class="fab fa-instagram text-sm"></i>
                    </a>
                    <a href="https://www.tiktok.com/@ppmambaulhuda?_r=1&_t=ZS-92QTFj1cu2i" target="_blank"
                        class="w-8 h-8 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center transition-all">
                        <i class="fab fa-tiktok text-sm"></i>
                    </a>
                    <a href="https://youtube.com/@ppmambaulhuda?si=WhI11FSLXkW0vAyI" target="_blank"
                        class="w-8 h-8 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center transition-all">
                        <i class="fab fa-youtube text-sm"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Copyright Bar -->
    <div class="bg-primary text-white py-3">
        <div class="<?= $footerMaxWidth ?> mx-auto px-4 text-center">
            <p class="text-xs">© Copyright <?= date('Y') ?> Yayasan Al Mukarromah</p>
        </div>
    </div>
</footer>
