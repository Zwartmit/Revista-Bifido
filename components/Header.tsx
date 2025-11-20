'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { mascots } from '@/lib/mascots';
import { useRef } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const pathname = usePathname();

  // Find active mascot based on pathname
  const activeMascot = mascots.find(m => pathname === `/${m.slug}`);
  const headerBgColor = activeMascot ? activeMascot.color.primary : '#000000';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-bifido-gray transition-colors duration-500"
      style={{ backgroundColor: headerBgColor }}
    >
      <nav className="container mx-auto px-4 py-4">
        {/* Mobile Layout - Logo and Menu Button side by side */}
        <div className="flex md:hidden items-center justify-between mb-4">
          <Link href="/" className="flex items-center">
            <div className="flex flex-col">
              <h1 className="font-display text-3xl text-white tracking-wider">
                REVISTA BÍFIDO
              </h1>
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FCD116 33.33%, #003893 33.33%, #003893 66.66%, #CE1126 66.66%)' }} />
              <p className="text-sm text-bifido-lightgray italic mt-1">
                Periodismo crudo para sensibilidades frágiles
              </p>
            </div>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Layout - Logo centered on top */}
        <div className="hidden md:flex justify-center mb-6">
          <Link href="/" className="flex items-center">
            <div className="flex flex-col items-center text-center">
              <h1 className="font-display text-4xl text-white tracking-wider">
                REVISTA BÍFIDO
              </h1>
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FCD116 33.33%, #003893 33.33%, #003893 66.66%, #CE1126 66.66%)' }} />
              <p
                ref={subtitleRef}
                className="text-lg text-bifido-lightgray italic mt-2"
              >
                Periodismo crudo para sensibilidades frágiles
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center">
          <div className="flex items-center gap-1">
            {/* Secciones */}
            {[...mascots].sort((a, b) => a.section.localeCompare(b.section)).map((mascot) => (
              <MascotNavLink key={mascot.id} mascot={mascot} />
            ))}
            <div className="h-6 w-1 bg-white mx-3" />

            <StaticNavLink href="/lamanada" label="La manada" />
            <StaticNavLink href="/mercado" label="Mercado" />
            <StaticNavLink href="/manifiesto" label="Manifiesto" />
            <StaticNavLink href="/contactanos" label="Contáctanos" />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {/* Secciones en móvil */}
            <div className="border-b border-white/20 pb-3 mb-3">
              {[...mascots].sort((a, b) => a.section.localeCompare(b.section)).map((mascot) => {
                const isActiveMobile = pathname === `/${mascot.slug}`;
                return (
                  <Link
                    key={mascot.id}
                    href={`/${mascot.slug}`}
                    className={`block text-sm font-medium transition-colors py-2 px-2 rounded ${isActiveMobile
                      ? 'bg-white/90 text-black font-bold'
                      : activeMascot
                        ? 'text-white hover:bg-white/10'
                        : 'text-bifido-lightgray hover:text-white hover:bg-bifido-gray'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      borderLeft: isActiveMobile ? '3px solid #000000' : `3px solid ${mascot.color.primary}`,
                      paddingLeft: '12px'
                    }}
                  >
                    {mascot.section}
                  </Link>
                );
              })}
            </div>

            <StaticNavLink
              href="/lamanada"
              label="La manada"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 px-2"
            />
            <StaticNavLink
              href="/mercado"
              label="Mercado"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 px-2"
            />
            <StaticNavLink
              href="/manifiesto"
              label="Manifiesto"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 px-2"
            />
            <StaticNavLink
              href="/contactanos"
              label="Contáctanos"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 px-2"
            />
          </div>
        )}
      </nav>
    </header>
  );
}

function MascotNavLink({ mascot }: { mascot: typeof mascots[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === `/${mascot.slug}`;

  // Check if we're on any section page
  const isOnSectionPage = mascots.some(m => pathname === `/${m.slug}`);

  // Determine text color based on state and context
  let textColor;
  if (isActive) {
    textColor = '#000000'; // Black for active link on colored background
  } else if (isHovered) {
    textColor = isOnSectionPage ? '#FFFFFF' : mascot.color.primary;
  } else {
    textColor = isOnSectionPage ? '#E5E7EB' : '#9CA3AF'; // Light gray on section pages, normal gray otherwise
  }

  return (
    <Link
      href={`/${mascot.slug}`}
      className={`text-sm font-medium transition-all duration-200 flex items-center gap-2 px-3 py-1 rounded-full ${isActive ? 'bg-white/90' : ''
        }`}
      style={{
        color: textColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="w-2 h-2 rounded-full transition-transform duration-200"
        style={{
          backgroundColor: isActive ? '#000000' : mascot.color.primary,
          transform: isHovered || isActive ? 'scale(1.5)' : 'scale(1)'
        }}
      />
      {mascot.section}
    </Link>
  );
}

function StaticNavLink({ href, label, onClick, className }: { href: string; label: string; onClick?: () => void; className?: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Check if we're on any section page
  const isOnSectionPage = mascots.some(m => pathname === `/${m.slug}`);

  return (
    <Link
      href={href}
      className={`${className || ''} text-sm font-medium transition-all duration-200 ${isActive
        ? 'bg-white/90 text-black'
        : isOnSectionPage ? 'text-gray-200 hover:text-white' : 'text-bifido-lightgray hover:text-white'
        } ${className?.includes('px-') || className?.includes('py-') ? '' : 'px-3 py-1 rounded-full'}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
