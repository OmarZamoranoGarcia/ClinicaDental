"use client";

import { useState } from "react";
import Sidebar from "@/components/barralateral/sidebar";

export default function Menu() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const enviarDatos = async () => {
    const res = await fetch("/api/agendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, telefono, correo, fecha, hora, motivo }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Cita registrada correctamente");
      setNombre("");
      setTelefono("");
      setCorreo("");
      setFecha("");
      setHora("");
      setMotivo("");
    } else {
      alert("Error: " + data.error);
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--main_black)" }}
    >
      <Sidebar />

      <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-auto relative">
        <h1
          className="text-2xl font-bold mb-8"
          style={{ color: "var(--white)" }}
        >
          AGENDAR CITAS
        </h1>

        <div className="max-w-3xl space-y-6" style={{ color: "var(--white)" }}>
          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              NOMBRE COMPLETO
            </label>
            <input
              type="text"
              placeholder="Ej. Alvaro Gabino Casas Ramires"
              className="w-full rounded p-2"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              TELÉFONO
            </label>
            <input
              type="text"
              placeholder="Ej. 664-741-5901"
              className="w-full rounded p-2"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              CORREO
            </label>
            <input
              type="email"
              placeholder="citas@gmail.com"
              className="w-full rounded p-2"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              FECHA
            </label>
            <input
              type="text"
              placeholder="DD/MM/AAAA"
              className="w-32 rounded p-2 text-center"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              HORA
            </label>
            <input
              type="text"
              placeholder="00:00"
              className="w-24 rounded p-2 text-center"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              MOTIVO
            </label>
            <textarea
              rows="5"
              placeholder="Descripcion..."
              className="w-full rounded p-2 resize-none"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            ></textarea>
          </div>

          <div className="text-right">
            <button
              onClick={enviarDatos}
              className="px-8 py-3 transition-all duration-300 rounded-lg font-semibold tracking-wide"
              style={{
                color: "var(--white)",
                backgroundColor: "var(--main_blue)",
                border: `1px solid var(--white)`,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#60D6A7";
                e.currentTarget.style.boxShadow =
                  "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.transform = "scale(1.01)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--main_blue)";
                e.currentTarget.style.boxShadow =
                  "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              BOTÓN AGENDAR
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}