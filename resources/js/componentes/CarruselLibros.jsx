import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const ITEM_W = 220;
const GAP = 32;

export default function CarruselLibros() {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [activeLocal, setActiveLocal] = useState(0);

  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const realIdxRef = useRef(0);
  const currentTranslateRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startTranslate = useRef(0);
  const movedRef = useRef(false);
  const NRef = useRef(0);
  const allBooksLengthRef = useRef(0);

  // Guardamos setPosition y jumpIfNeeded en refs para acceder a versión actual sin recrear listeners
  const setPositionRef = useRef(null);
  const jumpIfNeededRef = useRef(null);

  useEffect(() => {
    const fetchTopLibros = async () => {
      try {
        const response = await fetch("/api/libros/top-valorados", {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Error al cargar libros");
        const data = await response.json();
        setLibros(data);
      } catch (err) {
        setError("No se pudieron cargar los libros destacados");
      } finally {
        setCargando(false);
      }
    };
    fetchTopLibros();
  }, []);

  const N = libros.length;
  const allBooks = N > 0 ? [...libros, ...libros, ...libros] : [];

  // Mantener refs actualizados en cada render
  NRef.current = N;
  allBooksLengthRef.current = allBooks.length;

  function updateCardStyles(centerIdx) {
    if (!trackRef.current) return;
    const cards = trackRef.current.children;
    Array.from(cards).forEach((card, i) => {
      const diff = i - centerIdx;
      if (diff === 0) {
        card.style.transform = `scale(1.18)`;
        card.style.opacity = "1";
        card.style.zIndex = "10";
        card.style.pointerEvents = "auto";
      } else if (Math.abs(diff) === 1) {
        card.style.transform = `scale(0.85)`;
        card.style.opacity = "0.65";
        card.style.zIndex = "5";
        card.style.pointerEvents = "auto";
      } else {
        card.style.transform = `scale(0.7)`;
        card.style.opacity = "0";
        card.style.zIndex = "1";
        card.style.pointerEvents = "none";
      }
      card.style.transition = "transform 0.35s ease, opacity 0.35s ease";
    });
  }

  const getOffset = useCallback((idx) => {
    if (!wrapRef.current) return 0;
    const wrapW = wrapRef.current.offsetWidth;
    const centerCard = idx * (ITEM_W + GAP) + ITEM_W / 2;
    return centerCard - wrapW / 2;
  }, []);

  const setPosition = useCallback((idx, animate) => {
    if (!trackRef.current || NRef.current === 0) return;
    realIdxRef.current = idx;
    const offset = getOffset(idx);
    currentTranslateRef.current = -offset;
    trackRef.current.style.transition = animate ? "transform 0.35s ease" : "none";
    trackRef.current.style.transform = `translateX(${currentTranslateRef.current}px)`;
    const localIdx = ((idx - NRef.current) % NRef.current + NRef.current) % NRef.current;
    setActiveLocal(localIdx);
    updateCardStyles(idx);
  }, [getOffset]);

  const jumpIfNeeded = useCallback(() => {
    const idx = realIdxRef.current;
    const n = NRef.current;
    if (idx < n) setPosition(idx + n, false);
    else if (idx >= 2 * n) setPosition(idx - n, false);
  }, [setPosition]);

  // Mantener refs de funciones actualizados
  setPositionRef.current = setPosition;
  jumpIfNeededRef.current = jumpIfNeeded;

  // Init position
  useEffect(() => {
    if (N === 0) return;
    realIdxRef.current = N;
    setTimeout(() => setPosition(N, false), 50);
  }, [N, setPosition]);

  // Mouse drag — se monta cuando N > 0, usa refs para no recrearse con re-renders
  useEffect(() => {
    const track = trackRef.current;
    if (!track || N === 0) return;

    const onMouseDown = (e) => {
      isDragging.current = true;
      movedRef.current = false;
      startX.current = e.clientX;
      startTranslate.current = currentTranslateRef.current;
      track.style.transition = "none";
      track.style.cursor = "grabbing";
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startX.current;
      if (Math.abs(dx) > 5) movedRef.current = true;
      currentTranslateRef.current = startTranslate.current + dx;
      track.style.transform = `translateX(${currentTranslateRef.current}px)`;
      const wrapW = wrapRef.current?.offsetWidth ?? 600;
      const idx = Math.round(
        -currentTranslateRef.current / (ITEM_W + GAP) +
        wrapW / 2 / (ITEM_W + GAP) - 0.5
      );
      const clamped = Math.max(0, Math.min(idx, allBooksLengthRef.current - 1));
      realIdxRef.current = clamped;
      updateCardStyles(clamped);
      const n = NRef.current;
      setActiveLocal(((clamped - n) % n + n) % n);
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      track.style.cursor = "grab";
      setPositionRef.current(realIdxRef.current, true);
      setTimeout(() => jumpIfNeededRef.current(), 400);
    };

    track.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      track.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [N]); // Solo se re-monta cuando llegan los libros, no en cada render

  // Touch
  useEffect(() => {
    const track = trackRef.current;
    if (!track || N === 0) return;

    const onTouchStart = (e) => {
      movedRef.current = false;
      startX.current = e.touches[0].clientX;
      startTranslate.current = currentTranslateRef.current;
      track.style.transition = "none";
    };
    const onTouchMove = (e) => {
      const dx = e.touches[0].clientX - startX.current;
      if (Math.abs(dx) > 5) movedRef.current = true;
      currentTranslateRef.current = startTranslate.current + dx;
      track.style.transform = `translateX(${currentTranslateRef.current}px)`;
      const wrapW = wrapRef.current?.offsetWidth ?? 600;
      const idx = Math.round(
        -currentTranslateRef.current / (ITEM_W + GAP) +
        wrapW / 2 / (ITEM_W + GAP) - 0.5
      );
      const clamped = Math.max(0, Math.min(idx, allBooksLengthRef.current - 1));
      realIdxRef.current = clamped;
      updateCardStyles(clamped);
      const n = NRef.current;
      setActiveLocal(((clamped - n) % n + n) % n);
    };
    const onTouchEnd = () => {
      setPositionRef.current(realIdxRef.current, true);
      setTimeout(() => jumpIfNeededRef.current(), 400);
    };

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: true });
    track.addEventListener("touchend", onTouchEnd);

    return () => {
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
    };
  }, [N]);

  const goToIndex = (localTarget) => {
    const localCurrent = ((realIdxRef.current - N) % N + N) % N;
    let delta = localTarget - localCurrent;
    if (delta > N / 2) delta -= N;
    if (delta < -N / 2) delta += N;
    setPosition(realIdxRef.current + delta, true);
    setTimeout(jumpIfNeeded, 400);
  };

  if (cargando) {
    return (
      <div className="w-full py-8 text-center text-[#A8A29E] text-sm">
        Cargando destacados...
      </div>
    );
  }

  if (error || libros.length === 0) return null;

  const visibleWidth = "100%";

  return (
    <section className="w-full py-8">
      <div className="text-center mb-8">
        <span className="text-xs font-medium tracking-widest text-[#C97B63] uppercase">
          Destacados
        </span>
        <h2 className="text-3xl font-bold text-[#3A3A3A] mt-1">
          🏆 Más valorados
        </h2>
        <div className="mx-auto mt-3 h-0.5 w-16 rounded-full bg-[#C97B63] opacity-60" />
      </div>

      <div
        ref={wrapRef}
        style={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
          margin: "0 auto",
          padding: "2.5rem 0",
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${GAP}px`,
            cursor: "grab",
            userSelect: "none",
            willChange: "transform",
          }}
        >
          {allBooks.map((libro, i) => (
            <div key={i} style={{ width: `${ITEM_W}px`, flexShrink: 0 }}>
              <Link
                to={`/libro/${libro.id}`}
                draggable={false}
                onClick={(e) => {
                  if (movedRef.current) e.preventDefault();
                }}
              >
                <div
                  className="relative rounded-2xl overflow-hidden bg-[#E5E5E5]"
                  style={{ aspectRatio: "3/4" }}
                >
                  {libro.cover_url ? (
                    <img
                      src={libro.cover_url}
                      alt={libro.titulo}
                      className="w-full h-full object-cover pointer-events-none"
                      draggable={false}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#A8A29E] text-xs p-2 text-center">
                      Sin portada
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <p className="text-white text-xs font-medium line-clamp-2">
                      {libro.titulo}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {libros.map((_, i) => (
          <button
            key={i}
            onClick={() => goToIndex(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === activeLocal ? "24px" : "8px",
              background: i === activeLocal ? "#C97B63" : "#D1D5DB",
            }}
            aria-label={`Ir al libro ${i + 1}`}
          />
        ))}
      </div>

      <p className="text-center text-[#A8A29E] text-xs mt-3 md:hidden">
        ← Desliza para explorar →
      </p>
    </section>
  );
}