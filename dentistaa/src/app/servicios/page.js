"use client";

import Sidebar from "@/components/barralateral/sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isRole1, isRole2, isRole3, isRole4 } from "@/lib/auth";

export default function Servicios() {
  const router = useRouter();

  useEffect(() => {
    const usuario = getCurrentUser();
    if (!usuario) {
      router.push("/entrada");
      return;
    }
    if (isRole4(usuario)) {
      router.push("/agendar-citas");
      return;
    }
    if (isRole2(usuario)) {
      router.push("/citas-agendadas");
      return;
    }
    if (isRole1(usuario) || isRole3(usuario)) {
      return; // Acceso permitido
    }
    router.push("/entrada");
  }, [router]);

  // Estado para los servicios
  const [servicios, setServicios] = useState([]);
  const [nuevoServicio, setNuevoServicio] = useState({
    tipo: "",
    descripcion: "",
    duracion: 30,
    costo: "",
    activo: true
  });

  // Estado para los horarios (un solo objeto como fuente de verdad)
  const [horarios, setHorarios] = useState({
    "Lunes": "8:00 AM - 6:00 PM",
    "Martes": "8:00 AM - 6:00 PM",
    "Miércoles": "8:00 AM - 6:00 PM",
    "Jueves": "8:00 AM - 6:00 PM",
    "Viernes": "8:00 AM - 6:00 PM",
    "Sábado": "8:00 AM - 3:00 PM",
    "Domingo": "Cerrado"
  });

  const [diaEditando, setDiaEditando] = useState(null);
  const [valorTempHorario, setValorTempHorario] = useState("");
  const [editando, setEditando] = useState(null);

  const [telefono, setTelefono] = useState("664 234 567 890");
  const [editandoTelefono, setEditandoTelefono] = useState(false);
  const [valorTempTelefono, setValorTempTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar horarios de localStorage al iniciar
  useEffect(() => {
    const savedHorarios = localStorage.getItem("clinica_horarios");
    if (savedHorarios) {
      setHorarios(JSON.parse(savedHorarios));
    }
    const savedTelefono = localStorage.getItem("clinica_telefono");
    if (savedTelefono) {
      setTelefono(savedTelefono);
    }
  }, []);

  // Cargar los servicios desde la API
  const cargarServicios = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/servicios?todos=true");
      const data = await response.json();

      if (Array.isArray(data)) {
        const serviciosDesdeApi = data.map((s) => ({
          id: s.ServicioID,
          tipo: s.NombreServicio,
          descripcion: s.Descripcion || "",
          duracion: s.DuracionMinutos,
          costo: s.Precio,
          activo: s.Activo == 1
        }));
        setServicios(serviciosDesdeApi);
      }
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      alert("Error al cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  // Función para agregar un nuevo servicio
  const agregarServicio = async (e) => {
    e.preventDefault();
    if (!nuevoServicio.tipo || !nuevoServicio.costo) {
      alert("Por favor completa el nombre y precio del servicio");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NombreServicio: nuevoServicio.tipo,
          Descripcion: nuevoServicio.descripcion,
          DuracionMinutos: parseInt(nuevoServicio.duracion),
          Precio: parseFloat(nuevoServicio.costo),
          Activo: nuevoServicio.activo ? 1 : 0
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Servicio agregado correctamente");
        setNuevoServicio({
          tipo: "",
          descripcion: "",
          duracion: 30,
          costo: "",
          activo: true
        });
        cargarServicios();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error al agregar servicio:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un servicio
  const eliminarServicio = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este servicio?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/servicios?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Servicio eliminado correctamente");
        cargarServicios();
      } else {
        const data = await response.json();
        alert("Error: " + (data.error || "No se pudo eliminar"));
      }
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar la edición de un servicio
  const editarServicio = (id) => {
    const servicioParaEditar = servicios.find((s) => s.id === id);
    setNuevoServicio({
      tipo: servicioParaEditar.tipo,
      descripcion: servicioParaEditar.descripcion || "",
      duracion: servicioParaEditar.duracion,
      costo: servicioParaEditar.costo,
      activo: servicioParaEditar.activo
    });
    setEditando(id);
  };

  // Función para guardar los cambios
  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (!nuevoServicio.tipo || !nuevoServicio.costo) {
      alert("Por favor completa el nombre y precio del servicio");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/servicios?id=${editando}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NombreServicio: nuevoServicio.tipo,
          Descripcion: nuevoServicio.descripcion,
          DuracionMinutos: parseInt(nuevoServicio.duracion),
          Precio: parseFloat(nuevoServicio.costo),
          Activo: nuevoServicio.activo ? 1 : 0
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Servicio actualizado correctamente");
        setNuevoServicio({
          tipo: "",
          descripcion: "",
          duracion: 30,
          costo: "",
          activo: true
        });
        setEditando(null);
        cargarServicios();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setNuevoServicio({
      tipo: "",
      descripcion: "",
      duracion: 30,
      costo: "",
      activo: true
    });
    setEditando(null);
  };

  // Funciones para la gestión de horarios
  const iniciarEdicionHorario = (dia, valor) => {
    setDiaEditando(dia);
    setValorTempHorario(valor);
  };

  const guardarHorario = () => {
    // Validación básica de formato
    const regex = /^(\d{1,2}:\d{2}\s?(AM|PM))\s?-\s?(\d{1,2}:\d{2}\s?(AM|PM))$/i;
    if (valorTempHorario !== "Cerrado" && !regex.test(valorTempHorario)) {
      alert("Formato inválido. Usa por ejemplo: '8:00 AM - 6:00 PM' o 'Cerrado'");
      return;
    }

    const nuevosHorarios = { ...horarios, [diaEditando]: valorTempHorario };
    setHorarios(nuevosHorarios);
    localStorage.setItem("clinica_horarios", JSON.stringify(nuevosHorarios));
    setDiaEditando(null);
    alert("Horario actualizado localmente");
  };

  const guardarTelefono = () => {
    if (!valorTempTelefono.trim()) {
      alert("El teléfono no puede estar vacío");
      return;
    }
    setTelefono(valorTempTelefono);
    localStorage.setItem("clinica_telefono", valorTempTelefono);
    setEditandoTelefono(false);
    alert("Teléfono actualizado");
  };

  if (loading && servicios.length === 0) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: "var(--main_black)" }}
      >
        <div style={{ color: "var(--white)" }} className="text-xl">
          Cargando servicios...
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "var(--main_black)", color: "var(--white)" }}
    >
      <Sidebar />

      <main className="flex-1 py-5 px-20 relative overflow-y-auto">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--white)" }}
        >
          SERVICIOS
        </h1>

        {/* Tabla de servicios */}
        <div
          className="overflow-x-auto shadow-xl rounded-lg mb-10"
          style={{
            border: `1px solid var(--main_blue)`,
            backgroundColor: "var(--main_gray)",
          }}
        >
          <table className="min-w-full border-collapse text-left">
            <thead
              style={{
                backgroundColor: "var(--main_blue)",
                color: "var(--white)",
              }}
            >
              <tr>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Tipo de Servicio
                </th>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Descripción
                </th>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Duración (min)
                </th>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Costo
                </th>
                <th className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                  Estado
                </th>
                <th className="p-3 border-b text-center" style={{ borderColor: "var(--main_gray)" }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {servicios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4" style={{ color: "var(--white)" }}>
                    No hay servicios registrados.
                  </td>
                </tr>
              ) : (
                servicios.map((servicio) => (
                  <tr
                    key={servicio.id}
                    className="hover:bg-opacity-80 transition-colors"
                    style={{
                      backgroundColor: "var(--light_gray)",
                      color: "var(--white)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2A2F3A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--light_gray)";
                    }}
                  >
                    <td className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                      {servicio.tipo}
                    </td>
                    <td className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                      {servicio.descripcion || "-"}
                    </td>
                    <td className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                      {servicio.duracion}
                    </td>
                    <td className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                      ${servicio.costo}
                    </td>
                    <td className="p-3 border-b" style={{ borderColor: "var(--main_gray)" }}>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: servicio.activo ? "#10B981" : "#6B7280",
                          color: "white"
                        }}
                      >
                        {servicio.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="p-3 border-b text-center space-x-2" style={{ borderColor: "var(--main_gray)" }}>
                      <button
                        onClick={() => editarServicio(servicio.id)}
                        disabled={loading}
                        className="px-3 py-1 text-white rounded transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                        style={{
                          backgroundColor: "var(--main_blue)",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
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
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarServicio(servicio.id)}
                        disabled={loading}
                        className="px-3 py-1 text-white rounded transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                        style={{
                          backgroundColor: "#DC2626",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                        }}
                        onMouseEnter={(e) => {
                          if (!loading) {
                            e.currentTarget.style.backgroundColor = "#EF4444";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loading) {
                            e.currentTarget.style.backgroundColor = "#DC2626";
                          }
                        }}
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

        {/* Formulario para añadir o editar servicios */}
        <div
          className="rounded-lg shadow-xl p-6 w-full transition-all duration-300"
          style={{
            border: `1px solid var(--main_blue)`,
            backgroundColor: "var(--main_gray)",
          }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--main_blue)" }}
          >
            {editando ? "Editar Servicio" : "Añadir Nuevo Servicio"}
          </h2>
          <form onSubmit={editando ? guardarEdicion : agregarServicio} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre del servicio *"
                value={nuevoServicio.tipo}
                onChange={(e) =>
                  setNuevoServicio({ ...nuevoServicio, tipo: e.target.value })
                }
                className="rounded-lg p-2 focus:outline-none focus:ring-2"
                style={{
                  border: `1px solid var(--main_blue)`,
                  color: "var(--white)",
                  backgroundColor: "var(--light_gray)",
                }}
                disabled={loading}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Precio *"
                value={nuevoServicio.costo}
                onChange={(e) =>
                  setNuevoServicio({ ...nuevoServicio, costo: e.target.value })
                }
                className="rounded-lg p-2 focus:outline-none focus:ring-2"
                style={{
                  border: `1px solid var(--main_blue)`,
                  color: "var(--white)",
                  backgroundColor: "var(--light_gray)",
                }}
                disabled={loading}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                placeholder="Descripción (opcional)"
                value={nuevoServicio.descripcion}
                onChange={(e) =>
                  setNuevoServicio({ ...nuevoServicio, descripcion: e.target.value })
                }
                rows="2"
                className="rounded-lg p-2 focus:outline-none focus:ring-2 resize-none"
                style={{
                  border: `1px solid var(--main_blue)`,
                  color: "var(--white)",
                  backgroundColor: "var(--light_gray)",
                }}
                disabled={loading}
              />
              <input
                type="number"
                placeholder="Duración (minutos) *"
                value={nuevoServicio.duracion}
                onChange={(e) =>
                  setNuevoServicio({ ...nuevoServicio, duracion: e.target.value })
                }
                className="rounded-lg p-2 focus:outline-none focus:ring-2"
                style={{
                  border: `1px solid var(--main_blue)`,
                  color: "var(--white)",
                  backgroundColor: "var(--light_gray)",
                }}
                disabled={loading}
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nuevoServicio.activo}
                  onChange={(e) =>
                    setNuevoServicio({ ...nuevoServicio, activo: e.target.checked })
                  }
                  className="w-4 h-4 cursor-pointer"
                  disabled={loading}
                />
                <span style={{ color: "var(--white)" }}>Servicio activo</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="text-white font-semibold rounded-lg px-6 py-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--main_blue)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = "#60D6A7";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = "var(--main_blue)";
                }}
              >
                {loading ? "PROCESANDO..." : (editando ? "Guardar Cambios" : "Agregar Servicio")}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  disabled={loading}
                  className="text-white font-semibold rounded-lg px-6 py-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  style={{
                    backgroundColor: "#6B7280",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = "#9CA3AF";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = "#6B7280";
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SECCIÓN DE GESTIÓN DE HORARIOS (GUI) */}
        <div className="mt-16 mb-10">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--white)" }}>
            GESTIÓN DE HORARIOS
          </h2>
          <div 
            className="overflow-hidden rounded-2xl border shadow-2xl"
            style={{ borderColor: "var(--light_gray)", backgroundColor: "var(--main_gray)" }}
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[var(--main_blue)] to-[#4AC7FF]">
                  <th className="p-4 text-left text-[var(--main_black)] font-semibold">Día</th>
                  <th className="p-4 text-left text-[var(--main_black)] font-semibold">Horario</th>
                  <th className="p-4 text-center text-[var(--main_black)] font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(horarios).map(([dia, valor]) => (
                  <tr key={dia} className="border-t border-[var(--light_gray)] hover:bg-[var(--main_blue)]/5 transition-colors">
                    <td className="p-4 font-medium text-[var(--white)]">{dia}</td>
                    <td className="p-4">
                      {diaEditando === dia ? (
                        <input
                          type="text"
                          value={valorTempHorario}
                          onChange={(e) => setValorTempHorario(e.target.value)}
                          className="bg-[var(--light_gray)] text-[var(--white)] border border-[var(--main_blue)] rounded px-2 py-1 w-full focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className={valor === "Cerrado" ? "text-red-400" : "text-[var(--white)]/80"}>
                          {valor}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {diaEditando === dia ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={guardarHorario}
                            className="bg-[#10B981] text-white px-3 py-1 rounded text-xs hover:bg-emerald-600"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setDiaEditando(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => iniciarEdicionHorario(dia, valor)}
                          className="text-[var(--main_blue)] hover:text-[#4AC7FF] transition-colors flex items-center gap-1 mx-auto text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECCIÓN DE GESTIÓN DE CONTACTO */}
        <div className="mt-8 mb-10">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--white)" }}>
            GESTIÓN DE CONTACTO
          </h2>
          <div 
            className="p-6 rounded-2xl border shadow-2xl flex items-center justify-between"
            style={{ borderColor: "var(--light_gray)", backgroundColor: "var(--main_gray)" }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[var(--main_blue)]/10 text-[var(--main_blue)]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase font-semibold">Número de Teléfono</p>
                {editandoTelefono ? (
                  <input
                    type="text"
                    value={valorTempTelefono}
                    onChange={(e) => setValorTempTelefono(e.target.value)}
                    className="bg-[var(--light_gray)] text-[var(--white)] border border-[var(--main_blue)] rounded px-2 py-1 w-64 focus:outline-none text-xl font-light"
                    autoFocus
                  />
                ) : (
                  <p className="text-2xl font-light tracking-wider text-[var(--white)]">{telefono}</p>
                )}
              </div>
            </div>
            
            <div>
              {editandoTelefono ? (
                <div className="flex gap-2">
                  <button
                    onClick={guardarTelefono}
                    className="bg-[#10B981] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditandoTelefono(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setValorTempTelefono(telefono);
                    setEditandoTelefono(true);
                  }}
                  className="text-[var(--main_blue)] hover:text-[#4AC7FF] transition-colors flex items-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Cambiar número
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}