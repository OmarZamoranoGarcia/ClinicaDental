"use client";

import Sidebar from "@/components/barralateral/sidebar";
import { useState, useEffect } from "react";

export default function Servicios() {
  // Estado para los servicios y para el nuevo servicio
  const [servicios, setServicios] = useState([]);
  const [nuevoServicio, setNuevoServicio] = useState({ tipo: "", costo: "" });
  const [editando, setEditando] = useState(null); // ID del servicio que estamos editando

  // Cargar los servicios desde el localStorage cuando la página se carga
  useEffect(() => {
    const serviciosGuardados =
      JSON.parse(localStorage.getItem("servicios")) || [];
    setServicios(serviciosGuardados);
  }, []);

  // Función para guardar los servicios en el localStorage
  const guardarServicios = (serviciosActualizados) => {
    localStorage.setItem("servicios", JSON.stringify(serviciosActualizados));
    setServicios(serviciosActualizados);
  };

  // Función para agregar un nuevo servicio
  const agregarServicio = (e) => {
    e.preventDefault();
    if (nuevoServicio.tipo && nuevoServicio.costo) {
      const nuevoServicioConId = {
        ...nuevoServicio,
        id: servicios.length ? servicios[servicios.length - 1].id + 1 : 1,
      };
      const serviciosActualizados = [...servicios, nuevoServicioConId];
      guardarServicios(serviciosActualizados);
      setNuevoServicio({ tipo: "", costo: "" });
    }
  };

  // Función para eliminar un servicio
  const eliminarServicio = (id) => {
    const serviciosActualizados = servicios.filter((s) => s.id !== id);
    guardarServicios(serviciosActualizados);
  };

  // Función para iniciar la edición de un servicio
  const editarServicio = (id) => {
    const servicioParaEditar = servicios.find((s) => s.id === id);
    setNuevoServicio({
      tipo: servicioParaEditar.tipo,
      costo: servicioParaEditar.costo,
    });
    setEditando(id);
  };

  // Función para guardar los cambios después de editar un servicio
  const guardarEdicion = (e) => {
    e.preventDefault();
    if (nuevoServicio.tipo && nuevoServicio.costo) {
      const serviciosActualizados = servicios.map((servicio) =>
        servicio.id === editando
          ? {
              ...servicio,
              tipo: nuevoServicio.tipo,
              costo: nuevoServicio.costo,
            }
          : servicio,
      );
      guardarServicios(serviciosActualizados);
      setNuevoServicio({ tipo: "", costo: "" });
      setEditando(null); // Finalizamos la edición
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "var(--main_black)", color: "var(--white)" }}
    >
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 py-5 px-20 relative">
        {/* Logo */}
        <div className="absolute top-1 right-10 p-2 text-center"></div>

        {/* Título */}
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
                <th
                  className="p-3 border-b"
                  style={{ borderColor: "var(--main_gray)" }}
                >
                  Tipo de Servicio
                </th>
                <th
                  className="p-3 border-b"
                  style={{ borderColor: "var(--main_gray)" }}
                >
                  Costo
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
              {servicios.map((servicio) => (
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
                  <td
                    className="p-3 border-b"
                    style={{ borderColor: "var(--main_gray)" }}
                  >
                    {servicio.tipo}
                  </td>
                  <td
                    className="p-3 border-b"
                    style={{ borderColor: "var(--main_gray)" }}
                  >
                    {servicio.costo}
                  </td>
                  <td
                    className="p-3 border-b text-center space-x-2"
                    style={{ borderColor: "var(--main_gray)" }}
                  >
                    <button
                      onClick={() => editarServicio(servicio.id)}
                      className="px-3 py-1 text-white rounded transition-all duration-300 transform hover:scale-105"
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
                        e.currentTarget.style.backgroundColor =
                          "var(--main_blue)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 6px -1px rgba(0, 0, 0, 0.3)";
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarServicio(servicio.id)}
                      className="px-3 py-1 text-white rounded transition-all duration-300 transform hover:scale-105"
                      style={{
                        backgroundColor: "#DC2626",
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
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulario para añadir o editar servicios */}
        <div
          className="rounded-lg shadow-xl p-6 w-2/3 transition-all duration-300"
          style={{
            border: `1px solid var(--main_blue)`,
            backgroundColor: "var(--main_gray)",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--main_blue)" }}
          >
            {editando ? "Editar Servicio" : "Añadir Nuevo Servicio"}
          </h2>
          <form
            onSubmit={editando ? guardarEdicion : agregarServicio}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Tipo de servicio"
              value={nuevoServicio.tipo}
              onChange={(e) =>
                setNuevoServicio({ ...nuevoServicio, tipo: e.target.value })
              }
              className="rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 transition-all duration-300"
              style={{
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                backgroundColor: "var(--light_gray)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              required
            />
            <input
              type="text"
              placeholder="Costo"
              value={nuevoServicio.costo}
              onChange={(e) =>
                setNuevoServicio({ ...nuevoServicio, costo: e.target.value })
              }
              className="rounded-lg p-2 w-40 focus:outline-none focus:ring-2 transition-all duration-300"
              style={{
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                backgroundColor: "var(--light_gray)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              required
            />
            <button
              type="submit"
              className="text-white font-semibold rounded-lg px-6 py-2 transition-all duration-300 transform hover:scale-105"
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
            >
              {editando ? "Guardar Cambios" : "Agregar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}