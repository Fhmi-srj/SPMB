<?php
require_once '../api/config.php';
requireRole('super_admin');

$conn = getConnection();
$message = '';
$error = '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'add') {
        $username = sanitize($conn, $_POST['username']);
        $nama = sanitize($conn, $_POST['nama']);
        $password = $_POST['password'] ?? '';
        $role = sanitize($conn, $_POST['role']);

        // Validate role
        if (!in_array($role, ['super_admin', 'admin', 'panitia'])) {
            $error = 'Role tidak valid!';
        } elseif (strlen($password) < 6) {
            $error = 'Password minimal 6 karakter!';
        } else {
            // Check duplicate username
            $stmt = $conn->prepare("SELECT id FROM admin WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            if ($stmt->get_result()->num_rows > 0) {
                $error = 'Username sudah digunakan!';
            } else {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("INSERT INTO admin (username, password, nama, role) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("ssss", $username, $hashedPassword, $nama, $role);

                if ($stmt->execute()) {
                    $message = 'User berhasil ditambahkan!';
                    logActivity('USER_CREATE', "Menambah user: $nama ($role)");
                } else {
                    $error = 'Gagal menambahkan user!';
                }
            }
        }
    }

    if ($action === 'edit') {
        $id = intval($_POST['id']);
        $username = sanitize($conn, $_POST['username']);
        $nama = sanitize($conn, $_POST['nama']);
        $role = sanitize($conn, $_POST['role']);

        // Cannot edit own role
        if ($id == $_SESSION['admin_id'] && $role !== 'super_admin') {
            $error = 'Tidak bisa mengubah role sendiri!';
        } elseif (!in_array($role, ['super_admin', 'admin', 'panitia'])) {
            $error = 'Role tidak valid!';
        } else {
            // Check duplicate username
            $stmt = $conn->prepare("SELECT id FROM admin WHERE username = ? AND id != ?");
            $stmt->bind_param("si", $username, $id);
            $stmt->execute();
            if ($stmt->get_result()->num_rows > 0) {
                $error = 'Username sudah digunakan!';
            } else {
                $stmt = $conn->prepare("UPDATE admin SET username = ?, nama = ?, role = ? WHERE id = ?");
                $stmt->bind_param("sssi", $username, $nama, $role, $id);

                if ($stmt->execute()) {
                    $message = 'User berhasil diupdate!';
                    logActivity('USER_UPDATE', "Mengupdate user: $nama ($role)");
                } else {
                    $error = 'Gagal mengupdate user!';
                }
            }
        }
    }

    if ($action === 'reset_password') {
        $id = intval($_POST['id']);
        $newPassword = $_POST['new_password'] ?? '';

        if (strlen($newPassword) < 6) {
            $error = 'Password minimal 6 karakter!';
        } else {
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE admin SET password = ? WHERE id = ?");
            $stmt->bind_param("si", $hashedPassword, $id);

            if ($stmt->execute()) {
                // Get user name for log
                $stmt2 = $conn->prepare("SELECT nama FROM admin WHERE id = ?");
                $stmt2->bind_param("i", $id);
                $stmt2->execute();
                $userData = $stmt2->get_result()->fetch_assoc();
                $message = 'Password berhasil direset!';
                logActivity('PASSWORD_RESET', "Reset password user: " . ($userData['nama'] ?? 'Unknown'));
            } else {
                $error = 'Gagal mereset password!';
            }
        }
    }

    if ($action === 'delete') {
        $id = intval($_POST['id']);

        // Cannot delete self
        if ($id == $_SESSION['admin_id']) {
            $error = 'Tidak bisa menghapus akun sendiri!';
        } else {
            // Get user data for log before deleting
            $stmt = $conn->prepare("SELECT nama, role FROM admin WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $userData = $stmt->get_result()->fetch_assoc();

            $stmt = $conn->prepare("DELETE FROM admin WHERE id = ?");
            $stmt->bind_param("i", $id);

            if ($stmt->execute()) {
                $message = 'User berhasil dihapus!';
                logActivity('USER_DELETE', "Menghapus user: " . ($userData['nama'] ?? 'Unknown') . " (" . ($userData['role'] ?? '') . ")");
            } else {
                $error = 'Gagal menghapus user!';
            }
        }
    }
}

