"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/barralateral/sidebar";
import { getCurrentUser } from "@/lib/auth";

export default function Menu() {
  const router = useRouter();

  useEffect(() => {
    const usuario = getCurrentUser();
    if (!usuario) {
      router.push("/entrada");
    }
  }, [router]);

  // Estados para los datos del formulario
  const [pacienteID, setPacienteID] = useState("");
  const [servicioID, setServicioID] = useState("");
  const [usuarioID, setUsuarioID] = useState("");
  const [fechaCita, setFechaCita] = useState("");
  const [horaCita, setHoraCita] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [notas, setNotas] = useState("");
  
  // Estados para los selects
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  // Obtener datos para los selects al cargar el componente
  useEffect(() => {
    const obtenerDatosSelects = async () => {
      setCargandoDatos(true);
      try {
        // Obtener pacientes
        const pacientesRes = await fetch("/api/pacientes");
        const pacientesData = await pacientesRes.json();
        console.log("Pacientes recibidos:", pacientesData);
        setPacientes(Array.isArray(pacientesData) ? pacientesData : []);

        // Obtener servicios
        const serviciosRes = await fetch("/api/servicios");
        const serviciosData = await serviciosRes.json();
        console.log("Servicios recibidos:", serviciosData);
        setServicios(Array.isArray(serviciosData) ? serviciosData : []);

        // Obtener usuarios (dentistas)
        const usuariosRes = await fetch("/api/usuarios");
        const usuariosData = await usuariosRes.json();
        console.log("Usuarios recibidos:", usuariosData);
        setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);

      } catch (error) {
        console.error("Error al obtener datos:", error);
        alert("Error al cargar los datos necesarios");
        setPacientes([]);
        setServicios([]);
        setUsuarios([]);
      } finally {
        setCargandoDatos(false);
      }
    };

    obtenerDatosSelects();
  }, []);

  const enviarDatos = async () => {
    // Validaciones
    if (!pacienteID) {
      alert("Por favor selecciona un paciente");
      return;
    }
    if (!servicioID) {
      alert("Por favor selecciona un servicio");
      return;
    }
    if (!usuarioID) {
      alert("Por favor selecciona un dentista");
      return;
    }
    if (!fechaCita) {
      alert("Por favor selecciona una fecha");
      return;
    }
    if (!horaCita) {
      alert("Por favor selecciona una hora");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteID,
          servicioID,
          usuarioID,
          fechaCita,
          horaCita,
          estado,
          notas,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cita registrada correctamente");
        // Limpiar formulario
        setPacienteID("");
        setServicioID("");
        setUsuarioID("");
        setFechaCita("");
        setHoraCita("");
        setEstado("Pendiente");
        setNotas("");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error al agendar cita:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (cargandoDatos) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: "var(--main_black)" }}
      >
        <div style={{ color: "var(--white)" }} className="text-xl">
          Cargando datos...
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
          className="text-2xl font-bold mb-8"
          style={{ color: "var(--white)" }}
        >
          AGENDAR CITAS
        </h1>

        <div className="max-w-3xl space-y-6" style={{ color: "var(--white)" }}>
          {/* Select Paciente */}
          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              PACIENTE *
            </label>
            <select
              className="w-full rounded p-2"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={pacienteID}
              onChange={(e) => setPacienteID(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccionar paciente</option>
              {pacientes.length > 0 ? (
                pacientes.map((paciente) => (
                  <option key={paciente.PacienteID} value={paciente.PacienteID}>
                    {paciente.NombreCompleto}
                  </option>
                ))
              ) : (
                <option disabled>No hay pacientes registrados</option>
              )}
            </select>
          </div>

          {/* Select Servicio */}
          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              SERVICIO *
            </label>
            <select
              className="w-full rounded p-2"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={servicioID}
              onChange={(e) => setServicioID(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccionar servicio</option>
              {servicios.length > 0 ? (
                servicios.map((servicio) => (
                  <option key={servicio.ServicioID} value={servicio.ServicioID}>
                    {servicio.NombreServicio} {servicio.Precio ? `- $${servicio.Precio}` : ''}
                  </option>
                ))
              ) : (
                <option disabled>No hay servicios disponibles</option>
              )}
            </select>
          </div>

          {/* Select Usuario (Dentista) */}
          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              DENTISTA *
            </label>
            <select
              className="w-full rounded p-2"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={usuarioID}
              onChange={(e) => setUsuarioID(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccionar dentista</option>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <option key={usuario.UsuarioID} value={usuario.UsuarioID}>
                    {usuario.NombreCompleto} {usuario.NombreRol ? `- ${usuario.NombreRol}` : ''}
                  </option>
                ))
              ) : (
                <option disabled>No hay dentistas disponibles</option>
              )}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              FECHA *
            </label>
            <input
              type="date"
              className="w-full rounded p-2"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={fechaCita}
              onChange={(e) => setFechaCita(e.target.value)}
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              HORA *
            </label>
            <input
              type="time"
              className="w-full rounded p-2"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={horaCita}
              onChange={(e) => setHoraCita(e.target.value)}
              disabled={loading}
              step="1800"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block mb-2" style={{ color: "var(--white)" }}>
              NOTAS (Opcional)
            </label>
            <textarea
              rows="4"
              placeholder="Describe el motivo de la cita o notas adicionales..."
              className="w-full rounded p-2 resize-none"
              style={{
                backgroundColor: "var(--light_gray)",
                border: `1px solid var(--main_blue)`,
                color: "var(--white)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>

          {/* Botón Agendar */}
          <div className="text-right">
            <button
              onClick={enviarDatos}
              disabled={loading}
              className="px-8 py-3 transition-all duration-300 rounded-lg font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: "var(--white)",
                backgroundColor: "var(--main_blue)",
                border: `1px solid var(--white)`,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#60D6A7";
                  e.currentTarget.style.boxShadow =
                    "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)";
                  e.currentTarget.style.transform = "scale(1.01)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "var(--main_blue)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              {loading ? "AGENDANDO..." : "AGENDAR CITA"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}