import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useApiClient } from "@webbydevs/react-laravel-sanctum-auth";
import MyNavBar from "../componentes/MyNavBar";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Perfil() {
  const { user, loading: authLoading } = useAuth();
  const apiClient = useApiClient();
  const navigate = useNavigate();
  
  // Ref para evitar bucles con apiClient
  const apiClientRef = useRef(apiClient);

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  
  // Estado del formulario
  const [nombre, setNombre] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  
  // Ref para saber si ya se cargó el perfil
  const perfilCargadoRef = useRef(false);

  // Cargar datos del perfil (SOLO UNA VEZ)
  useEffect(() => {
    if (perfilCargadoRef.current || authLoading || !user) {
      if (!authLoading && !user) {
        navigate("/login?from=/perfil");
      }
      return;
    }

    const cargarPerfil = async () => {
      try {
        const { data } = await apiClientRef.current.get("/api/me");
        setPerfil(data);
        setNombre(data.name || "");
        setImagenUrl(data.imagen_perfil || "");
        setPreview(data.imagen_perfil || null);
        perfilCargadoRef.current = true;
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setError("No se pudo cargar tu perfil");
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [user, authLoading, navigate]);

  // Preview de imagen (solo cuando cambia archivo)
  useEffect(() => {
    if (!archivo) return;
    
    const objectUrl = URL.createObjectURL(archivo);
    setPreview(objectUrl);
    
    return () => URL.revokeObjectURL(objectUrl);
  }, [archivo]);

  // Subir imagen a Supabase (URL construida manualmente para evitar errores del SDK)
  const subirImagen = useCallback(async (file) => {
    if (!user?.id) throw new Error("Usuario no autenticado");
    
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `perfiles/${user.id}-${Date.now()}.${fileExt}`;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error("Solo JPG, PNG, WebP o GIF");
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Máximo 5MB");
    }

    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    
    if (uploadError) {
      console.error("Error subiendo imagen:", uploadError);
      throw new Error(uploadError.message);
    }

    // ✅ Construir URL pública manualmente (más fiable)
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const publicUrl = `${baseUrl}/storage/v1/object/public/avatars/${fileName}`;
    
    console.log("✅ Imagen subida:", publicUrl);
    return publicUrl;
  }, [user?.id]);

  // Guardar cambios
  const handleGuardar = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setExito(false);
    setGuardando(true);

    try {
      let nuevaImagenUrl = imagenUrl;
      
      if (archivo && archivo instanceof File) {
        nuevaImagenUrl = await subirImagen(archivo);
      }

      const { data } = await apiClientRef.current.put("/api/me", {
        nombre: nombre.trim(),
        imagen_perfil: nuevaImagenUrl || null,
      });

      // ✅ CORRECCIÓN: Tu backend devuelve { user: {...}, message: '...' }
      const userData = data.user || data; 
      
      setPerfil(userData);
      setNombre(userData.name);
      setImagenUrl(userData.imagen_perfil || "");
      setPreview(userData.imagen_perfil || null); // ✅ Ahora sí tendrá la URL correcta
      setEditando(false);
      setExito(true);
      
      // Actualizar localStorage para el NavBar
      try {
        const stored = localStorage.getItem('sanctum_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem('sanctum_user', JSON.stringify({ ...parsed, ...userData }));
        }
      } catch (e) {
        console.warn("No se pudo actualizar auth context:", e);
      }
      
      setTimeout(() => setExito(false), 3000);
      
    } catch (err) {
      console.error("Error guardando perfil:", err);
      setError(err.response?.data?.message || err.message || "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }, [nombre, imagenUrl, archivo, subirImagen]);

  // Cancelar edición
  const handleCancelar = useCallback(() => {
    setNombre(perfil?.name || "");
    setImagenUrl(perfil?.imagen_perfil || "");
    setPreview(perfil?.imagen_perfil || null);
    setArchivo(null);
    setEditando(false);
    setError("");
  }, [perfil]);

  // Loading
  if (authLoading || cargando) {
    return (
      <div className="bg-[#F5F5DC] min-h-screen flex items-center justify-center">
        <p className="text-[#A8A29E]">Cargando perfil...</p>
      </div>
    );
  }

  if (!perfil) return null;

  return (
    <div className="bg-[#F5F5DC] min-h-screen text-[#3A3A3A]">
      <MyNavBar onSearch={() => {}} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Mi Perfil</h1>
          <p className="text-[#A8A29E] text-sm">Gestiona tu información personal</p>
        </div>

        {/* Card */}
        <div className="bg-[#FAF9F6] rounded-2xl shadow-md border border-[#E5E5E5] overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#C97B63] to-[#b96d56]" />
          
          <div className="px-8 pb-8 -mt-12">
            
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#E5E5E5] border-4 border-[#FAF9F6] shadow-lg overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img 
                      key={preview} // ✅ Fuerza a React a recargar la imagen cuando cambia la URL
                      src={preview} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      // ✅ ELIMINADO onError: ya no resetea a "U" si hay un micro-retraso de CDN
                    />
                  ) : (
                    <span className="text-3xl font-bold text-[#6B705C]">
                      {(nombre || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                {editando && (
                  <label className="absolute bottom-1 right-1 bg-[#C97B63] text-white p-2 rounded-full cursor-pointer hover:bg-[#b96d56] transition shadow-md">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={(e) => {
                        setArchivo(e.target.files[0]);
                        setError("");
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Mensajes */}
            {exito && (
              <div className="mb-4 p-3 bg-[#C97B63]/10 border border-[#C97B63]/30 rounded-xl text-center">
                <p className="text-sm text-[#C97B63] font-medium">✅ Perfil actualizado</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-center">
                <p className="text-sm text-red-600 font-medium">❌ {error}</p>
              </div>
            )}

            {/* Vista o Formulario */}
            {!editando ? (
              // 👁️ Vista
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-[#3A3A3A]">{perfil?.name}</h2>
                  <p className="text-[#A8A29E]">{perfil?.email}</p>
                  {perfil?.rol && (
                    <span className="inline-block mt-2 px-3 py-1 bg-[#F5F5DC] border border-[#E5E5E5] rounded-full text-xs text-[#6B705C]">
                      {perfil.rol === 'admin' ? '👑 Administrador' : '👤 Lector'}
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-[#E5E5E5]">
                  <h3 className="text-sm font-semibold text-[#6B705C] mb-3">Estadísticas</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-2xl font-bold text-[#C97B63]">0</p><p className="text-xs text-[#A8A29E]">Reseñas</p></div>
                    <div><p className="text-2xl font-bold text-[#C97B63]">0</p><p className="text-xs text-[#A8A29E]">Leídos</p></div>
                    <div><p className="text-2xl font-bold text-[#C97B63]">0</p><p className="text-xs text-[#A8A29E]">Por leer</p></div>
                  </div>
                </div>

                <button
                  onClick={() => setEditando(true)}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#6B705C] text-white py-3 rounded-xl font-semibold hover:bg-[#5a5f4d] transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar perfil
                </button>
              </div>
            ) : (
              // ✏️ Formulario
              <form onSubmit={handleGuardar} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#6B705C] mb-2">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    minLength={2}
                    maxLength={255}
                    className="w-full rounded-xl border border-[#A8A29E] bg-white px-4 py-3 text-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#C97B63]"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#6B705C] mb-2">Email</label>
                  <input
                    type="email"
                    value={perfil?.email || ""}
                    disabled
                    className="w-full rounded-xl border border-[#E5E5E5] bg-[#F5F5DC] px-4 py-3 text-[#A8A29E] cursor-not-allowed"
                  />
                  <p className="text-xs text-[#A8A29E] mt-1">El email no se puede modificar</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#6B705C] mb-2">Foto de perfil</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#E5E5E5] overflow-hidden flex-shrink-0">
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-[#6B705C] font-bold">
                          {nombre?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <label className="flex-1">
                      <span className="block text-sm text-[#3A3A3A] mb-1">
                        {archivo ? archivo.name : "Selecciona una imagen"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setArchivo(e.target.files[0])}
                        className="block w-full text-sm text-[#A8A29E] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C97B63] file:text-white hover:file:bg-[#b96d56] cursor-pointer"
                      />
                    </label>
                  </div>
                  {archivo && (
                    <button
                      type="button"
                      onClick={() => {
                        setArchivo(null);
                        setPreview(imagenUrl || null);
                      }}
                      className="text-xs text-[#C97B63] hover:underline mt-2"
                    >
                      Cancelar selección
                    </button>
                  )}
                  <p className="text-xs text-[#A8A29E] mt-2">Máx 5MB. JPG, PNG, WebP o GIF</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={guardando}
                    className="flex-1 bg-[#C97B63] text-white py-3 rounded-xl font-semibold hover:bg-[#b96d56] transition disabled:opacity-50"
                  >
                    {guardando ? "Guardando..." : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelar}
                    disabled={guardando}
                    className="px-6 py-3 rounded-xl font-semibold text-[#6B705C] border border-[#E5E5E5] hover:bg-[#F5F5DC] transition disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}