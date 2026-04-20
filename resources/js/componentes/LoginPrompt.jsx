import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPrompt({ onClose, libroId }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginNow = () => {
    const from = location.pathname + location.search;
    navigate(`/login?from=${encodeURIComponent(from)}`);
  };

  const handleRegisterNow = () => {
    const from = location.pathname + location.search;
    navigate(`/register?from=${encodeURIComponent(from)}`);
  };

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className="fixed inset-0 bg-[#3A3A3A]/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="relative bg-[#FAF9F6] rounded-2xl shadow-xl border border-[#E5E5E5] max-w-md w-full p-6 animate-fade-in">
          
          {/* Icono de candado */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C97B63]/10 mb-4">
            <svg className="h-7 w-7 text-[#C97B63]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Título y mensaje */}
          <h3 className="text-xl font-bold text-[#3A3A3A] text-center mb-2">
            ¡Regístrate para reseñar!
          </h3>
          <p className="text-[#A8A29E] text-center mb-6">
            Para compartir tu opinión sobre este libro, necesitas tener una cuenta. 
            Es rápido y gratuito.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRegisterNow}
              className="w-full rounded-xl bg-[#C97B63] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#b96d56] transition"
            >
              Registrarse gratis
            </button>
            
            <button
              onClick={handleLoginNow}
              className="w-full rounded-xl bg-[#F5F5DC] border border-[#E5E5E5] px-4 py-3 text-sm font-semibold text-[#6B705C] hover:bg-[#E5E5E5] transition"
            >
              Ya tengo cuenta → Iniciar sesión
            </button>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#A8A29E] hover:text-[#6B705C] transition"
            title="Cerrar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}