// Get all users
$result = $conn->query("SELECT id, username, nama, role, created_at FROM admin ORDER BY id ASC");
$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

$conn->close();

// Page config
$pageTitle = 'Kelola User - Admin SPMB';
$currentPage = 'kelola_user';
?>
<?php include 'includes/header.php'; ?>

<div class="admin-wrapper">
    <?php include 'includes/sidebar.php'; ?>

    <!-- Main Content -->
    <main class="main-content p-4 md:p-6">
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Kelola User</h2>
                <p class="text-gray-500 text-sm">Kelola akun admin, tambah atau edit user</p>
            </div>
            <button onclick="openModal('addUserModal')"
                class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                <i class="fas fa-user-plus mr-2"></i>Tambah User
            </button>
        </div>

        <?php if ($message): ?>
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                <i class="fas fa-check-circle mr-2"></i>
                <?= $message ?>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <?= $error ?>
            </div>
        <?php endif; ?>

        <!-- Users Table -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dibuat</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <?php $no = 1;
                        foreach ($users as $user): ?>
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3 text-sm text-gray-500">
                                    <?= $no++ ?>
                                </td>
                                <td class="px-4 py-3 text-sm font-medium text-gray-800">
                                    <?= htmlspecialchars($user['nama']) ?>
                                    <?php if ($user['id'] == $_SESSION['admin_id']): ?>
                                        <span class="text-xs text-primary font-normal">(Anda)</span>
                                    <?php endif; ?>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">
                                    <?= htmlspecialchars($user['username']) ?>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <?php
                                    $badgeColor = match ($user['role']) {
                                        'super_admin' => 'bg-red-100 text-red-700',
                                        'admin' => 'bg-blue-100 text-blue-700',
                                        'panitia' => 'bg-green-100 text-green-700',
                                        default => 'bg-gray-100 text-gray-700',
                                    };
                                    $label = match ($user['role']) {
                                        'super_admin' => 'Super Admin',
                                        'admin' => 'Admin',
                                        'panitia' => 'Panitia',
                                        default => $user['role'],
                                    };
                                    ?>
                                    <span
                                        class="inline-block px-2 py-1 text-xs font-semibold rounded-full <?= $badgeColor ?>">
                                        <?= $label ?>
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-500">
                                    <?= $user['created_at'] ? date('d/m/Y', strtotime($user['created_at'])) : '-' ?>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <button onclick='editUser(<?= json_encode($user) ?>)'
                                        class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onclick="resetPassword(<?= $user['id'] ?>, '<?= htmlspecialchars($user['nama'], ENT_QUOTES) ?>')"
                                        class="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition"
                                        title="Reset Password">
                                        <i class="fas fa-key"></i>
                                    </button>
                                    <?php if ($user['id'] != $_SESSION['admin_id']): ?>
                                        <button
                                            onclick="deleteUser(<?= $user['id'] ?>, '<?= htmlspecialchars($user['nama'], ENT_QUOTES) ?>')"
                                            class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition" title="Hapus">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        <?php if (empty($users)): ?>
                            <tr>
                                <td colspan="6" class="px-4 py-8 text-center text-gray-500 text-sm">
                                    <i class="fas fa-users text-3xl mb-2 text-gray-300"></i>
                                    <p>Belum ada user</p>
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<!-- Add User Modal -->
<div id="addUserModal" class="modal-overlay fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4">
    <div class="modal-container bg-white rounded-xl max-w-md w-full">
        <div class="modal-header flex items-center justify-between p-6 border-b">
            <h3 class="text-lg font-bold text-gray-800">Tambah User Baru</h3>
            <button onclick="closeModal('addUserModal')" class="text-gray-400 hover:text-gray-600"><i
                    class="fas fa-times"></i></button>
        </div>
        <form method="POST">
            <div class="p-6 space-y-4">
                <input type="hidden" name="action" value="add">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input type="text" name="nama" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input type="text" name="username" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" name="password" required minlength="6"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                    <p class="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select name="role" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option value="panitia">Panitia</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
            </div>
            <div class="flex gap-2 justify-end p-6 border-t bg-gray-50 rounded-b-xl">
                <button type="button" onclick="closeModal('addUserModal')"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                <button type="submit"
                    class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition">Simpan</button>
            </div>
        </form>
    </div>
