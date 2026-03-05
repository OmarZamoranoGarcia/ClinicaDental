"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/barralateral/sidebar";

export default function Menu() {
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [motivo, setMotivo] = useState("");

    const enviarDatos = async () => {
        const res = await fetch("/api/agendar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, telefono, correo, fecha, hora, motivo })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Cita registrada correctamente");
            setNombre("");
            setTelefono("");
            setCorreo("");
            setFecha("");
            setHora("");
            setMotivo("");
        } else {
            alert("Error: " + data.error);
        }
    };

    return (
        <div className="flex h-screen bg-[#FFFFFF] text-white overflow-hidden">
            <Sidebar />

            <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-auto relative">

                <div className="absolute top-4 right-4">
                    <Image src="/diennnn.jpg" alt="logo" width={160} height={160} className="rounded" />
                </div>

                <h1 className="text-2xl font-bold mb-8 text-black">
                    AGENDAR CITAS
                </h1>

                <div className="max-w-3xl space-y-6 text-black">

                    <div>
                        <label className="block mb-2">NOMBRE COMPLETO</label>
                        <input
                            type="text"
                            placeholder="Ej. Alvaro Gabino Casas Ramires"
                            className="w-full bg-transparent border shadow-xl border-gray-600 rounded p-2"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">TELÉFONO</label>
                        <input
                            type="text"
                            placeholder="Ej. 664-741-5901"
                            className="w-full bg-transparent border shadow-xl border-gray-600 rounded p-2"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">CORREO</label>
                        <input
                            type="email"
                            placeholder="citas@gmail.com"
                            className="w-full bg-transparent border shadow-xl border-gray-600 rounded p-2"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">FECHA</label>
                        <input
                            type="text"
                            placeholder="DD/MM/AAAA"
                            className="w-32 bg-transparent border shadow-xl border-gray-600 rounded p-2 text-center"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">HORA</label>
                        <input
                            type="text"
                            placeholder="00:00"
                            className="w-24 bg-transparent border shadow-xl border-gray-600 rounded p-2 text-center"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-2">MOTIVO</label>
                        <textarea
                            rows="5"
                            placeholder="Descripcion..."
                            className="w-full bg-transparent border shadow-xl border-gray-600 rounded p-2 resize-none"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="text-right">
                        <button
                            onClick={enviarDatos}
                            className="text-[#FFFFFF] shadow-xl border border-gray-600 px-6 py-2 bg-[#147DA8] hover:bg-[#60D6A7] transition rounded"
                        >
                            BOTÓN AGENDAR
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
