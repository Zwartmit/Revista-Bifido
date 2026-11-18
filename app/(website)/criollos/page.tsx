import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { getCharacterColors } from '@/lib/character-colors';

export const metadata: Metadata = pageMetadata({
  title: 'Los Criollos',
  description: 'Un perro y un gato que llegaron desde el abandono y hoy son parte de La Manada: la sección de Bífido sobre adopción, refugios y bienestar animal.',
  path: '/criollos',
});

/**
 * Los Criollos: sección de La Manada (no son personajes principales).
 * Datos tomados del Manual de Identidad. Comparte el sistema visual `cl-*` de las landings de personajes,
 * pero en una sola columna ancha y centrada (ver `.cr-*` en character-landings.css).
 */
const FUNCIONES = [
  { title: 'Visibilizan', desc: 'Historias de adopción, refugios, procesos comunitarios y educación sobre bienestar animal.' },
  { title: 'Llaman a la acción', desc: 'Presentan llamados concretos: adoptar, cuidar, esterilizar, respetar.' },
  { title: 'Hacen de puente', desc: 'Conectan emocionalmente a la audiencia con la acción concreta.' },
  { title: 'Acompañan', desc: 'Piezas visuales, campañas, infografías y relatos breves.' },
];

export default function CriollosPage() {
  const c = getCharacterColors('criollos');

  return (
    <div
      className="cl-wrap cr-page"
      style={{ '--cl-p1': c.primary, '--cl-p1t': c.text, '--cl-on': c.on, '--cl-p2': c.secondary } as React.CSSProperties}
    >
      {/* ─── HERO ─── */}
      <section className="cr-hero">
        <div className="cr-hero-glow" aria-hidden="true" />
        <div className="cr-hero-inner">
          <h1 className="cl-hero-nombre">LOS <span className="acento">CRIOLLOS</span></h1>

          {/* Perro y gato: las dos ilustraciones comparten lienzo; el borde inferior se funde con el fondo */}
          <div className="cr-hero-art">
            <Image src="/personajes/dog%20adopcion.webp" alt="Criollo: el perro, adoptado por La Manada" fill sizes="(min-width: 1100px) 1020px, 100vw" className="object-cover object-bottom" priority />
            <Image src="/personajes/cat%20adopcion.webp" alt="Criollo: el gato, adoptado por La Manada" fill sizes="(min-width: 1100px) 1020px, 100vw" className="object-cover object-bottom" priority />
          </div>
        </div>
      </section>

      {/* ─── 01 · QUIÉNES SON ─── */}
      <section className="cr-section">
        <div className="cr-inner">
          <div className="cr-head">
            <p className="cl-section-label">01 — ¿Quiénes son?</p>
            <h2 className="cl-section-title">Adoptados por<br /><em>la Manada</em></h2>
          </div>
          <div className="cr-quienes">
            <p className="cr-lead">
              Un perro y un gato que llegaron desde el abandono, la intemperie y el rebusque, y que hoy forman parte de La Manada
              {' '}<strong>no como víctimas, sino como testigos y sobrevivientes</strong>.
            </p>
            <div className="cl-especie-texto">
              <p>Los Criollos encarnan <strong>el cuidado cotidiano</strong>, el afecto sin condiciones y la responsabilidad colectiva hacia los animales.</p>
              <p>Son la prueba de que el territorio también se cuida desde los gestos pequeños.</p>
              <div className="cl-alerta-box">
                <div className="alerta-head">Su postura</div>
                <p>Perro y gato son una <strong>pareja narrativa inseparable</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02 · QUÉ HACEN EN BÍFIDO ─── */}
      <section className="cr-section" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="cr-inner">
          <div className="cr-head">
            <p className="cl-section-label">02 — Función editorial</p>
            <h2 className="cl-section-title">Del afecto<br /><em>a la acción</em></h2>
          </div>
          <div className="cl-temas-grid">
            {FUNCIONES.map((f, i) => (
              <div key={f.title} className="cl-tema-card">
                <div className="cl-tema-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                <div className="cl-tema-title">{f.title}</div>
                <div className="cl-tema-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 03 · VOZ Y CARÁCTER ─── */}
      <section className="cr-section">
        <div className="cl-personaje-bg-text" aria-hidden="true">CRIOLLOS</div>
        <div className="cr-inner">
          <div className="cr-head">
            <p className="cl-section-label">03 — Voz y carácter</p>
            <h2 className="cl-section-title">Cercanos, afectivos,<br /><em>honestos</em></h2>
          </div>
          <div className="cr-voz">
            <div className="cl-personaje-voz">
              <p>Lenguaje <strong>simple, directo y emocional</strong>, sin dramatizar en exceso.</p>
              <p>Alternan entre <strong>ternura y firmeza</strong>, y pueden usar humor suave y complicidad.</p>
              <p>Hablan desde <strong>la experiencia vivida</strong>, no desde el juicio.</p>
            </div>
          </div>
          <div className="cl-datos-personaje">
            <div className="cl-dato-card"><div className="dato-key">Personajes</div><div className="dato-val">Perro + Gato</div></div>
            <div className="cl-dato-card"><div className="dato-key">Condición</div><div className="dato-val">Adoptados por La Manada</div></div>
            <div className="cl-dato-card"><div className="dato-key">Color identitario</div><div className="dato-val" style={{ color: 'var(--cl-p1t)' }}>Amarillo pollito</div></div>
            <div className="cl-dato-card"><div className="dato-key">Edad</div><div className="dato-val">Indeterminada (edad callejera)</div></div>
            <div className="cl-dato-card"><div className="dato-key">Religión simbólica</div><div className="dato-val">Afecto radical</div></div>
            <div className="cl-dato-card"><div className="dato-key">Rol en la revista</div><div className="dato-val">Adopción y bienestar animal</div></div>
          </div>
        </div>
      </section>

      {/* ─── MANIFIESTO ─── */}
      <section className="cl-section-manifiesto">
        <div className="cl-manifiesto-wrap">
          <p className="cl-manifiesto-sub">Manifiesto</p>
          <p className="cl-manifiesto-quote">
            No representan lástima:
            <span className="highlight">representan dignidad.</span>
          </p>
          <p className="cl-manifiesto-author">— Los Criollos, Revista Bífido</p>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cl-section-cta">
        <div className="cl-cta-left">
          <h2 className="cl-cta-title">¿Tienes una historia<br />de <span>adopción</span>?</h2>
          <p className="cl-cta-sub">Refugios, procesos comunitarios, rescates, esterilización. Cuéntanosla y la narramos desde adentro.</p>
        </div>
        <div className="cl-cta-btns">
          <Link href="/contactanos" className="cl-btn cl-btn-primary">Cuéntanos <span className="cl-btn-arrow">→</span></Link>
          <Link href="/elparche" className="cl-btn cl-btn-secondary">Conocer a La Manada <span className="cl-btn-arrow">→</span></Link>
        </div>
      </section>
    </div>
  );
}
