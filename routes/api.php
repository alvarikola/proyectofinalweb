<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LibroController;
use App\Http\Controllers\ResenaController;

Route::get('/libros', [LibroController::class, 'index']);
Route::get('/libros/{id}', [LibroController::class, 'show']);

Route::get('/libros/{id}/resenas', [ResenaController::class, 'index']);
Route::post('/libros/{id}/resenas', [ResenaController::class, 'store']);