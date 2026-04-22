<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LibroController;
use App\Http\Controllers\ResenaController;
use App\Http\Controllers\AuthController;

// Rutas públicas
Route::get('/libros', [LibroController::class, 'index']); {/* Ruta para obtener todos los libros */}
Route::get('/libros/{id}', [LibroController::class, 'show']); {/* Ruta para obtener un libro específico */}
Route::get('/libros/{id}/resenas', [ResenaController::class, 'index']); {/* Ruta para obtener todas las reseñas de un libro */}

// Rutas de autentificación
Route::get('/login', [AuthController::class, 'login']); {/* Ruta para obtener la página de login */}
Route::post('/login', [AuthController::class, 'login']); {/* Ruta para iniciar sesión */}
Route::post('/register', [AuthController::class, 'register']); {/* Ruta para registrar un nuevo usuario */}


{/* Ruta protegida con autenticación */}
Route::middleware('auth:web')->group(function () { 

    Route::post('/libros/{id}/resenas', [ResenaController::class, 'store']); {/* Ruta para crear una nueva reseña */}

    Route::post('/logout', [AuthController::class, 'logout']); {/* Ruta para cerrar sesión */}

    Route::get('/me', [AuthController::class, 'me']); {/* Ruta para obtener información del usuario actual */}
    Route::put('/me', [AuthController::class, 'updateProfile']);
    
    Route::get('/resenas/{id}', [ResenaController::class, 'show']);

    Route::get('/mis-resenas/libro/{idLibro}', [ResenaController::class, 'miResena']);
    Route::put('/resenas/{id}', [ResenaController::class, 'update']);
    Route::delete('/resenas/{id}', [ResenaController::class, 'destroy']);

});