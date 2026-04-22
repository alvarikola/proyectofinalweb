import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useRegister } from "@webbydevs/react-laravel-sanctum-auth";

function RegisterSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-[#F5F5DC] min-h-screen flex items-center justify-center py-12">
      <div className="bg-[#FAF9F6] px-6 py-8 sm:rounded-xl shadow-md border border-[#E5E5E5] text-center max-w-md mx-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C97B63]/10 mb-4">
          <svg className="h-6 w-6 text-[#C97B63]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#3A3A3A] mb-2">¡Cuenta creada!</h2>
        <p className="text-[#A8A29E] mb-6">
          Tu registro fue exitoso. Serás redirigido al inicio de sesión...
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full rounded-md bg-[#C97B63] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#b96d56] transition"
        >
          Ir a iniciar sesión ahora
        </button>
      </div>
    </div>
  );
}

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Hook del nuevo paquete
  const { register } = useRegister();
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);
    try {
      // ✅ El paquete espera un objeto con los campos del formulario
      await register({
        nombre,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      setSuccess(true);
      
    } catch (err) {
      // Errores de red o del paquete
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  // Renderizado condicional
  if (success) {
    return <RegisterSuccess />;
  }

  return (
    <div className="bg-[#F5F5DC] min-h-screen">
      <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
        
        {/* TÍTULO */}
        <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-3xl font-extrabold text-[#3A3A3A]">
            Crear cuenta
          </h1>
        </div>

        {/* CARD */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#FAF9F6] px-6 pb-6 pt-8 sm:rounded-xl sm:shadow-md border border-[#E5E5E5]">

            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* NOMBRE */}
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A]">
                  Nombre
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="block w-full rounded-md border border-[#A8A29E] bg-[#FAF9F6] px-3 py-2 text-[#3A3A3A] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#C97B63]"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A]">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
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
                    minLength={8}
                    className="block w-full rounded-md border border-[#A8A29E] bg-[#FAF9F6] px-3 py-2 pr-10 text-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#C97B63]"
                  />
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

              {/* CONFIRMAR CONTRASEÑA */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#3A3A3A]">
                  Confirmar contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="block w-full rounded-md border border-[#A8A29E] bg-[#FAF9F6] px-3 py-2 pr-10 text-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#C97B63]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B705C] hover:text-[#3A3A3A]"
                  >
                    {showConfirmPassword ? (
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

              {/* ERROR */}
              {error && (
                <p className="text-sm text-[#C97B63] text-center font-medium">
                  {error}
                </p>
              )}

              {/* BOTÓN */}
              <div>
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full rounded-md bg-[#C97B63] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#b96d56] focus:outline-none focus:ring-2 focus:ring-[#C97B63] disabled:opacity-50"
                >
                  {cargando ? "Creando cuenta..." : "Registrarse"}
                </button>
              </div>
            </form>

            {/* LINK DE LOGIN */}
            <div className="mt-6 text-center">
              <span className="text-[#A8A29E]">
                ¿Ya tienes cuenta?
              </span>{" "}
              <Link
                to={`/login${location.search}`}
                className="font-semibold text-[#6B705C] hover:underline"
              >
                Iniciar sesión
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}