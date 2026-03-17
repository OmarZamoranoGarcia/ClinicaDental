// import Login from "./entrada/page";

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[var(--main_gray)] text-[var(--white)] shadow-lg">
        <h1 className="text-2xl font-bold text-[var(--main_blue)]">
          Clínica Dental
        </h1>

        <ul className="flex items-center gap-8">
          <li>
            <a className="hover:text-[var(--main_blue)] transition cursor-pointer">
              Servicios
            </a>
          </li>
          <li>
            <a className="hover:text-[var(--main_blue)] transition cursor-pointer">
              Ubicación
            </a>
          </li>
          <li>
            <button className="bg-[var(--main_blue)] text-[var(--main_black)] px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer">
              Agendar cita
            </button>
          </li>
        </ul>
      </nav>

      <main className="bg-[var(--main_black)] text-[var(--white)]">
        {/* HERO */}
        <section className="grid md:grid-cols-2 items-center content-center gap-10 px-8 py-20">
          <div>
            <h2 className="text-6xl font-bold mb-12 text-[var(--main_blue)]">
              Bienvenido a nuestra clínica dental
            </h2>
            <p className="text-lg text-[var(--white)]/80 mb-12">
              Cuidamos tu sonrisa con los mejores especialistas y tecnología
              moderna.
            </p>
            <button className="bg-[var(--main_blue)] text-[var(--main_black)] px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition cursor-pointer">
              Reserva online
            </button>
          </div>

          <div>
            <img
              src="./clinicaDental.jpg"
              alt="Imagen clínica"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </section>

        {/* SERVICIOS */}
        <section className="px-8 py-20 bg-[var(--light_gray)]">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--main_blue)] mb-4">
              Servicios especializados
            </h2>
            <p className="text-[var(--white)]/70">
              Tratamientos modernos y personalizados.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Blanqueamiento dental",
              "Ortodoncia",
              "Cirugía maxilofacial",
              "Limpieza",
              "Caries",
              "Extracciones",
            ].map((service, index) => (
              <div
                key={index}
                className="p-6 bg-[var(--main_gray)] rounded-2xl"
              >
                <h3 className="text-xl font-semibold text-[var(--main_blue)] mb-3">
                  {service}
                </h3>
                <p className="text-[var(--white)]/70">
                  Atención profesional con tecnología avanzada.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* UBICACIÓN */}
        <section className="px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-16 text-[var(--main_blue)]">
            Visítanos
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Ubicación</h3>
              <p className="text-[var(--white)]/70 mb-6">
                Estamos ubicados en el centro de la ciudad.
              </p>
              <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26910.675962286026!2d-117.05995992089842!3d32.53056699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d949fcb8a7484d%3A0xf192e04592be342a!2sCIRUJANO%20DENTISTA%20DR%20CRISTIAN%20L%C3%93PEZ!5e0!3m2!1ses!2smx!4v1773527011870!5m2!1ses!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Horario de atención
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border border-[var(--main_blue)]">
                  <thead>
                    <tr className="bg-[var(--main_blue)] text-[var(--main_black)]">
                      <th className="p-3 text-left">Día</th>
                      <th className="p-3 text-left">Horario</th>
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
                        className="border-t border-[var(--light_gray)] hover:bg-[var(--main_gray)] transition"
                      >
                        <td className="p-3">{row[0]}</td>
                        <td className="p-3">{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h4 className="text-xl font-semibold text-[var(--main_blue)]">
                  Teléfono
                </h4>
                <span className="text-lg">664 234 567 890</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[var(--main_gray)] text-center py-6 text-[var(--white)]">
        <p>© 2026 Clínica Dental - Todos los derechos reservados</p>
      </footer>
    </>
  );
}