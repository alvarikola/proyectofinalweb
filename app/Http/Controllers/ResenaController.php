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
        $request->validate([
            'puntuacionEstrellas' => 'required|numeric|between:1,5',
            'contenido' => 'nullable|string',
        ]);

        $resena = Resena::create([
            'idLibro' => $idLibro,
            'idUsuario' => null, // cuando implementes auth: auth()->id()
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

        return response()->json($resena, 201);
    }
}
