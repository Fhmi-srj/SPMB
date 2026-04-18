<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class PasswordResetController extends Controller
{
    // ─── REQUEST RESET (kirim link via WhatsApp) ─────────────────
    public function requestReset(Request $request)
    {
        $request->validate([
            'no_hp' => 'required|string',
        ]);

        $noHp = preg_replace('/[^0-9]/', '', $request->no_hp);

        // Try multiple phone formats
        $phoneFormats = [];
        if (str_starts_with($noHp, '62')) {
            $phoneFormats = [$noHp, '+' . $noHp, '0' . substr($noHp, 2), substr($noHp, 2)];
        } elseif (str_starts_with($noHp, '0')) {
            $phoneFormats = [$noHp, '62' . substr($noHp, 1), '+62' . substr($noHp, 1), substr($noHp, 1)];
        } else {
            $phoneFormats = [$noHp, '0' . $noHp, '62' . $noHp, '+62' . $noHp];
        }

        $user = null;
        foreach ($phoneFormats as $tryPhone) {
            $found = Pendaftaran::where('no_hp_wali', $tryPhone)->first();
            if ($found) { $user = $found; break; }
        }

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Nomor HP tidak terdaftar dalam sistem'], 404);
        }

        // Generate token
        $token = substr(bin2hex(random_bytes(5)), 0, 9);
        $expires = now()->addHour();

        $user->update([
            'reset_token'         => $token,
            'reset_token_expires' => $expires,
        ]);

        // Build reset link
        $resetLink = url("/reset-password?token={$token}");

        // Send WA via MPWA
        $mpwaUrl = config('services.mpwa.url', env('MPWA_URL'));
        $mpwaApiKey = config('services.mpwa.api_key', env('MPWA_API_KEY'));
        $mpwaSender = config('services.mpwa.sender', env('MPWA_SENDER'));

        if ($mpwaUrl) {
            $message = "Halo {$user->nama},\n\nAnda meminta reset password PSB.\nKlik link berikut untuk membuat password baru:\n{$resetLink}\n\nLink ini berlaku selama 1 jam.\nJika Anda tidak meminta reset password, abaikan pesan ini.";

            try {
                Http::post($mpwaUrl, [
                    'api_key' => $mpwaApiKey,
                    'sender'  => $mpwaSender,
                    'number'  => $user->no_hp_wali,
                    'message' => $message,
                ]);
            } catch (\Exception $e) {
                // Silent fail - link still valid
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Link reset password telah dikirim ke WhatsApp Anda',
            'data'    => ['nama' => $user->nama],
        ]);
    }

    // ─── VALIDATE TOKEN ──────────────────────────────────────────
    public function validateToken(Request $request)
    {
        $token = $request->token;
        if (!$token) {
            return response()->json(['success' => false, 'message' => 'Token tidak valid'], 400);
        }

        $user = Pendaftaran::where('reset_token', $token)
            ->where('reset_token_expires', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Link sudah kadaluarsa atau tidak valid'], 400);
        }

        return response()->json([
            'success' => true,
            'data'    => ['nama' => $user->nama],
        ]);
    }

    // ─── RESET PASSWORD ──────────────────────────────────────────
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = Pendaftaran::where('reset_token', $request->token)
            ->where('reset_token_expires', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Token tidak valid atau sudah kadaluarsa'], 400);
        }

        $user->update([
            'password'             => Hash::make($request->password),
            'reset_token'          => null,
            'reset_token_expires'  => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah. Silakan login dengan password baru.',
        ]);
    }
}
