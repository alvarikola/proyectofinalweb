import { useEffect, useState } from "react";

export default function Libros() {

  const [libros, setLibros] = useState([]);

  useEffect(() => {
    fetch("/api/libros")
      .then(res => res.json())
      .then(data => setLibros(data.data || [])); // <-- acceder a la propiedad data
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Libros</h1>

        <div className="grid grid-cols-3 gap-4">
            {Array.isArray(libros) && libros.length > 0
                ? libros.map(libro => (
                    <div key={libro.id} className="bg-white p-4 shadow rounded">
                        <h2 className="font-bold text-lg">{libro.titulo}</h2>
                        <p className="text-gray-600">{libro.autor}</p>
                    </div>
                ))
                :   <p>No hay libros disponibles</p>
            }
        </div>
    </div>
  );
}