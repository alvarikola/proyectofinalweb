<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Libro;


class LibroController extends Controller
{
    // Devolver todos los libros ordenados por paginas, en cada una hay 12 libros
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 12); // libros por página
        $search = $request->get('search');
        $query = Libro::query();

        // Buscar libros
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('titulo', 'ILIKE', '%' . $search . '%')
                  ->orWhere('autor', 'ILIKE', '%' . $search . '%');
            });
        }

        // Ordenar libros por valoración
        $libros = $query
            ->orderByRaw('valoracion IS NULL, valoracion DESC')
            ->paginate($perPage);

        return response()->json($libros);
    }

    // Mostrar un libro en específico
    public function show($id)
    {
        $libro = Libro::findOrFail($id);
        return response()->json($libro);
    }

    
    // Obtener los 5 libros mejor valorados, teniendo en cuenta la valoración total del libro y número de calificaciones
    public function topValorados()
    {
        $libros = Libro::whereNotNull('valoracion')
            ->where('calificaciones', '>', 0)
            ->selectRaw('*, (valoracion * calificaciones) / (calificaciones + 10) AS score_ponderado')
            ->orderByDesc('score_ponderado')
            ->limit(5)
            ->get();

        return response()->json($libros);
    }
}
