"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["600", "800"],
  subsets: ["latin"],
});

export default function Registro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",
    nombreUsuario: "",
    contrasena: "",
    confirmarContrasena: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    // Validar longitud de contraseña
    if (formData.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    // Validar fecha de nacimiento
    if (!formData.fechaNacimiento) {
      setError("La fecha de nacimiento es requerida");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/registro-paciente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreCompleto: formData.nombreCompleto,
          email: formData.email,
          telefono: formData.telefono,
          fechaNacimiento: formData.fechaNacimiento,
          direccion: formData.direccion,
          nombreUsuario: formData.nombreUsuario,
          contrasena: formData.contrasena
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la cuenta");
      }

      setSuccess("Cuenta creada exitosamente. Redirigiendo al login...");
      
      // Redirigir al login de pacientes después de 2 segundos
      setTimeout(() => {
        router.push("/entrada");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-5"
      style={{ backgroundColor: "var(--light_gray)" }}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden"
        style={{ backgroundColor: "var(--main_gray)" }}
      >
        {/* Header con gradiente */}
        <div className="p-8 text-center border-b" style={{ borderColor: "var(--main_blue)" }}>
          <h1 
            className={`${poppins.className} text-4xl font-extrabold bg-clip-text text-transparent`}
            style={{
              backgroundImage: `linear-gradient(to right, var(--main_blue), #60D6A7)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            REGISTRO DE PACIENTE
          </h1>
          <p className="mt-2" style={{ color: "var(--white)" }}>
            Crea tu cuenta para agendar citas fácilmente
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Mensajes de error y éxito */}
          {error && (
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: "#dc2626", color: "white" }}
            >
              {error}
            </div>
          )}
          
          {success && (
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: "#10b981", color: "white" }}
            >
              {success}
            </div>
          )}

          {/* Nombre Completo */}
          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: "var(--white)" }}
            >
              NOMBRE COMPLETO *
            </label>
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez García"
              className="w-full rounded-lg p-3 focus:outline-none transition-all"
              style={{
                backgroundColor: "transparent",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
              }}
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: "var(--white)" }}
            >
              CORREO ELECTRÓNICO *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className="w-full rounded-lg p-3 focus:outline-none transition-all"
              style={{
                backgroundColor: "transparent",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
              }}
              disabled={loading}
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: "var(--white)" }}
            >
              TELÉFONO
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej. 5512345678"
              className="w-full rounded-lg p-3 focus:outline-none transition-all"
              style={{
                backgroundColor: "transparent",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
              }}
              disabled={loading}
            />
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: "var(--white)" }}
            >
              FECHA DE NACIMIENTO *
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="w-full rounded-lg p-3 focus:outline-none transition-all"
              style={{
                backgroundColor: "transparent",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                colorScheme: "dark",
              }}
              disabled={loading}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Dirección */}
          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: "var(--white)" }}
            >
              DIRECCIÓN
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ej. Calle Principal #123, Colonia Centro"
              className="w-full rounded-lg p-3 focus:outline-none transition-all"
              style={{
                backgroundColor: "transparent",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
              }}
              disabled={loading}
            />
          </div>

          {/* Nombre de Usuario */}
          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: "var(--white)" }}
            >
              NOMBRE DE USUARIO *
            </label>
            <input
              type="text"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              placeholder="Ej. juanperez"
              className="w-full rounded-lg p-3 focus:outline-none transition-all"
              style={{
                backgroundColor: "transparent",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
              }}
              disabled={loading}
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: "var(--white)" }}
            >
              CONTRASEÑA *
            </label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-lg p-3 focus:outline-none transition-all"
              style={{
                backgroundColor: "transparent",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
              }}
              disabled={loading}
              required
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label 
              className="block mb-2 font-semibold"
              style={{ color: "var(--white)" }}
            >
              CONFIRMAR CONTRASEÑA *
            </label>
            <input
              type="password"
              name="confirmarContrasena"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className="w-full rounded-lg p-3 focus:outline-none transition-all"
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
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--main_blue)",
                color: "var(--white)",
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
              {loading ? "CREANDO CUENTA..." : "REGISTRARSE"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50"
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
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}