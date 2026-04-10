<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau password salah.',
            ], 401);
        }

        // Revoke old tokens
        $user->tokens()->delete();

        $expiration = now()->addHours(8);
        $token = $user->createToken('auth-token', ['*'], $expiration)->plainTextToken;

        // Log activity
        ActivityLog::create([
            'user_id'     => $user->id,
            'action'      => 'LOGIN',
            'description' => 'Login berhasil',
            'ip_address'  => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'user' => [
                    'id'       => $user->id,
                    'username' => $user->username,
                    'nama'     => $user->nama,
                    'role'     => $user->role,
                ],
                'token'      => $token,
                'expires_at' => $expiration->toISOString(),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'id'       => $request->user()->id,
                'username' => $request->user()->username,
                'nama'     => $request->user()->nama,
                'role'     => $request->user()->role,
            ],
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password lama salah.',
            ], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        ActivityLog::create([
            'user_id'     => $user->id,
            'action'      => 'PASSWORD_CHANGE',
            'description' => 'Mengubah password',
            'ip_address'  => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah.',
        ]);
    }
}
