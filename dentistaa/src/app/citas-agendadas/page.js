"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/barralateral/sidebar";
import { getCurrentUser, isRole4 } from "@/lib/auth";

export default function CitasAgendadas() {
  const router = useRouter();

  useEffect(() => {
    const usuario = getCurrentUser();
    if (!usuario) {
      router.push("/entrada");
      return;
    }
    if (isRole4(usuario)) {
      router.push("/agendar-citas");
    }
  }, [router]);

  const [citas, setCitas] = useState([]);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    pacienteID: "",
    servicioID: "",
    usuarioID: "",
    fechaCita: "",
    horaCita: "",
    estado: "Pendiente",
    notas: "",
  });

  // Obtener datos para selects
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Obtener citas con datos relacionados
  const obtenerCitas = async () => {
    try {
      const res = await fetch("/api/citas");
      const data = await res.json();
      setCitas(data);
    } catch (error) {
      console.error("Error al obtener citas:", error);
    }
  };

  // Obtener datos para los selects
  const obtenerDatosSelects = async () => {
    try {
      const [pacientesRes, serviciosRes, usuariosRes] = await Promise.all([
        fetch("/api/pacientes"),
        fetch("/api/servicios"),
        fetch("/api/usuarios"),
      ]);

      const pacientesData = await pacientesRes.json();
      const serviciosData = await serviciosRes.json();
      const usuariosData = await usuariosRes.json();

      setPacientes(pacientesData);
      setServicios(serviciosData);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error("Error al obtener datos para selects:", error);
    }
  };

  useEffect(() => {
    obtenerCitas();
    obtenerDatosSelects();
  }, []);

  // ELIMINAR CITA
  const eliminarCita = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta cita?")) return;

    try {
      const res = await fetch(`/api/citas/${id}`, { method: "DELETE" });
      if (res.ok) {
        obtenerCitas();
      } else {
        alert("Error al eliminar la cita");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar la cita");
    }
  };

  // ABRIR MODAL DE EDICIÓN
  const abrirEditar = (cita) => {
    setEditando(cita.CitaID);
    setForm({
      pacienteID: cita.PacienteID,
      servicioID: cita.ServicioID,
      usuarioID: cita.UsuarioID,
      fechaCita: cita.FechaCita,
      horaCita: cita.HoraCita,
      estado: cita.Estado,
      notas: cita.Notas || "",
    });
  };

  // GUARDAR CAMBIOS
  const guardarEdicion = async () => {
    try {
      const res = await fetch(`/api/citas/${editando}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cita actualizada con éxito");
        setEditando(null);
        obtenerCitas();
      } else {
        alert(data.error || "Error al guardar los cambios");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios");
    }
  };

  // Función para obtener el nombre del paciente
  const getNombrePaciente = (pacienteID) => {
    const paciente = pacientes.find(p => p.PacienteID === pacienteID);
    return paciente ? paciente.NombreCompleto : "Cargando...";
  };

  // Función para obtener el nombre del servicio
  const getNombreServicio = (servicioID) => {
    const servicio = servicios.find(s => s.ServicioID === servicioID);
    return servicio ? servicio.NombreServicio : "Cargando...";
  };

  // Función para obtener el nombre del usuario
  const getNombreUsuario = (usuarioID) => {
    const usuario = usuarios.find(u => u.UsuarioID === usuarioID);
    return usuario ? usuario.NombreCompleto : "Cargando...";
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
          CITAS AGENDADAS
        </h1>

        <div
          className="overflow-x-auto shadow-xl rounded-lg"
          style={{
            border: `1px solid var(--main_blue)`,
            backgroundColor: "var(--main_gray)",
          }}
        >
          <table className="min-w-full text-left">
            <thead
              style={{
                backgroundColor: "var(--main_blue)",
                color: "var(--white)",
              }}
            >
              <tr>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Paciente
                </th>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Servicio
                </th>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Dentista
                </th>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Fecha
                </th>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Hora
                </th>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Estado
                </th>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Notas
                </th>
                <th className="p-3 border-b text-center" style={{ borderColor: "var(--main_gray)" }}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {citas.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-4"
                    style={{ color: "var(--white)" }}
                  >
                    No hay citas registradas.
                  </td>
                </tr>
              ) : (
                citas.map((cita) => (
                  <tr
                    key={cita.CitaID}
                    className="border-b transition-colors"
                    style={{
                      borderColor: "var(--main_gray)",
                      backgroundColor: "var(--light_gray)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2A2F3A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--light_gray)";
                    }}
                  >
                    <td className="p-3" style={{ color: "var(--white)" }}>
                      {getNombrePaciente(cita.PacienteID)}
                    </td>
                    <td className="p-3" style={{ color: "var(--white)" }}>
                      {getNombreServicio(cita.ServicioID)}
                    </td>
                    <td className="p-3" style={{ color: "var(--white)" }}>
                      {getNombreUsuario(cita.UsuarioID)}
                    </td>
                    <td className="p-3" style={{ color: "var(--white)" }}>
                      {new Date(cita.FechaCita).toLocaleDateString('es-MX')}
                    </td>
                    <td className="p-3" style={{ color: "var(--white)" }}>
                      {cita.HoraCita.substring(0, 5)}
                    </td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: 
                            cita.Estado === 'Pendiente' ? '#F59E0B' :
                            cita.Estado === 'Confirmada' ? '#10B981' :
                            cita.Estado === 'Cancelada' ? '#EF4444' :
                            '#6B7280',
                          color: 'white'
                        }}
                      >
                        {cita.Estado}
                      </span>
                    </td>
                    <td className="p-3" style={{ color: "var(--white)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {cita.Notas || "-"}
                    </td>
                    <td className="p-3 text-center space-x-3">
                      <button
                        className="px-4 py-2 rounded text-white transition-all duration-300 transform hover:scale-105"
                        style={{
                          backgroundColor: "var(--main_blue)",
                          border: `1px solid var(--white)`,
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#60D6A7";
                          e.currentTarget.style.boxShadow =
                            "0 10px 15px -3px rgba(0, 0, 0, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--main_blue)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 6px -1px rgba(0, 0, 0, 0.3)";
                        }}
                        onClick={() => abrirEditar(cita)}
                      >
                        Editar
                      </button>

                      <button
                        className="px-4 py-2 rounded text-white transition-all duration-300 transform hover:scale-105"
                        style={{
                          backgroundColor: "#DC2626",
                          border: `1px solid var(--white)`,
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#EF4444";
                          e.currentTarget.style.boxShadow =
                            "0 10px 15px -3px rgba(0, 0, 0, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#DC2626";
                          e.currentTarget.style.boxShadow =
                            "0 4px 6px -1px rgba(0, 0, 0, 0.3)";
                        }}
                        onClick={() => eliminarCita(cita.CitaID)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL EDITAR */}
        {editando && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div
              className="p-6 rounded-xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto transition-all duration-300"
              style={{
                backgroundColor: "var(--main_gray)",
                color: "var(--white)",
                border: `1px solid var(--main_blue)`,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "var(--main_blue)" }}
              >
                Editar Cita
              </h2>

              {/* Select Paciente */}
              <div className="mb-3">
                <label className="block mb-1 text-sm" style={{ color: "var(--white)" }}>
                  Paciente
                </label>
                <select
                  className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    border: `1px solid var(--main_blue)`,
                    color: "var(--white)",
                    backgroundColor: "var(--light_gray)",
                  }}
                  value={form.pacienteID}
                  onChange={(e) => setForm({ ...form, pacienteID: e.target.value })}
                >
                  <option value="">Seleccionar paciente</option>
                  {pacientes.map(paciente => (
                    <option key={paciente.PacienteID} value={paciente.PacienteID}>
                      {paciente.NombreCompleto}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Servicio */}
              <div className="mb-3">
                <label className="block mb-1 text-sm" style={{ color: "var(--white)" }}>
                  Servicio
                </label>
                <select
                  className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    border: `1px solid var(--main_blue)`,
                    color: "var(--white)",
                    backgroundColor: "var(--light_gray)",
                  }}
                  value={form.servicioID}
                  onChange={(e) => setForm({ ...form, servicioID: e.target.value })}
                >
                  <option value="">Seleccionar servicio</option>
                  {servicios.map(servicio => (
                    <option key={servicio.ServicioID} value={servicio.ServicioID}>
                      {servicio.NombreServicio}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Usuario (Dentista) */}
              <div className="mb-3">
                <label className="block mb-1 text-sm" style={{ color: "var(--white)" }}>
                  Dentista
                </label>
                <select
                  className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    border: `1px solid var(--main_blue)`,
                    color: "var(--white)",
                    backgroundColor: "var(--light_gray)",
                  }}
                  value={form.usuarioID}
                  onChange={(e) => setForm({ ...form, usuarioID: e.target.value })}
                >
                  <option value="">Seleccionar dentista</option>
                  {usuarios.map(usuario => (
                    <option key={usuario.UsuarioID} value={usuario.UsuarioID}>
                      {usuario.NombreCompleto}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div className="mb-3">
                <label className="block mb-1 text-sm" style={{ color: "var(--white)" }}>
                  Fecha
                </label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    border: `1px solid var(--main_blue)`,
                    color: "var(--white)",
                    backgroundColor: "var(--light_gray)",
                  }}
                  value={form.fechaCita}
                  onChange={(e) => setForm({ ...form, fechaCita: e.target.value })}
                />
              </div>

              {/* Hora */}
              <div className="mb-3">
                <label className="block mb-1 text-sm" style={{ color: "var(--white)" }}>
                  Hora
                </label>
                <input
                  type="time"
                  className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    border: `1px solid var(--main_blue)`,
                    color: "var(--white)",
                    backgroundColor: "var(--light_gray)",
                  }}
                  value={form.horaCita}
                  onChange={(e) => setForm({ ...form, horaCita: e.target.value })}
                />
              </div>

              {/* Estado */}
              <div className="mb-3">
                <label className="block mb-1 text-sm" style={{ color: "var(--white)" }}>
                  Estado
                </label>
                <select
                  className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    border: `1px solid var(--main_blue)`,
                    color: "var(--white)",
                    backgroundColor: "var(--light_gray)",
                  }}
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Completada">Completada</option>
                </select>
              </div>

              {/* Notas */}
              <div className="mb-3">
                <label className="block mb-1 text-sm" style={{ color: "var(--white)" }}>
                  Notas
                </label>
                <textarea
                  className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    border: `1px solid var(--main_blue)`,
                    color: "var(--white)",
                    backgroundColor: "var(--light_gray)",
                    resize: "vertical"
                  }}
                  rows="3"
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  placeholder="Notas adicionales..."
                />
              </div>

              <div className="flex justify-between mt-6 gap-3">
                <button
                  className="px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex-1"
                  style={{
                    backgroundColor: "var(--light_gray)",
                    color: "var(--white)",
                    border: `1px solid var(--main_blue)`,
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2A2F3A";
                    e.currentTarget.style.boxShadow =
                      "0 10px 15px -3px rgba(0, 0, 0, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--light_gray)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(0, 0, 0, 0.3)";
                  }}
                  onClick={() => setEditando(null)}
                >
                  Cancelar
                </button>

                <button
                  className="px-5 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 flex-1"
                  style={{
                    backgroundColor: "var(--main_blue)",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#60D6A7";
                    e.currentTarget.style.boxShadow =
                      "0 10px 15px -3px rgba(0, 0, 0, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--main_blue)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(0, 0, 0, 0.3)";
                  }}
                  onClick={guardarEdicion}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}