<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Libro;


class LibroController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10); // libros por página

        $libros = Libro::paginate($perPage);

        return response()->json($libros);
    }
}
