import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Política de privacidad y cookies',
  description: 'Qué datos recoge Revista Bífido, para qué los usa, qué cookies emplea y cómo puedes ejercer tus derechos.',
  path: '/privacidad',
});

const H2 = 'font-display text-3xl text-white mt-12 mb-4';
const P = 'text-base text-gray-300 leading-relaxed mb-4';
const LI = 'text-base text-gray-300 leading-relaxed';

export default function PrivacidadPage() {
  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-16 pt-36 pb-20 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-bifido-neon mb-3">Última actualización: 10 de noviembre de 2026</p>
      <h1 className="font-display text-5xl md:text-6xl uppercase leading-[0.95] mb-8">Política de privacidad y cookies</h1>

      <p className={P}>
        En Revista Bífido (<strong>revistabifido.com</strong>) cuidamos tus datos igual que cuidamos las historias que contamos.
        Esta página explica, en lenguaje claro, qué información recogemos, para qué y cómo puedes controlarla.
      </p>

      <h2 className={H2}>Qué datos recogemos</h2>
      <p className={P}>
        No tenemos cuentas de usuario ni formularios que pidan datos personales en el sitio. Lo único que medimos, y solo si
        lo aceptas, es el uso general de la web mediante <strong>Google Analytics</strong>: páginas visitadas, tiempo de lectura,
        tipo de dispositivo y navegador, y ubicación aproximada (ciudad o país). No usamos esa información para identificarte.
      </p>

      <h2 className={H2}>Cookies que usamos</h2>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li className={LI}><strong>Necesarias:</strong> guardan tu elección sobre las cookies (en el almacenamiento de tu navegador). Sin ellas no podríamos recordarla.</li>
        <li className={LI}><strong>Analítica (Google Analytics, cookies <code>_ga</code> y <code>_ga_*</code>):</strong> solo se activan si pulsas «Aceptar». Sirven para entender qué se lee y mejorar la revista.</li>
        <li className={LI}><strong>Publicidad:</strong> no usamos cookies de publicidad ni de seguimiento entre sitios.</li>
      </ul>
      <p className={P}>
        Puedes cambiar tu decisión en cualquier momento con el enlace <strong>«Cookies»</strong> del pie de página, o borrando
        los datos del sitio desde la configuración de tu navegador.
      </p>

      <h2 className={H2}>Terceros</h2>
      <p className={P}>
        Si aceptas la analítica, Google (Google Analytics y Google Tag Manager) procesa los datos de uso en sus servidores,
        que pueden estar fuera de Colombia. El sitio también puede mostrar contenido incrustado de terceros (por ejemplo,
        videos o publicaciones de redes sociales), que pueden aplicar sus propias políticas.
      </p>

      <h2 className={H2}>Tus derechos</h2>
      <p className={P}>
        De acuerdo con la Ley 1581 de 2012 (protección de datos personales en Colombia) puedes conocer, actualizar, rectificar y
        solicitar la supresión de tus datos, así como revocar la autorización que nos hayas dado. Para ejercer estos derechos,
        escríbenos desde la página de <Link href="/contactanos" className="underline underline-offset-2 text-bifido-neon hover:text-white">Contáctanos</Link>.
      </p>

      <h2 className={H2}>Cambios en esta política</h2>
      <p className={P}>
        Si algo cambia (por ejemplo, si añadimos otra herramienta de medición), actualizaremos esta página y volveremos a
        pedirte tu consentimiento cuando sea necesario.
      </p>
    </div>
  );
}
