<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use Illuminate\Support\Facades\Mail;
use App\Mail\BienvenidaMail;

class AuthController extends Controller
{
    // Login con usuario existente
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $request->session()->regenerate();
        $user = Auth::user();

        // ✅ CORRECTO: Devuelve SOLO el objeto user (sin envolver)
        return response()->json([
            'id' => $user->id,
            'name' => $user->nombre,
            'email' => $user->email,
            'imagen_perfil' => $user->imagen_perfil,
            'rol' => $user->rol,
        ]);
    }

    // Cerrar sesión
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Sesión cerrada']);
    }

    // Obtener usuario actual
    public function me(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }
        
        // ✅ Devuelve 'name' mapeado desde 'nombre'
        return response()->json([
            'id' => $user->id,
            'name' => $user->nombre,
            'email' => $user->email,
            'imagen_perfil' => $user->imagen_perfil,
            'rol' => $user->rol,
        ]);
    }

    // Registrar nuevo usuario
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:usuario,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = \App\Models\Usuario::create([
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'rol' => 'user',
        ]);

        // Enviar correo de bienvenida
        Mail::to($user->email)->send(new BienvenidaMail($user));

        // Devuelve 'user' con 'name' mapeado
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->nombre,
                'email' => $user->email,
                'imagen_perfil' => $user->imagen_perfil,
            ],
            'message' => 'Usuario creado exitosamente'
        ], 201);
    }
}