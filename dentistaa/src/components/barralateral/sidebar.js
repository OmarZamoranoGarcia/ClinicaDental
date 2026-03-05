
import Link from 'next/link';

export default function Sidebar() {
    return (
        // Remuevo el div innecesario que solo envuelve la aside
        <aside className="w-80 h-full bg-[#147DA8] flex flex-col justify-between p-4 border-r border-gray-700">
            <div>

                {/* ENLACE PARA CITAS: Redirecciona a la página pages/citas.js */}
                <Link
                    href="/agendar-citas"
                    className="italic w-full py-2 bg-white shadow-xl text-[#147DA8] mb-4 border border-gray-600 hover:bg-[#60D6A7] transition delay-50 rounded text-center block"
                >
                    AGENDAR CITAS
                </Link>

                {/* ENLACE PARA CITAS AGENDADAS: Redirecciona a la página pages/citas-agendadas.js */}
                <Link
                    href="/citas-agendadas"
                    className="italic w-full py-2 border mb-4 bg-white shadow-xl text-[#147DA8] border-gray-600 hover:bg-[#60D6A7] transition delay-50 rounded text-center block"
                >
                    CITAS AGENDADAS
                </Link>
                {/* ENLACE PARA CITAS AGENDADAS: Redirecciona a la página pages/citas-agendadas.js */}
                <Link
                    href="/servicios"
                    className="italic w-full py-2 border bg-white shadow-xl text-[#147DA8] border-gray-600 hover:bg-[#60D6A7] transition delay-50 rounded text-center block"
                >
                    SERVICIOS
                </Link>

            </div>

            {/* Botón de CERRAR SESIÓN (No es un enlace de página, se mantiene como botón) */}
            <Link
                href="/entrada"
                className="font-style: italic w-full py-2 border bg-[#FFFFFF] shadow-xl text-[#147DA8] border-gray-600 hover:bg-[#60D6A7] transition delay-50 rounded">
                CERRAR SESIÓN
            </Link>

        </aside>
    );
}