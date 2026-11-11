'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

const SOCIAL: Array<[RegExp, string]> = [
  [/facebook\.com|fb\.com/i, 'facebook'],
  [/instagram\.com/i, 'instagram'],
  [/youtube\.com|youtu\.be/i, 'youtube'],
  [/wa\.me|whatsapp\.com/i, 'whatsapp'],
  [/tiktok\.com/i, 'tiktok'],
  [/(^|\/\/)(www\.)?(x|twitter)\.com/i, 'x'],
  [/spotify\.com/i, 'spotify'],
];
const CHARACTER_PATH = /^\/(malandra|incendia|mordaz|punkibri|anika)(\/|$)/;

/**
 * Eventos de clic por delegación (un solo listener para todo el sitio):
 *  - [data-track="nombre_evento"] (+ data-track-label): cualquier botón/enlace que queramos medir.
 *  - Redes sociales  -> social_click   { network }
 *  - mailto / tel    -> contact_click  { method }
 *  - Páginas de personaje -> character_click { character }
 * Los clics de salida, descargas y desplazamientos ya los mide la "medición mejorada" de GA4.
 */
export default function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;

      const tagged = target.closest<HTMLElement>('[data-track]');
      if (tagged) {
        track(tagged.dataset.track as string, { label: tagged.dataset.trackLabel, page: location.pathname });
        return;
      }

      const a = target.closest<HTMLAnchorElement>('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';

      if (href.startsWith('mailto:')) return track('contact_click', { method: 'email', page: location.pathname });
      if (href.startsWith('tel:')) return track('contact_click', { method: 'phone', page: location.pathname });

      const social = SOCIAL.find(([re]) => re.test(href));
      if (social) return track('social_click', { network: social[1], link_url: href, page: location.pathname });

      // Enlaces internos a las landings / páginas de personaje
      const internal = href.startsWith('/') || a.host === location.host;
      const m = internal ? (href.startsWith('/') ? href : a.pathname).match(CHARACTER_PATH) : null;
      if (m) track('character_click', { character: m[1], link_url: href, page: location.pathname });
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
