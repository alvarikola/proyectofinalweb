import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
        await login(email, password);
        navigate("/");
    } catch (err) {
        setError(err.message);
    } finally {
        setCargando(false);
    }
};

  return (
    <div className="bg-[#F5F5DC] min-h-screen">
      <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
        
        {/* TÍTULO */}
        <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-3xl font-extrabold text-[#3A3A3A]">
            Iniciar sesión
          </h1>
        </div>

        {/* CARD */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#FAF9F6] px-6 pb-6 pt-8 sm:rounded-xl sm:shadow-md border border-[#E5E5E5]">

            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A]">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md border border-[#A8A29E] bg-[#FAF9F6] px-3 py-2 text-[#3A3A3A] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#C97B63]"
                  />
                </div>
              </div>

              {/* CONTRASEÑA */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#3A3A3A]">
                  Contraseña
                </label>

                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border border-[#A8A29E] bg-[#FAF9F6] px-3 py-2 pr-10 text-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#C97B63]"
                  />

                  {/* ICONO OJO */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B705C] hover:text-[#3A3A3A]"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zM10 15a5 5 0 110-10 5 5 0 010 10z" />
                        <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.293 2.293a1 1 0 011.414 0L17.707 16.293a1 1 0 01-1.414 1.414L2.293 3.707a1 1 0 010-1.414zM10 3C5 3 1.73 7.11 1 10c.33 1.31 1.35 3.06 2.93 4.47l1.43-1.43A5 5 0 0110 5c1.07 0 2.05.42 2.78 1.11l1.43-1.43C13.06 3.33 11.31 2.33 10 3zM10 15a5 5 0 01-5-5c0-1.07.42-2.05 1.11-2.78l1.43 1.43A3 3 0 0010 13a3 3 0 002.78-2.11l1.43 1.43A4.97 4.97 0 0110 15z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* BOTÓN */}
              <div>
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full rounded-md bg-[#C97B63] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#b96d56] focus:outline-none focus:ring-2 focus:ring-[#C97B63]"
                >
                  {cargando ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </form>

            {/* REGISTER */}
            <div className="mt-6 text-center">
              <span className="text-[#A8A29E]">
                ¿No tienes cuenta?
              </span>{" "}
              <Link
                to="/register"
                className="font-semibold text-[#6B705C] hover:underline"
              >
                Crear cuenta
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}