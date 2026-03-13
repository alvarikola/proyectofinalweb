<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Libro extends Model
{
    protected $table = 'libro';

    protected $primaryKey = 'id';

    public $timestamps = false; // porque solo tienes created_at

    protected $fillable = [
        'titulo',
        'autor',
        'sinopsis',
        'fecha_publicacion',
        'genero',
        'cover_url',
        'valoracion',
        'calificaciones'
    ];

    protected $casts = [
        'fecha_publicacion' => 'integer',
        'valoracion' => 'float',
        'calificaciones' => 'integer',
        'created_at' => 'datetime'
    ];
}