'use client';

import Link from 'next/link';
import Image from 'next/image';
import { characters } from '@/lib/characters';
import { RiFacebookFill, RiWhatsappFill, RiInstagramFill, RiYoutubeFill } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="bg-black pb-8 relative overflow-hidden">
      {/* Separator */}
      <div className="w-full flex justify-center pb-10">
        <div className="w-[50%] h-[1px] bg-gradient-to-r from-transparent via-bifido-neon/30 to-transparent blur-[0.5px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-12 relative z-10 flex flex-col">

        {/* Main Row: Síguenos | Logo | Nav Columns */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 lg:gap-10 mb-16">

          {/* Left: Síguenos */}
          <div className="flex flex-col gap-4 items-center lg:items-start lg:w-1/4">
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
                  <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                        <Icon size={20} />
                      </div>
                    ))}
                  </div>
                  <div className="relative z-10 text-black flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Center: Two Nav Columns */}
          <div className="flex gap-20 md:gap-28 lg:gap-36 w-full lg:flex-1 justify-center">

            {/* Column 1: Main nav */}
            <div className="flex flex-col gap-3 items-center lg:items-start">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-white font-display tracking-widest text-xl uppercase">Navegación</span>
                <div className="w-full h-px bg-bifido-neon" />
              </div>
              <Link href="/" className="text-white font-display tracking-wider text-lg hover:text-bifido-neon transition-colors uppercase">Inicio</Link>
              <Link href="/elparche" className="text-white font-display tracking-wider text-lg hover:text-bifido-neon transition-colors uppercase">El Parche</Link>
              <Link href="/eventos" className="text-white font-display tracking-wider text-lg hover:text-bifido-neon transition-colors uppercase">Eventos</Link>
              <Link href="/contactanos" className="text-white font-display tracking-wider text-lg hover:text-bifido-neon transition-colors uppercase">Contáctanos</Link>
            </div>

            {/* Column 2: La Manada */}
            <div className="flex flex-col gap-3 items-center lg:items-start">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-white font-display tracking-widest text-xl uppercase">La Manada</span>
                <div className="w-full h-px bg-bifido-neon" />
              </div>
              {characters.map((character) => (
                <Link
                  key={character.id}
                  href={`/${character.slug}`}
                  className="font-display tracking-wider text-lg transition-colors uppercase"
                  style={{ color: character.color.primary }}
                >
                  {character.section}
                </Link>
              ))}
            </div>

          </div>

          {/* Right: Logo */}
          <div className="flex-shrink-0 lg:w-1/4 flex justify-center lg:justify-end items-center">
            <Image src="/icons/bifido.svg" alt="Revista Bífido" width={280} height={70} className="object-contain w-auto h-auto" />
          </div>

        </div>

        {/* Separator Line */}
        <div className="w-full h-[2px] bg-bifido-neon/70 mb-8 rounded-full shadow-[0_0_10px_rgba(204,253,41,0.5)]"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-xs font-jack tracking-[0.2em] font-semibold uppercase">
            © {new Date().getFullYear()} Revista Bífido. <br className="md:hidden" /> Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}

