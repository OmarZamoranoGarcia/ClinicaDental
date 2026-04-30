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
  
  const [step, setStep] = useState(1); // 1: Formulario, 2: Código
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [codigoIngresado, setCodigoIngresado] = useState("");
  
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

    // Si es el paso 1, enviamos el código de verificación por correo
    if (step === 1) {
      try {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setCodigoGenerado(code);

        const response = await fetch("/api/correo/enviar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailDirecto: formData.email,
            nombreDirecto: formData.nombreCompleto,
            asunto: "Código de Verificación - Registro Clínica Dental",
            cuerpo: `
              <div style="font-family: sans-serif; color: #2c3e50;">
                <h1>Verifica tu cuenta 🎉</h1>
                <p>Hola <strong>${formData.nombreCompleto}</strong>,</p>
                <p>Para completar tu registro, utiliza el siguiente código de seguridad:</p>
                <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3b82f6; border-radius: 10px;">
                  ${code}
                </div>
                <p>Este código es necesario para confirmar que tienes acceso a este correo.</p>
              </div>
            `
          }),
        });

        if (!response.ok) throw new Error("Error al enviar el correo de verificación");

        setStep(2);
        setSuccess("Código enviado. Por favor revisa tu bandeja de entrada.");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Si es el paso 2, validamos el código antes de registrar en la DB
    if (codigoIngresado !== codigoGenerado) {
      setError("El código de verificación es incorrecto");
      setLoading(false);
      return;
    }

    await registrarUsuario();
  };

  const registrarUsuario = async () => {
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

          {step === 1 ? (
            <>
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
            </>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="text-center space-y-4 py-4">
                <label className="block text-xl font-bold" style={{ color: "var(--white)" }}>
                  INGRESA EL CÓDIGO DE 6 DÍGITOS
                </label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="000000"
                  value={codigoIngresado}
                  onChange={(e) => setCodigoIngresado(e.target.value)}
                  className="w-full text-center text-3xl tracking-[10px] font-mono rounded-lg p-4 focus:outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: `2px solid var(--main_blue)`,
                    color: "var(--white)",
                  }}
                  disabled={loading}
                />
                <p className="text-sm" style={{ color: "var(--white)", opacity: 0.8 }}>
                  El código fue enviado a <strong>{formData.email}</strong>
                </p>
                <button 
                  type="button"
                  onClick={() => { setStep(1); setError(""); }}
                  className="text-sm underline"
                  style={{ color: "var(--main_blue)" }}
                >
                  ¿Correo incorrecto? Volver atrás
                </button>
              </div>
            </div>
          )}

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
              {loading ? "PROCESANDO..." : (step === 1 ? "ENVIAR CÓDIGO" : "VERIFICAR Y REGISTRAR")}
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