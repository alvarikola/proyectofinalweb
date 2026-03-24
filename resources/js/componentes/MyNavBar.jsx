import React from "react";
import { useState, useRef } from "react";

function MySearchBar() {
    const [expanded, setExpanded] = useState(false);
    const inputRef = useRef(null);

    const handleIconClick = () => {
        setExpanded(true);
        inputRef.current.focus();
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                placeholder="Buscar..."
                className={`bg-[#FAF9F6] border border-[#A8A29E] h-10 px-5 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C97B63] transition-all duration-300 ${
                    expanded ? "w-64" : "w-12"
                }`}
                onFocus={() => setExpanded(true)}
                onBlur={(e) => {
                    if (e.target.value === "") setExpanded(false);
                }}
            />
            <button
                type="button"
                onClick={handleIconClick}
                className="absolute right-0 top-0 mt-3 mr-4"
            >
                <svg className="h-4 w-4 fill-[#6B705C]">
                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                </svg>
            </button>
        </div>
    );
}

export default function MyNavBar() {
    return (
        <header className="sticky top-0 z-30 mx-auto w-full max-w-screen-md border border-[#E5E5E5] bg-[#FAF9F6]/90 py-3 shadow-md backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
            <div class="px-4">
                <div class="flex items-center justify-between">
                    <div class="flex shrink-0">
                        <a aria-current="page" class="flex items-center" href="/">
                            <img class="h-7 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt=""/>
                            <p class="sr-only">Website Title</p>
                        </a>
                    </div>
                    <div class="hidden md:flex md:items-center md:justify-center md:gap-5">
                        <a aria-current="page"
                            className="inline-block rounded-lg px-3 py-1 text-sm font-medium text-[#3A3A3A] transition hover:bg-[#F5F5DC] hover:text-[#6B705C]"
                            href="#">Leídos</a>
                        <a className="inline-block rounded-lg px-3 py-1 text-sm font-medium text-[#3A3A3A] transition hover:bg-[#F5F5DC] hover:text-[#6B705C]"
                            href="#">Por leer</a>
                    </div>
                    <div class="flex items-center justify-end gap-3">
                        <MySearchBar />
                        <a
                            className="inline-flex items-center justify-center rounded-xl bg-[#C97B63] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b96d56]"
                            href="/login"
                        >
                            Login
                        </a>
                    </div>
                </div>
            </div>
        </header>
        
    );
}