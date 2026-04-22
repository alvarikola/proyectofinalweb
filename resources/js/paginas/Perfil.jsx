import MyNavBar from "../componentes/MyNavBar";

export default function Perfil() {
  return (
    <div className="bg-[#F5F5DC] min-h-screen text-[#3A3A3A]">
      <MyNavBar onSearch={() => {}} />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold">✅ Perfil cargado correctamente</h1>
        <p className="mt-4">Si ves esto, el import y la ruta funcionan.</p>
      </div>
    </div>
  );
}