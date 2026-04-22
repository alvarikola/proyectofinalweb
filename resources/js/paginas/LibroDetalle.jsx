import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, useApiClient } from "@webbydevs/react-laravel-sanctum-auth"; // ← Nuevos hooks
import MyNavBar from "../componentes/MyNavBar";
import ResenaCard from "../componentes/ResenaCard";
import LoginPrompt from "../componentes/LoginPrompt";

export default function LibroDetalle() {
    const { id } = useParams();
    const location = useLocation();
    
    const [libro, setLibro] = useState(null);
    const [resenas, setResenas] = useState([]);
    
    // ✅ Hooks del nuevo paquete
    const { user } = useAuth(); // ← user en vez de usuario
    const apiClient = useApiClient(); // ← Axios pre-configurado con cookies/CSRF
    
    const navigate = useNavigate();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    
    // Estado para la reseña del usuario actual
    const [miResena, setMiResena] = useState(null);
    const [cargandoMiResena, setCargandoMiResena] = useState(false);

    // Cargar datos del libro y reseñas públicas
    useEffect(() => {
        // Libros y reseñas son públicos → no necesitan auth
        fetch(`/api/libros/${id}`, { headers: { Accept: 'application/json' } })
            .then(r => r.json())
            .then(setLibro)
            .catch(err => console.error('Error cargando libro:', err));
            
        cargarResenas();
    }, [id]);

    // Cargar MI reseña si estoy logueado
    useEffect(() => {
        let isMounted = true; // Para evitar actualizaciones si el componente se desmonta
        
        if (!user) {
            setMiResena(null);
            setCargandoMiResena(false);
            return;
        }
        
        setCargandoMiResena(true);
        
        // ✅ Usar fetch con credentials para enviar cookies
        fetch(`/api/mis-resenas/libro/${id}`, {
            credentials: "include",
            headers: { 
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(async (r) => {
                if (r.status === 401) {
                    console.warn("⚠️ No autenticado - sesión expirada");
                    return null;
                }
                if (r.status === 404) {
                    console.log("Reseña no encontrada (usuario no tiene reseña)");
                    return null;
                }
                if (!r.ok) {
                    throw new Error(`Error ${r.status}: ${r.statusText}`);
                }
                return r.json();
            })
            .then((data) => {
                if (isMounted) {
                    console.log("📝 Mi reseña cargada:", data);
                    setMiResena(data); // null si no tiene, objeto si tiene
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error("❌ Error cargando mi reseña:", err);
                    setMiResena(null);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setCargandoMiResena(false);
                }
            });
        
        return () => {
            isMounted = false; // Cleanup
        };
    }, [user, id]); // ← Solo dependencias esenciales

    const cargarResenas = () => {
        fetch(`/api/libros/${id}/resenas`, { headers: { Accept: 'application/json' } })
            .then(r => r.json())
            .then(setResenas)
            .catch(err => console.error('Error cargando reseñas:', err));
    };

    const Estrellas = ({ rating }) => (
        <div className="flex gap-0.5">
            {[1,2,3,4,5].map(estrella => {
                let tipo = "empty";
                if (rating >= estrella) tipo = "full";
                else if (rating >= estrella - 0.5) tipo = "half";

                return (
                    <svg key={estrella} className="w-4 h-4" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" fill="#E5E5E5" />
                        {tipo === "full" && <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" fill="#FACC15" />}
                        {tipo === "half" && <>
                            <defs>
                                <linearGradient id={`half-${estrella}`}>
                                    <stop offset="50%" stopColor="#FACC15" />
                                    <stop offset="50%" stopColor="#E5E5E5" />
                                </linearGradient>
                            </defs>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" fill={`url(#half-${estrella})`} />
                        </>}
                    </svg>
                );
            })}
        </div>
    );

    if (!libro) return (
        <div className="bg-[#F5F5DC] min-h-screen flex items-center justify-center">
            <p className="text-[#A8A29E]">Cargando...</p>
        </div>
    );

    return (
        <div className="bg-[#F5F5DC] min-h-screen text-[#3A3A3A]">
            <MyNavBar onSearch={() => {}} />

            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Info del libro */}
                <div className="bg-[#FAF9F6] rounded-2xl shadow-md p-8 flex gap-8 mb-8">
                    <div className="w-44 flex-shrink-0">
                        {libro.cover_url
                            ? <img src={libro.cover_url} alt={libro.titulo} className="w-full rounded-xl shadow-md object-contain" />
                            : <div className="w-full h-64 bg-[#E5E5E5] rounded-xl flex items-center justify-center">
                                <span className="text-[#A8A29E] text-sm">Sin imagen</span>
                              </div>
                        }
                        <div className="mt-4 flex flex-col items-center gap-1">
                            <Estrellas rating={libro.valoracion ?? 0} />
                            <span className="text-sm text-[#A8A29E]">
                                {libro.valoracion ? libro.valoracion.toFixed(1) : "Sin valorar"}
                            </span>
                            {libro.calificaciones > 0 && (
                                <span className="text-xs text-[#A8A29E]">{libro.calificaciones} calificaciones</span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                        <h1 className="text-2xl font-bold leading-tight">{libro.titulo}</h1>
                        <p className="text-[#A8A29E] text-sm">{libro.autor}</p>
                        <div className="flex gap-2 flex-wrap mt-1">
                            {libro.genero && (() => {
                                try {
                                    const generos = JSON.parse(libro.genero);
                                    return generos.map((g, i) => (
                                        <span key={i} className="bg-[#F5F5DC] border border-[#E5E5E5] text-[#6B705C] text-xs px-3 py-1 rounded-full">{g}</span>
                                    ));
                                } catch {
                                    return <span className="bg-[#F5F5DC] border border-[#E5E5E5] text-[#6B705C] text-xs px-3 py-1 rounded-full">{libro.genero}</span>;
                                }
                            })()}
                            {libro.fecha_publicacion && (
                                <span className="bg-[#F5F5DC] border border-[#E5E5E5] text-[#6B705C] text-xs px-3 py-1 rounded-full">{libro.fecha_publicacion}</span>
                            )}
                            {libro.isbn && (
                                <span className="bg-[#F5F5DC] border border-[#E5E5E5] text-[#6B705C] text-xs px-3 py-1 rounded-full">ISBN: {libro.isbn}</span>
                            )}
                        </div>
                        {libro.sinopsis && (
                            <div className="mt-2">
                                <h2 className="text-sm font-semibold text-[#6B705C] mb-1">Sinopsis</h2>
                                <div className="text-sm leading-relaxed text-[#3A3A3A]" dangerouslySetInnerHTML={{ __html: libro.sinopsis }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* ✅ BOTÓN CONDICIONAL: Crear o Editar reseña */}
                <div className="flex justify-end mb-6">
                    {user ? (
                        cargandoMiResena ? (
                            <button disabled className="bg-[#E5E5E5] text-[#A8A29E] px-5 py-2 rounded-xl text-sm font-semibold">
                                Cargando...
                            </button>
                        ) : miResena && miResena.id ? (
                            // ✅ TIENE RESEÑA → Botón "Editar"
                            <Link
                                to={`/libro/${id}/resena/editar?resenaId=${miResena.id}`}
                                className="bg-[#6B705C] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#5a5f4d] transition"
                            >
                                ✏️ Editar tu reseña
                            </Link>
                        ) : (
                            // ✅ NO TIENE RESEÑA → Botón "Escribir"
                            <Link
                                to={`/libro/${id}/resena/nueva`}
                                className="bg-[#C97B63] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#b96d56] transition"
                            >
                                Escribir reseña
                            </Link>
                        )
                    ) : (
                        // 🔓 No logueado → Abre LoginPrompt
                        <button
                            onClick={() => setShowLoginPrompt(true)}
                            className="bg-[#F5F5DC] text-[#6B705C] border border-[#E5E5E5] px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#E5E5E5] transition"
                        >
                            Escribir reseña
                        </button>
                    )}
                </div>
                
                {/* Reseñas */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#3A3A3A]">
                        Reseñas {resenas.length > 0 && <span className="text-[#A8A29E] font-normal text-sm">({resenas.length})</span>}
                    </h2>

                    {resenas.length === 0 && (
                        <p className="text-[#A8A29E] text-sm">Todavía no hay reseñas para este libro.</p>
                    )}

                    {resenas.map(resena => (
                        <ResenaCard key={resena.id} resena={resena} />
                    ))}
                </div>
            </div>

            {/* Modal de Login para no logueados */}
            {showLoginPrompt && (
                <LoginPrompt 
                    onClose={() => setShowLoginPrompt(false)} 
                    libroId={id} 
                />
            )}
        </div>
    );
}