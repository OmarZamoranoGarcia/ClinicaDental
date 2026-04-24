"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/barralateral/sidebar";

export default function Expedientes() {
  const [pacientes, setPacientes] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);
  const [editandoExpediente, setEditandoExpediente] = useState(null);
  const [editMotivo, setEditMotivo] = useState("");
  const [editObservaciones, setEditObservaciones] = useState("");
  const [citasHistorial, setCitasHistorial] = useState([]);
  const [mostrandoCitas, setMostrandoCitas] = useState(false);
  const [cargandoCitas, setCargandoCitas] = useState(false);

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

  const handleEditarExpediente = (expediente) => {
    setEditandoExpediente(expediente);
    setEditMotivo(expediente.MotivoGeneral || "");
    setEditObservaciones(expediente.ObservacionesGenerales || "");
    setExpedienteSeleccionado(expediente);
    setMostrandoCitas(false);
    setCitasHistorial([]);
  };

  const handleGuardarExpediente = async () => {
    if (!editandoExpediente) return;

    try {
      const res = await fetch(`/api/expedientes/${editandoExpediente.ExpedienteID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          MotivoGeneral: editMotivo,
          ObservacionesGenerales: editObservaciones,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error al actualizar expediente.");
        return;
      }

      const actualizado = {
        ...editandoExpediente,
        MotivoGeneral: editMotivo,
        ObservacionesGenerales: editObservaciones,
      };

      setExpedientes((prev) =>
        prev.map((exp) =>
          exp.ExpedienteID === actualizado.ExpedienteID ? actualizado : exp
        )
      );
      setExpedienteSeleccionado(actualizado);
      setEditandoExpediente(actualizado);
      alert("Expediente actualizado exitosamente.");
    } catch (error) {
      console.error(error);
      alert("Error de conexión al actualizar expediente.");
    }
  };

  const handleVerCitas = async (expediente) => {
    setExpedienteSeleccionado(expediente);
    setEditandoExpediente(null);
    setMostrandoCitas(true);
    setCargandoCitas(true);
    setCitasHistorial([]);

    try {
      const res = await fetch(
        `/api/expedientes/citas?expedienteID=${expediente.ExpedienteID}`
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al obtener citas.");
        setMostrandoCitas(false);
      } else {
        setCitasHistorial(data);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al obtener citas.");
      setMostrandoCitas(false);
    } finally {
      setCargandoCitas(false);
    }
  };

  const cerrarModal = () => {
    setExpedienteSeleccionado(null);
    setEditandoExpediente(null);
    setMostrandoCitas(false);
    setCitasHistorial([]);
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
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditarExpediente(exp);
                      }}
                      className="rounded px-3 py-2 bg-yellow-500 text-black font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerCitas(exp);
                      }}
                      className="rounded px-3 py-2 bg-blue-600 text-white font-semibold"
                    >
                      Ver citas
                    </button>
                  </div>
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
            onClick={cerrarModal}
          >
            <div
              className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Detalles del Expediente</h2>
              <p><strong>ID:</strong> {expedienteSeleccionado.ExpedienteID}</p>
              <p><strong>Paciente ID:</strong> {expedienteSeleccionado.PacienteID}</p>
              <p><strong>Doctor ID:</strong> {expedienteSeleccionado.UsuarioID}</p>
              <p><strong>Fecha:</strong> {new Date(expedienteSeleccionado.FechaCreacion).toLocaleDateString()}</p>
              <p><strong>Motivo general:</strong> {expedienteSeleccionado.MotivoGeneral || "N/A"}</p>
              <p><strong>Observaciones generales:</strong> {expedienteSeleccionado.ObservacionesGenerales || "N/A"}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleEditarExpediente(expedienteSeleccionado)}
                  className="rounded px-4 py-2 bg-yellow-500 text-black font-semibold"
                >
                  Editar expediente
                </button>
                <button
                  type="button"
                  onClick={() => handleVerCitas(expedienteSeleccionado)}
                  className="rounded px-4 py-2 bg-blue-600 text-white font-semibold"
                >
                  Ver citas del paciente
                </button>
              </div>

              {editandoExpediente && editandoExpediente.ExpedienteID === expedienteSeleccionado.ExpedienteID && (
                <div className="mt-6 border-t border-gray-700 pt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Editar expediente</h3>

                  <label className="block">
                    <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                      Motivo general
                    </span>
                    <textarea
                      rows="4"
                      value={editMotivo}
                      onChange={(e) => setEditMotivo(e.target.value)}
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
                      value={editObservaciones}
                      onChange={(e) => setEditObservaciones(e.target.value)}
                      className="mt-2 w-full rounded px-3 py-2"
                      style={{
                        backgroundColor: "transparent",
                        border: `1px solid var(--light_gray)`,
                        color: "var(--white)",
                      }}
                    />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleGuardarExpediente}
                      className="rounded px-4 py-2 bg-green-600 text-white font-semibold"
                    >
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditandoExpediente(null)}
                      className="rounded px-4 py-2 bg-gray-600 text-white font-semibold"
                    >
                      Cancelar edición
                    </button>
                  </div>
                </div>
              )}

              {mostrandoCitas && (
                <div className="mt-6 border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold mb-3">Historial de citas</h3>

                  {cargandoCitas ? (
                    <p>Cargando citas...</p>
                  ) : citasHistorial.length > 0 ? (
                    <div className="space-y-3">
                      {citasHistorial.map((cita) => (
                        <div
                          key={cita.CitaID}
                          className="rounded border border-gray-700 p-3"
                        >
                          <p><strong>Paciente:</strong> {cita.NombreCompleto}</p>
                          <p><strong>Cita ID:</strong> {cita.CitaID}</p>
                          <p><strong>Fecha:</strong> {new Date(cita.FechaCita).toLocaleDateString()}</p>
                          <p><strong>Hora:</strong> {cita.HoraCita}</p>
                          <p><strong>Estado:</strong> {cita.Estado}</p>
                          <p><strong>Notas:</strong> {cita.Notas || "N/A"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No hay citas registradas para este expediente.</p>
                  )}
                </div>
              )}

              <button
                className="mt-6 px-4 py-2 bg-gray-600 text-white rounded"
                onClick={cerrarModal}
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