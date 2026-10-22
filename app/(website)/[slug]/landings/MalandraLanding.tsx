'use client';

import { useRef } from 'react';
import Link from 'next/link';

import { getCharacterColors } from '@/lib/character-colors';
import { useHorizontalLanding } from '@/lib/useHorizontalLanding';

export default function MalandraLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useHorizontalLanding({ containerRef, trackRef, fillRef });

  return (
    <div className="cl-wrap" style={{ '--cl-p1': getCharacterColors('malandra').primary, '--cl-p2': getCharacterColors('malandra').secondary } as React.CSSProperties}>

      <section className="cl-hero">
        <div className="cl-hero-bg-wrap">
          <video className="cl-hero-bg-video" autoPlay loop muted playsInline preload="metadata">
            <source src="/videos/characters/malandra-video.mp4" type="video/mp4" />
          </video>
          <div className="cl-hero-bg-overlay" />
        </div>
        <div className="cl-hero-left">
          <p className="cl-label-revista"><span className="cl-dot-live" />Revista Bífido — Personajes</p>
          <h1 className="cl-hero-nombre">MAL<span className="acento">AN</span>DRA</h1>
          <p className="cl-hero-tagline">
            No negocia con el miedo.<br />
            Escribe sobre justicia sin rodeos.<br />
            <strong>Sobrevivir es también una forma de resistir.</strong>
          </p>
          <div className="cl-hero-meta">
            <span className="cl-meta-badge">Didelphis marsupialis</span>
            <span className="cl-meta-badge">Justicia &amp; Derechos</span>
            <span className="cl-meta-badge">35 años</span>
          </div>
          <p className="cl-scroll-cta">Scroll para conocerla</p>
        </div>
        <div className="cl-hero-right" />
      </section>

      <div className="cl-horizontal-container" ref={containerRef}>
        <div className="cl-sticky-wrapper">

          <div className="cl-horizontal-track" ref={trackRef}>

            {/* Slide 1: Especie */}
            <div className="cl-slide-panel mal-slide-panel">
              <section className="cl-section-especie">
                <div className="cl-reveal mal-reveal">
                  <p className="cl-section-label">01 — La especie</p>
                  <h2 className="cl-section-title">Antes del parche,<br /><em>la selva</em></h2>
                  <div className="cl-especie-grid">
                    <div className="cl-especie-stat"><div className="stat-val">60</div><div className="stat-label">Días de gestación</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">LC</div><div className="stat-label">Estado IUCN — Sin riesgo</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">100+</div><div className="stat-label">Millones de años evolutivos</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">Marsupial</div><div className="stat-label">Único en América</div></div>
                  </div>
                  <div className="cl-alerta-box">
                    <div className="alerta-head">⚠ Dato clave</div>
                    <p>La zarigüeya lleva más de <strong style={{ color: '#fff' }}>100 millones de años</strong> en la Tierra. Ha sobrevivido a todo: extinciones masivas, deforestación, urbanización. Adaptarse sin perder la esencia es su mayor hazaña.</p>
                  </div>
                </div>
                <div className="cl-especie-texto cl-reveal mal-reveal">
                  <p>La <strong>Zarigüeya común</strong> (Didelphis marsupialis) es el único marsupial del continente americano fuera de Australia. Ha sobrevivido más de cien millones de años en la Tierra.</p>
                  <p>Es adaptable, omnívora, nocturna y muy malentendida. La tildan de plaga porque aparece donde otros animales ya no pueden. No es señal de deterioro: es señal de que algo todavía funciona.</p>
                  <p>Las <strong>crías nacen diminutas</strong> —del tamaño de un frijol— y se desarrollan dentro de la bolsa marsupial de la madre durante meses. La zarigüeya no elige el lugar más cómodo para nacer; aprende a sobrevivir desde el primer momento.</p>
                  <p>En la ciudad o en el bosque, de noche y con cautela. Sin pedir permiso para estar.</p>
                </div>
              </section>
            </div>

            {/* Slide 2: Territorio */}
            <div className="cl-slide-panel mal-slide-panel">
              <section className="cl-section-territorio">
                <div className="cl-territorio-inner">
                  <div className="cl-reveal mal-reveal">
                    <p className="cl-section-label">02 — Territorio y amenazas</p>
                    <h2 className="cl-section-title">El territorio<br /><em>que sabe resistir</em></h2>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>Aparece en selvas, jardines, acequias y basureros. No tiene hábitat exclusivo porque aprendió a sobrevivir en todos. Pero la presión urbana y el atropellamiento reducen las poblaciones en zonas periféricas.</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.35)', marginBottom: '32px' }}><em>Me adapto. Siempre lo he hecho. Pero adaptarse no es lo mismo que estar a salvo.</em></p>
                    <div className="cl-amenazas-lista">
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">01</span>Atropellamiento en zonas urbanas y periurbanas</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">02</span>Pérdida de corredores biológicos</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">03</span>Cacería doméstica y miedo popular</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">04</span>Expansión urbana sin planeación</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">05</span>Deforestación de bordes de bosque</div>
                    </div>
                  </div>
                  <div className="cl-mapa-placeholder cl-reveal mal-reveal">
                    <video autoPlay loop muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                      <source src="/videos/characters/malandra-v.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </section>
            </div>

            {/* Slide 3: Personaje */}
            <div className="cl-slide-panel mal-slide-panel">
              <section className="cl-section-personaje">
                <div className="cl-personaje-bg-text">ALANDRA</div>
                <div className="cl-personaje-inner">
                  <p className="cl-section-label cl-reveal mal-reveal">03 — El personaje</p>
                  <p className="cl-personaje-intro cl-reveal mal-reveal">
                    Aquí empieza <em>la supervivencia</em>.<br />
                    No negocia con el miedo.<br />Tampoco con la impunidad.
                  </p>
                  <div className="cl-personaje-voz cl-reveal mal-reveal">
                    <p>En Bífido la llaman <strong>Malandra</strong>.</p>
                    <p>Tiene <strong>35 años</strong> y desde los veinte aprendió que el sistema funciona distinto según desde dónde te lo miras.</p>
                    <p>Escribe sobre <strong>justicia, derechos humanos y lo que pasa cuando el Estado falla</strong> o mira al lado. Sin eufemismos. Sin ahorrar palabras.</p>
                    <p>Su religión es <strong>el pragmatismo</strong>: no le interesa el ideal, le interesa lo que funciona para proteger a la gente real.</p>
                    <p><em>Sobrevivir también es una forma de resistir. Y resistir, a veces, se parece mucho a seguir aquí.</em></p>
                  </div>
                  <div className="cl-datos-personaje cl-reveal mal-reveal">
                    <div className="cl-dato-card"><div className="dato-key">Rol en la revista</div><div className="dato-val">Justicia &amp; derechos humanos</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Tono</div><div className="dato-val">Directo. Sin eufemismos. Justo.</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Color identidad</div><div className="dato-val" style={{ color: 'var(--cl-p1)' }}>Morado / Oro viejo y Coral</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Inspiración animal</div><div className="dato-val">Zarigüeya común<br /><span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>Didelphis marsupialis</span></div></div>
                    <div className="cl-dato-card"><div className="dato-key">Filosofía</div><div className="dato-val">Pragmatismo &amp; protección real</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Edad</div><div className="dato-val">35 años</div></div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="cl-slide-dots" role="tablist">
            <button className="cl-slide-dot mal-slide-dot active" role="tab" aria-selected="true" aria-label="Ir a Especie" data-idx="0" />
            <button className="cl-slide-dot mal-slide-dot" role="tab" aria-selected="false" aria-label="Ir a Territorio" data-idx="1" />
            <button className="cl-slide-dot mal-slide-dot" role="tab" aria-selected="false" aria-label="Ir a Personaje" data-idx="2" />
          </div>

          <div className="cl-progress-container">
            <div className="cl-progress-track"><div className="cl-progress-fill" ref={fillRef} /></div>
            <div className="cl-progress-labels">
              <span className="cl-progress-label mal-progress-label active" data-index="0">01 Especie</span>
              <span className="cl-progress-label mal-progress-label" data-index="1">02 Territorio</span>
              <span className="cl-progress-label mal-progress-label" data-index="2">03 Personaje</span>
            </div>
          </div>
        </div>
      </div>

      <section className="cl-section-manifiesto" style={{ backgroundImage: "url('/images/characters/malandra-manifiesto.jpeg')" }}>
        <div className="cl-manifiesto-wrap cl-reveal mal-reveal">
          <p className="cl-manifiesto-sub">Manifiesto</p>
          <p className="cl-manifiesto-quote">
            Llevan millones de años<br />intentando desaparecernos.
            <span className="highlight">Seguimos aquí.<br />Eso también es justicia.</span>
          </p>
          <p className="cl-manifiesto-author">— Malandra, Revista Bífido</p>
        </div>
      </section>

      <div className="cl-divisor" />

      <section className="cl-section-temas">
        <p className="cl-section-label cl-reveal mal-reveal">04 — Lo que Malandra habla</p>
        <h2 className="cl-section-title cl-reveal mal-reveal">Sus territorios<br /><em>editoriales</em></h2>
        <div className="cl-temas-grid">
          <div className="cl-tema-card cl-reveal mal-reveal">
            <div className="cl-tema-num">01</div>
            <div className="cl-tema-title">Justicia sin filtros</div>
            <div className="cl-tema-desc">Los procesos que nadie sigue porque son largos y confusos. Las sentencias que cambian vidas. Lo que el sistema de justicia hace —y lo que evita hacer.</div>
          </div>
          <div className="cl-tema-card cl-reveal mal-reveal">
            <div className="cl-tema-num">02</div>
            <div className="cl-tema-title">Derechos humanos</div>
            <div className="cl-tema-desc">Cuando el Estado falla, cuando las instituciones miran para otro lado y cuando la gente real paga el precio de las abstracciones jurídicas.</div>
          </div>
          <div className="cl-tema-card cl-reveal mal-reveal">
            <div className="cl-tema-num">03</div>
            <div className="cl-tema-title">Supervivencia organizada</div>
            <div className="cl-tema-desc">Comunidades, organizaciones y personas que construyen alternativas cuando el sistema no llega. No heroísmo —estrategia.</div>
          </div>
        </div>
      </section>

      <section className="cl-section-cta">
        <div className="cl-cta-left cl-reveal mal-reveal">
          <h2 className="cl-cta-title">¿Lista para<br />escuchar a<br /><span>Malandra</span>?</h2>
          <p className="cl-cta-sub">Las ediciones de Bífido ya están disponibles. Malandra habla de lo que el sistema preferiría que no nombráramos. Sin filtros. Sin complacencia.</p>
        </div>
        <div className="cl-cta-btns cl-reveal mal-reveal">
          <Link href="/malandra/articulos" className="cl-btn cl-btn-primary">Leer artículos <span className="cl-btn-arrow">→</span></Link>
          <Link href="/elparche" className="cl-btn cl-btn-secondary">Conocer al resto del parche <span className="cl-btn-arrow">→</span></Link>
        </div>
      </section>
    </div>
  );
}
