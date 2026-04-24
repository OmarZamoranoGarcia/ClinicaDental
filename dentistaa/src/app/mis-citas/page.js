"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/barralateral/sidebar";
import { getCurrentUser, isRole4 } from "@/lib/auth";

export default function MisCitas() {
  const router = useRouter();
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuario = getCurrentUser();
    if (!usuario) {
      router.push("/entrada");
      return;
    }

    // Solo pacientes pueden ver esta página
    if (!isRole4(usuario)) {
      router.push("/servicios");
      return;
    }

    setUsuarioActual(usuario);

    // Cargar citas del paciente
    const cargarCitas = async () => {
      try {
        const res = await fetch(`/api/citas?pacienteID=${usuario.id}`);
        const data = await res.json();
        if (res.ok) {
          setCitas(data);
        } else {
          console.error("Error al cargar citas:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarCitas();
  }, [router]);

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-500';
      case 'confirmada':
        return 'bg-blue-500';
      case 'completada':
        return 'bg-green-500';
      case 'cancelada':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'Pendiente';
      case 'confirmada':
        return 'Confirmada';
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return estado;
    }
  };

  const esCitaPasada = (fechaCita, horaCita) => {
    const ahora = new Date();
    const citaDateTime = new Date(`${fechaCita}T${horaCita}`);
    return citaDateTime < ahora;
  };

  if (cargando || !usuarioActual) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: "var(--main_black)" }}
      >
        <div style={{ color: "var(--white)" }} className="text-xl">
          Cargando tus citas...
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--main_black)" }}
    >
      <Sidebar />

      <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-auto relative">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: "var(--white)" }}
        >
          MIS CITAS AGENDADAS
        </h1>

        <div
          className="shadow-xl rounded-lg p-6"
          style={{
            border: `1px solid var(--main_blue)`,
            backgroundColor: "var(--main_gray)",
          }}
        >
          {citas.length > 0 ? (
            <div className="space-y-4">
              {citas.map((cita) => {
                const esPasada = esCitaPasada(cita.FechaCita, cita.HoraCita);
                return (
                  <div
                    key={cita.CitaID}
                    className={`border rounded-lg p-4 ${
                      esPasada ? 'opacity-75' : ''
                    }`}
                    style={{
                      borderColor: "var(--light_gray)",
                      backgroundColor: esPasada ? "var(--light_gray)" : "transparent"
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold" style={{ color: "var(--white)" }}>
                            {cita.NombreServicio}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getEstadoColor(cita.Estado)}`}
                          >
                            {getEstadoTexto(cita.Estado)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm" style={{ color: "var(--white)" }}>
                          <p><strong>Dentista:</strong> {cita.NombreDentista}</p>
                          <p><strong>Fecha:</strong> {new Date(cita.FechaCita).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</p>
                          <p><strong>Hora:</strong> {cita.HoraCita}</p>
                          <p><strong>Precio:</strong> ${cita.Precio || 'N/A'}</p>
                        </div>

                        {cita.Notas && (
                          <p className="mt-2 text-sm" style={{ color: "var(--white)" }}>
                            <strong>Notas:</strong> {cita.Notas}
                          </p>
                        )}

                        {esPasada && (
                          <p className="mt-2 text-xs text-yellow-300">
                            Esta cita ya ha pasado
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p style={{ color: "var(--white)" }} className="text-lg mb-4">
                No tienes citas agendadas aún.
              </p>
              <button
                onClick={() => router.push("/agendar-citas")}
                className="px-6 py-3 rounded-lg font-semibold"
                style={{
                  color: "var(--white)",
                  backgroundColor: "var(--main_blue)",
                  border: `1px solid var(--white)`,
                }}
              >
                Agendar Nueva Cita
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}