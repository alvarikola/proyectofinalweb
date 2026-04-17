import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./paginas/Home";
import Login from "./paginas/Login";
import LibroDetalle from "./paginas/LibroDetalle";
import CrearResena from "./paginas/CrearResena";
import { AuthProvider } from "./context/AuthContext";
import Register from "./paginas/Register";




export default function App() {
    return (
        <AuthProvider> {/* Envuelve el arbol de rutas para el contexto de autenticación */}
            <BrowserRouter> {/* Envuelve el arbol de rutas con el router */}
                <Routes> {/* Envuelve las rutas dentro del router */}
                    <Route path="/" element={<Home />} /> {/* Ruta principal */}
                    <Route path="/login" element={<Login />} /> {/* Ruta de login */}
                    <Route path="/register" element={<Register />} /> {/* Ruta de registro */}
                    <Route path="/libro/:id" element={<LibroDetalle />} /> {/* Ruta de detalle de libro */}
                    <Route path="/libro/:id/resena/nueva" element={<CrearResena />} /> {/* Ruta de crear reseña */}
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
