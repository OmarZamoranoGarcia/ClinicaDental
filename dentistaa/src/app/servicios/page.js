"use client";
import Image from "next/image";
import Sidebar from "@/components/barralateral/sidebar";
import { useState, useEffect } from "react";

export default function Servicios() {
  // Estado para los servicios y para el nuevo servicio
  const [servicios, setServicios] = useState([]);
  const [nuevoServicio, setNuevoServicio] = useState({ tipo: "", costo: "" });
  const [editando, setEditando] = useState(null); // ID del servicio que estamos editando

  // Cargar los servicios desde el localStorage cuando la página se carga
  useEffect(() => {
    const serviciosGuardados = JSON.parse(localStorage.getItem("servicios")) || [];
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
    setNuevoServicio({ tipo: servicioParaEditar.tipo, costo: servicioParaEditar.costo });
    setEditando(id);
  };

  // Función para guardar los cambios después de editar un servicio
  const guardarEdicion = (e) => {
    e.preventDefault();
    if (nuevoServicio.tipo && nuevoServicio.costo) {
      const serviciosActualizados = servicios.map((servicio) =>
        servicio.id === editando
          ? { ...servicio, tipo: nuevoServicio.tipo, costo: nuevoServicio.costo }
          : servicio
      );
      guardarServicios(serviciosActualizados);
      setNuevoServicio({ tipo: "", costo: "" });
      setEditando(null); // Finalizamos la edición
    }
  };

  return (
    <div className="flex h-screen bg-[#FFFFFF] text-black">
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 py-5 px-20 relative">
        {/* Logo */}
        <div className="absolute top-1 right-10 p-2 text-center">
          <Image src="/diennnn.jpg" alt="logo" width={50} height={300} />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold mb-6">SERVICIOS</h1>

        {/* Tabla de servicios */}
        <div className="overflow-x-auto border border-gray-600 shadow-xl rounded-lg mb-10">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-[#147DA8] text-white">
              <tr>
                <th className="p-3 border-b border-gray-400">Tipo de Servicio</th>
                <th className="p-3 border-b border-gray-400">Costo</th>
                <th className="p-3 border-b border-gray-400 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-100">
                  <td className="p-3 border-b border-gray-300">{servicio.tipo}</td>
                  <td className="p-3 border-b border-gray-300">{servicio.costo}</td>
                  <td className="p-3 border-b border-gray-300 text-center space-x-2">
                    <button
                      onClick={() => editarServicio(servicio.id)}
                      className="px-3 py-1 bg-[#147DA8] text-white rounded hover:bg-[#125f83]"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarServicio(servicio.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
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
        <div className="border border-gray-400 rounded-lg shadow-lg p-6 w-2/3">
          <h2 className="text-xl font-semibold mb-4 text-[#147DA8]">
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
              className="border border-gray-400 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#147DA8]"
              required
            />
            <input
              type="text"
              placeholder="Costo"
              value={nuevoServicio.costo}
              onChange={(e) =>
                setNuevoServicio({ ...nuevoServicio, costo: e.target.value })
              }
              className="border border-gray-400 rounded-lg p-2 w-40 focus:outline-none focus:ring-2 focus:ring-[#147DA8]"
              required
            />
            <button
              type="submit"
              className="bg-[#147DA8] text-white font-semibold rounded-lg px-6 py-2 hover:bg-[#125f83]"
            >
              {editando ? "Guardar Cambios" : "Agregar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
