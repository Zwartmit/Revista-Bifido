'use client';

import { useRef } from 'react';
import Link from 'next/link';

import { getCharacterColors } from '@/lib/character-colors';
import { useHorizontalLanding } from '@/lib/useHorizontalLanding';

export default function AnikaLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useHorizontalLanding({ containerRef, trackRef, fillRef });

  return (
    <div
      className="cl-wrap"
      style={{ '--cl-p1': getCharacterColors('anika').primary, '--cl-p2': getCharacterColors('anika').secondary } as React.CSSProperties}
    >
      {/* ─── SLIDE DOTS ─── */}

      {/* ─── HERO ─── */}
      <section className="cl-hero">
        <div className="cl-hero-bg-wrap">
          <video className="cl-hero-bg-video" autoPlay loop muted playsInline preload="metadata">
            <source src="/videos/characters/anika-video.mp4" type="video/mp4" />
          </video>
          <div className="cl-hero-bg-overlay" />
        </div>
        <div className="cl-hero-left">
          <p className="cl-label-revista"><span className="cl-dot-live" />Revista Bífido — Personajes</p>
          <h1 className="cl-hero-nombre">ÁN<span className="acento">I</span>KA</h1>
          <p className="cl-hero-tagline">
            Habla claro. Sin pánico.<br />
            Sin moral que juzgue.<br />
            <strong>La información también cuida.</strong>
          </p>
          <div className="cl-hero-meta">
            <span className="cl-meta-badge">Bothrops asper</span>
            <span className="cl-meta-badge">Reducción de daños</span>
            <span className="cl-meta-badge">28 años</span>
          </div>
          <p className="cl-scroll-cta">Scroll para conocerla</p>
        </div>
        <div className="cl-hero-right" />
      </section>

      {/* ─── HORIZONTAL SCROLL ─── */}
      <div className="cl-horizontal-container" ref={containerRef}>
        <div className="cl-sticky-wrapper">

          <div className="cl-horizontal-track" ref={trackRef}>

            {/* Slide 1: Especie */}
            <div className="cl-slide-panel anika-slide-panel">
              <section className="cl-section-especie">
                <div className="cl-reveal anika-reveal">
                  <p className="cl-section-label">01 — La especie</p>
                  <h2 className="cl-section-title">Antes del parche,<br /><em>el veneno</em></h2>
                  <div className="cl-especie-grid">
                    <div className="cl-especie-stat"><div className="stat-val">1975</div><div className="stat-label">Metros msnm máximo</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">LC</div><div className="stat-label">Estado IUCN</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">Bífido</div><div className="stat-label">Lengua sensorial única</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">Nocturna</div><div className="stat-label">Actividad preferente</div></div>
                  </div>
                  <div className="cl-alerta-box">
                    <div className="alerta-head">⚠ Dato clave</div>
                    <p>La <strong style={{ color: '#fff' }}>Mapaná o Talla X</strong> (Bothrops asper) es la responsable del mayor número de accidentes ofídicos en Colombia. Sin embargo, su veneno ha sido clave en el desarrollo de <strong style={{ color: '#fff' }}>anticoagulantes y medicamentos</strong>. El miedo y la utilidad coexisten.</p>
                  </div>
                </div>
                <div className="cl-especie-texto cl-reveal anika-reveal">
                  <p>La <strong>Mapaná</strong> (Bothrops asper) es una de las serpientes venenosas más comunes y temidas de Colombia. Y también una de las más malinterpretadas.</p>
                  <p>Habita en tierras bajas, selvas húmedas, plantaciones de banano y cacao, bordes de ríos y comunidades rurales. Está donde la gente vive. Eso la hace temible, y también la pone en riesgo.</p>
                  <p>Su <strong>lengua bífida</strong> es un órgano sensorial. No amenaza: detecta moléculas en el aire para orientarse y encontrar presas. Ver una serpiente con lengua bifurcada no es señal de ataque: es señal de que está prestando atención.</p>
                  <p>Su veneno contiene proteínas que hoy son la base de medicamentos hemostáticos usados en cirugía. Lo que la hace peligrosa es lo mismo que la hace valiosa para la medicina.</p>
                </div>
              </section>
            </div>

            {/* Slide 2: Territorio */}
            <div className="cl-slide-panel anika-slide-panel">
              <section className="cl-section-territorio">
                <div className="cl-territorio-inner">
                  <div className="cl-reveal anika-reveal">
                    <p className="cl-section-label">02 — Territorio y amenazas</p>
                    <h2 className="cl-section-title">Donde el cuidado<br /><em>no llega</em></h2>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.74)', marginBottom: '8px' }}>
                      Habita en las mismas zonas donde las comunidades viven. Eso la convierte en un riesgo real para humanos con poco acceso a información y atención médica. La desinformación mata más que el veneno.
                    </p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.62)', marginBottom: '32px' }}>
                      <em>Estoy donde siempre estuve. El problema no soy yo. Es que no hay información sobre cómo convivir.</em>
                    </p>
                    <div className="cl-amenazas-lista">
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">01</span>Deforestación de hábitats naturales</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">02</span>Matanza por miedo y desconocimiento</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">03</span>Captura para tráfico ilegal</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">04</span>Reducción de corredores boscosos</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">05</span>Falta de información en zonas rurales</div>
                    </div>
                  </div>
                  <div className="cl-mapa-placeholder cl-reveal anika-reveal">
                    <video autoPlay loop muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                      <source src="/videos/characters/anika-v.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </section>
            </div>

            {/* Slide 3: Personaje */}
            <div className="cl-slide-panel anika-slide-panel">
              <section className="cl-section-personaje">
                <div className="cl-personaje-bg-text">VENENO</div>
                <div className="cl-personaje-inner">
                  <p className="cl-section-label cl-reveal anika-reveal">03 — El personaje</p>
                  <p className="cl-personaje-intro cl-reveal anika-reveal">
                    Aquí empieza <em>el cuidado</em>.<br />
                    Habla claro. Sin pánico.<br />Sin moral que juzgue.
                  </p>
                  <div className="cl-personaje-voz cl-reveal anika-reveal">
                    <p>En Bífido la llaman <strong>Ánika</strong>.</p>
                    <p>Tiene <strong>28 años</strong>, y aprendió que el cuidado también es una forma de resistencia.</p>
                    <p>Escribe sobre <strong>reducción de riesgos y daños</strong>. Habla de lo que muchos evitan nombrar: el consumo de sustancias, la autonomía del cuerpo, las decisiones que cada quien toma sobre su propia vida.</p>
                    <p>No se trata de prohibir. Se trata de <strong>cuidarse sin miedo</strong>. Porque la información también cuida, y entender lo que hacemos puede cambiar las decisiones.</p>
                    <p><em>Silenciosa. Esencial. Incluso cuando no la quieren cerca.</em></p>
                  </div>
                  <div className="cl-datos-personaje cl-reveal anika-reveal">
                    <div className="cl-dato-card"><div className="dato-key">Rol en la revista</div><div className="dato-val">Reducción de riesgos y daños</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Tono</div><div className="dato-val">Claro. Sin pánico. Sin moral.</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Color identidad</div><div className="dato-val" style={{ color: 'var(--cl-p1)' }}>Cian / Menta y Lavanda</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Inspiración animal</div><div className="dato-val">Mapaná / Talla X<br /><span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.62)' }}>Bothrops asper</span></div></div>
                    <div className="cl-dato-card"><div className="dato-key">Filosofía</div><div className="dato-val">El cuidado como resistencia</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Edad</div><div className="dato-val">28 años</div></div>
                  </div>
                </div>
              </section>
            </div>

          </div>

          <div className="cl-slide-dots" role="tablist" aria-label="Secciones del personaje">
            <button className="cl-slide-dot anika-slide-dot active" role="tab" aria-selected="true" aria-label="Ir a Especie" data-idx="0" />
            <button className="cl-slide-dot anika-slide-dot" role="tab" aria-selected="false" aria-label="Ir a Territorio" data-idx="1" />
            <button className="cl-slide-dot anika-slide-dot" role="tab" aria-selected="false" aria-label="Ir a Personaje" data-idx="2" />
          </div>

          <div className="cl-progress-container">
            <div className="cl-progress-track"><div className="cl-progress-fill" ref={fillRef} /></div>
            <div className="cl-progress-labels">
              <span className="cl-progress-label anika-progress-label active" data-index="0">01 Especie</span>
              <span className="cl-progress-label anika-progress-label" data-index="1">02 Territorio</span>
              <span className="cl-progress-label anika-progress-label" data-index="2">03 Personaje</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MANIFIESTO ─── */}
      <section className="cl-section-manifiesto" style={{ backgroundImage: "url('/images/characters/anika-manifiesto.jpeg')" }}>
        <div className="cl-manifiesto-wrap cl-reveal anika-reveal">
          <p className="cl-manifiesto-sub">Manifiesto</p>
          <p className="cl-manifiesto-quote">
            La información también cuida.<br />No se trata de prohibir.
            <span className="highlight">Cuidarse también<br />es político.</span>
          </p>
          <p className="cl-manifiesto-author">— Ánika, Revista Bífido</p>
        </div>
      </section>

      <div className="cl-divisor" />

      {/* ─── TEMAS ─── */}
      <section className="cl-section-temas">
        <p className="cl-section-label cl-reveal anika-reveal">04 — Lo que Ánika habla</p>
        <h2 className="cl-section-title cl-reveal anika-reveal">Sus territorios<br /><em>editoriales</em></h2>
        <div className="cl-temas-grid">
          <div className="cl-tema-card cl-reveal anika-reveal">
            <div className="cl-tema-num">01</div>
            <div className="cl-tema-title">Reducción de riesgos</div>
            <div className="cl-tema-desc">Información honesta sobre el consumo de sustancias psicoactivas: qué son, cómo actúan, cómo cuidarse. Sin estigma, sin catastrofismo, sin mentiras.</div>
          </div>
          <div className="cl-tema-card cl-reveal anika-reveal">
            <div className="cl-tema-num">02</div>
            <div className="cl-tema-title">Autonomía del cuerpo</div>
            <div className="cl-tema-desc">El derecho a decidir sobre la propia vida sin que la moral ajena dicte las consecuencias. El cuidado no puede depender del juicio de otros.</div>
          </div>
          <div className="cl-tema-card cl-reveal anika-reveal">
            <div className="cl-tema-num">03</div>
            <div className="cl-tema-title">Lo que el miedo silencia</div>
            <div className="cl-tema-desc">Todo lo que la desinformación convierte en tabú: las decisiones que se toman igual, con o sin información. Ánika prefiere que sea con ella.</div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cl-section-cta">
        <div className="cl-cta-left cl-reveal anika-reveal">
          <h2 className="cl-cta-title">¿Lista para<br />escuchar a<br /><span>Ánika</span>?</h2>
          <p className="cl-cta-sub">Las ediciones de Bífido ya están disponibles. Ánika habla de lo que otros evitan. No para asustar — para que puedas decidir con información real.</p>
        </div>
        <div className="cl-cta-btns cl-reveal anika-reveal">
          <Link href="/anika/articulos" className="cl-btn cl-btn-primary">Leer artículos <span className="cl-btn-arrow">→</span></Link>
          <Link href="/elparche" className="cl-btn cl-btn-secondary">Conocer al resto del parche <span className="cl-btn-arrow">→</span></Link>
        </div>
      </section>
    </div>
  );
}
