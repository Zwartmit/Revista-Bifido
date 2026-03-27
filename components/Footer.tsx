'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { mascots } from '@/lib/mascots';
import { RiFacebookFill, RiWhatsappFill, RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
import ScrollToTop from './ScrollToTop';

export default function Footer() {
  const [isMascotMenuOpen, setIsMascotMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMascotMenuOpen(false);
      }
    };

    if (isMascotMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMascotMenuOpen]);

  return (
    <footer className="bg-black pb-8 pt-10 relative overflow-hidden">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/backgrounds/manada_bg.jpg"
          alt="Manada Background"
          fill
          className="object-cover opacity-30 grayscale transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/80" />
      </div>

      {/* Background radial glow wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #CCFD29 0%, transparent 70%)', transform: 'translate(20%, 50%)' }} />
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10 flex flex-col">
        {/* Top Row: Síguenos & Logo */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
          {/* Síguenos */}
          <div className="flex items-center gap-4 md:w-1/3">
            <span className="text-white font-display text-xl tracking-wider">Síguenos:</span>
            <div className="flex items-center gap-3">
              {[
                { Icon: RiFacebookFill, href: "https://www.facebook.com/revistabifido/" },
                { Icon: RiWhatsappFill, href: "https://wa.me/" },
                { Icon: RiInstagramFill, href: "https://www.instagram.com/revistabifido/" },
                { Icon: RiYoutubeFill, href: "https://www.youtube.com/@revistabifido" },
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden w-9 h-9 rounded-full bg-bifido-neon flex items-center justify-center hover:scale-110 transition-transform group"
                >
                  {/* Long Shadow Effect using flattened opacity stacking context */}
                  <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                        <Icon size={20} />
                      </div>
                    ))}
                  </div>
                  {/* Main Icon */}
                  <div className="relative z-10 text-black flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 md:w-1/3 flex justify-center">
            <Image src="/logos/bifido.svg" alt="Revista Bífido" width={280} height={80} className="object-contain" />
          </div>

          {/* Empty space to balance */}
          <div className="hidden md:block md:w-1/3"></div>
        </div>

        {/* Links Row */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 relative w-full">
          <div className="hidden md:flex flex-col justify-center items-start md:w-1/4 h-full">
            <Image src="/icons/arrow_g.svg" alt="arrow" width={24} height={40} className="object-contain" />
          </div>

          <div className="hidden md:flex flex-wrap items-center justify-center gap-4 lg:gap-6 md:w-3/4 mx-auto" ref={menuRef}>
            <Link href="/" className="flex items-center gap-2 text-bifido-neon font-display tracking-wider text-lg transition-colors uppercase px-2">
              <Image src="/icons/home.svg" alt="Inicio" width={20} height={20} className="object-contain" />
              INICIO
            </Link>

            <div className="h-4 w-[2px] bg-bifido-neon" />

            {/* Mascot buttons Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMascotMenuOpen(!isMascotMenuOpen)}
                className="flex items-center gap-1 text-white font-display tracking-wider text-lg hover:text-bifido-neon transition-colors uppercase px-2"
              >
                LA MANADA
                <ChevronDown size={18} className={`transform transition-transform duration-200 ${isMascotMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMascotMenuOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 bg-black border border-bifido-neon rounded-full py-4 px-6 lg:px-8 shadow-[0_0_15px_rgba(204,253,41,0.2)] flex flex-row items-center gap-4 lg:gap-8 justify-center w-max max-w-[95vw] overflow-x-auto z-[60]">
                  {mascots.map((mascot) => (
                    <Link
                      key={mascot.id}
                      href={`/${mascot.slug}`}
                      onClick={() => setIsMascotMenuOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white text-gray-400 uppercase whitespace-nowrap"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: mascot.color.primary }}
                      />
                      {mascot.section}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="h-4 w-[2px] bg-bifido-neon" />

            <Link href="/elparche" className="text-white font-display text-lg tracking-wider hover:text-bifido-neon transition-colors uppercase px-2">EL PARCHE</Link>

            <div className="h-4 w-[2px] bg-bifido-neon" />

            <Link href="/eventos" className="text-white font-display text-lg tracking-wider hover:text-bifido-neon transition-colors uppercase px-2">EVENTOS</Link>

            <div className="h-4 w-[2px] bg-bifido-neon" />

            <Link href="/contactanos" className="text-white font-display text-lg tracking-wider hover:text-bifido-neon transition-colors uppercase px-2">CONTÁCTANOS</Link>
          </div>

          {/* Empty spacer to maintain layout balance where the scroll button used to be */}
          <div className="flex justify-end md:w-1/4 mt-8 md:mt-0">
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-[2px] bg-bifido-neon/70 mb-8 rounded-full shadow-[0_0_10px_rgba(204,253,41,0.5)]"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-xs font-jack tracking-[0.2em] font-semibold uppercase">
            {new Date().getFullYear()} Revista Bífido. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}
