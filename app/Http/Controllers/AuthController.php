<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class AuthController extends Controller
{
    // Funcion para hace login con un usuario existente
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

        $usuario = Auth::user();

        // Devuelve los campos que el frontend espera
        return response()->json([
            'usuario' => [
                'id' => $usuario->id,
                'nombre' => $usuario->nombre,
                'email' => $usuario->email,
                'imagen_perfil' => $usuario->imagen_perfil,
                'rol' => $usuario->rol,
            ],
            'message' => 'Login exitoso'
        ], 200);
    }

    // Funcion para cerrar sesion del usuario actual
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Sesión cerrada']);
    }

    // Funcion para obtener el usuario actual
    public function me(Request $request)
    {
        $usuario = $request->user();
        if (!$usuario) {
            return response()->json(['message' => 'No autenticado'], 401);
        }
        return response()->json([
            'id' => $usuario->id,
            'nombre' => $usuario->nombre,
            'email' => $usuario->email,
            'imagen_perfil' => $usuario->imagen_perfil,
            'rol' => $usuario->rol,
        ]);
    }

    // Funcion para registrar un nuevo usuario
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:usuario,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $usuario = \App\Models\Usuario::create([
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']), // Encriptación de contraseña para laravel
            'rol' => 'user',
        ]);

        return response()->json([
            'usuario' => [
                'id' => $usuario->id,
                'nombre' => $usuario->nombre,
                'email' => $usuario->email,
            ],
            'message' => 'Usuario creado exitosamente'
        ], 201);
    }
}