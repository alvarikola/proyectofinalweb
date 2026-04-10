import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function Libros({ search }) {
  const [libros, setLibros] = useState([]);
  const [page, setPage] = useState(1);          // página actual
  const [hasMore, setHasMore] = useState(true); // si hay más libros
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();
  const searchRef = useRef(search); // ref para tener siempre el search actual
  const navigate = useNavigate();


  // Función para cargar libros
  const fetchLibros = async (pageNumber, searchTerm = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/libros?per_page=12&page=${pageNumber}&search=${searchTerm}`);
      const data = await res.json();

      // Laravel devuelve estructura {data: [...], current_page, last_page, ...}
      // Si es nueva búsqueda reemplaza resultados
      if (pageNumber === 1) {
        setLibros(data.data || []);
      } else {
        setLibros(prev => [...prev, ...(data.data || [])]);
      }

      setHasMore(pageNumber < data.last_page);
    } catch (error) {
      console.error("Error cargando libros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchRef.current = search;
    const delay = setTimeout(() => {
      setLibros([])
      setPage(1);
      setHasMore(true);
      fetchLibros(1, search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (page === 1) return;
    fetchLibros(page, searchRef.current);
  }, [page]);

  // Intersection Observer para infinite scroll
  const lastLibroRef = useCallback(node => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="grid grid-cols-3 gap-6">
        {libros.map((libro, index) => {
          const isLast = index === libros.length - 1;
          return (
            <div
              key={libro.id}
              ref={isLast ? lastLibroRef : null}
              onClick={() => navigate(`/libro/${libro.id}`)}
              className="cursor-pointer bg-[#FAF9F6] bg-[#FAF9F6] shadow-md rounded-xl border border-[#E5E5E5] hover:shadow-lg transition overflow-hidden flex flex-row"
            >
              {/* Imagen izquierda */}
              <div className="w-28 flex-shrink-0 bg-[#E5E5E5] flex items-center justify-center">
                {libro.cover_url
                  ? <img
                      src={libro.cover_url}
                      alt={libro.titulo}
                      className="w-full h-full object-contain"
                    />
                  : <span className="text-[#A8A29E] text-xs text-center p-2">Sin imagen</span>
                }
              </div>

              {/* Info derecha */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="font-bold text-base text-[#3A3A3A] line-clamp-2">
                    {libro.titulo}
                  </h2>
                  <p className="text-sm text-[#A8A29E] mt-1">
                    {libro.autor}
                  </p>
                </div>

                {/* Valoración */}
                <div className="flex items-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((estrella) => {
                    const rating = libro.valoracion ?? 0;

                    let tipo = "empty";
                    if (rating >= estrella) {
                      tipo = "full";
                    } else if (rating >= estrella - 0.5) {
                      tipo = "half";
                    }

                    return (
                      <svg
                        key={estrella}
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                      >
                        {/* Estrella base (gris) */}
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
                          fill="#E5E5E5"
                        />

                        {/* Estrella llena */}
                        {tipo === "full" && (
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
                            fill="#FACC15"
                          />
                        )}

                        {/* Media estrella */}
                        {tipo === "half" && (
                          <>
                            <defs>
                              <linearGradient id={`half-${estrella}`}>
                                <stop offset="50%" stopColor="#FACC15" />
                                <stop offset="50%" stopColor="#E5E5E5" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
                              fill={`url(#half-${estrella})`}
                            />
                          </>
                        )}
                      </svg>
                    );
                  })}

                  <span className="text-xs text-[#A8A29E] ml-1">
                    {libro.valoracion ? libro.valoracion.toFixed(1) : "Sin valorar"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {loading && <p className="text-[#A8A29E] col-span-3 text-center mt-4">Cargando más libros...</p>}
      </div>
    </div>
  );
}