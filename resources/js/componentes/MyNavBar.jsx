import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importa el contexto

// Barra de búsqueda del navBar
function MySearchBar({ onSearch }) {
    const [expanded, setExpanded] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);

    const handleIconClick = () => {
        setExpanded(true);
        inputRef.current?.focus();
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch?.(value);
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                placeholder="Buscar..."
                value={query}
                onChange={handleChange}
                className={`bg-[#FAF9F6] border border-[#A8A29E] h-10 px-5 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C97B63] transition-all duration-300 ${
                    expanded ? "w-64" : "w-12"
                }`}
                onFocus={() => setExpanded(true)}
                onBlur={(e) => {
                    if (e.target.value === "") setExpanded(false);
                }}
            />
            <button type="button" onClick={handleIconClick} className="absolute right-0 top-0 mt-3 mr-4">
                <svg className="h-4 w-4 fill-[#6B705C]">
                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                </svg>
            </button>
        </div>
    );
}

// Funcion del navBar
export default function MyNavBar({ onSearch }) {
    const { usuario, logout } = useAuth(); // Obtener estado de autenticación
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <header className="sticky top-0 z-30 mx-auto w-full max-w-screen-md border border-[#E5E5E5] bg-[#FAF9F6]/90 py-3 shadow-md backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
            <div className="px-4">
                <div className="flex items-center justify-between">
                    {/* LOGO */}
                    <div className="flex shrink-0">
                        <Link to="/" className="flex items-center">
                            <img className="h-7 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Logo" />
                            <p className="sr-only">Website Title</p>
                        </Link>
                    </div>

                    {/* MENÚ CENTRAL */}
                    <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
                        <Link
                            to="/leidos"
                            className="inline-block rounded-lg px-3 py-1 text-sm font-medium text-[#3A3A3A] transition hover:bg-[#F5F5DC] hover:text-[#6B705C]"
                        >
                            Leídos
                        </Link>
                        <Link
                            to="/por-leer"
                            className="inline-block rounded-lg px-3 py-1 text-sm font-medium text-[#3A3A3A] transition hover:bg-[#F5F5DC] hover:text-[#6B705C]"
                        >
                            Por leer
                        </Link>
                    </div>

                    {/* ACCIONES DERECHA */}
                    <div className="flex items-center justify-end gap-3">
                        <MySearchBar onSearch={onSearch} />

                        {/* USUARIO LOGUEADO */}
                        {usuario ? (
                        <div className="relative">
                            {/* Avatar con dropdown */}
                            <button
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C97B63] text-white font-semibold text-sm shadow-sm hover:bg-[#b96d56] transition overflow-hidden"
                            title={usuario.nombre || usuario.email}
                            >
                            {usuario.imagen_perfil ? (
                                // Muestra imagen si existe
                                <img
                                src={usuario.imagen_perfil}
                                alt="Avatar"
                                className="h-full w-full object-cover"
                                />
                            ) : (
                                // Muestra iniciales si no hay imagen
                                <span>
                                {usuario.nombre?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                            )}
                            </button>

                            {/* Dropdown menú */}
                            {menuAbierto && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(false)} />
                                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#FAF9F6] border border-[#E5E5E5] shadow-lg py-1 z-20">
                                <div className="px-4 py-2 border-b border-[#E5E5E5]">
                                    <p className="text-sm font-medium text-[#3A3A3A] truncate">
                                    {usuario.nombre || "Usuario"}
                                    </p>
                                    <p className="text-xs text-[#A8A29E] truncate">
                                    {usuario.email}
                                    </p>
                                </div>
                                <Link
                                    to="/perfil"
                                    className="block px-4 py-2 text-sm text-[#3A3A3A] hover:bg-[#F5F5DC] hover:text-[#6B705C]"
                                    onClick={() => setMenuAbierto(false)}
                                >
                                    Mi perfil
                                </Link>
                                <Link
                                    to="/mis-libros"
                                    className="block px-4 py-2 text-sm text-[#3A3A3A] hover:bg-[#F5F5DC] hover:text-[#6B705C]"
                                    onClick={() => setMenuAbierto(false)}
                                >
                                    Mis libros
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-[#C97B63] hover:bg-[#F5F5DC]"
                                >
                                    Cerrar sesión
                                </button>
                                </div>
                            </>
                            )}
                        </div>
                        ) : (
                        /* BOTÓN LOGIN */
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center rounded-xl bg-[#C97B63] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b96d56]"
                        >
                            Login
                        </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}