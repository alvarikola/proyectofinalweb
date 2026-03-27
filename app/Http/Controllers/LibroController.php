<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Libro;


class LibroController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 12); // libros por página

        $libros = Libro::orderByRaw('valoracion IS NULL, valoracion DESC')
            ->paginate($perPage);

        return response()->json($libros);
    }
}
