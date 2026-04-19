"use client";

import Sidebar from "@/components/barralateral/sidebar";

export default function Expedientes() {
  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "var(--main_black)", color: "var(--white)" }}
    >
      <Sidebar />

      <main className="flex-1 py-10 px-6 lg:px-20 relative overflow-y-auto">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: "var(--white)" }}
        >
          EXPEDIENTES
        </h1>

        <div
          className="shadow-xl rounded-lg p-6"
          style={{
            border: `1px solid var(--main_blue)`,
            backgroundColor: "var(--main_gray)",
          }}
        >
          <p className="mb-6" style={{ color: "var(--white)" }}>
            Completa los datos del expediente del paciente. Esta página está diseñada para el doctor, el admin y la recepcionista.
          </p>

          <form className="grid gap-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                  Paciente ID
                </span>
                <input
                  type="text"
                  placeholder="Ej. 123"
                  className="mt-2 w-full rounded px-3 py-2"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid var(--light_gray)`,
                    color: "var(--white)",
                  }}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                  Cita ID
                </span>
                <input
                  type="text"
                  placeholder="Ej. 456"
                  className="mt-2 w-full rounded px-3 py-2"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid var(--light_gray)`,
                    color: "var(--white)",
                  }}
                />
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                  Usuario ID
                </span>
                <input
                  type="text"
                  placeholder="Ej. 789"
                  className="mt-2 w-full rounded px-3 py-2"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid var(--light_gray)`,
                    color: "var(--white)",
                  }}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                  Fecha de consulta
                </span>
                <input
                  type="date"
                  className="mt-2 w-full rounded px-3 py-2"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid var(--light_gray)`,
                    color: "var(--white)",
                  }}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                Motivo de la consulta
              </span>
              <textarea
                rows="4"
                placeholder="Describe el motivo de la consulta"
                className="mt-2 w-full rounded px-3 py-2"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid var(--light_gray)`,
                  color: "var(--white)",
                }}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                Diagnóstico
              </span>
              <textarea
                rows="4"
                placeholder="Describe el diagnóstico"
                className="mt-2 w-full rounded px-3 py-2"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid var(--light_gray)`,
                  color: "var(--white)",
                }}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                Tratamiento
              </span>
              <textarea
                rows="4"
                placeholder="Describe el tratamiento recomendado"
                className="mt-2 w-full rounded px-3 py-2"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid var(--light_gray)`,
                  color: "var(--white)",
                }}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold" style={{ color: "var(--white)" }}>
                Observaciones
              </span>
              <textarea
                rows="4"
                placeholder="Notas adicionales"
                className="mt-2 w-full rounded px-3 py-2"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid var(--light_gray)`,
                  color: "var(--white)",
                }}
              />
            </label>

            <button
              type="button"
              className="mt-3 w-full rounded py-3 font-semibold shadow-xl"
              style={{
                backgroundColor: "var(--main_blue)",
                border: `1px solid var(--white)`,
                color: "var(--white)",
              }}
            >
              GUARDAR EXPEDIENTE
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
