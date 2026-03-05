"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
        motivo: ""
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
            motivo: cita.motivo
        });
    };

    // GUARDAR CAMBIOS
const guardarEdicion = async () => {
    const res = await fetch(`/api/citas/${editando}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)  // Asegúrate de que 'form' tenga los datos correctos
    });
    
    const data = await res.json();
    
    console.log('Respuesta de guardar:', data);
    
    if (res.ok) {
        alert('Cita guardada con éxito');
        setEditando(null);
        obtenerCitas();  // Actualiza la lista de citas
    } else {
        alert('Error al guardar los cambios');
    }
};


    return (
        <div className="flex h-screen bg-white text-black">
            <Sidebar />

            <main className="flex-1 py-10 px-6 lg:px-20 relative">
                <div className="absolute top-1 right-10 p-2 text-center">
                    <Image src="/diennnn.jpg" alt="logo" width={80} height={400} />
                </div>

                <h1 className="text-3xl font-bold mb-6">CITAS</h1>

                <div className="overflow-x-auto border border-gray-300 shadow-lg rounded-lg">
                    <table className="min-w-full text-left">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="p-3 border-b">Nombre</th>
                                <th className="p-3 border-b">Teléfono</th>
                                <th className="p-3 border-b">Correo</th>
                                <th className="p-3 border-b">Fecha</th>
                                <th className="p-3 border-b">Hora</th>
                                <th className="p-3 border-b">Motivo</th>
                                <th className="p-3 border-b text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {citas.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-4">No hay citas registradas.</td>
                                </tr>
                            ) : (
                                citas.map((cita) => (
                                    <tr key={cita.id} className="border-b border-gray-200 bg-white">
                                        <td className="p-3">{cita.nombre}</td>
                                        <td className="p-3">{cita.telefono}</td>
                                        <td className="p-3">{cita.correo}</td>
                                        <td className="p-3">{cita.fecha}</td>
                                        <td className="p-3">{cita.hora}</td>
                                        <td className="p-3">{cita.motivo}</td>

                                        <td className="p-3 text-center space-x-3">
                                            <button
                                                className="px-4 py-2 rounded bg-blue-600 text-white border border-blue-700 hover:bg-blue-700"
                                                onClick={() => abrirEditar(cita)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="px-4 py-2 rounded bg-red-600 text-white border border-red-700 hover:bg-red-700"
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow-xl w-96 text-black">
                            <h2 className="text-xl font-bold mb-4">Editar Cita</h2>

                            {["nombre", "telefono", "correo", "fecha", "hora", "motivo"].map((campo) => (
                                <input
                                    key={campo}
                                    className="w-full p-3 border rounded mb-3"
                                    placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                                    value={form[campo]}
                                    onChange={(e) =>
                                        setForm({ ...form, [campo]: e.target.value })
                                    }
                                />
                            ))}

                            <div className="flex justify-between mt-6">
                                <button
                                    className="px-5 py-2 bg-gray-400 text-black rounded"
                                    onClick={() => setEditando(null)}
                                >
                                    Cancelar
                                </button>

                                <button
                                    className="px-5 py-2 bg-green-600 text-white rounded"
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
