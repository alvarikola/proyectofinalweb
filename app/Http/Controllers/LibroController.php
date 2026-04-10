<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Libro;


class LibroController extends Controller
{
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

    public function show($id)
    {
        $libro = Libro::findOrFail($id);
        return response()->json($libro);
    }
}
