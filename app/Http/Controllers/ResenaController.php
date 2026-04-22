<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resena;
use App\Models\Libro;

class ResenaController extends Controller
{
    /**
     * Obtener todas las reseñas públicas de un libro
     */
    public function index($idLibro)
    {
        $resenas = Resena::with('usuario')
            ->where('idLibro', $idLibro)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($resenas);
    }

    public function show($id)
    {
        $usuario = request()->user();
        
        if (!$usuario) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Solo puede ver SU propia reseña
        $resena = Resena::with('usuario')
            ->where('id', $id)
            ->where('idUsuario', $usuario->id)
            ->firstOrFail(); // 404 si no existe o no es suya

        return response()->json($resena);
    }

    /**
     * ✅ NUEVO: Obtener la reseña del usuario actual para un libro específico
     */
    public function miResena($idLibro)
    {
        $usuario = request()->user();
        
        if (!$usuario) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Busca SOLO la reseña de ESTE usuario para ESTE libro
        $miResena = Resena::with('usuario')
            ->where('idLibro', $idLibro)
            ->where('idUsuario', $usuario->id)
            ->first();

        return response()->json($miResena); // null si no tiene reseña
    }

    /**
     * Crear nueva reseña
     */
    public function store(Request $request, $idLibro)
    {
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $request->validate([
            'puntuacionEstrellas' => 'required|numeric|between:1,5',
            'contenido' => 'nullable|string|max:2000',
        ]);

        // Evitar que un usuario reseñe el mismo libro dos veces
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

        // Actualizar valoración media del libro
        $media = Resena::where('idLibro', $idLibro)->avg('puntuacionEstrellas');
        $total = Resena::where('idLibro', $idLibro)->count();

        Libro::where('id', $idLibro)->update([
            'valoracion' => round($media, 2),
            'calificaciones' => $total,
        ]);

        return response()->json($resena->load('usuario'), 201);
    }

    /**
     * ✅ NUEVO: Actualizar reseña propia
     */
    public function update(Request $request, $id)
    {
        $usuario = request()->user();
        
        if (!$usuario) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Solo puede editar SU propia reseña
        $resena = Resena::where('id', $id)
                       ->where('idUsuario', $usuario->id)
                       ->firstOrFail();

        $validated = $request->validate([
            'puntuacionEstrellas' => 'required|numeric|between:1,5',
            'contenido' => 'nullable|string|max:2000',
        ]);

        $resena->update($validated);

        // Recalcular valoración del libro
        $media = Resena::where('idLibro', $resena->idLibro)->avg('puntuacionEstrellas');
        $total = Resena::where('idLibro', $resena->idLibro)->count();

        Libro::where('id', $resena->idLibro)->update([
            'valoracion' => round($media, 2),
            'calificaciones' => $total,
        ]);

        return response()->json($resena->load('usuario'));
    }

    /**
     * ✅ NUEVO: Eliminar reseña propia
     */
    public function destroy($id)
    {
        $usuario = request()->user();
        
        if (!$usuario) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Solo puede eliminar SU propia reseña
        $resena = Resena::where('id', $id)
                       ->where('idUsuario', $usuario->id)
                       ->firstOrFail();

        $idLibro = $resena->idLibro;
        $resena->delete();

        // Recalcular valoración del libro
        $media = Resena::where('idLibro', $idLibro)->avg('puntuacionEstrellas');
        $total = Resena::where('idLibro', $idLibro)->count();

        Libro::where('id', $idLibro)->update([
            'valoracion' => $total > 0 ? round($media, 2) : null,
            'calificaciones' => $total,
        ]);

        return response()->json(['message' => 'Reseña eliminada']);
    }
}