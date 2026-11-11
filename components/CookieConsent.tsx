'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStoredConsent, setConsent, OPEN_CONSENT_EVENT, type ConsentChoice } from '@/lib/analytics';

/**
 * Aviso de cookies. Por defecto la analítica está DENEGADA (Consent Mode v2, ver GoogleTagManager.tsx);
 * solo se activa si la persona acepta. La elección se recuerda y se puede cambiar desde el pie de página.
 */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getStoredConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md z-[10000] bg-black border border-bifido-neon/60 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
    >
      <p className="font-display text-xl text-white mb-2">Cookies</p>
      <p className="text-sm text-gray-300 leading-relaxed mb-4">
        Usamos cookies de analítica (Google Analytics) para entender cómo se lee la revista y mejorarla.
        Solo se activan si las aceptas, y no usamos cookies de publicidad.{' '}
        <Link href="/privacidad" className="underline underline-offset-2 text-bifido-neon hover:text-white">
          Más información
        </Link>
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => choose('granted')}
          className="flex-1 bg-bifido-neon text-black font-mono text-xs font-bold uppercase tracking-widest py-3 rounded-full hover:bg-white transition-colors"
        >
          Aceptar
        </button>
        <button
          onClick={() => choose('denied')}
          className="flex-1 border border-white/40 text-white font-mono text-xs font-bold uppercase tracking-widest py-3 rounded-full hover:bg-white/10 transition-colors"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
