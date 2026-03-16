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
                className={`bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none transition-all duration-300 ease-in-out ${
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
                <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                </svg>
            </button>
        </div>
    );
}

export default function MyNavBar() {
    return (
        <header
            class="sticky top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
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
                            class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                            href="#">Leídos</a>
                        <a class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                            href="#">Por leer</a>
                    </div>
                    <div class="flex items-center justify-end gap-3">
                        <MySearchBar />
                        <a class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            href="/login">Login</a>
                    </div>
                </div>
            </div>
        </header>
        
    );
}