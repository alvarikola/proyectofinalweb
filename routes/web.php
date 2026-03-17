<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LibroController;

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!api).*$');