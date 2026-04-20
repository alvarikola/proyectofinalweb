<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;


class Usuario extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'usuario';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'email',
        'password',
        'rol',
        'imagen_perfil',
    ];

    protected $hidden = [
        'password',
    ];

    // ✅ AGREGA ESTO: Convierte 'nombre' en 'name' automáticamente
    public function getNameAttribute()
    {
        return $this->nombre;
    }
}
