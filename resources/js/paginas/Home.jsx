import React from "react";
import { useState } from "react";
import Libros from "../componentes/Libros";
import MyNavBar from "../componentes/MyNavBar";


export default function Home() {
    const [search, setSearch] = useState("");
    return (
        <div className="bg-[#F5F5DC] min-h-screen text-[#3A3A3A]">
            <MyNavBar onSearch={setSearch} />
            <div className="text-center pt-32 pb-16">
                <Libros search={search} />
            </div>
        </div>
    );
}
