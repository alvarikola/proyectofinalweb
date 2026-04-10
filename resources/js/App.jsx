import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./paginas/Home";
import Login from "./paginas/Login";
import LibroDetalle from "./paginas/LibroDetalle";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/libro/:id" element={<LibroDetalle />} />
            </Routes>
        </BrowserRouter>
    );
}
