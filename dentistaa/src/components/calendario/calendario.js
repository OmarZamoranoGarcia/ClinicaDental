"use client";

import { useEffect, useMemo, useState } from "react";

const toMinutes = (time) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const toTimeString = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const isOverlap = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

const generatePossibleSlots = (durationMinutes) => {
  const start = 8 * 60; // 08:00
  const end = 17 * 60; // 17:00
  const step = 15;
  const slots = [];

  for (let current = start; current + durationMinutes <= end; current += step) {
    slots.push({
      value: toTimeString(current),
      label: `${toTimeString(current)} - ${toTimeString(current + durationMinutes)}`,
      start: current,
      end: current + durationMinutes,
    });
  }

  return slots;
};

export default function Calendario({ fecha, dentistaID, servicioDuracion, onSelectHora, horaSeleccionada }) {
  const [busyIntervals, setBusyIntervals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setBusyIntervals([]);
    setError("");

    if (!fecha || !dentistaID) {
      return;
    }

    const fetchBusy = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams({
          usuarioID: dentistaID,
          fechaCita: fecha,
        });

        const res = await fetch(`/api/citas/disponibilidad?${searchParams.toString()}`);

        if (!res.ok) {
          const data = await res.json();
          setError(data?.error || "No se pudieron cargar las citas");
          return;
        }

        const data = await res.json();
        const intervals = data.map((cita) => {
          const start = toMinutes(cita.HoraCita.toString().slice(0, 5));
          return {
            start,
            end: start + cita.DuracionMinutos,
            label: `${cita.HoraCita.toString().slice(0, 5)} - ${toTimeString(start + cita.DuracionMinutos)}`,
          };
        });

        console.log('Citas ocupadas cargadas:', intervals);
        setBusyIntervals(intervals);
      } catch (fetchError) {
        console.error("Error cargando disponibilidad:", fetchError);
        setError("Error al obtener la disponibilidad de citas");
      } finally {
        setLoading(false);
      }
    };

    fetchBusy();
  }, [fecha, dentistaID]);

  const availableSlots = useMemo(() => {
    if (!fecha || !dentistaID || !servicioDuracion) {
      return [];
    }

    const possibleSlots = generatePossibleSlots(servicioDuracion);
    const slots = possibleSlots.map((slot) => {
      const blocked = busyIntervals.some((busy) => isOverlap(slot.start, slot.end, busy.start, busy.end));
      return {
        ...slot,
        disponible: !blocked,
      };
    });
    
    console.log('Slots disponibles:', slots);
    return slots;
  }, [busyIntervals, fecha, dentistaID, servicioDuracion]);

  const availableCount = availableSlots.filter((slot) => slot.disponible).length;

  return (
    <section className="rounded-xl p-4 border border-white/20 bg-white/5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Calendario de disponibilidad</h2>
          <p className="text-sm text-white/70">
            Selecciona una fecha, un dentista y un servicio para ver los horarios disponibles.
          </p>
        </div>
        <div className="text-right text-sm text-white/80">
          {fecha && dentistaID ? (
            <>
              <div>{`Citas ocupadas: ${busyIntervals.length}`}</div>
              <div>{`Horarios libres: ${availableCount}`}</div>
            </>
          ) : (
            <div>Seleccione fecha y dentista</div>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-500/20 p-3 text-red-100">{error}</div>
      ) : null}

      {loading ? (
        <div className="text-white/80">Cargando disponibilidad...</div>
      ) : !fecha || !dentistaID ? (
        <div className="text-white/70">Debes seleccionar fecha y dentista para ver el calendario.</div>
      ) : !servicioDuracion ? (
        <div className="text-white/70">Debes seleccionar un servicio para conocer los horarios válidos.</div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {availableSlots.map((slot) => (
            <button
              key={slot.value}
              type="button"
              onClick={() => slot.disponible && onSelectHora(slot.value)}
              disabled={!slot.disponible}
              className={`rounded-xl border-2 px-3 py-2 text-left transition font-medium ${
                slot.disponible
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-100 hover:border-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
                  : "border-red-600 bg-red-700/50 text-red-50 cursor-not-allowed"
              } ${horaSeleccionada === slot.value ? "ring-2 ring-emerald-400" : ""}`}
            >
              <div className="font-bold text-base">{slot.value}</div>
              <div className="text-xs opacity-80">{slot.label}</div>
              {!slot.disponible ? <div className="text-[11px] mt-1 font-semibold">🔴 Ocupado</div> : null}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
