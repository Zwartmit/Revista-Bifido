'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { mascots } from '@/lib/mascots';
import { RiFacebookFill, RiWhatsappFill, RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
import ScrollToTop from './ScrollToTop';

export default function Footer() {
  const [isMascotMenuOpen, setIsMascotMenuOpen] = useState(false);

  return (
    <footer className="bg-black pt-16 pb-8 mt-20 relative">
      {/* Background radial glow wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #CCFD29 0%, transparent 70%)', transform: 'translate(20%, 50%)' }} />
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10 flex flex-col">
        {/* Top Row: Síguenos & Logo */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
          {/* Síguenos */}
          <div className="flex items-center gap-4 md:w-1/3">
            <span className="text-white font-display text-xl tracking-wider">Síguenos</span>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/revistabifido/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-bifido-neon flex items-center justify-center text-black hover:scale-110 transition-transform">
                <RiFacebookFill size={20} />
              </a>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-bifido-neon flex items-center justify-center text-black hover:scale-110 transition-transform">
                <RiWhatsappFill size={20} />
              </a>
              <a href="https://www.instagram.com/revistabifido/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-bifido-neon flex items-center justify-center text-black hover:scale-110 transition-transform">
                <RiInstagramFill size={20} />
              </a>
              <a href="https://www.youtube.com/@revistabifido" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-bifido-neon flex items-center justify-center text-black hover:scale-110 transition-transform">
                <RiYoutubeFill size={20} />
              </a>
            </div>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 md:w-1/3 flex justify-center">
            <Image src="/logo-white.png" alt="Revista Bífido" width={280} height={80} className="object-contain" />
          </div>

          {/* Empty space to balance */}
          <div className="hidden md:block md:w-1/3"></div>
        </div>

        {/* Links Row */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 relative w-full">
          {/* The decorative left chevron */}
          <div className="hidden md:flex flex-col justify-center items-start md:w-1/4 h-full">
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0 Q 10 20 0 40 L 16 20 Z" fill="#CCFD29" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4 md:w-2/4">
            <Link href="/" className="flex items-center gap-2 text-bifido-neon font-display tracking-wider text-lg transition-colors uppercase">
              <Image src="/icons/Home.png" alt="Inicio" width={20} height={20} className="object-contain" />
              INICIO
            </Link>

            <div className="h-4 w-[2px] bg-bifido-neon mx-1" />

            {/* Mascot buttons Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMascotMenuOpen(!isMascotMenuOpen)}
                className="flex items-center gap-1 text-white font-display tracking-wider text-lg hover:text-bifido-neon transition-colors uppercase"
              >
                LA MANADA
                <ChevronDown size={18} className={`transform transition-transform duration-200 ${isMascotMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMascotMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40 cursor-pointer" onClick={() => setIsMascotMenuOpen(false)}></div>
                  {/* Dropdown popping UPWARDS from footer */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 bg-black border border-bifido-neon rounded-full py-4 px-6 lg:px-8 shadow-[0_0_15px_rgba(204,253,41,0.2)] flex flex-row items-center gap-4 lg:gap-8 justify-center w-max max-w-[95vw] overflow-x-auto z-[60]">
                    {[...mascots].sort((a, b) => a.section.localeCompare(b.section)).map((mascot) => (
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
                </>
              )}
            </div>

            <div className="h-4 w-[2px] bg-bifido-neon mx-1" />

            <Link href="/elparche" className="text-white font-display text-lg tracking-wider hover:text-bifido-neon transition-colors uppercase">EL PARCHE</Link>

            <div className="h-4 w-[2px] bg-bifido-neon mx-1" />

            <Link href="/eventos" className="text-white font-display text-lg tracking-wider hover:text-bifido-neon transition-colors uppercase">EVENTOS</Link>

            <div className="h-4 w-[2px] bg-bifido-neon mx-1" />

            <Link href="/contactanos" className="text-white font-display text-lg tracking-wider hover:text-bifido-neon transition-colors uppercase">CONTÁCTANOS</Link>
          </div>

          {/* Empty spacer to maintain layout balance where the scroll button used to be */}
          <div className="flex justify-end md:w-1/4 mt-8 md:mt-0">
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-[2px] bg-bifido-neon/70 mb-8 rounded-full shadow-[0_0_10px_rgba(204,253,41,0.5)]"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-xs font-mono tracking-[0.2em] font-semibold uppercase">
            {new Date().getFullYear()} Revista Bífido. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}
