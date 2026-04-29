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

      <div className="container mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 relative z-10 flex flex-col">

        {/* Main Row: Síguenos | Logo | Nav Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-16 lg:gap-8 mb-16">

          {/* Left: Síguenos */}
          <div className="flex flex-col gap-4 items-center lg:items-start">
            <div className="flex flex-col items-center">
              <span className="text-white font-display text-xl tracking-wider">Síguenos</span>
              <div className="w-full h-[2px] bg-bifido-neon" />
            </div>
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
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-28 justify-center items-center lg:items-start w-full">

            {/* Column 1: Main nav */}
            <div className="flex flex-col gap-4 lg:gap-3 items-center lg:items-start">
              <div className="flex flex-col items-center">
                <span className="text-white font-display text-xl tracking-wider">Navegación</span>
                <div className="w-full h-[2px] bg-bifido-neon" />
              </div>
              <div className="flex flex-row lg:flex-col gap-4 lg:gap-3 justify-center lg:items-start flex-wrap">
                <Link href="/" className="text-white font-googlesans text-base hover:text-bifido-neon transition-colors text-center lg:text-left">Inicio</Link>
                <Link href="/elparche" className="text-white font-googlesans text-base hover:text-bifido-neon transition-colors text-center lg:text-left">El Parche</Link>
                <Link href="/eventos" className="text-white font-googlesans text-base hover:text-bifido-neon transition-colors text-center lg:text-left">Eventos</Link>
                <Link href="/contactanos" className="text-white font-googlesans text-base hover:text-bifido-neon transition-colors text-center lg:text-left">Contáctanos</Link>
              </div>
            </div>

            {/* Column 2: La Manada */}
            <div className="flex flex-col gap-4 lg:gap-3 items-center lg:items-start">
              <div className="flex flex-col items-center">
                <span className="text-white font-display text-xl tracking-wider">La Manada</span>
                <div className="w-full h-[2px] bg-bifido-neon" />
              </div>
              <div className="flex flex-row lg:flex-col gap-3 lg:gap-3 justify-center lg:items-start flex-wrap">
                {characters.map((character) => (
                  <Link
                    key={character.id}
                    href={`/${character.slug}`}
                    className="font-googlesans text-base transition-colors text-center lg:text-left group flex items-center justify-center"
                    style={{ color: character.color.primary }}
                  >
                    {/* Desktop text */}
                    <span className="hidden lg:inline-block hover:brightness-125 transition-all">
                      {character.section}
                    </span>
                    {/* Mobile icon */}
                    <div
                      className="lg:hidden w-12 h-12 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 flex-shrink-0 bg-bifido-gray flex items-center justify-center p-1"
                      style={{ borderColor: character.color.primary }}
                    >
                      <Image
                        src={`/icons/${character.slug}.png`}
                        alt={character.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Logo */}
          <div className="flex justify-center items-start">
            <Image src="/icons/bifido.svg" alt="Revista Bífido" width={240} height={60} className="object-contain max-w-full" />
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

