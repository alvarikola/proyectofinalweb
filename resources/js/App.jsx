import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@webbydevs/react-laravel-sanctum-auth";

import Home from "./paginas/Home";
import Login from "./paginas/Login";
import LibroDetalle from "./paginas/LibroDetalle";
import CrearResena from "./paginas/CrearResena";
import Register from "./paginas/Register";

// Configuración del paquete Sanctum
const sanctumConfig = {
  baseUrl: "https://8000-firebase-proyectofinal-1773404425378.cluster-64pjnskmlbaxowh5lzq6i7v4ra.cloudworkstations.dev",
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}