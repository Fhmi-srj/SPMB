<?php
/**
 * Sidebar Component
 * 
 * Usage: Set $currentPage before including this file
 * Example: $currentPage = 'dashboard';
 */

// Role label helper
function getRoleLabel($role)
{
    switch ($role) {
        case 'super_admin':
            return 'Super Admin';
        case 'admin':
            return 'Admin';
        case 'panitia':
            return 'Panitia';
        default:
            return 'User';
    }
}
function getRoleBadgeColor($role)
{
    switch ($role) {
        case 'super_admin':
            return 'bg-red-500';
        case 'admin':
            return 'bg-blue-500';
        case 'panitia':
            return 'bg-green-500';
        default:
            return 'bg-gray-500';
    }
}
$currentRole = getRole();
$roleLabel = getRoleLabel($currentRole);
$roleBadgeColor = getRoleBadgeColor($currentRole);

// Pending transaction count for Super Admin badge
$pendingTransCount = 0;
if (isSuperAdmin()) {
    $sidebarConn = getConnection();
    $pendingResult = $sidebarConn->query("SELECT 
        (SELECT COUNT(*) FROM transaksi_pemasukan WHERE status = 'pending') + 
        (SELECT COUNT(*) FROM transaksi_pengeluaran WHERE status = 'pending') as total");
    if ($pendingResult) {
        $pendingTransCount = intval($pendingResult->fetch_assoc()['total']);
    }
    $sidebarConn->close();
}
?>
<!-- Mobile Header -->
<div class="md:hidden bg-primary text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
    <span class="font-bold">Admin SPMB</span>
    <a href="logout.php" class="text-xl"><i class="fas fa-sign-out-alt"></i></a>
</div>

<!-- Sidebar -->
<aside class="sidebar fixed md:sticky inset-y-0 left-0 z-50 w-64 bg-primary text-white h-screen flex flex-col">
    <div class="p-4 border-b border-white/10">
        <h1 class="font-bold text-lg">Admin SPMB</h1>
        <p class="text-xs text-white/60">Mambaul Huda</p>
    </div>

    <nav class="p-4 space-y-1 flex-1 overflow-y-auto">
        <a href="dashboard.php"
            class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'dashboard' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
            <i class="fas fa-tachometer-alt w-5"></i><span>Dashboard</span>
        </a>
        <a href="pendaftaran.php"
            class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'pendaftaran' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
            <i class="fas fa-users w-5"></i><span>Data Pendaftar</span>
        </a>

        <?php if (canAccessAdmin()): ?>
            <!-- Menu Administrasi (Super Admin & Admin only) -->
            <div class="pt-2 mt-2 border-t border-white/10">
                <p class="px-4 py-1 text-xs text-white/40 uppercase tracking-wider">Administrasi</p>
            </div>
            <a href="biaya.php"
                class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'biaya' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
                <i class="fas fa-money-bill w-5"></i><span>Biaya</span>
            </a>
            <a href="perlengkapan.php"
                class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'perlengkapan' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
                <i class="fas fa-box w-5"></i><span>Perlengkapan</span>
            </a>
            <a href="transaksi.php"
                class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'transaksi' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
                <i class="fas fa-money-bill-wave w-5"></i>
                <span class="flex-1">Transaksi</span>
                <?php if ($pendingTransCount > 0): ?>
                    <span
                        class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full"><?= $pendingTransCount ?></span>
                <?php endif; ?>
            </a>
            <a href="pos_keuangan.php"
                class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'pos_keuangan' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
                <i class="fas fa-chart-pie w-5"></i><span>Pos Keuangan</span>
            </a>
        <?php endif; ?>

        <!-- Menu Umum -->
        <div class="pt-2 mt-2 border-t border-white/10">
            <p class="px-4 py-1 text-xs text-white/40 uppercase tracking-wider">Lainnya</p>
        </div>
        <a href="beasiswa.php"
            class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'beasiswa' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
            <i class="fas fa-graduation-cap w-5"></i><span>Beasiswa</span>
        </a>
        <a href="kontak.php"
            class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'kontak' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
            <i class="fas fa-phone-alt w-5"></i><span>Kontak</span>
        </a>
        <a href="pengaturan.php"
            class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'pengaturan' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
            <i class="fas fa-cog w-5"></i><span>Pengaturan</span>
        </a>
        <?php if (canAccessAdmin()): ?>
            <a href="aktivitas.php"
                class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'aktivitas' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
                <i class="fas fa-history w-5"></i><span>Log Aktivitas</span>
            </a>
        <?php endif; ?>

        <?php if (isSuperAdmin()): ?>
            <!-- Menu Super Admin -->
            <div class="pt-2 mt-2 border-t border-white/10">
                <p class="px-4 py-1 text-xs text-white/40 uppercase tracking-wider">Super Admin</p>
            </div>
            <a href="kelola_user.php"
                class="flex items-center gap-3 px-4 py-3 rounded-lg <?= $currentPage === 'kelola_user' ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white' ?> transition">
                <i class="fas fa-user-cog w-5"></i><span>Kelola User</span>
            </a>
        <?php endif; ?>
    </nav>


    <div class="p-4 border-t border-white/10">
        <a href="profil.php"
            class="flex items-center gap-3 mb-3 hover:bg-white/10 p-2 -m-2 rounded-lg transition cursor-pointer">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i class="fas fa-user"></i>
            </div>
            <div class="flex-1">
                <p class="font-medium text-sm"><?= htmlspecialchars($_SESSION['admin_nama'] ?? 'Admin') ?></p>
                <span
                    class="inline-block px-2 py-0.5 text-xs rounded-full <?= $roleBadgeColor ?> text-white"><?= $roleLabel ?></span>
            </div>
            <i class="fas fa-chevron-right text-white/40 text-xs"></i>
        </a>
        <a href="logout.php" class="block text-center py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">
            <i class="fas fa-sign-out-alt mr-2"></i>Keluar
        </a>
    </div>
</aside>


<!-- Overlay for mobile -->
<div class="sidebar-overlay fixed inset-0 bg-black/50 z-40 hidden md:hidden" onclick="toggleSidebar()"></div>

<!-- Mobile Bottom Navigation -->
<nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
    <div class="flex items-end justify-around px-2 pt-2 pb-3">
        <!-- Dashboard -->
        <a href="dashboard.php"
            class="flex flex-col items-center gap-1 px-3 py-2 <?= $currentPage === 'dashboard' ? 'text-primary' : 'text-gray-500' ?> transition">
            <i class="fas fa-home text-xl"></i>
            <span class="text-xs font-medium">Dashboard</span>
        </a>

        <!-- Data Pendaftar -->
        <a href="pendaftaran.php"
            class="flex flex-col items-center gap-1 px-3 py-2 <?= $currentPage === 'pendaftaran' ? 'text-primary' : 'text-gray-500' ?> transition">
            <i class="fas fa-users text-xl"></i>
            <span class="text-xs font-medium">Pendaftar</span>
        </a>

        <!-- Center Menu Button -->
        <button onclick="toggleDropupMenu()" class="flex flex-col items-center -mt-6 relative">
            <div
                class="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition">
                <i id="dropupIcon" class="fas fa-plus text-white text-2xl"></i>
            </div>
            <span class="text-xs font-medium text-gray-500 mt-1">Menu</span>
        </button>

        <?php if (canAccessAdmin()): ?>
            <!-- Transaksi (only for admin roles) -->
            <a href="transaksi.php"
                class="flex flex-col items-center gap-1 px-3 py-2 <?= $currentPage === 'transaksi' ? 'text-primary' : 'text-gray-500' ?> transition">
                <i class="fas fa-money-bill-wave text-xl"></i>
                <span class="text-xs font-medium">Transaksi</span>
            </a>
        <?php else: ?>
            <!-- Beasiswa (for panitia) -->
            <a href="beasiswa.php"
                class="flex flex-col items-center gap-1 px-3 py-2 <?= $currentPage === 'beasiswa' ? 'text-primary' : 'text-gray-500' ?> transition">
                <i class="fas fa-graduation-cap text-xl"></i>
                <span class="text-xs font-medium">Beasiswa</span>
            </a>
        <?php endif; ?>

        <!-- Pengaturan -->
        <a href="pengaturan.php"
            class="flex flex-col items-center gap-1 px-3 py-2 <?= $currentPage === 'pengaturan' ? 'text-primary' : 'text-gray-500' ?> transition">
            <i class="fas fa-cog text-xl"></i>
            <span class="text-xs font-medium">Pengaturan</span>
        </a>
    </div>
</nav>

<!-- Dropup Menu Overlay -->
<div id="dropupOverlay" class="md:hidden fixed inset-0 bg-black/50 z-40 hidden" onclick="toggleDropupMenu()"></div>

<!-- Dropup Menu -->
<div id="dropupMenu"
    class="md:hidden fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50 hidden transform transition-all duration-300">
    <div class="p-4">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Menu Lainnya</h3>
            <button onclick="toggleDropupMenu()" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>
        <div class="grid grid-cols-3 gap-3">
            <?php if (canAccessAdmin()): ?>
                <a href="biaya.php"
                    class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition <?= $currentPage === 'biaya' ? 'bg-primary/10 text-primary' : 'text-gray-600' ?>">
                    <i class="fas fa-money-bill text-2xl"></i>
                    <span class="text-xs font-medium text-center">Biaya</span>
                </a>
                <a href="perlengkapan.php"
                    class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition <?= $currentPage === 'perlengkapan' ? 'bg-primary/10 text-primary' : 'text-gray-600' ?>">
                    <i class="fas fa-box text-2xl"></i>
                    <span class="text-xs font-medium text-center">Perlengkapan</span>
                </a>
                <a href="pos_keuangan.php"
                    class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition <?= $currentPage === 'pos_keuangan' ? 'bg-primary/10 text-primary' : 'text-gray-600' ?>">
                    <i class="fas fa-chart-pie text-2xl"></i>
                    <span class="text-xs font-medium text-center">Pos Keuangan</span>
                </a>
            <?php endif; ?>
            <a href="beasiswa.php"
                class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition <?= $currentPage === 'beasiswa' ? 'bg-primary/10 text-primary' : 'text-gray-600' ?>">
                <i class="fas fa-graduation-cap text-2xl"></i>
                <span class="text-xs font-medium text-center">Beasiswa</span>
            </a>
            <a href="kontak.php"
                class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition <?= $currentPage === 'kontak' ? 'bg-primary/10 text-primary' : 'text-gray-600' ?>">
                <i class="fas fa-phone-alt text-2xl"></i>
                <span class="text-xs font-medium text-center">Kontak</span>
            </a>
            <a href="aktivitas.php"
                class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition <?= $currentPage === 'aktivitas' ? 'bg-primary/10 text-primary' : 'text-gray-600' ?>">
                <i class="fas fa-history text-2xl"></i>
                <span class="text-xs font-medium text-center">Log Aktivitas</span>
            </a>
            <?php if (isSuperAdmin()): ?>
                <a href="kelola_user.php"
                    class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition <?= $currentPage === 'kelola_user' ? 'bg-primary/10 text-primary' : 'text-gray-600' ?>">
                    <i class="fas fa-user-cog text-2xl"></i>
                    <span class="text-xs font-medium text-center">Kelola User</span>
                </a>
            <?php endif; ?>
        </div>
    </div>
</div>

<script>
    function toggleSidebar() {
        document.querySelector('.sidebar').classList.toggle('active');
        document.querySelector('.sidebar-overlay').classList.toggle('hidden');
    }

    function toggleDropupMenu() {
        const menu = document.getElementById('dropupMenu');
        const overlay = document.getElementById('dropupOverlay');
        const icon = document.getElementById('dropupIcon');

        menu.classList.toggle('hidden');
        overlay.classList.toggle('hidden');

        // Rotate icon
        if (menu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-plus');
        } else {
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-times');
        }
    }
</script>