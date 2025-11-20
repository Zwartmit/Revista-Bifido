'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollText } from 'lucide-react';

export default function ManifiestoPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen py-20 sm:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div ref={contentRef}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-bifido-gray rounded-full mb-4">
              <ScrollText className="text-white" size={32} />
            </div>
            <h1 className="font-display text-5xl md:text-6xl mb-4">
              Manifiesto
            </h1>
            <p className="text-xl text-bifido-lightgray italic">
              &quot;Periodismo crudo para sensibilidades frágiles&quot;
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="font-display text-3xl mb-4">¿Qué es Bífido?</h2>
              <p className="text-gray-300 leading-relaxed">
                Bífido es una revista digital, cultural, alternativa e independiente que nace
                de la necesidad de contar historias sin filtros, sin censura y sin miedo.
                Somos un espacio para las voces que no encuentran eco en los medios tradicionales,
                para las perspectivas que incomodan, para las verdades que duelen.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-3xl mb-4">Nuestra Filosofía</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Creemos en el periodismo como herramienta de transformación social. No nos
                conformamos con informar; queremos provocar reflexión, generar debate y
                cuestionar el status quo. Nuestro compromiso es con la verdad, por incómoda
                que sea.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Bífido no es para todos. Es para quienes están dispuestos a enfrentar
                realidades complejas, para quienes valoran la honestidad por encima de la
                corrección política, para quienes entienden que el cambio comienza con la
                incomodidad.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-3xl mb-4">Nuestras Secciones</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-punkibri-primary pl-4">
                  <h3 className="font-display text-xl mb-2">Ecorebeldia</h3>
                  <p className="text-gray-300">
                    Ambiente, activismo ecológico y la lucha por un planeta sostenible.
                  </p>
                </div>

                <div className="border-l-4 border-mordaz-primary pl-4">
                  <h3 className="font-display text-xl mb-2">Lxs compas de Mordáz</h3>
                  <p className="text-gray-300">
                    Opinión sin censura, análisis político y crítica social.
                  </p>
                </div>

                <div className="border-l-4 border-malandra-primary pl-4">
                  <h3 className="font-display text-xl mb-2">Mala Fama</h3>
                  <p className="text-gray-300">
                    Cultura underground, arte alternativo y expresiones marginales.
                  </p>
                </div>

                <div className="border-l-4 border-anika-primary pl-4">
                  <h3 className="font-display text-xl mb-2">Muda de Piel</h3>
                  <p className="text-gray-300">
                    Reducción de riesgos y daños, autocuidado y salud desde una perspectiva pragmática.
                  </p>
                </div>

                <div className="border-l-4 border-incendia-primary pl-4">
                  <h3 className="font-display text-xl mb-2">Fuegos Diversos</h3>
                  <p className="text-gray-300">
                    Género, diversidad, equidad y justicia social interseccional.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-3xl mb-4">Nuestro Compromiso</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">•</span>
                  <span>Independencia editorial absoluta</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">•</span>
                  <span>Transparencia en nuestras fuentes y métodos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">•</span>
                  <span>Respeto a la diversidad de voces y perspectivas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">•</span>
                  <span>Compromiso con la ética periodística</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">•</span>
                  <span>Accesibilidad y gratuidad del contenido</span>
                </li>
              </ul>
            </section>

            <section className="bg-bifido-gray text-white p-8 rounded-lg">
              <h2 className="font-display text-3xl mb-4">Únete a Bífido</h2>
              <p className="leading-relaxed mb-4">
                Bífido es más que una revista; es una comunidad de pensadores críticos,
                activistas, artistas y ciudadanos comprometidos con el cambio social.
              </p>
              <p className="leading-relaxed">
                Si compartes nuestra visión y quieres contribuir con tu voz,
                <a href="/contactanos" className="underline ml-1 hover:text-bifido-lightgray">
                  contáctanos
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