</div>

<!-- Edit User Modal -->
<div id="editUserModal" class="modal-overlay fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4">
    <div class="modal-container bg-white rounded-xl max-w-md w-full">
        <div class="modal-header flex items-center justify-between p-6 border-b">
            <h3 class="text-lg font-bold text-gray-800">Edit User</h3>
            <button onclick="closeModal('editUserModal')" class="text-gray-400 hover:text-gray-600"><i
                    class="fas fa-times"></i></button>
        </div>
        <form method="POST">
            <div class="p-6 space-y-4">
                <input type="hidden" name="action" value="edit">
                <input type="hidden" name="id" id="editUserId">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input type="text" name="nama" id="editUserNama" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input type="text" name="username" id="editUserUsername" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select name="role" id="editUserRole" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option value="panitia">Panitia</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
            </div>
            <div class="flex gap-2 justify-end p-6 border-t bg-gray-50 rounded-b-xl">
                <button type="button" onclick="closeModal('editUserModal')"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                <button type="submit"
                    class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition">Update</button>
            </div>
        </form>
    </div>
</div>

<!-- Reset Password Modal -->
<div id="resetPwModal" class="modal-overlay fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4">
    <div class="modal-container bg-white rounded-xl max-w-sm w-full">
        <div class="modal-header flex items-center justify-between p-6 border-b">
            <h3 class="text-lg font-bold text-gray-800">Reset Password</h3>
            <button onclick="closeModal('resetPwModal')" class="text-gray-400 hover:text-gray-600"><i
                    class="fas fa-times"></i></button>
        </div>
        <form method="POST">
            <div class="p-6 space-y-4">
                <input type="hidden" name="action" value="reset_password">
                <input type="hidden" name="id" id="resetPwId">
                <p class="text-sm text-gray-600">Reset password untuk <strong id="resetPwName"></strong></p>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                    <input type="password" name="new_password" required minlength="6"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                    <p class="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                </div>
            </div>
            <div class="flex gap-2 justify-end p-6 border-t bg-gray-50 rounded-b-xl">
                <button type="button" onclick="closeModal('resetPwModal')"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                <button type="submit"
                    class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition">Reset
                    Password</button>
            </div>
        </form>
    </div>
</div>

<!-- Delete User Modal -->
<div id="deleteUserModal" class="modal-overlay fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4">
    <div class="modal-container bg-white rounded-xl max-w-sm w-full p-6 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-trash-alt text-red-500 text-2xl"></i>
        </div>
        <h3 class="font-bold text-lg text-gray-800 mb-2">Hapus User?</h3>
        <p class="text-gray-500 text-sm mb-6">Yakin ingin menghapus <strong id="deleteUserName"></strong>? Tindakan ini
            tidak bisa dibatalkan.</p>
        <form method="POST" class="flex gap-3">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" id="deleteUserId">
            <button type="button" onclick="closeModal('deleteUserModal')"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
            <button type="submit"
                class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">Hapus</button>
        </form>
    </div>
</div>

<script>
    function openModal(id) {
        document.getElementById(id).classList.remove('hidden');
        document.getElementById(id).classList.add('flex');
    }

    function closeModal(id) {
        document.getElementById(id).classList.add('hidden');
        document.getElementById(id).classList.remove('flex');
    }

    function editUser(user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserNama').value = user.nama;
        document.getElementById('editUserUsername').value = user.username;
        document.getElementById('editUserRole').value = user.role;
        openModal('editUserModal');
    }

    function resetPassword(id, nama) {
        document.getElementById('resetPwId').value = id;
        document.getElementById('resetPwName').textContent = nama;
        openModal('resetPwModal');
    }

    function deleteUser(id, nama) {
        document.getElementById('deleteUserId').value = id;
        document.getElementById('deleteUserName').textContent = nama;
        openModal('deleteUserModal');
    }

    // Close modal on outside click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.add('hidden');
                this.classList.remove('flex');
            }
        });
    });
</script>
</body>

</html>