import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

// Fuente Poppins: limpia, moderna y profesional
const poppins = Poppins({
  weight: ["600", "800"],
  subsets: ["latin"],
});

export default function Login() {
  return (
    <div className="flex h-screen bg-[#A3CCDA] items-center justify-center p-5">
      
      {/* Contenedor principal */}
      <div className="flex w-full max-w-6xl h-[80vh] shadow-lg rounded overflow-hidden">
        
        {/* Columna de la imagen */}
        <div className="flex-1 bg-gray-100 relative flex items-center justify-center p-5">
          <Image
            src="/logindiente.png"
            alt="Imagen lateral"
            fill
            className="object-cover"
          />
        </div>

        {/* Columna del formulario */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-sm space-y-6">

            {/* Título principal con fuente Poppins y gradiente */}
            <div className="text-center mb-6">
              <label
                className={`${poppins.className} block text-6xl font-extrabold bg-linear-to-r from-[#147DA8] to-[#60D6A7] bg-clip-text text-transparent drop-shadow-lg tracking-wide relative -top-15`}
              >
                ING DENTAL
              </label>
            </div>

            {/* Campo de usuario */}
            <div>
              <label className="block mb-2 text-black font-semibold">USUARIO</label>
              <input
                type="text"
                placeholder="Ej. Alvaro Casas"
                className="w-full bg-transparent border border-gray-400 rounded p-2 focus:outline-none text-black shadow-sm"
              />
            </div>

            {/* Campo de contraseña */}
            <div>
              <label className="block mb-2 text-black font-semibold">CONTRASEÑA</label>
              <input
                type="password"
                placeholder="********"
                className="w-full bg-transparent border border-gray-400 rounded p-2 focus:outline-none text-black shadow-sm"
              />
            </div>

            {/* Botón de inicio */}
            <div className="text-left">
              <Link href="/agendar-citas">
                <button className="text-white shadow border border-gray-600 px-6 py-2 bg-[#147DA8] hover:bg-[#60D6A7] transition delay-50 rounded">
                  INICIAR SESIÓN
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
