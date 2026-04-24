import React from "react";
import { useState } from "react";
import Libros from "../componentes/Libros";
import MyNavBar from "../componentes/MyNavBar";
import CarruselLibros from "../componentes/CarruselLibros";


export default function Home() {
    const [search, setSearch] = useState("");
    return (
        <div className="bg-[#F5F5DC] min-h-screen text-[#3A3A3A]">
            <MyNavBar onSearch={setSearch} />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <CarruselLibros />
                <div className="text-center pt-32 pb-16">
                    <Libros search={search} />
                </div>
            </main>
            
        </div>
    );
}
