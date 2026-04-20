<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resena;
use App\Models\Libro;

class ResenaController extends Controller
{
    public function index($idLibro)
    {
        $resenas = Resena::with('usuario')
            ->where('idLibro', $idLibro)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($resenas);
    }

    public function store(Request $request, $idLibro)
    {
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $request->validate([
            'puntuacionEstrellas' => 'required|numeric|between:1,5',
            'contenido' => 'nullable|string',
        ]);

        // evitar que un usuario reseñe el mismo libro dos veces
        $yaReseño = Resena::where('idLibro', $idLibro)
                         ->where('idUsuario', $usuario->id)
                         ->exists();
        
        if ($yaReseño) {
            return response()->json(['message' => 'Ya has reseñado este libro'], 409);
        }

        $resena = Resena::create([
            'idLibro' => $idLibro,
            'idUsuario' => $usuario->id,
            'puntuacionEstrellas' => $request->puntuacionEstrellas,
            'puntuacionChilis' => null,
            'contenido' => $request->contenido,
        ]);

        // Actualizar valoracion media y numero de calificaciones en libro
        $media = Resena::where('idLibro', $idLibro)->avg('puntuacionEstrellas');
        $total = Resena::where('idLibro', $idLibro)->count();

        Libro::where('id', $idLibro)->update([
            'valoracion' => round($media, 2),
            'calificaciones' => $total,
        ]);

        return response()->json($resena->load('usuario'), 201);
    }
}
