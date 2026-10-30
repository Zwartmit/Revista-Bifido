import { useEffect, type RefObject } from 'react';

const DESKTOP_MIN_WIDTH = 900;

interface Refs {
  containerRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  fillRef: RefObject<HTMLDivElement | null>;
}

interface Layout {
  header: number;
  pad: number;
  trans: number;
  total: number;
  overflow: number[];
  segStart: number[];
  transStart: number[];
}

/**
 * Pinned "horizontal story" for the character landings.
 *
 * The container is as tall as the sum of a timeline of scroll segments; while it is pinned
 * (sticky) the page scroll drives, per slide: first a vertical translate of the slide content
 * (only as much as it overflows the visible area) and then the horizontal move to the next slide.
 * Nothing is ever clipped, whatever the viewport height, and no nested scrolling is needed.
 */
export function useHorizontalLanding({ containerRef, trackRef, fillRef }: Refs) {
  useEffect(() => {
    window.scrollTo(0, 0);

    const container = containerRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    const sticky = container?.querySelector<HTMLElement>('.cl-sticky-wrapper');
    if (!container || !track || !fill || !sticky) return;

    const panels = Array.from(container.querySelectorAll<HTMLElement>('.cl-slide-panel'));
    const sections = panels.map(p => p.firstElementChild as HTMLElement | null);
    const labels = Array.from(container.querySelectorAll<HTMLElement>('.cl-progress-label'));
    const dots = Array.from(container.querySelectorAll<HTMLElement>('.cl-slide-dot'));
    const lastIndex = panels.length - 1;
    const chrome = Array.from(container.querySelectorAll<HTMLElement>('.cl-slide-dots, .cl-progress-container'));

    const isDesktop = () => window.innerWidth >= DESKTOP_MIN_WIDTH;

    let layout: Layout | null = null;
    let activeIndex = -1;
    let raf = 0;
    let disposed = false;

    function revealPanel(index: number) {
      panels[index]?.querySelectorAll<HTMLElement>('.cl-reveal').forEach(el => el.classList.add('visible'));
    }

    function setActive(index: number) {
      if (index === activeIndex) return;
      activeIndex = index;
      labels.forEach((l, i) => l.classList.toggle('active', i === index));
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      revealPanel(index);
    }

    function reset() {
      layout = null;
      activeIndex = -1;
      container!.style.height = '';
      track!.style.transform = '';
      fill!.style.width = '';
      chrome.forEach(el => { el.style.opacity = ''; });
      panels.forEach(p => p.classList.remove('has-more'));
      sections.forEach(s => { if (s) s.style.transform = ''; });
      container!.querySelectorAll<HTMLElement>('.cl-reveal').forEach(el => el.classList.add('visible'));
    }

    function measure() {
      if (!isDesktop()) { reset(); return; }

      const headerEl = document.querySelector('header');
      const header = headerEl ? headerEl.getBoundingClientRect().height : 120;
      document.documentElement.style.setProperty('--cl-header-h', `${header}px`);

      const pad = Math.round(window.innerHeight * 0.1);
      const trans = Math.round(window.innerHeight * 0.8);

      const overflow = panels.map((panel, i) => {
        const section = sections[i];
        if (!section) return 0;
        const cs = getComputedStyle(panel);
        const needed = section.offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        return Math.max(0, Math.ceil(needed - panel.clientHeight));
      });

      const segStart: number[] = [];
      const transStart: number[] = [];
      let cursor = 0;
      overflow.forEach((o, i) => {
        segStart[i] = cursor;
        cursor += pad + o + pad;
        if (i < lastIndex) { transStart[i] = cursor; cursor += trans; }
      });

      container!.style.height = `${sticky!.offsetHeight + cursor}px`;
      layout = { header, pad, trans, total: cursor, overflow, segStart, transStart };
    }

    function update() {
      raf = 0;
      if (!layout || !isDesktop()) return;
      const { header, pad, trans, total, overflow, segStart, transStart } = layout;

      const s = Math.min(Math.max(header - container!.getBoundingClientRect().top, 0), total);

      // Horizontal position in slide units (0 .. lastIndex)
      let p = 0;
      for (let k = 0; k < transStart.length; k++) {
        if (s >= transStart[k] + trans) p = k + 1;
        else if (s > transStart[k]) { p = k + (s - transStart[k]) / trans; break; }
        else break;
      }

      const maxX = track!.scrollWidth - sticky!.clientWidth;
      track!.style.transform = `translateX(${-(p / lastIndex) * maxX}px)`;
      const current = Math.round(p);
      sections.forEach((section, i) => {
        if (!section) return;
        const y = Math.min(Math.max(s - segStart[i] - pad, 0), overflow[i]);
        section.style.transform = y ? `translateY(${-y}px)` : '';
        panels[i].classList.toggle('has-more', i === current && overflow[i] - y > 8);
      });
      fill!.style.width = `${total ? (s / total) * 100 : 0}%`;
      // the slide dots / progress bar fade out during the final pause, before the section unpins
      const tail = Math.min(Math.max((total - s) / pad, 0), 1);
      chrome.forEach(el => { el.style.opacity = tail < 1 ? String(tail) : ''; });
      setActive(current);
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    function relayout() {
      measure();
      update();
    }

    function goTo(index: number) {
      if (!layout || !isDesktop()) return;
      const top = window.scrollY + container!.getBoundingClientRect().top;
      window.scrollTo({ top: top - layout.header + layout.segStart[index], behavior: 'smooth' });
    }

    const labelHandlers = labels.map((label, i) => {
      const handler = () => goTo(parseInt(label.getAttribute('data-index') ?? `${i}`, 10));
      label.addEventListener('click', handler);
      return handler;
    });
    const dotHandlers = dots.map((dot, i) => {
      const handler = () => goTo(parseInt(dot.getAttribute('data-idx') ?? `${i}`, 10));
      dot.addEventListener('click', handler);
      return handler;
    });

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', relayout);

    const resizeObserver = new ResizeObserver(relayout);
    resizeObserver.observe(sticky);
    sections.forEach(s => { if (s) resizeObserver.observe(s); });
    const headerEl = document.querySelector('header');
    if (headerEl) resizeObserver.observe(headerEl);

    document.fonts?.ready.then(() => { if (!disposed) relayout(); });

    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && (!entry.target.closest('.cl-horizontal-container') || !isDesktop())) {
        entry.target.classList.add('visible');
      }
    }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll<HTMLElement>('.cl-reveal').forEach((el, i) => {
      revealObserver.observe(el);
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    relayout();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', relayout);
      labels.forEach((l, i) => l.removeEventListener('click', labelHandlers[i]));
      dots.forEach((d, i) => d.removeEventListener('click', dotHandlers[i]));
      resizeObserver.disconnect();
      revealObserver.disconnect();
    };
  }, [containerRef, trackRef, fillRef]);
}
