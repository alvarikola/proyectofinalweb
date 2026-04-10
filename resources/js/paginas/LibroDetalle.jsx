import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyNavBar from "../componentes/MyNavBar";

export default function LibroDetalle() {
    const { id } = useParams();
    const [libro, setLibro] = useState({}); // Inicializa con un objeto vacío

    const parsearGenero = (genero) => {
        if (!genero) return null;
        try {
            const parsed = JSON.parse(genero);
            return Array.isArray(parsed) ? parsed.join(", ") : genero;
        } catch {
            return genero;
        }
    }

    useEffect(() => {
        fetch(`/api/libros/${id}`)
            .then(r => r.json())
            .then(data => {
                console.log("Respuesta API:", data);
                setLibro(data);
            })
            .catch(err => console.error("Error fetch:", err));
    }, [id]);

    // Muestra "Cargando..." si el libro aún no tiene un ID
    if (!libro.id) return (
        <div className="bg-[#F5F5DC] min-h-screen flex items-center justify-center">
            <p className="text-[#A8A29E]">Cargando...</p>
        </div>
    );

    return (
        <div className="bg-[#F5F5DC] min-h-screen text-[#3A3A3A]">
            <MyNavBar onSearch={() => {}} />

            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="bg-[#FAF9F6] rounded-2xl shadow-md p-8 flex gap-8">
                    {/* Portada */}
                    <div className="w-44 flex-shrink-0">
                        {libro.cover_url
                            ? <img
                                src={libro.cover_url}
                                alt={libro.titulo}
                                className="w-full rounded-xl shadow-md object-contain"
                              />
                            : <div className="w-full h-64 bg-[#E5E5E5] rounded-xl flex items-center justify-center">
                                <span className="text-[#A8A29E] text-sm">Sin imagen</span>
                              </div>
                        }

                        {/* Valoración */}
                        <div className="mt-4 flex flex-col items-center gap-1">
                            <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(estrella => {
                                    const rating = libro.valoracion ?? 0;
                                    let tipo = "empty";
                                    if (rating >= estrella) tipo = "full";
                                    else if (rating >= estrella - 0.5) tipo = "half";

                                    return (
                                        <svg key={estrella} className="w-5 h-5" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" fill="#E5E5E5" />
                                            {tipo === "full" && (
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" fill="#FACC15" />
                                            )}
                                            {tipo === "half" && (
                                                <>
                                                    <defs>
                                                        <linearGradient id={`half-${estrella}`}>
                                                            <stop offset="50%" stopColor="#FACC15" />
                                                            <stop offset="50%" stopColor="#E5E5E5" />
                                                        </linearGradient>
                                                    </defs>
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" fill={`url(#half-${estrella})`} />
                                                </>
                                            )}
                                        </svg>
                                    );
                                })}
                            </div>
                            <span className="text-sm text-[#A8A29E]">
                                {libro.valoracion ? libro.valoracion.toFixed(1) : "Sin valorar"}
                            </span>
                            {libro.calificaciones > 0 && (
                                <span className="text-xs text-[#A8A29E]">
                                    {libro.calificaciones} calificaciones
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-3 flex-1">
                        <h1 className="text-2xl font-bold leading-tight">{libro.titulo}</h1>
                        <p className="text-[#A8A29E] text-sm">{libro.autor}</p>

                        <div className="flex gap-2 flex-wrap mt-1">
                            {libro.genero && (
                                <span className="bg-[#F5F5DC] border border-[#E5E5E5] text-[#6B705C] text-xs px-3 py-1 rounded-full">
                                    {parsearGenero(libro.genero)}
                                </span>
                            )}
                            {libro.fecha_publicacion && (
                                <span className="bg-[#F5F5DC] border border-[#E5E5E5] text-[#6B705C] text-xs px-3 py-1 rounded-full">
                                    {libro.fecha_publicacion}
                                </span>
                            )}
                            {libro.isbn && (
                                <span className="bg-[#F5F5DC] border border-[#E5E5E5] text-[#6B705C] text-xs px-3 py-1 rounded-full">
                                    ISBN: {libro.isbn}
                                </span>
                            )}
                        </div>

                        {libro.sinopsis && (
                            <div className="mt-2">
                                <h2 className="text-sm font-semibold text-[#6B705C] mb-1">Sinopsis</h2>
                                <div
                                    className="text-sm leading-relaxed text-[#3A3A3A]"
                                    dangerouslySetInnerHTML={{ __html: libro.sinopsis }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
