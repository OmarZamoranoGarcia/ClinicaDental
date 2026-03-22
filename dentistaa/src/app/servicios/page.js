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
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar los servicios desde la API
  const cargarServicios = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/servicios");
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
      </main>
    </div>
  );
}