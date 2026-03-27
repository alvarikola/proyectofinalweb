<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

// comando para insertar libros: php artisan app:insertar-libros
class InsertarLibros extends Command
{
    protected $signature = 'app:insertar-libros';
    protected $description = 'Importa libros desde Goodreads y los inserta en Supabase';

    public function handle()
    {
        $this->info('Importando libros...');

        $offset = 0;
        $limite = 10;
        $totalInsertados = 0;

        do {
            $this->info("Procesando libros {$offset} - " . ($offset + $limite) . "...");

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('SUPABASE_SERVICE_ROLE_KEY'),
                'Content-Type' => 'application/json',
            ])->timeout(120)->post(env('SUPABASE_FUNCTION_URL'), [
                'offset' => $offset,
                'limite' => $limite,
            ]);

            $data = $response->json();
            $this->info('Resultado lote: ' . json_encode($data));

            $totalInsertados += $data['insertados'] ?? 0;
            $totalItems = $data['total_items'] ?? 0;

            $offset += $limite;

        } while ($offset < $totalItems);

        $this->info("✅ Total insertados: {$totalInsertados}");

        return Command::SUCCESS;
    }
}