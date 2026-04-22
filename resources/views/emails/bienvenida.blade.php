<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; background: #F5F5DC; margin: 0; padding: 40px 20px; }
        .card { background: #FAF9F6; max-width: 480px; margin: 0 auto; border-radius: 16px; padding: 40px; border: 1px solid #E5E5E5; }
        h1 { color: #3A3A3A; font-size: 24px; margin-bottom: 8px; }
        p { color: #6B705C; font-size: 15px; line-height: 1.6; }
        .btn { display: inline-block; margin-top: 24px; background: #C97B63; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; }
        .footer { margin-top: 32px; font-size: 13px; color: #A8A29E; }
        a { color: #C97B63; text-decoration: none; }
    </style>
</head>
<body>
    <div class="card">
        <h1>¡Bienvenido/a, {{ $usuario->nombre }}! 📚</h1>
        <p>Tu cuenta ha sido creada correctamente. Ya puedes explorar libros, escribir reseñas y compartir tu opinión con la comunidad.</p>
        <a href="{{ config('app.url') }}" class="btn">Ir a la app</a>
        <div class="footer">
            <p>Si no has creado esta cuenta, puedes ignorar este correo.</p>
        </div>
    </div>
</body>
</html>