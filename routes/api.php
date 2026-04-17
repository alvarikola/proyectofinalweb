<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LibroController;
use App\Http\Controllers\ResenaController;
use App\Http\Controllers\AuthController;

Route::get('/libros', [LibroController::class, 'index']); {/* Ruta para obtener todos los libros */}
Route::get('/libros/{id}', [LibroController::class, 'show']); {/* Ruta para obtener un libro específico */}

Route::get('/libros/{id}/resenas', [ResenaController::class, 'index']); {/* Ruta para obtener todas las reseñas de un libro */}
Route::post('/libros/{id}/resenas', [ResenaController::class, 'store']); {/* Ruta para crear una nueva reseña */}

Route::get('/login', [AuthController::class, 'login']); {/* Ruta para obtener la página de login */}
Route::post('/login', [AuthController::class, 'login']); {/* Ruta para iniciar sesión */}
Route::post('/register', [AuthController::class, 'register']); {/* Ruta para registrar un nuevo usuario */}

{/* Ruta protegida con autenticación */}
Route::middleware('auth:sanctum')->group(function () { 
    Route::post('/logout', [AuthController::class, 'logout']); {/* Ruta para cerrar sesión */}

    Route::get('/me', [AuthController::class, 'me']); {/* Ruta para obtener información del usuario actual */}
});