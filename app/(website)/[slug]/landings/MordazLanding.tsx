'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

import { getCharacterColors } from '@/lib/character-colors';

export default function MordazLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const container = containerRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!container || !track || !fill) return;
    const labels = document.querySelectorAll<HTMLElement>('.mor-progress-label');
    const slideDots = document.querySelectorAll<HTMLElement>('.mor-slide-dot');

    function handleScroll() {
      if (window.innerWidth >= 900) {
        const rect = container!.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        if (rect.top <= 0 && rect.bottom >= viewHeight) {
          const pct = Math.min(Math.max(-rect.top / (rect.height - viewHeight), 0), 1);
          track!.style.transform = `translateX(-${pct * (track!.scrollWidth - window.innerWidth)}px)`;
          fill!.style.width = `${pct * 100}%`;
          const ai = pct >= 0.66 ? 2 : pct >= 0.33 ? 1 : 0;
          labels.forEach((l, i) => l.classList.toggle('active', i === ai));
          slideDots.forEach((d, i) => { d.classList.toggle('active', i === ai); d.setAttribute('aria-selected', i === ai ? 'true' : 'false'); });
          document.querySelectorAll('.mor-slide-panel')[ai]?.querySelectorAll<HTMLElement>('.mor-reveal').forEach(el => el.classList.add('visible'));
        } else if (rect.top > 0) {
          track!.style.transform = 'translateX(0px)'; fill!.style.width = '0%';
          document.querySelectorAll('.mor-slide-panel')[0]?.querySelectorAll<HTMLElement>('.mor-reveal').forEach(el => el.classList.add('visible'));
        } else {
          track!.style.transform = `translateX(-${track!.scrollWidth - window.innerWidth}px)`; fill!.style.width = '100%';
          document.querySelectorAll('.mor-slide-panel')[2]?.querySelectorAll<HTMLElement>('.mor-reveal').forEach(el => el.classList.add('visible'));
        }
      } else { track!.style.transform = 'none'; }
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    labels.forEach(label => label.addEventListener('click', () => {
      if (window.innerWidth >= 900) {
        const i = parseInt(label.getAttribute('data-index') || '0');
        window.scrollTo({ top: window.scrollY + container!.getBoundingClientRect().top + (i / 2) * (container!.offsetHeight - window.innerHeight), behavior: 'smooth' });
      }
    }));
    slideDots.forEach(dot => dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-idx') || '0');
      if (window.innerWidth >= 900) window.scrollTo({ top: window.scrollY + container!.getBoundingClientRect().top + (idx / 2) * (container!.offsetHeight - window.innerHeight), behavior: 'smooth' });
    }));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && (!entry.target.closest('.cl-horizontal-container') || window.innerWidth < 900)) entry.target.classList.add('visible');
    }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll<HTMLElement>('.mor-reveal').forEach((el, i) => { observer.observe(el); el.style.transitionDelay = `${(i % 4) * 0.08}s`; });
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('resize', handleScroll); observer.disconnect(); };
  }, []);

  return (
    <div className="cl-wrap" style={{ '--cl-p1': getCharacterColors('mordaz').primary, '--cl-p2': getCharacterColors('mordaz').secondary } as React.CSSProperties}>

      <section className="cl-hero">
        <div className="cl-hero-bg-wrap">
          <video className="cl-hero-bg-video" autoPlay loop muted playsInline>
            <source src="/videos/characters/mordaz-video.mp4" type="video/mp4" />
          </video>
          <div className="cl-hero-bg-overlay" />
        </div>
        <div className="cl-hero-left">
          <p className="cl-label-revista"><span className="cl-dot-live" />Revista Bífido — Personajes</p>
          <h1 className="cl-hero-nombre">MOR<span className="acento">D</span>ÁZ</h1>
          <p className="cl-hero-tagline">
            Habla sin pelos en la lengua.<br />
            Informa sobre la realidad que nos rodea.<br />
            <strong>Desde arriba, las verdades oficiales se ven bastante pequeñas.</strong>
          </p>
          <div className="cl-hero-meta">
            <span className="cl-meta-badge">Vultur gryphus</span>
            <span className="cl-meta-badge">Opinión</span>
            <span className="cl-meta-badge">42 años</span>
          </div>
          <p className="cl-scroll-cta">Scroll para conocerlo</p>
        </div>
        <div className="cl-hero-right" />
      </section>

      <div className="cl-horizontal-container" ref={containerRef}>
        <div className="cl-sticky-wrapper">

          <div className="cl-horizontal-track" ref={trackRef}>

            {/* Slide 1: Especie */}
            <div className="cl-slide-panel mor-slide-panel">
              <section className="cl-section-especie">
                <div className="cl-reveal mor-reveal">
                  <p className="cl-section-label">01 — La especie</p>
                  <h2 className="cl-section-title">Antes del parche,<br /><em>la cordillera</em></h2>
                  <div className="cl-especie-grid">
                    <div className="cl-especie-stat"><div className="stat-val">3 m</div><div className="stat-label">Envergadura de alas</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">VU</div><div className="stat-label">Estado IUCN</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">5000</div><div className="stat-label">msnm máximo</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">Ave<br />Nacional</div><div className="stat-label">Símbolo de Colombia</div></div>
                  </div>
                  <div className="cl-alerta-box">
                    <div className="alerta-head">⚠ Estado de conservación</div>
                    <p>Clasificado como <strong style={{ color: '#fff' }}>Vulnerable</strong> por la UICN. Cuidarlo no es solo proteger un ave, es preservar un símbolo y el equilibrio de los ecosistemas donde habita.</p>
                  </div>
                </div>
                <div className="cl-especie-texto cl-reveal mor-reveal">
                  <p>El <strong>Cóndor de los Andes</strong> (Vultur gryphus) es un ave carroñera de la familia Cathartidae. No caza: llega cuando todo ya pasó. Alguien tiene que hacerse cargo de lo que otros prefieren ignorar.</p>
                  <p>Es una de las <strong>aves voladoras más grandes del mundo</strong>. Cuando despliega las alas puede alcanzar hasta tres metros de envergadura. Los machos son más grandes y llevan una cresta en la cabeza que los delata.</p>
                  <p>Tal vez ya lo viste antes sin saberlo: el cóndor está en el <strong>escudo nacional de Colombia</strong>. Bonito en los símbolos. Más frágil en la realidad.</p>
                  <p>Habita en las montañas más imponentes del continente: pastizales, páramos y bosques de niebla desde la cordillera de los Andes hasta la Sierra Nevada de Santa Marta.</p>
                  <p><em style={{ color: 'rgba(255,255,255,0.4)' }}>Desde ahí el paisaje se entiende distinto. Y también sus heridas.</em></p>
                </div>
              </section>
            </div>

            {/* Slide 2: Territorio */}
            <div className="cl-slide-panel mor-slide-panel">
              <section className="cl-section-territorio">
                <div className="cl-territorio-inner">
                  <div className="cl-reveal mor-reveal">
                    <p className="cl-section-label">02 — Territorio y amenazas</p>
                    <h2 className="cl-section-title">Donde<br /><em>empieza el viento</em></h2>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>Hace dos siglos su área de reproducción abarcaba desde el oeste de Venezuela hasta Tierra de Fuego. Hoy ese territorio se ha reducido drásticamente por la actividad humana.</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.35)', marginBottom: '32px' }}><em>Sigo volando libre… pero cada vez tengo menos cielo que habitar.</em></p>
                    <div className="cl-amenazas-lista">
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">01</span>Expansión agrícola y acuícola</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">02</span>Deforestación y pérdida de hábitat</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">03</span>Corredores de transporte e infraestructura</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">04</span>Explotación de recursos biológicos</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">05</span>Especies invasoras y enfermedades</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">06</span>Caza furtiva</div>
                    </div>
                  </div>
                  <div className="cl-mapa-placeholder cl-reveal mor-reveal">
                    <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                      <source src="/videos/characters/mordaz-v.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </section>
            </div>

            {/* Slide 3: Personaje */}
            <div className="cl-slide-panel mor-slide-panel">
              <section className="cl-section-personaje">
                <div className="cl-personaje-bg-text">ORDÁZ</div>
                <div className="cl-personaje-inner">
                  <p className="cl-section-label cl-reveal mor-reveal">03 — El personaje</p>
                  <p className="cl-personaje-intro cl-reveal mor-reveal">
                    Aquí empieza <em>lo incómodo</em>.<br />
                    Pero no todo en su vida es volar.
                  </p>
                  <div className="cl-personaje-voz cl-reveal mor-reveal">
                    <p><strong>Mucho gusto… o no tanto.</strong></p>
                    <p>En Bífido su a.k.a es Mordáz. Lo suyo es decir las cosas sin pelos en la lengua, y por eso no es de muchos amigos.</p>
                    <p>Le gusta opinar. De lo que sabe. Y de lo que le importa.</p>
                    <p>Tiene <strong>42 años</strong>, suficiente tiempo para desconfiar de las verdades fáciles. Su religión —si así se le puede llamar— es el <strong>escepticismo militante</strong>.</p>
                    <p>Su color es <strong>rojo y oro</strong>, porque opinar sin incomodar es apenas decoración.</p>
                    <p>Observa contradicciones, discursos inflados y certezas que se desmoronan cuando se miran de cerca. No vino a buscar consenso. Vino a abrir debates incómodos.</p>
                  </div>
                  <div className="cl-datos-personaje cl-reveal mor-reveal">
                    <div className="cl-dato-card"><div className="dato-key">Rol en la revista</div><div className="dato-val">Opinión &amp; análisis de coyuntura</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Tono</div><div className="dato-val">Ironía. Humor negro. Argumentos.</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Color identidad</div><div className="dato-val" style={{ color: 'var(--cl-p1)' }}>Rojo, Oro y Durazno</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Inspiración animal</div><div className="dato-val">Cóndor de los Andes<br /><span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Vultur gryphus</span></div></div>
                    <div className="cl-dato-card"><div className="dato-key">Filosofía</div><div className="dato-val">Escepticismo militante</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Edad</div><div className="dato-val">42 años</div></div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="cl-slide-dots" role="tablist">
            <button className="cl-slide-dot mor-slide-dot active" role="tab" aria-selected="true" aria-label="Ir a Especie" data-idx="0" />
            <button className="cl-slide-dot mor-slide-dot" role="tab" aria-selected="false" aria-label="Ir a Territorio" data-idx="1" />
            <button className="cl-slide-dot mor-slide-dot" role="tab" aria-selected="false" aria-label="Ir a Personaje" data-idx="2" />
          </div>

          <div className="cl-progress-container">
            <div className="cl-progress-track"><div className="cl-progress-fill" ref={fillRef} /></div>
            <div className="cl-progress-labels">
              <span className="cl-progress-label mor-progress-label active" data-index="0">01 Especie</span>
              <span className="cl-progress-label mor-progress-label" data-index="1">02 Territorio</span>
              <span className="cl-progress-label mor-progress-label" data-index="2">03 Personaje</span>
            </div>
          </div>
        </div>
      </div>

      <section className="cl-section-manifiesto" style={{ backgroundImage: "url('/images/characters/mordaz-manifiesto.jpeg')" }}>
        <div className="cl-manifiesto-wrap cl-reveal mor-reveal">
          <p className="cl-manifiesto-sub">Manifiesto</p>
          <p className="cl-manifiesto-quote">
            Si algo he aprendido volando<br />sobre este territorio es esto:
            <span className="highlight">desde arriba, las verdades<br />oficiales se ven bastante pequeñas.</span>
          </p>
          <p className="cl-manifiesto-author">— Mordáz, Revista Bífido</p>
        </div>
      </section>

      <div className="cl-divisor" />

      <section className="cl-section-temas">
        <p className="cl-section-label cl-reveal mor-reveal">04 — Lo que Mordáz habla</p>
        <h2 className="cl-section-title cl-reveal mor-reveal">Sus territorios<br /><em>editoriales</em></h2>
        <div className="cl-temas-grid">
          <div className="cl-tema-card cl-reveal mor-reveal">
            <div className="cl-tema-num">01</div>
            <div className="cl-tema-title">Opinión sin filtro</div>
            <div className="cl-tema-desc">Columnas que incomodan. Análisis que no buscan aplausos sino conversaciones que la gente evita en los almuerzos familiares.</div>
          </div>
          <div className="cl-tema-card cl-reveal mor-reveal">
            <div className="cl-tema-num">02</div>
            <div className="cl-tema-title">Realidad que nos rodea</div>
            <div className="cl-tema-desc">Lo que pasa en el país y en el mundo, visto desde las alturas donde los eufemismos no alcanzan. Sin discursos inflados.</div>
          </div>
          <div className="cl-tema-card cl-reveal mor-reveal">
            <div className="cl-tema-num">03</div>
            <div className="cl-tema-title">Debates incómodos</div>
            <div className="cl-tema-desc">Certezas que se desmoronan cuando se miran de cerca. Contradicciones que el sistema preferiría que no señaláramos.</div>
          </div>
        </div>
      </section>

      <section className="cl-section-cta">
        <div className="cl-cta-left cl-reveal mor-reveal">
          <h2 className="cl-cta-title">¿Listo para<br />escuchar<br />a <span>Mordáz</span>?</h2>
          <p className="cl-cta-sub">Las ediciones de Bífido ya están disponibles. No prometemos que te guste todo lo que leas. Prometemos que no podrás ignorarlo.</p>
        </div>
        <div className="cl-cta-btns cl-reveal mor-reveal">
          <Link href="/mordaz/articulos" className="cl-btn cl-btn-primary">Leer la revista <span className="cl-btn-arrow">→</span></Link>
          <Link href="/elparche" className="cl-btn cl-btn-secondary">Conocer al resto del parche <span className="cl-btn-arrow">→</span></Link>
        </div>
      </section>
    </div>
  );
}
