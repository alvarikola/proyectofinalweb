import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./paginas/Home";
import Login from "./paginas/Login";
import LibroDetalle from "./paginas/LibroDetalle";
import CrearResena from "./paginas/CrearResena";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/libro/:id" element={<LibroDetalle />} />
                <Route path="/libro/:id/resena/nueva" element={<CrearResena />} />
            </Routes>
        </BrowserRouter>
    );
}
