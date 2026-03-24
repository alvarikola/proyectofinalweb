import { useEffect, useState } from "react";

export default function Libros() {

  const [libros, setLibros] = useState([]);

  useEffect(() => {
    const fetchLibros = async () => {
      const res = await fetch("/api/libros")
      const json = await res.json()
      setLibros(json.data || [])
    };
    fetchLibros();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#3A3A3A]">
        Lista de Libros
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {Array.isArray(libros) && libros.length > 0
          ? libros.map(libro => (
              <div
                key={libro.id}
                className="bg-[#FAF9F6] p-5 shadow-md rounded-xl border border-[#E5E5E5] hover:shadow-lg transition"
              >
                <h2 className="font-bold text-lg text-[#3A3A3A]">
                  {libro.titulo}
                </h2>
                <p className="text-[#A8A29E]">
                  {libro.autor}
                </p>
              </div>
            ))
          : <p className="text-[#A8A29E]">No hay libros disponibles</p>
        }
      </div>
    </div>
  );
}