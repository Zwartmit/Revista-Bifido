import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

/** Las personas del Archivo Vivo (mismos avatares que en El Parche). */
const TEAM = [
  { file: 'Alexandra', name: 'Alexandra Amado' },
  { file: 'Ana', name: 'Ana Meléndez R.' },
  { file: 'Camila', name: 'Cami Castañeda' },
  { file: 'Natalia', name: 'Churca Despeinada' },
  { file: 'Brian', name: 'Crowan' },
  { file: 'Carlos', name: 'Juan Carlos Arias' },
  { file: 'Paula', name: 'Pawleska' },
  { file: 'Brandon', name: 'Zwartmit' },
];

const STATS = [
  { big: '5', label: 'personajes, 5 causas' },
  { big: '8', label: 'personas en el Archivo Vivo' },
  { big: '2', label: 'ediciones del FreeSoul Fest' },
];

/**
 * Introducción de la Home: explica qué es Bífido a quien llega por primera vez.
 * Su título es el <h1> de la página (el hero solo contiene imágenes).
 */
export default function HomeIntro() {
  return (
    <section aria-labelledby="que-es-bifido" className="bg-black relative z-10 pt-10 pb-14 md:pt-16 md:pb-20">
      <div className="container mx-auto px-5 sm:px-8 lg:px-12 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Texto */}
          <div>
            <h1
              id="que-es-bifido"
              className="font-display uppercase text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-white mb-6"
            >
              ¿Qué es <span className="text-bifido-neon">Bífido</span>?
              <span className="sr-only"> Revista digital de periodismo crudo para sensibilidades frágiles</span>
            </h1>

            <p className="font-googlesans text-lg md:text-xl text-gray-200 leading-relaxed mb-5 md:max-w-2xl lg:max-w-none">
              Bífido es una revista digital, cultural y alternativa hecha en Boyacá que cuenta lo que pasa en la calle: cultura, género, opinión,
              ambiente y reducción de riesgos y daños. Sin filtros ni moralina, con las voces de quienes lo viven.
            </p>
            <p className="font-googlesans text-lg md:text-xl text-gray-300 leading-relaxed mb-8 md:max-w-2xl lg:max-w-none">
              Cada tema tiene su voz: cinco personajes, <strong className="text-white">la manada</strong>, que hablan y firman.
              Detrás hay personas reales, el <strong className="text-white">Archivo Vivo</strong>, que narran, señalan y registran.
            </p>

            <dl className="grid grid-cols-3 gap-3 sm:gap-4 mb-9 md:max-w-2xl lg:max-w-none">
              {STATS.map((s) => (
                <div key={s.label} className="border-l-2 border-bifido-neon pl-3 sm:pl-4">
                  <dt className="font-display text-4xl sm:text-5xl text-bifido-neon leading-none">{s.big}</dt>
                  <dd className="mt-1 text-sm sm:text-base text-gray-300 leading-snug">{s.label}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="#lo-mas-fresquito"
                className="inline-flex items-center justify-center gap-3 px-7 py-3 rounded-full bg-bifido-neon text-black font-display text-xl tracking-wide hover:bg-white transition-colors"
              >
                LEE LO ÚLTIMO <ArrowRight size={22} className="rotate-90" />
              </Link>
              <Link
                href="/eventos"
                className="inline-flex items-center justify-center gap-3 px-7 py-3 rounded-full border-2 border-white/50 text-white font-display text-xl tracking-wide hover:bg-white/10 transition-colors"
              >
                MIRA LOS EVENTOS <ArrowRight size={22} />
              </Link>
            </div>
          </div>

          {/* Avatares del Archivo Vivo */}
          <div className="w-full max-w-md md:max-w-xl mx-auto lg:max-w-none">
            <ul className="grid grid-cols-4 gap-3 sm:gap-5 lg:gap-4">
              {TEAM.map((p, i) => {
                const odd = i % 2 === 1;
                return (
                  <li key={p.file}>
                    <div
                      className={`aspect-square rounded-full overflow-hidden bg-white p-[6%] border-[3px] ${
                        odd
                          ? 'border-white rotate-[2.5deg] shadow-[5px_5px_0_#fe5e00] md:shadow-[7px_7px_0_#fe5e00] lg:shadow-[5px_5px_0_#fe5e00]'
                          : 'border-bifido-neon -rotate-[2.5deg] shadow-[5px_5px_0_rgba(184,255,0,0.35)] md:shadow-[7px_7px_0_rgba(184,255,0,0.35)] lg:shadow-[5px_5px_0_rgba(184,255,0,0.35)]'
                      }`}
                    >
                      <Image
                        src={`/archivo/${p.file}.png`}
                        alt={`Avatar de ${p.name}`}
                        width={240}
                        height={240}
                        sizes="(min-width: 1024px) 130px, (min-width: 768px) 140px, 22vw"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-center font-mono text-xs sm:text-sm uppercase tracking-[0.12em] text-gray-400 md:whitespace-nowrap lg:whitespace-normal xl:whitespace-nowrap">
              <span className="block sm:inline">Archivo Vivo</span>
              <span className="hidden sm:inline"> · </span>
              <span className="block sm:inline">las personas detrás de la revista</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
