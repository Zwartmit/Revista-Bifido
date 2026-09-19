'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

import { getCharacterColors } from '@/lib/character-colors';

export default function PunkibriLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stickyOffsetRef = useRef(120);

  useEffect(() => {
    window.scrollTo(0, 0);
    const container = containerRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!container || !track || !fill) return;
    const labels = document.querySelectorAll<HTMLElement>('.punk-progress-label');
    const slideDots = document.querySelectorAll<HTMLElement>('.punk-slide-dot');

    function measureHeaderOffset() {
      const header = document.querySelector('header');
      const h = header ? header.getBoundingClientRect().height : 120;
      stickyOffsetRef.current = h;
      document.documentElement.style.setProperty('--cl-header-h', `${h}px`);
    }
    measureHeaderOffset();

    function handleScroll() {
      if (window.innerWidth >= 900) {
        const rect = container!.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const stickyOffset = stickyOffsetRef.current;
        if (rect.top <= stickyOffset && rect.bottom >= viewHeight) {
          const scrolled = -(rect.top - stickyOffset);
          const totalScrollable = rect.height - (viewHeight - stickyOffset);
          const pct = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
          track!.style.transform = `translateX(-${pct * (track!.scrollWidth - window.innerWidth)}px)`;
          fill!.style.width = `${pct * 100}%`;
          const ai = pct >= 0.66 ? 2 : pct >= 0.33 ? 1 : 0;
          labels.forEach((l, i) => l.classList.toggle('active', i === ai));
          slideDots.forEach((d, i) => { d.classList.toggle('active', i === ai); d.setAttribute('aria-selected', i === ai ? 'true' : 'false'); });
          document.querySelectorAll('.punk-slide-panel')[ai]?.querySelectorAll<HTMLElement>('.punk-reveal').forEach(el => el.classList.add('visible'));
        } else if (rect.top > stickyOffset) {
          track!.style.transform = 'translateX(0px)'; fill!.style.width = '0%';
          document.querySelectorAll('.punk-slide-panel')[0]?.querySelectorAll<HTMLElement>('.punk-reveal').forEach(el => el.classList.add('visible'));
        } else {
          track!.style.transform = `translateX(-${track!.scrollWidth - window.innerWidth}px)`; fill!.style.width = '100%';
          document.querySelectorAll('.punk-slide-panel')[2]?.querySelectorAll<HTMLElement>('.punk-reveal').forEach(el => el.classList.add('visible'));
        }
      } else { track!.style.transform = 'none'; }
    }

    const handleResize = () => { measureHeaderOffset(); handleScroll(); };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
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
    document.querySelectorAll<HTMLElement>('.punk-reveal').forEach((el, i) => { observer.observe(el); el.style.transitionDelay = `${(i % 4) * 0.08}s`; });
    const panels = document.querySelectorAll<HTMLElement>('.punk-slide-panel');
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

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 900) {
        const panel = e.currentTarget as HTMLElement;
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        touchStartY = touchY;
        const isScrollable = panel.scrollHeight > panel.clientHeight;
        if (!isScrollable) {
          e.preventDefault();
          window.scrollBy(0, deltaY);
          return;
        }
        const isAtBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2;
        const isAtTop = panel.scrollTop <= 2;
        if (deltaY > 0 && isAtBottom) {
          e.preventDefault();
          window.scrollBy(0, deltaY);
        } else if (deltaY < 0 && isAtTop) {
          e.preventDefault();
          window.scrollBy(0, deltaY);
        }
      }
    };
    panels.forEach(p => {
      p.addEventListener('touchstart', handleTouchStart, { passive: true });
      p.addEventListener('touchmove', handleTouchMove, { passive: false });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      panels.forEach(p => {
        p.removeEventListener('wheel', handleWheel);
        p.removeEventListener('touchstart', handleTouchStart);
        p.removeEventListener('touchmove', handleTouchMove);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div className="cl-wrap" style={{ '--cl-p1': getCharacterColors('punkibri').primary, '--cl-p2': getCharacterColors('punkibri').secondary } as React.CSSProperties}>

      <section className="cl-hero">
        <div className="cl-hero-bg-wrap">
          <video className="cl-hero-bg-video" autoPlay loop muted playsInline preload="metadata">
            <source src="/videos/characters/punkibri-video.mp4" type="video/mp4" />
          </video>
          <div className="cl-hero-bg-overlay" />
        </div>
        <div className="cl-hero-left">
          <p className="cl-label-revista"><span className="cl-dot-live" />Revista Bífido — Personajes</p>
          <h1 className="cl-hero-nombre">PUNK<span className="acento">I</span>BRÍ</h1>
          <p className="cl-hero-tagline">
            Habla desde el territorio.<br />
            Defiende el páramo sin pedir permiso.<br />
            <strong>Lo frágil también sostiene el mundo.</strong>
          </p>
          <div className="cl-hero-meta">
            <span className="cl-meta-badge">Oxypogon stubelii</span>
            <span className="cl-meta-badge">Medio Ambiente</span>
            <span className="cl-meta-badge">Vulnerable — IUCN</span>
          </div>
          <p className="cl-scroll-cta">Scroll para conocerlo</p>
        </div>
        <div className="cl-hero-right" />
      </section>

      <div className="cl-horizontal-container" ref={containerRef}>
        <div className="cl-sticky-wrapper">

          <div className="cl-horizontal-track" ref={trackRef}>

            {/* Slide 1: Especie */}
            <div className="cl-slide-panel punk-slide-panel">
              <section className="cl-section-especie">
                <div className="cl-reveal punk-reveal">
                  <p className="cl-section-label">01 — La especie</p>
                  <h2 className="cl-section-title">Antes del parche,<br /><em>las alturas</em></h2>
                  <div className="cl-especie-grid">
                    <div className="cl-especie-stat"><div className="stat-val">177</div><div className="stat-label">Especies de colibríes en Colombia</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">VU</div><div className="stat-label">Estado IUCN — Vulnerable</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">100%</div><div className="stat-label">Endémico de Colombia</div></div>
                    <div className="cl-especie-stat"><div className="stat-val">Páramo</div><div className="stat-label">Hábitat único en el mundo</div></div>
                  </div>
                  <div className="cl-alerta-box">
                    <div className="alerta-head">⚠ Estado de conservación</div>
                    <p>El Chivito del Ruiz es <strong style={{ color: '#fff' }}>endémico de Colombia</strong>, lo que significa que solo existe aquí. Su área de distribución es muy limitada y cualquier transformación del páramo afecta directamente su supervivencia.</p>
                  </div>
                </div>
                <div className="cl-especie-texto cl-reveal punk-reveal">
                  <p>El <strong>Chivito del Ruiz</strong> (Oxypogon stubelii) es un colibrí que vive donde el aire escasea y el frío no perdona. Habita únicamente en los <strong>páramos de la Cordillera Central</strong>, entre frailejones, neblina y cambios de clima que no avisan.</p>
                  <p>Es pequeño, rápido y resistente. Su pico es delgado, su plumaje atrapa la luz, y carga una <strong>barba característica</strong> —las plumas iridiscentes bajo el pico— que le da un aire que parece decir que no vino a encajar.</p>
                  <p>Colombia es el país con <strong>mayor diversidad de colibríes en el mundo</strong>, con cerca de 177 especies registradas. Entre todas ellas, pocas viven donde casi nada más puede hacerlo.</p>
                  <p>Su vida gira alrededor del néctar. Pero no es solo alimento: mientras vuela de flor en flor, también <strong>poliniza</strong>. En estos territorios, lo pequeño sostiene lo grande.</p>
                </div>
              </section>
            </div>

            {/* Slide 2: Territorio */}
            <div className="cl-slide-panel punk-slide-panel">
              <section className="cl-section-territorio">
                <div className="cl-territorio-inner">
                  <div className="cl-reveal punk-reveal">
                    <p className="cl-section-label">02 — Territorio y amenazas</p>
                    <h2 className="cl-section-title">Donde todo<br /><em>florece lento</em></h2>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Su hogar existe en un solo lugar del planeta y eso lo hace único, pero también frágil. Cuando el territorio cambia, Punkibrí también está en riesgo.</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.35)', marginBottom: '32px' }}><em>Resiste en las alturas… pero incluso aquí, el mundo está cambiando.</em></p>
                    <div className="cl-amenazas-lista">
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">01</span>Expansión agrícola en zonas de páramo</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">02</span>Quemas e incendios de ecosistemas altoandinos</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">03</span>Cambio climático y variación de temperatura</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">04</span>Pérdida y degradación del hábitat</div>
                      <div className="cl-amenaza-item"><span className="cl-amenaza-num">05</span>Distribución geográfica muy reducida</div>
                    </div>
                  </div>
                  <div className="cl-mapa-placeholder cl-reveal punk-reveal">
                    <video autoPlay loop muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                      <source src="/videos/characters/punkibri-v.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </section>
            </div>

            {/* Slide 3: Personaje */}
            <div className="cl-slide-panel punk-slide-panel">
              <section className="cl-section-personaje">
                <div className="cl-personaje-bg-text">PUNK</div>
                <div className="cl-personaje-inner">
                  <p className="cl-section-label cl-reveal punk-reveal">03 — El personaje</p>
                  <p className="cl-personaje-intro cl-reveal punk-reveal">
                    Aquí empieza <em>el vuelo</em>.<br />
                    Habla desde el territorio.<br />No desde la autoridad.
                  </p>
                  <div className="cl-personaje-voz cl-reveal punk-reveal">
                    <p>En Bífido le llaman <strong>Punkibrí</strong>.</p>
                    <p>Tiene <strong>127 años</strong> —en años de colibrí—. Suficiente tiempo para entender que lo que crece lento es lo que más vale.</p>
                    <p>Su religión es el <strong>animismo</strong>: todo lo que vive merece respeto. No habla desde el juicio. Habla desde lo que el territorio le enseñó.</p>
                    <p>No es neutral. Cree en el cuidado, en lo colectivo y en la tierra como algo que no nos pertenece.</p>
                    <p><em>Desde lo que crece lento, desde lo que resiste sin ruido, desde lo que muchos no ven.</em></p>
                  </div>
                  <div className="cl-datos-personaje cl-reveal punk-reveal">
                    <div className="cl-dato-card"><div className="dato-key">Rol en la revista</div><div className="dato-val">Medio ambiente &amp; territorio</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Tono</div><div className="dato-val">Cuidado. Colectivo. Sin neutralidad.</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Color identidad</div><div className="dato-val" style={{ color: 'var(--cl-p1)' }}>Verde Páramo / Amarillo y Púrpura</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Inspiración animal</div><div className="dato-val">Chivito del Ruiz<br /><span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>Oxypogon stubelii</span></div></div>
                    <div className="cl-dato-card"><div className="dato-key">Filosofía</div><div className="dato-val">Animismo &amp; defensa del territorio</div></div>
                    <div className="cl-dato-card"><div className="dato-key">Edad</div><div className="dato-val">127 años<br /><span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>(en años de colibrí)</span></div></div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="cl-slide-dots" role="tablist">
            <button className="cl-slide-dot punk-slide-dot active" role="tab" aria-selected="true" aria-label="Ir a Especie" data-idx="0" />
            <button className="cl-slide-dot punk-slide-dot" role="tab" aria-selected="false" aria-label="Ir a Territorio" data-idx="1" />
            <button className="cl-slide-dot punk-slide-dot" role="tab" aria-selected="false" aria-label="Ir a Personaje" data-idx="2" />
          </div>

          <div className="cl-progress-container">
            <div className="cl-progress-track"><div className="cl-progress-fill" ref={fillRef} /></div>
            <div className="cl-progress-labels">
              <span className="cl-progress-label punk-progress-label active" data-index="0">01 Especie</span>
              <span className="cl-progress-label punk-progress-label" data-index="1">02 Territorio</span>
              <span className="cl-progress-label punk-progress-label" data-index="2">03 Personaje</span>
            </div>
          </div>
        </div>
      </div>

      <section className="cl-section-manifiesto" style={{ backgroundImage: "url('/images/characters/punkibri-manifiesto.jpeg')" }}>
        <div className="cl-manifiesto-wrap cl-reveal punk-reveal">
          <p className="cl-manifiesto-sub">Manifiesto</p>
          <p className="cl-manifiesto-quote">
            En estos territorios,<br />lo pequeño sostiene lo grande.
            <span className="highlight">Lo frágil también<br />sostiene el mundo.</span>
          </p>
          <p className="cl-manifiesto-author">— Punkibrí, Revista Bífido</p>
        </div>
      </section>

      <div className="cl-divisor" />

      <section className="cl-section-temas">
        <p className="cl-section-label cl-reveal punk-reveal">04 — Lo que Punkibrí habla</p>
        <h2 className="cl-section-title cl-reveal punk-reveal">Sus territorios<br /><em>editoriales</em></h2>
        <div className="cl-temas-grid">
          <div className="cl-tema-card cl-reveal punk-reveal">
            <div className="cl-tema-num">01</div>
            <div className="cl-tema-title">Defensa del territorio</div>
            <div className="cl-tema-desc">Crónicas desde el páramo y otros ecosistemas amenazados. Lo que el territorio dice cuando alguien se toma el tiempo de escucharlo.</div>
          </div>
          <div className="cl-tema-card cl-reveal punk-reveal">
            <div className="cl-tema-num">02</div>
            <div className="cl-tema-title">Ambientalismo sin poses</div>
            <div className="cl-tema-desc">Sin greenwashing, sin discursos vacíos. La crisis ambiental contada desde lo concreto: incendios, quemas, expansión agrícola, silencio institucional.</div>
          </div>
          <div className="cl-tema-card cl-reveal punk-reveal">
            <div className="cl-tema-num">03</div>
            <div className="cl-tema-title">Lo que resiste sin ruido</div>
            <div className="cl-tema-desc">Historias de comunidades, ecosistemas y especies que sostienen el mundo desde la marginalidad. Lo frágil como forma de resistencia.</div>
          </div>
        </div>
      </section>

      <section className="cl-section-cta">
        <div className="cl-cta-left cl-reveal punk-reveal">
          <h2 className="cl-cta-title">¿Listo para<br />escuchar al<br /><span>páramo</span>?</h2>
          <p className="cl-cta-sub">Las ediciones de Bífido ya están disponibles. Punkibrí habla desde las alturas — pequeño, pero imposible de ignorar.</p>
        </div>
        <div className="cl-cta-btns cl-reveal punk-reveal">
          <Link href="/punkibri/articulos" className="cl-btn cl-btn-primary">Leer artículos <span className="cl-btn-arrow">→</span></Link>
          <Link href="/elparche" className="cl-btn cl-btn-secondary">Conocer al resto del parche <span className="cl-btn-arrow">→</span></Link>
        </div>
      </section>
    </div>
  );
}
