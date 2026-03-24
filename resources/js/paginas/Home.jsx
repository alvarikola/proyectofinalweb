import React from "react";
import Libros from "../componentes/Libros";
import MyNavBar from "../componentes/MyNavBar";




function MyButton() {
    return (
        <div class="relative inline-flex  group">
            <div
                class="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
            </div>
            <a href="#" title="Get quote now"
                class="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="button">Get it now
            </a>
        </div>
        
    );
}

export default function Home() {
    return (
        <div className="bg-[#F5F5DC] min-h-screen text-[#3A3A3A]">
            <MyNavBar />
            <div className="text-center pt-32 pb-16">
                <h1 className="text-3xl font-bold mb-4">
                    Laravel + React funcionando 🚀
                </h1>
                <h2 className="text-xl mb-6">
                    esta es la pagina principal
                </h2>
                <MyButton />
                <Libros />
            </div>
        </div>
    );
}
