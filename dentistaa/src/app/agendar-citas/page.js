"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/barralateral/sidebar";
import Calendario from "@/components/calendario/calendario";
import { getCurrentUser, isRole1, isRole2, isRole3, isRole4 } from "@/lib/auth";

export default function Menu() {
  const router = useRouter();
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [isPaciente, setIsPaciente] = useState(false);

  useEffect(() => {
    const usuario = getCurrentUser();
    if (!usuario) {
      router.push("/entrada");
      return;
    }

    setUsuarioActual(usuario);
    setIsPaciente(isRole4(usuario));

    // Si es paciente, acceso permitido
    if (isRole4(usuario)) {
      return;
    }

    // Si es doctor (rol 2), redirigir a citas agendadas
    if (isRole2(usuario)) {
      router.push("/citas-agendadas");
      return;
    }

    // Admin y recepcionista pueden acceder
    if (isRole1(usuario) || isRole3(usuario)) {
      return;
    }

    // Por defecto, redirigir
    router.push("/servicios");
  }, [router]);

  // Estados para los datos del formulario
  const [pacienteID, setPacienteID] = useState("");
  const [servicioID, setServicioID] = useState("");
  const [usuarioID, setUsuarioID] = useState("");
  const [fechaCita, setFechaCita] = useState("");
  const [horaCita, setHoraCita] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [notas, setNotas] = useState("");

  const [selectedSlot, setSelectedSlot] = useState("");

  // Estados para los selects
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [dentistas, setDentistas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  const servicioSeleccionado = servicios.find(
    (servicio) => servicio.ServicioID === parseInt(servicioID, 10)
  );
  const horaMaxima = servicioSeleccionado
    ? getMaxHora(servicioSeleccionado.DuracionMinutos)
    : "17:00";

  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isHorarioValido = (time, duracion) => {
    if (!time || !duracion) return false;
    const inicio = timeToMinutes(time);
    const fin = inicio + duracion;
    return inicio >= 8 * 60 && fin <= 17 * 60;
  };

  function getMaxHora(duracion) {
    if (!duracion) return "17:00";
    const fin = 17 * 60 - duracion;
    const hours = Math.floor(fin / 60);
    const minutes = fin % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  const handleSlotSelect = (hora) => {
    setHoraCita(hora);
    setSelectedSlot(hora);
  };

  // Obtener datos para los selects al cargar el componente
  useEffect(() => {
    const obtenerDatosSelects = async () => {
      setCargandoDatos(true);
      try {
        // Obtener servicios
        const serviciosRes = await fetch("/api/servicios");
        const serviciosData = await serviciosRes.json();
        setServicios(Array.isArray(serviciosData) ? serviciosData : []);

        // Obtener dentistas (solo rol 2 - doctor)
        const dentistasRes = await fetch("/api/usuarios?rol=2");
        const dentistasData = await dentistasRes.json();
        setDentistas(Array.isArray(dentistasData) ? dentistasData : []);

        // Solo cargar pacientes si NO es paciente
        if (!isPaciente) {
          const pacientesRes = await fetch("/api/pacientes");
          const pacientesData = await pacientesRes.json();
          setPacientes(Array.isArray(pacientesData) ? pacientesData : []);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        alert("Error al cargar los datos necesarios");
        setServicios([]);
        setDentistas([]);
        setPacientes([]);
      } finally {
        setCargandoDatos(false);
      }
    };

    if (usuarioActual !== null) {
      obtenerDatosSelects();
    }
  }, [isPaciente, usuarioActual]);

  const enviarDatos = async () => {
    // Validaciones
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
    if (!servicioSeleccionado) {
      alert("Por favor selecciona un servicio válido");
      return;
    }
    if (!isHorarioValido(horaCita, servicioSeleccionado.DuracionMinutos)) {
      alert(
        `La hora seleccionada no es válida para el servicio elegido. El horario debe ser entre 08:00 y ${horaMaxima}`
      );
      return;
    }

    setLoading(true);

    try {
      const body = {
        servicioID: parseInt(servicioID),
        usuarioID: parseInt(usuarioID),
        fechaCita,
        horaCita,
        estado,
        notas,
      };

      // Determinar el pacienteID según el rol
      if (!isPaciente) {
        // Admin/Recepcionista: usar el seleccionado
        if (!pacienteID) {
          alert("Por favor selecciona un paciente");
          setLoading(false);
          return;
        }
        body.pacienteID = parseInt(pacienteID);
      } else {
        // Paciente: usar su propio ID de la sesión
        if (usuarioActual && usuarioActual.id) {
          body.pacienteID = usuarioActual.id;
        } else {
          alert("Error: No se pudo identificar al paciente");
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
        setSelectedSlot("");

        // Redirigir a rutas dependiendo del rol
        if (isPaciente) {
          router.push("/");
        } else {
          router.push("/citas-agendadas");
        }
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
  if (cargandoDatos || usuarioActual === null) {
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
          {/* Campo de paciente - condicional según rol */}
          {!isPaciente ? (
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
                    <option
                      key={paciente.PacienteID}
                      value={paciente.PacienteID}
                    >
                      {paciente.NombreCompleto}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay pacientes registrados</option>
                )}
              </select>
            </div>
          ) : (
            <div>
              <label className="block mb-2" style={{ color: "var(--white)" }}>
                PACIENTE
              </label>
              <input
                type="text"
                value={usuarioActual?.nombre || "Cargando..."}
                disabled
                className="w-full rounded p-2 opacity-70 cursor-not-allowed"
                style={{
                  backgroundColor: "var(--light_gray)",
                  border: `1px solid var(--main_blue)`,
                  color: "var(--white)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                }}
              />
            </div>
          )}

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
                    {servicio.NombreServicio}{" "}
                    {servicio.Precio ? `- $${servicio.Precio}` : ""}
                  </option>
                ))
              ) : (
                <option disabled>No hay servicios disponibles</option>
              )}
            </select>
          </div>

          {/* Select Dentista - solo muestra doctores (rol 2) */}
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
              {dentistas.length > 0 ? (
                dentistas.map((dentista) => (
                  <option key={dentista.UsuarioID} value={dentista.UsuarioID}>
                    {dentista.NombreCompleto}
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
                colorScheme: "dark",
              }}
              value={fechaCita}
              onChange={(e) => setFechaCita(e.target.value)}
              disabled={loading}
              min={new Date().toISOString().split("T")[0]}
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
                colorScheme: "dark",
              }}
              value={horaCita}
              onChange={(e) => {
                setHoraCita(e.target.value);
                setSelectedSlot(e.target.value);
              }}
              disabled={loading}
              step="900"
              min="08:00"
              max={horaMaxima}
            />
            <p className="mt-2 text-sm text-white/70">
              Los horarios son válidos de 08:00 hasta 17:00, ajustados a la duración del servicio.
              {servicioSeleccionado ? (
                <span> Este servicio dura {servicioSeleccionado.DuracionMinutos} minutos.</span>
              ) : null}
            </p>
          </div>

          <Calendario
            fecha={fechaCita}
            dentistaID={usuarioID}
            servicioDuracion={servicioSeleccionado?.DuracionMinutos}
            onSelectHora={handleSlotSelect}
            horaSeleccionada={selectedSlot}
          />

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
