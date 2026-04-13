<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resena extends Model
{
    protected $table = 'resena';
    protected $primaryKey = 'id';

    protected $fillable = [
        'puntuacionEstrellas',
        'puntuacionChilis',
        'contenido',
        'idUsuario',
        'idLibro',
    ];

    protected $casts = [
        'puntuacionEstrellas' => 'float',
        'puntuacionChilis' => 'float',
        'created_at' => 'datetime',
    ];

    public $timestamps = false;

    public function libro()
    {
        return $this->belongsTo(Libro::class, 'idLibro');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario');
    }
}
