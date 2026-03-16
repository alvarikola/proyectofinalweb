import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss()
    ],
    server: {
        host: true,
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost'
        },
        cors: true
    }
})