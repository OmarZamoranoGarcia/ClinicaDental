"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  isRole1,
  isRole2,
  isRole3,
  isRole4,
  clearCurrentUser,
} from "@/lib/auth";

export default function Sidebar() {
  const router = useRouter();
  const [esRol1, setEsRol1] = useState(false);
  const [esRol2, setEsRol2] = useState(false);
  const [esRol3, setEsRol3] = useState(false);
  const [esRol4, setEsRol4] = useState(false);

  useEffect(() => {
    const usuario = getCurrentUser();
    setEsRol1(isRole1(usuario));
    setEsRol2(isRole2(usuario));
    setEsRol3(isRole3(usuario));
    setEsRol4(isRole4(usuario));
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    router.replace("/entrada");
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
        {(esRol1 || esRol3 || esRol4) && (
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
        )}

        {(esRol1 || esRol3 || esRol2) && (
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
        )}

        {(esRol1 || esRol3) && (
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
        )}

        {(esRol1 || esRol2) && (
          <Link
            href="/crear-expedientes"
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
            CREAR EXPEDIENTE
          </Link>
        )}

        {(esRol1 || esRol2 || esRol3) && (
          <Link
            href="/expedientes"
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
            EXPEDIENTES
          </Link>
        )}
      </div>

      {/* Botón de CERRAR SESIÓN */}
      <button
        type="button"
        onClick={handleLogout}
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
      </button>
    </aside>
  );
}