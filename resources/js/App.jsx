import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@webbydevs/react-laravel-sanctum-auth";

import Home from "./paginas/Home";
import Login from "./paginas/Login";
import LibroDetalle from "./paginas/LibroDetalle";
import CrearResena from "./paginas/CrearResena";
import Register from "./paginas/Register";
import Perfil from "./paginas/Perfil";

// Configuración del paquete Sanctum
const sanctumConfig = {
  baseUrl: window.location.origin,
  loginUrl: "api/login",
  registerUrl: "api/register",
  logoutUrl: "api/logout",
  csrfCookieUrl: "/sanctum/csrf-cookie",
};

export default function App() {
  return (
    <AuthProvider config={sanctumConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/libro/:id" element={<LibroDetalle />} />
          <Route path="/libro/:id/resena/nueva" element={<CrearResena />} />
          <Route path="/libro/:id/resena/editar" element={<CrearResena />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}