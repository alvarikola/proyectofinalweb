import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth, useApiClient } from "@webbydevs/react-laravel-sanctum-auth";
import MyNavBar from "../componentes/MyNavBar";

const MODULOS = [
    { key: "personajes", label: "Personajes", emoji: "✨" },
    { key: "musica", label: "Música Recomendada", emoji: "🎧" },
    { key: "citas", label: "Citas Favoritas", emoji: "💬" },
    { key: "spoilers", label: "Alerta de Spoilers", emoji: "⚠️" },
    { key: "comparacion", label: "Comparar con Otros Libros", emoji: "📊" },
    { key: "momentos", label: "Momentos Clave", emoji: "💥" },
];

export default function CrearResena() {
    const { id } = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Hooks del nuevo paquete
    const { user } = useAuth();
    const apiClient = useApiClient();
    
    // Detectar modo edición desde la URL: /libro/:id/resena/editar?resenaId=123
    const esEdicion = location.pathname.includes('/editar');
    const resenaId = searchParams.get('resenaId');
    
    const [puntuacion, setPuntuacion] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [modulosActivos, setModulosActivos] = useState([]);
    const [contenido, setContenido] = useState({ general: "" });
    const [enviando, setEnviando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(esEdicion); // Si es edición, cargamos datos

    // Cargar datos si es edición
    useEffect(() => {
        if (!esEdicion || !resenaId) {
            setCargando(false);
            return;
        }

        // ✅ useApiClient maneja automáticamente cookies y CSRF
        apiClient.get(`/api/resenas/${resenaId}`)
            .then(({ data }) => {
                setPuntuacion(data.puntuacionEstrellas);
                
                // Parsear contenido JSON si está stringificado
                try {
                    const parsed = JSON.parse(data.contenido);
                    setContenido(parsed);
                    setModulosActivos(Object.keys(parsed).filter(k => k !== "general"));
                } catch {
                    setContenido({ general: data.contenido });
                }
            })
            .catch(err => {
                console.error("Error cargando reseña:", err);
                setError("No se pudo cargar tu reseña");
            })
            .finally(() => setCargando(false));
    }, [esEdicion, resenaId, apiClient]);

    const toggleModulo = (key) => {
        if (modulosActivos.includes(key)) {
            setModulosActivos(prev => prev.filter(m => m !== key));
            setContenido(prev => {
                const nuevo = { ...prev };
                delete nuevo[key];
                return nuevo;
            });
        } else {
            setModulosActivos(prev => [...prev, key]);
            setContenido(prev => ({ ...prev, [key]: "" }));
        }
    };

    const handleContenido = (key, value) => {
        setContenido(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (puntuacion === 0) return setError("Selecciona una puntuación");
        if (!contenido.general?.trim()) return setError("Escribe tu opinión general");

        setError("");
        setEnviando(true);

        try {
            const method = esEdicion ? "PUT" : "POST";
            const url = esEdicion 
                ? `/api/resenas/${resenaId}`
                : `/api/libros/${id}/resenas`;

            // ✅ useApiClient maneja automáticamente cookies y CSRF
            const { data } = await apiClient({
                method,
                url,
                headers: { "Content-Type": "application/json" },
                data: {
                    puntuacionEstrellas: puntuacion,
                    contenido: JSON.stringify(contenido),
                },
            });

            navigate(`/libro/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error al guardar");
        } finally {
            setEnviando(false);
        }
    };

    const handleEliminar = async () => {
        if (!resenaId || !confirm("¿Eliminar tu reseña? Esta acción no se puede deshacer.")) return;
        
        setEliminando(true);
        try {
            // ✅ useApiClient maneja automáticamente cookies y CSRF
            await apiClient.delete(`/api/resenas/${resenaId}`);
            navigate(`/libro/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error al eliminar");
        } finally {
            setEliminando(false);
        }
    };

    // Loading state para edición
    if (cargando) {
        return (
            <div className="bg-[#F5F5DC] min-h-screen flex items-center justify-center">
                <p className="text-[#A8A29E]">Cargando tu reseña...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#F5F5DC] min-h-screen text-[#3A3A3A]">
            <MyNavBar onSearch={() => {}} />

            <div className="max-w-2xl mx-auto px-6 py-12">
                <h1 className="text-2xl font-bold mb-8 text-center">
                    {esEdicion ? "Editar tu reseña" : "Crear nueva reseña"}
                </h1>

                <div className="bg-[#FAF9F6] rounded-2xl shadow-md p-8 space-y-8">

                    {/* Puntuación */}
                    <div>
                        <h2 className="text-sm font-semibold text-[#6B705C] mb-3">Tu Puntuación</h2>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(estrella => (
                                <button
                                    key={estrella}
                                    type="button"
                                    onClick={() => setPuntuacion(estrella)}
                                    onMouseEnter={() => setHovered(estrella)}
                                    onMouseLeave={() => setHovered(0)}
                                >
                                    <svg className="w-8 h-8" viewBox="0 0 20 20">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
                                            fill={(hovered || puntuacion) >= estrella ? "#FACC15" : "#E5E5E5"}
                                        />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Opinión general */}
                    <div>
                        <h2 className="text-sm font-semibold text-[#6B705C] mb-3">Tu Opinión</h2>
                        <textarea
                            value={contenido.general || ""}
                            onChange={e => handleContenido("general", e.target.value)}
                            placeholder="Escribe tu reseña aquí..."
                            className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm resize-none h-36 focus:outline-none focus:ring-2 focus:ring-[#C97B63] bg-white"
                        />
                    </div>

                    {/* Módulos */}
                    <div>
                        <h2 className="text-sm font-semibold text-[#6B705C] mb-1">Añadir Módulos</h2>
                        <p className="text-xs text-[#A8A29E] mb-4">Agrega bloques a tu reseña</p>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {MODULOS.map(({ key, label, emoji }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => toggleModulo(key)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition
                                        ${modulosActivos.includes(key)
                                            ? "bg-[#C97B63] text-white border-[#C97B63]"
                                            : "bg-white text-[#3A3A3A] border-[#E5E5E5] hover:border-[#C97B63]"
                                        }`}
                                >
                                    <span>{emoji}</span> {label}
                                </button>
                            ))}
                        </div>

                        {/* Textareas de módulos activos */}
                        <div className="space-y-4">
                            {MODULOS.filter(m => modulosActivos.includes(m.key)).map(({ key, label, emoji }) => (
                                <div key={key}>
                                    <h3 className="text-sm font-semibold text-[#6B705C] mb-2">{emoji} {label}</h3>
                                    <textarea
                                        value={contenido[key] || ""}
                                        onChange={e => handleContenido(key, e.target.value)}
                                        placeholder={`Escribe sobre ${label.toLowerCase()}...`}
                                        className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-[#C97B63] bg-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-[#C97B63] text-center font-medium">{error}</p>
                    )}

                    {/* Botones de acción */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={enviando}
                            className="flex-1 bg-[#C97B63] text-white py-3 rounded-xl font-semibold hover:bg-[#b96d56] transition disabled:opacity-50"
                        >
                            {enviando ? "Guardando..." : (esEdicion ? "Guardar cambios" : "Publicar reseña")}
                        </button>
                        
                        {esEdicion && (
                            <button
                                type="button"
                                onClick={handleEliminar}
                                disabled={eliminando}
                                className="px-6 py-3 rounded-xl font-semibold text-[#C97B63] border border-[#C97B63] hover:bg-[#C97B63]/10 transition disabled:opacity-50"
                            >
                                {eliminando ? "..." : "Eliminar"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}