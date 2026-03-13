# Laravel + React Blueprint

## Visión General

Este documento describe los pasos para integrar React.js en un proyecto Laravel existente, reemplazando las vistas de Blade como motor de frontend principal.

## Plan de Implementación Actual

### 1. Instalar Dependencias de React

- Instalar `react` y `react-dom`.
- Instalar `@vitejs/plugin-react` para la integración con Vite.

### 2. Configurar Vite para React

- Actualizar `vite.config.js` para usar el plugin de React.
- Cambiar el punto de entrada en `vite.config.js` de `resources/js/app.js` a `resources/js/app.jsx`.

### 3. Crear Componentes de React

- Crear un componente `App.jsx` de ejemplo en `resources/js/`.
- Crear el archivo `resources/js/app.jsx` para renderizar el componente `App`.

### 4. Actualizar la Vista de Blade

- Modificar `resources/views/welcome.blade.php` para que sirva como punto de entrada para la aplicación de React.
- Añadir un `<div>` con `id="app"` donde se montará la aplicación de React.
- Cargar el nuevo script `resources/js/app.jsx` usando la directiva `@vite`.

### 5. Limpieza

- Eliminar el archivo `resources/js/app.js` que ya no es necesario.
