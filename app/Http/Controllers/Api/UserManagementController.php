<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'username', 'nama', 'role', 'created_at')
            ->orderBy('id')
            ->get();
        return response()->json(['success' => true, 'data' => $users]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:50|unique:admin',
            'nama'     => 'required|string|max:100',
            'role'     => 'required|in:super_admin,admin,panitia',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'username' => $request->username,
            'nama'     => $request->nama,
            'role'     => $request->role,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User berhasil ditambahkan', 'data' => $user], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Cannot edit own role
        if ($user->id === auth()->id()) {
            $request->merge(['role' => $user->role]);
        }

        $request->validate([
            'username' => 'required|string|max:50|unique:admin,username,' . $id,
            'nama'     => 'required|string|max:100',
            'role'     => 'required|in:super_admin,admin,panitia',
        ]);

        $user->update($request->only(['username', 'nama', 'role']));

        return response()->json(['message' => 'User berhasil diupdate', 'data' => $user]);
    }

    public function resetPassword(Request $request, $id)
    {
        $request->validate([
            'new_password' => 'required|string|min:6',
        ]);

        $user = User::findOrFail($id);
        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json(['message' => 'Password berhasil direset']);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Tidak bisa menghapus akun sendiri!'], 422);
        }

        $user->delete();
        return response()->json(['message' => 'User berhasil dihapus']);
    }
}
