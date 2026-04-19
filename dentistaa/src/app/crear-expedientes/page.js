"use client";

import Sidebar from "@/components/barralateral/sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isRole1, isRole2 } from "@/lib/auth";

function formatDateTimeLocal(date) {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date - tzOffset).toISOString().slice(0, 16);
}

export default function CrearExpedientes() {
  const router = useRouter();
  const [pacienteID, setPacienteID] = useState("");
  const [usuarioID, setUsuarioID] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [motivoGeneral, setMotivoGeneral] = useState("");
  const [observacionesGenerales, setObservacionesGenerales] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const usuario = getCurrentUser();
    if (!usuario) {
      router.push("/entrada");
      return;
    }
    if (!isRole1(usuario) && !isRole2(usuario)) {
      router.push("/entrada");
      return;
    }

    setFechaCreacion(formatDateTimeLocal(new Date()));
  }, [router]);

  useEffect(() => {
    fetch("/api/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(data));

    fetch("/api/usuarios?rol=2")
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pacienteID || !usuarioID) {
      alert("Selecciona un paciente y un doctor.");
      return;
    }

    const expediente = {
      PacienteID: parseInt(pacienteID),
      UsuarioID: parseInt(usuarioID),
      FechaCreacion: fechaCreacion,
      MotivoGeneral: motivoGeneral,
      ObservacionesGenerales: observacionesGenerales,
    };

    try {
      const res = await fetch("/api/expedientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expediente),
      });
      if (res.ok) {
        alert("Expediente creado exitosamente.");
        setPacienteID("");
        setUsuarioID("");
        setMotivoGeneral("");
        setObservacionesGenerales("");
        setFechaCreacion(formatDateTimeLocal(new Date()));
      } else {
        const data = await res.json();
        alert(data.error || "Error al crear expediente.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "var(--main_black)", color: "var(--white)" }}
    >
      <Sidebar />

      <main className="flex-1 py-10 px-6 lg:px-20 relative overflow-y-auto">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: "var(--white)" }}
        >
          CREAR EXPEDIENTE
        </h1>

        <div
          className="shadow-xl rounded-lg p-6"
          style={{
            border: `1px solid var(--main_blue)`,
            backgroundColor: "var(--main_gray)",
          }}
        >
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                  Paciente
                </span>
                <select
                  value={pacienteID}
                  onChange={(e) => setPacienteID(e.target.value)}
                  className="mt-2 w-full rounded px-3 py-2"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid var(--light_gray)`,
                    color: "var(--white)",
                  }}
                  required
                >
                  <option value="">Selecciona un paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.PacienteID} value={p.PacienteID}>
                      {p.NombreCompleto}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                  Doctor
                </span>
                <select
                  value={usuarioID}
                  onChange={(e) => setUsuarioID(e.target.value)}
                  className="mt-2 w-full rounded px-3 py-2"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid var(--light_gray)`,
                    color: "var(--white)",
                  }}
                  required
                >
                  <option value="">Selecciona un doctor</option>
                  {usuarios.map((u) => (
                    <option key={u.UsuarioID} value={u.UsuarioID}>
                      {u.NombreCompleto}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                Fecha de creación
              </span>
              <input
                type="datetime-local"
                value={fechaCreacion}
                disabled
                className="mt-2 w-full rounded px-3 py-2 bg-slate-900"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid var(--light_gray)`,
                  color: "var(--white)",
                }}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                Motivo general
              </span>
              <textarea
                rows="4"
                value={motivoGeneral}
                onChange={(e) => setMotivoGeneral(e.target.value)}
                placeholder="Describe el motivo general del expediente"
                className="mt-2 w-full rounded px-3 py-2"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid var(--light_gray)`,
                  color: "var(--white)",
                }}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                Observaciones generales
              </span>
              <textarea
                rows="4"
                value={observacionesGenerales}
                onChange={(e) => setObservacionesGenerales(e.target.value)}
                placeholder="Escribe observaciones generales"
                className="mt-2 w-full rounded px-3 py-2"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid var(--light_gray)`,
                  color: "var(--white)",
                }}
              />
            </label>

            <button
              type="submit"
              className="mt-3 w-full rounded py-3 font-semibold shadow-xl"
              style={{
                backgroundColor: "var(--main_blue)",
                border: `1px solid var(--white)`,
                color: "var(--white)",
              }}
            >
              GUARDAR EXPEDIENTE
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}