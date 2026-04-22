"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/barralateral/sidebar";

export default function Expedientes() {
  const [pacientes, setPacientes] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);

  // Cargar pacientes para el filtro
  useEffect(() => {
    fetch("/api/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(data));
  }, []);

  // Cargar expedientes filtrados
  useEffect(() => {
    if (filtroPaciente) {
      fetch(`/api/expedientes?pacienteID=${filtroPaciente}`)
        .then((res) => res.json())
        .then((data) => setExpedientes(data));
    } else {
      setExpedientes([]);
    }
  }, [filtroPaciente]);

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
          VER EXPEDIENTES
        </h1>

        <div
          className="shadow-xl rounded-lg p-6 mb-6"
          style={{
            border: `1px solid var(--main_blue)`,
            backgroundColor: "var(--main_gray)",
          }}
        >
          <label className="block">
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--white)" }}
            >
              Filtrar por Paciente
            </span>
            <select
              value={filtroPaciente}
              onChange={(e) => setFiltroPaciente(e.target.value)}
              className="mt-2 w-full rounded px-3 py-2"
              style={{
                backgroundColor: "transparent",
                border: `1px solid var(--light_gray)`,
                color: "var(--white)",
              }}
            >
              <option value="">Selecciona un paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.PacienteID} value={paciente.PacienteID}>
                  {paciente.NombreCompleto}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          className="shadow-xl rounded-lg p-6"
          style={{
            border: `1px solid var(--main_blue)`,
            backgroundColor: "var(--main_gray)",
          }}
        >
          {expedientes.length > 0 ? (
            <div className="grid gap-4">
              {expedientes.map((exp) => (
                <div
                  key={exp.ExpedienteID}
                  className="border rounded p-4 cursor-pointer"
                  style={{ borderColor: "var(--light_gray)" }}
                  onClick={() => setExpedienteSeleccionado(exp)}
                >
                  <h3 className="font-semibold">Expediente ID: {exp.ExpedienteID}</h3>
                  <p>Fecha: {new Date(exp.FechaCreacion).toLocaleDateString()}</p>
                  <p>Motivo: {exp.MotivoGeneral || "N/A"}</p>
                </div>
              ))}
            </div>
          ) : filtroPaciente ? (
            <p>No se encontraron expedientes para este paciente.</p>
          ) : (
            <p>Selecciona un paciente para ver sus expedientes.</p>
          )}
        </div>

        {expedienteSeleccionado && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setExpedienteSeleccionado(null)}
          >
            <div
              className="bg-gray-800 p-6 rounded-lg max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Detalles del Expediente</h2>
              <p><strong>ID:</strong> {expedienteSeleccionado.ExpedienteID}</p>
              <p><strong>Paciente ID:</strong> {expedienteSeleccionado.PacienteID}</p>
              <p><strong>Doctor ID:</strong> {expedienteSeleccionado.UsuarioID}</p>
              <p><strong>Fecha:</strong> {new Date(expedienteSeleccionado.FechaCreacion).toLocaleDateString()}</p>
              <p><strong>Motivo general:</strong> {expedienteSeleccionado.MotivoGeneral || "N/A"}</p>
              <p><strong>Observaciones generales:</strong> {expedienteSeleccionado.ObservacionesGenerales || "N/A"}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setExpedienteSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}