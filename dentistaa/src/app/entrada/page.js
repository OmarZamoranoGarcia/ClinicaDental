"use client";

import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Fuente Poppins: limpia, moderna y profesional
const poppins = Poppins({
  weight: ["600", "800"],
  subsets: ["latin"],
});

export default function Login() {
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push("/crear-cuenta"); // Cambia esta ruta según tu necesidad
  };

  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      // Guardar usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Redirigir según rol:
      // rolId 4/paciente -> /agendar-citas
      // rolId 2/doctor -> /citas-agendadas
      // rolId 1/admin y rolId 3/recepcionista -> /servicios
      const rolId = Number(
        data.usuario.rolId ?? data.usuario.rolID ?? data.usuario.rol,
      );
      const rolName = String(
        data.usuario.rol || data.usuario.role || "",
      ).toLowerCase();

      if (rolId === 4 || rolName === "cliente" || rolName === "paciente") {
        router.push("/agendar-citas");
      } else if (rolId === 2 || rolName === "doctor") {
        router.push("/citas-agendadas");
      } else if (
        rolId === 1 ||
        rolName === "admin" ||
        rolId === 3 ||
        rolName === "recepcionista"
      ) {
        router.push("/servicios");
      } else {
        router.push("/entrada");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="flex h-screen items-center justify-center p-5"
      style={{ backgroundColor: "var(--light_gray)" }}
    >
      {/* Contenedor principal */}
      <div
        className="flex w-full max-w-6xl h-[80vh] shadow-lg rounded overflow-hidden"
        style={{ backgroundColor: "var(--main_gray)" }}
      >
        {/* Columna de la imagen */}
        <div className="flex-1 relative flex items-center justify-center p-5">
          <Image
            src="/logindiente.png"
            alt="Imagen lateral"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            loading="eager"
          />
        </div>

        {/* Columna del formulario */}
        <div
          className="flex-1 flex items-center justify-center p-8"
          style={{ backgroundColor: "var(--main_gray)" }}
        >
          <div className="w-full max-w-sm space-y-6">
            {/* Título principal con fuente Poppins y gradiente */}
            <div className="text-center mb-6">
              <label
                className={`${poppins.className} block text-6xl font-extrabold bg-clip-text text-transparent drop-shadow-lg tracking-wide relative -top-15`}
                style={{
                  backgroundImage: `linear-gradient(to right, var(--main_blue), #60D6A7)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                ING DENTAL
              </label>
            </div>

            {/* Mostrar error si existe */}
            {error && (
              <div
                className="text-center p-2 rounded"
                style={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {/* Campo de usuario */}
            <div>
              <label
                className="block mb-2 font-semibold"
                style={{ color: "var(--white)" }}
              >
                USUARIO
              </label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="Ej. Alvaro Casas"
                className="w-full rounded p-2 focus:outline-none shadow-sm"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid var(--main_blue)`,
                  color: "var(--white)",
                }}
                disabled={loading}
                required
              />
            </div>

            {/* Campo de contraseña */}
            <div>
              <label
                className="block mb-2 font-semibold"
                style={{ color: "var(--white)" }}
              >
                CONTRASEÑA
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full rounded p-2 focus:outline-none shadow-sm"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid var(--main_blue)`,
                  color: "var(--white)",
                }}
                disabled={loading}
                required
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3">
              {/* Botón de inicio de sesión - AHORA CON handleSubmit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full text-white shadow px-6 py-2 transition delay-50 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--main_blue)",
                  border: `1px solid var(--white)`,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#60D6A7";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "var(--main_blue)";
                  }
                }}
              >
                {loading ? "INICIANDO..." : "INICIAR SESIÓN"}
              </button>

              {/* Botón de crear cuenta */}
              <button
                onClick={handleCreateAccount}
                disabled={loading}
                className="w-full text-white shadow px-6 py-2 transition delay-50 rounded font-semibold disabled:opacity-50"
                style={{
                  backgroundColor: "transparent",
                  border: `2px solid var(--main_blue)`,
                  color: "var(--main_blue)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#60D6A7";
                    e.currentTarget.style.color = "var(--white)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--main_blue)";
                  }
                }}
              >
                CREAR CUENTA
              </button>
            </div>
          </div>
        </div>
      </div>

      <Link href="/">
        <button
          className="fixed bottom-6 right-6 px-5 py-3 rounded-full transition-all duration-300 transform hover:scale-110 flex items-center gap-2 group z-50"
          style={{
            backgroundColor: "var(--main_blue)",
            color: "var(--white)",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
            border: `1px solid var(--white)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#60D6A7";
            e.currentTarget.style.boxShadow =
              "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--main_blue)";
            e.currentTarget.style.boxShadow =
              "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-semibold">Volver al inicio</span>
        </button>
      </Link>
    </div>
  );
}
