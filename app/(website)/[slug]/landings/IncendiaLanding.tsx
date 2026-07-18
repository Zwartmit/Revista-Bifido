'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

import { getCharacterColors } from '@/lib/character-colors';

export default function IncendiaLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const container = containerRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!container || !track || !fill) return;
    const labels = document.querySelectorAll<HTMLElement>('.inc-progress-label');
    const slideDots = document.querySelectorAll<HTMLElement>('.inc-slide-dot');

    function handleScroll() {
      if (window.innerWidth >= 900) {
        const rect = container!.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const stickyOffset = 120;
        if (rect.top <= stickyOffset && rect.bottom >= viewHeight) {
          const scrolled = -(rect.top - stickyOffset);
          const totalScrollable = rect.height - (viewHeight - stickyOffset);
          const pct = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
          track!.style.transform = `translateX(-${pct * (track!.scrollWidth - window.innerWidth)}px)`;
          fill!.style.width = `${pct * 100}%`;
          const ai = pct >= 0.66 ? 2 : pct >= 0.33 ? 1 : 0;
          labels.forEach((l, i) => l.classList.toggle('active', i === ai));
          slideDots.forEach((d, i) => { d.classList.toggle('active', i === ai); d.setAttribute('aria-selected', i === ai ? 'true' : 'false'); });
          document.querySelectorAll('.inc-slide-panel')[ai]?.querySelectorAll<HTMLElement>('.inc-reveal').forEach(el => el.classList.add('visible'));
        } else if (rect.top > stickyOffset) {
          track!.style.transform = 'translateX(0px)'; fill!.style.width = '0%';
          labels.forEach((l, i) => l.classList.toggle('active', i === 0));
          document.querySelectorAll('.inc-slide-panel')[0]?.querySelectorAll<HTMLElement>('.inc-reveal').forEach(el => el.classList.add('visible'));
        } else {
          track!.style.transform = `translateX(-${track!.scrollWidth - window.innerWidth}px)`; fill!.style.width = '100%';
          labels.forEach((l, i) => l.classList.toggle('active', i === 2));
          document.querySelectorAll('.inc-slide-panel')[2]?.querySelectorAll<HTMLElement>('.inc-reveal').forEach(el => el.classList.add('visible'));
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
    document.querySelectorAll<HTMLElement>('.inc-reveal').forEach((el, i) => { observer.observe(el); el.style.transitionDelay = `${(i % 4) * 0.08}s`; });
    const panels = document.querySelectorAll<HTMLElement>('.inc-slide-panel');
    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 900) {
        const panel = e.currentTarget as HTMLElement;
        const isScrollable = panel.scrollHeight > panel.clientHeight;
        if (!isScrollable) {
          e.preventDefault();
          window.scrollBy(0, e.deltaY);
          return;
        }
        const isAtBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2;
        const isAtTop = panel.scrollTop <= 2;
        if (e.deltaY > 0 && isAtBottom) {
          e.preventDefault();
          window.scrollBy(0, e.deltaY);
        } else if (e.deltaY < 0 && isAtTop) {
          e.preventDefault();
          window.scrollBy(0, e.deltaY);
        }
      }
    };
    panels.forEach(p => p.addEventListener('wheel', handleWheel, { passive: false }));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      panels.forEach(p => p.removeEventListener('wheel', handleWheel));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="cl-wrap" style={{ '--cl-p1': getCharacterColors('incendia').primary, '--cl-p2': getCharacterColors('incendia').secondary } as React.CSSProperties}>

      <section className="cl-hero">
        <div className="cl-hero-bg-wrap">
          <video className="cl-hero-bg-video" autoPlay loop muted playsInline>
            <source src="/videos/characters/incendia-video.mp4" type="video/mp4" />
          </video>
          <div className="cl-hero-bg-overlay" />
        </div>
        <div className="cl-hero-left">
          <p className="cl-label-revista"><span className="cl-dot-live" />Revista Bífido — Personajes</p>
          <h1 className="cl-hero-nombre"><span className="acento">IN</span>CENDIA</h1>
          <p className="cl-hero-tagline">
            Curiosa, inquieta, y de las que<br />hacen preguntas cuando el resto calla.<br />
            <strong>Mi color es el fuego, porque pasar desapercibida tiene un límite.</strong>
          </p>
          <div className="cl-hero-meta">
            <span className="cl-meta-badge">Cerdocyon thous</span>
            <span className="cl-meta-badge">Género &amp; Diversidad</span>
            <span className="cl-meta-badge">36 años</span>
          </div>
          <p className="cl-scroll-cta">Scroll para conocerla</p>
        </div>
        <div className="cl-hero-right" />
      </section>

      <div className="cl-horizontal-container" ref={containerRef}>
        <div className="cl-sticky-wrapper">

          <div className="cl-horizontal-track" ref={trackRef}>

            {/* Slide 1: Especie */}
            <div className="cl-slide-panel inc-slide-panel">
              <section className="cl-section-especie">
                <div className="cl-reveal inc-reveal">
                  <p className="cl-section-label">01 — La especie</p>
                  <h2 className="cl-section-title">Antes del parche,<br /><em>el monte</em></h2>
                  <div className="cl-especie-grid">
                    <div className="cl-especie-stat"><div className="stat-val">LC</div><div className="stat-label">Estado IUCN — Sin riesgo</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">Todo</div><div className="stat-label">Presente en toda Colombia</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">Nocturna</div><div className="stat-label">Actividad principal</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">Olfato</div><div className="stat-label">Sentido principal de caza</div></div>
                  </div>
                  <div className="cl-alerta-box">
                    <div className="alerta-head">⚠ Dato clave</div>
                    <p>Aunque no está en riesgo de extinción, la <strong style={{ color: '#fff' }}>Zorra cangrejera</strong> sufre presión por confusión con perros ferales y expansión urbana. En zonas rurales es cazada por error o por considerarla plaga. La convivencia requiere información.</p>
                  </div>
                </div>
                <div className="cl-especie-texto cl-reveal inc-reveal">
                  <p>La <strong>Zorra cangrejera</strong> (Cerdocyon thous) es un cánido silvestre sudamericano muy adaptable. No es una zorra europea ni un perro: es su propio linaje, con su propia lógica.</p>
                  <p>Habita selvas, sabanas, pastizales y bordes de ciudad. Come de todo: cangrejos de río, insectos, frutos, roedores. Su dieta varía con las estaciones y el territorio disponible.</p>
                  <p>Es mayoritariamente <strong>nocturna</strong> y solitaria, aunque forma parejas estables. No es agresiva: si se siente amenazada, huye. Si no puede huir, finge la muerte.</p>
                  <p>El mito de que es un animal de mal agüero o peligroso para las gallinas la pone en riesgo en zonas rurales. El problema no es la zorra. Es la falta de información sobre cómo convivir.</p>
                  <p><em style={{ color: 'rgba(255,255,255,0.4)' }}>Adaptarse no significa ser invencible. Incluso los más astutos necesitan territorio.</em></p>
                </div>
              </section>
            </div>

            {/* Slide 2: Territorio */}
            <div className="cl-slide-panel inc-slide-panel">
              <section className="cl-section-territorio">
                <div className="cl-territorio-inner">
                  <div className="cl-reveal inc-reveal">
                    <p className="cl-section-label">02 — Territorio y amenazas</p>
                    <h2 className="cl-section-title">El territorio<br /><em>también arde</em></h2>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>Adaptarse no significa ser invencible. La deforestación y la expansión de ciudades reducen los espacios donde puede moverse libremente.</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.35)', marginBottom: '32px' }}><em>Sé adaptarme. Pero incluso los más astutos necesitan territorio para sobrevivir.</em></p>
                    <div className="cl-amenazas-lista">
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">01</span>Deforestación y pérdida de hábitat</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">02</span>Expansión urbana y agrícola</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">03</span>Tráfico ilegal de fauna silvestre</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">04</span>Especies invasoras (perros y gatos domésticos)</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">05</span>Conflictos con humanos en zonas rurales</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">06</span>Confusión con perros callejeros</div>
                    </div>
                  </div>
                  <div className="cl-mapa-placeholder cl-reveal inc-reveal">
                    <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                      <source src="/videos/characters/incendia-v.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </section>
            </div>

            {/* Slide 3: Personaje */}
            <div className="cl-slide-panel inc-slide-panel">
              <section className="cl-section-personaje">
                <div className="cl-personaje-bg-text">FUEGO</div>
                <div className="cl-personaje-inner">
                  <p className="cl-section-label cl-reveal inc-reveal">03 — El personaje</p>
                  <p className="cl-personaje-intro cl-reveal inc-reveal">
                    Aquí empieza <em>el fuego</em>.<br />
                    Curiosa, inquieta, y de las que<br />hacen preguntas cuando el resto calla.
                  </p>
                  <div className="cl-personaje-voz cl-reveal inc-reveal">
                    <p>En Bífido la llaman <strong>Incendia</strong>.</p>
                    <p>Tiene <strong>36 años</strong>, edad suficiente para saber que muchas desigualdades no son casualidad.</p>
                    <p>Su territorio son las conversaciones incómodas: <strong>género, diversidad y equidad</strong>. No escribe para quedar bien. Escribe para señalar abusos, desarmar privilegios y meterle candela a lo que se nos vendió como normal.</p>
                    <p>Se pintó el pelo color fuego, en honor a sus <strong>ancestras cola de fuego</strong>: esas que aprendieron a sobrevivir en un mundo hecho a la medida de los machos.</p>
                    <p><em>Mi color es el fuego, porque pasar desapercibida también tiene un límite.</em></p>
                  </div>
                  <div className="cl-datos-personaje cl-reveal inc-reveal">
                    <div className="cl-dato-card"><div className="dato-key">Rol en la revista</div><div className="dato-val">Género, diversidad &amp; equidad</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Tono</div><div className="dato-val">Fuego. Argumentos. Sin filtro.</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Color identidad</div><div className="dato-val" style={{ color: 'var(--cl-p1)' }}>Naranja Fuego / Malva y Terracota</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Inspiración animal</div><div className="dato-val">Zorra cangrejera<br /><span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>Cerdocyon thous</span></div></div>
                    <div className="cl-dato-card"><div className="dato-key">Filosofía</div><div className="dato-val">Feminismo &amp; libertad de ser</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Edad</div><div className="dato-val">36 años</div></div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="cl-slide-dots" role="tablist">
            <button className="cl-slide-dot inc-slide-dot active" role="tab" aria-selected="true" aria-label="Ir a Especie" data-idx="0" />
            <button className="cl-slide-dot inc-slide-dot" role="tab" aria-selected="false" aria-label="Ir a Territorio" data-idx="1" />
            <button className="cl-slide-dot inc-slide-dot" role="tab" aria-selected="false" aria-label="Ir a Personaje" data-idx="2" />
          </div>

          <div className="cl-progress-container">
            <div className="cl-progress-track"><div className="cl-progress-fill" ref={fillRef} /></div>
            <div className="cl-progress-labels">
              <span className="cl-progress-label inc-progress-label active" data-index="0">01 Especie</span>
              <span className="cl-progress-label inc-progress-label" data-index="1">02 Territorio</span>
              <span className="cl-progress-label inc-progress-label" data-index="2">03 Personaje</span>
            </div>
          </div>
        </div>
      </div>

      <section className="cl-section-manifiesto" style={{ backgroundImage: "url('/images/characters/incendia-manifiesto.jpeg')" }}>
        <div className="cl-manifiesto-wrap cl-reveal inc-reveal">
          <p className="cl-manifiesto-sub">Manifiesto</p>
          <p className="cl-manifiesto-quote">
            Adaptarse no es rendirse.<br />Sobrevivir tampoco es callar.
            <span className="highlight">El patriarcado no<br />se reforma. Se tumba.</span>
          </p>
          <p className="cl-manifiesto-author">— Incendia, Revista Bífido</p>
        </div>
      </section>

      <div className="cl-divisor" />

      <section className="cl-section-temas">
        <p className="cl-section-label cl-reveal inc-reveal">04 — Lo que Incendia habla</p>
        <h2 className="cl-section-title cl-reveal inc-reveal">Sus territorios<br /><em>editoriales</em></h2>
        <div className="cl-temas-grid">
          <div className="cl-tema-card cl-reveal inc-reveal">
            <div className="cl-tema-num">01</div>
            <div className="cl-tema-title">Feminidad sin molde</div>
            <div className="cl-tema-desc">Conversaciones sobre lo que significa ser mujer hoy: los cuerpos, los roles, las expectativas. Todo lo que el sistema llama normal y merece revisarse.</div>
          </div>
          <div className="cl-tema-card cl-reveal inc-reveal">
            <div className="cl-tema-num">02</div>
            <div className="cl-tema-title">Diversidad &amp; libertad de ser</div>
            <div className="cl-tema-desc">Identidades que el mainstream ignora o caricaturiza. Incendia da espacio a lo que existe aunque incomode, con argumentos y sin condescendencia.</div>
          </div>
          <div className="cl-tema-card cl-reveal inc-reveal">
            <div className="cl-tema-num">03</div>
            <div className="cl-tema-title">Desarmar privilegios</div>
            <div className="cl-tema-desc">Señalar abusos que se normalizaron. Meterle candela a lo que se nos vendió como inevitable. No para escandalizar, sino para que el debate empiece.</div>
          </div>
        </div>
      </section>

      <section className="cl-section-cta">
        <div className="cl-cta-left cl-reveal inc-reveal">
          <h2 className="cl-cta-title">¿Lista para<br />escuchar a<br /><span>Incendia</span>?</h2>
          <p className="cl-cta-sub">Las ediciones de Bífido ya están disponibles. Incendia no escribe para que estés de acuerdo. Escribe para que no puedas ignorarlo.</p>
        </div>
        <div className="cl-cta-btns cl-reveal inc-reveal">
          <Link href="/incendia/articulos" className="cl-btn cl-btn-primary">Leer la revista <span className="cl-btn-arrow">→</span></Link>
          <Link href="/elparche" className="cl-btn cl-btn-secondary">Conocer al resto del parche <span className="cl-btn-arrow">→</span></Link>
        </div>
      </section>
    </div>
  );
}
