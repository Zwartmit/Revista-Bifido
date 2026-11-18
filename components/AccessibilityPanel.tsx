'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PersonStanding, X } from 'lucide-react';

/**
 * Panel de accesibilidad propio (sin servicios de terceros).
 * Aplica preferencias como atributos `data-a11y-*` en <html>; los estilos viven en globals.css.
 * Se guardan solo en este navegador (localStorage), no se envía nada a ningún servidor.
 */
const STORAGE_KEY = 'bifido-a11y-v1';

interface Prefs {
  text: 0 | 1 | 2; // tamaño de texto: normal / grande / muy grande
  contrast: boolean; // alto contraste
  motion: boolean; // reducir movimiento (animaciones, videos y fluido)
  links: boolean; // subrayar enlaces
  focus: boolean; // foco reforzado
}

const DEFAULTS: Prefs = { text: 0, contrast: false, motion: false, links: false, focus: false };

function applyPrefs(p: Prefs) {
  const el = document.documentElement;
  const set = (name: string, on: boolean | string) => {
    if (on === false || on === '0') el.removeAttribute(`data-a11y-${name}`);
    else el.setAttribute(`data-a11y-${name}`, on === true ? 'on' : String(on));
  };
  set('text', String(p.text));
  set('contrast', p.contrast);
  set('motion', p.motion);
  set('links', p.links);
  set('focus', p.focus);

  // Los videos de fondo no los frena CSS: se pausan o se reanudan aquí.
  document.querySelectorAll('video').forEach((v) => {
    if (p.motion) v.pause();
    else if (v.autoplay) v.play().catch(() => {});
  });
}

function load(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* sin almacenamiento: se usan los valores por defecto */
  }
  // Primera visita: respeta la preferencia del sistema operativo.
  return { ...DEFAULTS, motion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false };
}

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const p = load();
    setPrefs(p);
    applyPrefs(p);
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<Prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      applyPrefs(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignorar */
      }
      return next;
    });
  }, []);

  // Videos que se montan después (cambio de página): respetar "reducir movimiento".
  useEffect(() => {
    if (!ready || !prefs.motion) return;
    const mo = new MutationObserver(() => document.querySelectorAll('video').forEach((v) => v.pause()));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [ready, prefs.motion]);

  // Foco: al abrir va al panel; Escape cierra y devuelve el foco al botón.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const toggles: Array<{ key: keyof Omit<Prefs, 'text'>; label: string; hint: string }> = [
    { key: 'contrast', label: 'Alto contraste', hint: 'Textos blancos y bordes más marcados' },
    { key: 'motion', label: 'Reducir movimiento', hint: 'Pausa animaciones, videos y efectos' },
    { key: 'links', label: 'Subrayar enlaces', hint: 'Los enlaces se distinguen sin depender del color' },
    { key: 'focus', label: 'Foco reforzado', hint: 'Marco grueso al navegar con teclado' },
  ];

  return (
    <div className="a11y-panel-root">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="Opciones de accesibilidad"
        className="fixed left-4 bottom-4 z-[9990] w-12 h-12 rounded-full bg-bifido-neon text-black flex items-center justify-center shadow-lg border-2 border-black hover:scale-105 transition-transform"
      >
        <PersonStanding size={26} aria-hidden="true" />
      </button>

      {open && (
        <div
          id="a11y-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Opciones de accesibilidad"
          tabIndex={-1}
          className="fixed left-4 bottom-20 z-[9991] w-[min(22rem,calc(100vw-2rem))] max-h-[75vh] overflow-y-auto rounded-2xl bg-black border-2 border-bifido-neon p-5 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl uppercase tracking-wide">Accesibilidad</h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Cerrar opciones de accesibilidad"
              className="p-1 rounded hover:bg-white/10"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <fieldset className="mb-4">
            <legend className="text-sm text-gray-300 mb-2">Tamaño del texto</legend>
            <div className="grid grid-cols-3 gap-2">
              {(['Normal', 'Grande', 'Muy grande'] as const).map((label, i) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={prefs.text === i}
                  onClick={() => update({ text: i as Prefs['text'] })}
                  className={`px-2 py-2 rounded-lg border text-sm font-medium ${prefs.text === i ? 'bg-bifido-neon text-black border-bifido-neon' : 'border-white/40 hover:bg-white/10'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <ul className="flex flex-col gap-2">
            {toggles.map((t) => (
              <li key={t.key}>
                <button
                  type="button"
                  aria-pressed={prefs[t.key]}
                  onClick={() => update({ [t.key]: !prefs[t.key] } as Partial<Prefs>)}
                  className={`w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between gap-3 ${prefs[t.key] ? 'border-bifido-neon bg-bifido-neon/10' : 'border-white/30 hover:bg-white/10'}`}
                >
                  <span>
                    <span className="block text-sm font-semibold">{t.label}</span>
                    <span className="block text-xs text-gray-300">{t.hint}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 w-10 h-6 rounded-full p-0.5 transition-colors ${prefs[t.key] ? 'bg-bifido-neon' : 'bg-white/30'}`}
                  >
                    <span className={`block w-5 h-5 rounded-full bg-black transition-transform ${prefs[t.key] ? 'translate-x-4' : ''}`} />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
            <button type="button" onClick={() => update({ ...DEFAULTS })} className="text-sm underline underline-offset-4 hover:text-bifido-neon">
              Restablecer
            </button>
            <Link href="/accesibilidad" className="text-sm underline underline-offset-4 hover:text-bifido-neon">
              Declaración de accesibilidad
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
