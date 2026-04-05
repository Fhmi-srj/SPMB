<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfilController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        return response()->json([
            'id'       => $user->id,
            'username' => $user->username,
            'nama'     => $user->nama,
            'role'     => $user->role,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'nama'     => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:users,username,' . $user->id,
        ]);

        $user->update($request->only(['nama', 'username']));

        return response()->json(['message' => 'Profil berhasil diupdate']);
    }

    public function updatePassword(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Password lama salah!'], 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json(['message' => 'Password berhasil diubah']);
    }
}
