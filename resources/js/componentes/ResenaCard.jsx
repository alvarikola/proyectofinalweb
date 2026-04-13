import { useState } from "react";

const MODULOS_INFO = [
    { key: "personajes", label: "Personajes", emoji: "✨" },
    { key: "musica", label: "Música Recomendada", emoji: "🎧" },
    { key: "citas", label: "Citas Favoritas", emoji: "💬" },
    { key: "spoilers", label: "Alerta de Spoilers", emoji: "⚠️" },
    { key: "comparacion", label: "Comparar con Otros Libros", emoji: "📊" },
    { key: "momentos", label: "Momentos Clave", emoji: "💥" },
];

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

const LIMITE_CHARS = 150;
const LIMITE_MODULOS = 2;

export default function ResenaCard({ resena }) {
    const [expandida, setExpandida] = useState(false);

    let contenido = {};
    try {
        contenido = resena.contenido ? JSON.parse(resena.contenido) : {};
    } catch {
        contenido = { general: resena.contenido || "" };
    }


    const general = String(contenido.general || "");
    const modulosConContenido = MODULOS_INFO.filter(m => contenido[m.key]);
    const textoTotal = [general, ...modulosConContenido.map(m => String(contenido[m.key] || ""))].join(" ");
    
    const esLarga = textoTotal.length > LIMITE_CHARS || modulosConContenido.length > LIMITE_MODULOS;


    // Calcula qué mostrar respetando el límite de chars en todos los campos
    const renderContenido = () => {
        if (expandida) {
            return { textoGeneral: general, modulosAMostrar: modulosConContenido, cortado: false };
        }

        let charsRestantes = LIMITE_CHARS;
        let cortado = false;

        // Chars del general
        let textoGeneral = general;
        if (general.length > charsRestantes) {
            textoGeneral = general.slice(0, charsRestantes);
            charsRestantes = 0;
            cortado = true;
        } else {
            charsRestantes -= general.length;
        }

        // Módulos hasta agotar chars o límite de módulos
        const modulosAMostrar = [];
        for (const modulo of modulosConContenido) {
            if (cortado || modulosAMostrar.length >= LIMITE_MODULOS) break;
            const texto = String(contenido[modulo.key] || "");
            if (texto.length > charsRestantes) {
                modulosAMostrar.push({ ...modulo, textoCortado: texto.slice(0, charsRestantes) });
                cortado = true;
                charsRestantes = 0;
            } else {
                modulosAMostrar.push({ ...modulo, textoCortado: null });
                charsRestantes -= texto.length;
            }
        }

        return { textoGeneral, modulosAMostrar, cortado };
    };

    const { textoGeneral, modulosAMostrar, cortado } = renderContenido();

    return (
        <div className="bg-[#FAF9F6] rounded-2xl shadow-md p-6">
            {/* Usuario, estrellas y fecha */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {resena.usuario?.imagen_perfil
                        ? <img
                            src={resena.usuario.imagen_perfil}
                            alt={resena.usuario.nombre}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        : <div className="w-9 h-9 rounded-full bg-[#C97B63] flex items-center justify-center text-white text-sm font-bold">
                            {resena.usuario?.nombre?.charAt(0).toUpperCase()}
                          </div>
                    }
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{resena.usuario?.nombre}</span>
                        <Estrellas rating={resena.puntuacionEstrellas ?? 0} />
                    </div>
                </div>
                <span className="text-xs text-[#A8A29E]">
                    {new Date(resena.created_at).toLocaleDateString("es-ES", {
                        day: "numeric", month: "long", year: "numeric"
                    })}
                </span>
            </div>

            {/* Contenido general */}
            {general && (
                <p style={{ wordBreak: "break-word" }} className="text-sm leading-relaxed text-[#3A3A3A] mb-4">
                    {textoGeneral}{cortado && textoGeneral.length < general.length ? "..." : ""}
                </p>
            )}

            {/* Módulos */}
            {modulosAMostrar.length > 0 && (
                <div className="space-y-4">
                    {modulosAMostrar.map(({ key, label, emoji, textoCortado }) => (
                        <div key={key} className="border-t border-[#E5E5E5] pt-4">
                            <h4 className="text-sm font-semibold text-[#6B705C] mb-2">{emoji} {label}</h4>
                            <p style={{ wordBreak: "break-word" }} className="text-sm leading-relaxed text-[#3A3A3A]">
                                {textoCortado ?? String(contenido[key] || "")}
                                {textoCortado ? "..." : ""}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Botón mostrar más/menos */}
            {esLarga && (
                <button
                    onClick={() => setExpandida(prev => !prev)}
                    className="mt-3 text-xs font-semibold text-[#C97B63] hover:text-[#b96d56] transition"
                >
                    {expandida ? "Mostrar menos ↑" : "Mostrar más ↓"}
                </button>
            )}
        </div>
    );
}