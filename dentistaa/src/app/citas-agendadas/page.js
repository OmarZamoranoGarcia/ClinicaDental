"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/barralateral/sidebar";

export default function CitasAgendadas() {
  const [citas, setCitas] = useState([]);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    fecha: "",
    hora: "",
    motivo: "",
  });

  // Obtener citas
  const obtenerCitas = async () => {
    const res = await fetch("/api/citas");
    const data = await res.json();
    setCitas(data);
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  // ELIMINAR CITA
  const eliminarCita = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta cita?")) return;

    await fetch(`/api/citas/${id}`, { method: "DELETE" });

    obtenerCitas();
  };

  // ABRIR MODAL DE EDICIÓN
  const abrirEditar = (cita) => {
    setEditando(cita.id);
    setForm({
      nombre: cita.nombre,
      telefono: cita.telefono,
      correo: cita.correo,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
    });
  };

  // GUARDAR CAMBIOS
  const guardarEdicion = async () => {
    const res = await fetch(`/api/citas/${editando}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form), // Asegúrate de que 'form' tenga los datos correctos
    });

    const data = await res.json();

    console.log("Respuesta de guardar:", data);

    if (res.ok) {
      alert("Cita guardada con éxito");
      setEditando(null);
      obtenerCitas(); // Actualiza la lista de citas
    } else {
      alert("Error al guardar los cambios");
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "var(--main_black)", color: "var(--white)" }}
    >
      <Sidebar />

      <main className="flex-1 py-10 px-6 lg:px-20 relative">
        <div className="absolute top-1 right-10 p-2 text-center"></div>

        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: "var(--white)" }}
        >
          CITAS
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
                <th
                  className="p-3 border-b"
                  style={{ borderColor: "var(--main_gray)" }}
                >
                  Nombre
                </th>
                <th
                  className="p-3 border-b"
                  style={{ borderColor: "var(--main_gray)" }}
                >
                  Teléfono
                </th>
                <th
                  className="p-3 border-b"
                  style={{ borderColor: "var(--main_gray)" }}
                >
                  Correo
                </th>
                <th
                  className="p-3 border-b"
                  style={{ borderColor: "var(--main_gray)" }}
                >
                  Fecha
                </th>
                <th
                  className="p-3 border-b"
                  style={{ borderColor: "var(--main_gray)" }}
                >
                  Hora
                </th>
                <th
                  className="p-3 border-b"
                  style={{ borderColor: "var(--main_gray)" }}
                >
                  Motivo
                </th>
                <th
                  className="p-3 border-b text-center"
                  style={{ borderColor: "var(--main_gray)" }}
                >
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {citas.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-4"
                    style={{ color: "var(--white)" }}
                  >
                    No hay citas registradas.
                  </td>
                </tr>
              ) : (
                citas.map((cita) => (
                  <tr
                    key={cita.id}
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
                      {cita.nombre}
                    </td>
                    <td className="p-3" style={{ color: "var(--white)" }}>
                      {cita.telefono}
                    </td>
                    <td className="p-3" style={{ color: "var(--white)" }}>
                      {cita.correo}
                    </td>
                    <td className="p-3" style={{ color: "var(--white)" }}>
                      {cita.fecha}
                    </td>
                    <td className="p-3" style={{ color: "var(--white)" }}>
                      {cita.hora}
                    </td>
                    <td className="p-3" style={{ color: "var(--white)" }}>
                      {cita.motivo}
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
                        onClick={() => eliminarCita(cita.id)}
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
              className="p-6 rounded-xl shadow-2xl w-96 transition-all duration-300"
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

              {["nombre", "telefono", "correo", "fecha", "hora", "motivo"].map(
                (campo) => (
                  <input
                    key={campo}
                    className="w-full p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      border: `1px solid var(--main_blue)`,
                      color: "var(--white)",
                      backgroundColor: "var(--light_gray)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                    }}
                    placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                    value={form[campo]}
                    onChange={(e) =>
                      setForm({ ...form, [campo]: e.target.value })
                    }
                  />
                ),
              )}

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
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}