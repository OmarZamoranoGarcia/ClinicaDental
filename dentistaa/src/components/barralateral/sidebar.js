"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, isRole4, clearCurrentUser } from "@/lib/auth";

export default function Sidebar() {
  const [esRol4, setEsRol4] = useState(false);

  useEffect(() => {
    const usuario = getCurrentUser();
    setEsRol4(isRole4(usuario));
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    window.location.href = "/entrada";
  };

  return (
    <aside
      className="w-80 h-full flex flex-col justify-between p-4 border-r"
      style={{
        backgroundColor: "var(--main_gray)",
        borderColor: "var(--light_gray)",
      }}
    >
      <div>
        {/* ENLACE PARA CITAS: Redirecciona a agendar-citas */}
        <Link
          href="/agendar-citas"
          className="italic w-full py-2 shadow-xl mb-4 rounded text-center block transition delay-20"
          style={{
            backgroundColor: "var(--light_gray)",
            color: "var(--white)",
            border: `1px solid var(--main_blue)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--main_blue)";
            e.currentTarget.style.color = "var(--white)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--light_gray)";
            e.currentTarget.style.color = "var(--white)";
          }}
        >
          AGENDAR CITAS
        </Link>

        {!esRol4 && (
          <>
            {/* ENLACE PARA CITAS AGENDADAS: Redirecciona a citas-agendadas */}
            <Link
              href="/citas-agendadas"
              className="italic w-full py-2 shadow-xl mb-4 rounded text-center block transition delay-20"
              style={{
                backgroundColor: "var(--light_gray)",
                color: "var(--white)",
                border: `1px solid var(--main_blue)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--main_blue)";
                e.currentTarget.style.color = "var(--white)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--light_gray)";
                e.currentTarget.style.color = "var(--white)";
              }}
            >
              CITAS AGENDADAS
            </Link>

            {/* ENLACE PARA SERVICIOS: Redirecciona a servicios */}
            <Link
              href="/servicios"
              className="italic w-full py-2 shadow-xl mb-4 rounded text-center block transition delay-20"
              style={{
                backgroundColor: "var(--light_gray)",
                color: "var(--white)",
                border: `1px solid var(--main_blue)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--main_blue)";
                e.currentTarget.style.color = "var(--white)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--light_gray)";
                e.currentTarget.style.color = "var(--white)";
              }}
            >
              SERVICIOS
            </Link>
          </>
        )}
      </div>

      {/* Botón de CERRAR SESIÓN */}
      <Link
        href="/entrada"
        className="italic w-full py-2 shadow-xl rounded text-center block transition delay-20"
        style={{
          backgroundColor: "var(--light_gray)",
          color: "var(--white)",
          border: `1px solid var(--main_blue)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--main_blue)";
          e.currentTarget.style.color = "var(--white)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--light_gray)";
          e.currentTarget.style.color = "var(--white)";
        }}
      >
        CERRAR SESIÓN
      </Link>
    </aside>
  );
}