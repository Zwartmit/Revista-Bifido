import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Declaración de accesibilidad',
  description: 'Qué hace Revista Bífido por una web accesible, qué opciones puedes activar y cómo reportarnos una barrera.',
  path: '/accesibilidad',
});

const H2 = 'font-display text-3xl text-white mt-12 mb-4';
const P = 'text-base text-gray-300 leading-relaxed mb-4';
const LI = 'text-base text-gray-300 leading-relaxed';

export default function AccesibilidadPage() {
  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-16 pt-36 pb-20 max-w-3xl">
      <h1 className="font-display text-5xl md:text-6xl uppercase leading-[0.95] mb-8">Declaración de accesibilidad</h1>

      <p className={P}>
        Queremos que cualquier persona pueda leer, navegar y participar en Bífido. Trabajamos para que el sitio cumpla las pautas
        WCAG 2.1 nivel AA, y reconocemos que es un proceso continuo: todavía puede haber barreras que no hemos detectado.
      </p>

      <h2 className={H2}>Opciones que puedes activar</h2>
      <p className={P}>
        El botón de accesibilidad, abajo a la izquierda de cada página, abre un panel con estas opciones. Se guardan solo en tu
        navegador y no se envían a ningún servidor.
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li className={LI}>Tamaño del texto: normal, grande o muy grande.</li>
        <li className={LI}>Alto contraste.</li>
        <li className={LI}>Reducir movimiento: pausa animaciones, videos y efectos. También respetamos la preferencia de tu sistema operativo.</li>
        <li className={LI}>Subrayar enlaces.</li>
      </ul>

      <h2 className={H2}>Navegación con teclado</h2>
      <p className={P}>
        Puedes recorrer todo el sitio con la tecla Tab. Los menús y el panel se cierran con Escape.
      </p>

      <h2 className={H2}>Limitaciones conocidas</h2>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li className={LI}>Algunas ilustraciones y videos decorativos todavía no tienen descripción alternativa detallada.</li>
        <li className={LI}>Los contenidos de terceros (mapas, videos incrustados, redes sociales) siguen las políticas de accesibilidad de cada plataforma.</li>
        <li className={LI}>Los artículos antiguos pueden tener imágenes sin texto alternativo.</li>
      </ul>

      <h2 className={H2}>Cuéntanos si encuentras una barrera</h2>
      <p className={P}>
        Si algo no funciona con tu lector de pantalla, teclado u otra tecnología de apoyo, escríbenos desde{' '}
        <Link href="/contactanos" className="text-bifido-neon underline underline-offset-4">Contáctanos</Link> o a{' '}
        <a href="mailto:bifidomedio@gmail.com" className="text-bifido-neon underline underline-offset-4">bifidomedio@gmail.com</a>. Indícanos la
        página, qué intentabas hacer y qué tecnología usas. Respondemos lo antes posible.
      </p>
    </div>
  );
}
