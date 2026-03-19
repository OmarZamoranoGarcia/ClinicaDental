// import Login from "./entrada/page";
export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 bg-[var(--main_gray)]/95 backdrop-blur-md text-[var(--white)] border-b border-[var(--light_gray)]">
        <h1 className="text-2xl font-light tracking-tight">
          <span className="font-bold text-[var(--main_blue)]">Clínica</span>{" "}
          Dental
        </h1>

        <ul className="flex items-center gap-10">
          <li>
            <a className="text-sm font-medium uppercase tracking-wider hover:text-[var(--main_blue)] transition-colors duration-300 cursor-pointer" href="#servicios">
              Servicios
            </a>
          </li>
          <li>
            <a className="text-sm font-medium uppercase tracking-wider hover:text-[var(--main_blue)] transition-colors duration-300 cursor-pointer" href="#ubicacion">
              Ubicación
            </a>
          </li>
          <li>
            <button className="bg-[var(--main_blue)] text-[var(--main_black)] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg shadow-[var(--main_blue)]/20 cursor-pointer">
              Agendar cita
            </button>
          </li>
        </ul>
      </nav>

      <main className="bg-[var(--main_black)] text-[var(--white)]">
        {/* HERO */}
        <section className="relative grid md:grid-cols-2 items-center gap-16 px-8 py-24 max-w-7xl mx-auto overflow-hidden">
          {/* Efecto decorativo */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--main_blue)]/10 rounded-full blur-3xl -z-10"></div>

          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-[var(--main_blue)]/10 rounded-full">
              <span className="text-sm font-medium text-[var(--main_blue)]">
                ✨ Bienvenido a tu clínica de confianza
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-[var(--white)]">Cuidamos tu</span>
              <br />
              <span className="text-[var(--main_blue)]">sonrisa</span>
            </h2>
            <p className="text-lg text-[var(--white)]/70 leading-relaxed max-w-lg">
              Con los mejores especialistas y tecnología moderna para brindarte
              la mejor experiencia dental.
            </p>
            <button className="group bg-gradient-to-r from-[var(--main_blue)] to-[#4AC7FF] text-[var(--main_black)] px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2">
              Reserva online
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--main_blue)]/20 to-transparent rounded-3xl blur-2xl"></div>
            <img
              src="./clinicaDental.jpg"
              alt="Imagen clínica"
              className="relative rounded-3xl shadow-2xl border border-[var(--light_gray)]"
            />
          </div>
        </section>

        {/* SERVICIOS */}
        <section className="px-8 py-28 bg-gradient-to-b from-[var(--light_gray)] to-[var(--main_gray)]" id="servicios">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-[var(--main_blue)] mb-4">
                Servicios especializados
              </h2>
              <div className="w-24 h-1 bg-[var(--main_blue)] mx-auto rounded-full mb-6"></div>
              <p className="text-[var(--white)]/70 max-w-2xl mx-auto">
                Ofrecemos tratamientos modernos y personalizados adaptados a tus
                necesidades
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Blanqueamiento dental", icon: "✨" },
                { name: "Ortodoncia", icon: "🦷" },
                { name: "Cirugía maxilofacial", icon: "⚕️" },
                { name: "Limpieza", icon: "💎" },
                { name: "Caries", icon: "🔧" },
                { name: "Extracciones", icon: "🦷" },
              ].map((service, index) => (
                <div
                  key={index}
                  className="group p-8 bg-[var(--main_gray)]/50 backdrop-blur-sm rounded-2xl border border-[var(--light_gray)] hover:border-[var(--main_blue)]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--main_blue)]/10"
                >
                  <span className="text-4xl mb-4 block">{service.icon}</span>
                  <h3 className="text-xl font-semibold text-[var(--main_blue)] mb-3">
                    {service.name}
                  </h3>
                  <p className="text-[var(--white)]/60 text-sm leading-relaxed">
                    Atención profesional con tecnología avanzada para resultados
                    óptimos.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* UBICACIÓN */}
        <section className="px-8 py-28 max-w-7xl mx-auto" id="ubicacion">
          <h2 className="text-4xl font-bold text-center mb-4 text-[var(--main_blue)]">
            Visítanos
          </h2>
          <div className="w-24 h-1 bg-[var(--main_blue)] mx-auto rounded-full mb-20"></div>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--main_blue)] rounded-full"></span>
                  Ubicación
                </h3>
                <p className="text-[var(--white)]/70 mb-6 leading-relaxed">
                  Estamos ubicados en el centro de la ciudad, con fácil acceso y
                  estacionamiento.
                </p>
              </div>

              <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-[var(--light_gray)]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26910.675962286026!2d-117.05995992089842!3d32.53056699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d949fcb8a7484d%3A0xf192e04592be342a!2sCIRUJANO%20DENTISTA%20DR%20CRISTIAN%20L%C3%93PEZ!5e0!3m2!1ses!2smx!4v1773527011870!5m2!1ses!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--main_blue)] rounded-full"></span>
                  Horario de atención
                </h3>

                <div className="overflow-hidden rounded-2xl border border-[var(--light_gray)] bg-[var(--main_gray)]/30">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-[var(--main_blue)] to-[#4AC7FF]">
                        <th className="p-4 text-left text-[var(--main_black)] font-semibold">
                          Día
                        </th>
                        <th className="p-4 text-left text-[var(--main_black)] font-semibold">
                          Horario
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Lunes", "8:00 AM - 6:00 PM"],
                        ["Martes", "8:00 AM - 6:00 PM"],
                        ["Miércoles", "8:00 AM - 6:00 PM"],
                        ["Jueves", "8:00 AM - 6:00 PM"],
                        ["Viernes", "8:00 AM - 6:00 PM"],
                        ["Sábado", "8:00 AM - 3:00 PM"],
                        ["Domingo", "Cerrado"],
                      ].map((row, index) => (
                        <tr
                          key={index}
                          className="border-t border-[var(--light_gray)] hover:bg-[var(--main_blue)]/5 transition-colors duration-200"
                        >
                          <td className="p-4 font-medium">{row[0]}</td>
                          <td
                            className={`p-4 ${row[1] === "Cerrado" ? "text-red-400" : "text-[var(--white)]/80"}`}
                          >
                            {row[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[var(--main_gray)] to-[var(--light_gray)] p-8 rounded-2xl border border-[var(--light_gray)]">
                <h4 className="text-xl font-semibold text-[var(--main_blue)] mb-3">
                  📞 Teléfono
                </h4>
                <span className="text-2xl font-light tracking-wider">
                  664 234 567 890
                </span>
                <p className="text-sm text-[var(--white)]/50 mt-4">
                  Llámanos para agendar tu cita o resolver tus dudas
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[var(--main_gray)] border-t border-[var(--light_gray)]">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-[var(--main_blue)] mb-4">
                Clínica Dental
              </h3>
              <p className="text-sm text-[var(--white)]/60 leading-relaxed">
                Tu sonrisa es nuestra prioridad. Más de 10 años cuidando la
                salud dental de nuestros pacientes.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--white)]/80 mb-4">
                Enlaces rápidos
              </h4>
              <ul className="space-y-2 text-sm text-[var(--white)]/60">
                <li>
                  <a className="hover:text-[var(--main_blue)] transition-colors cursor-pointer" href="#servicios">
                    Servicios
                  </a>
                </li>
                <li>
                  <a className="hover:text-[var(--main_blue)] transition-colors cursor-pointer" href="#ubicacion">
                    Ubicación
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--white)]/80 mb-4">
                Horario
              </h4>
              <ul className="space-y-2 text-sm text-[var(--white)]/60">
                <li>Lun - Vie: 8:00 AM - 6:00 PM</li>
                <li>Sábado: 8:00 AM - 3:00 PM</li>
                <li>Domingo: Cerrado</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-[var(--light_gray)]">
            <p className="text-sm text-[var(--white)]/40">
              © 2026 Clínica Dental - Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
