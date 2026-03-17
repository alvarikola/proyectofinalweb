import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./paginas/Home";
import Login from "./paginas/Login";


export  function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}
