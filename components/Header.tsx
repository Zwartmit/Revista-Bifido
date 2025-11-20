'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { mascots } from '@/lib/mascots';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bifido-black/95 backdrop-blur-sm border-b border-bifido-gray">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex flex-col">
              <h1 className="font-display text-3xl text-white tracking-wider">
                REVISTA BÍFIDO
              </h1>
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FCD116 33.33%, #003893 33.33%, #003893 66.66%, #CE1126 66.66%)' }} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {/* Secciones */}
            {mascots.map((mascot) => (
              <MascotNavLink key={mascot.id} mascot={mascot} />
            ))}
            <div className="h-6 w-1 bg-white mx-3" />

            <StaticNavLink href="/lamanada" label="La manada" />
            <StaticNavLink href="/mercado" label="Mercado" />
            <StaticNavLink href="/manifiesto" label="Manifiesto" />
            <StaticNavLink href="/contactanos" label="Contáctanos" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {/* Secciones en móvil */}
            <div className="border-b border-bifido-gray pb-3 mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                Secciones
              </p>
              {mascots.map((mascot) => (
                <Link
                  key={mascot.id}
                  href={`/${mascot.slug}`}
                  className="block text-sm font-medium text-bifido-lightgray hover:text-white transition-colors py-2 px-2 hover:bg-bifido-gray rounded"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    borderLeft: `3px solid ${mascot.color.primary}`,
                    paddingLeft: '12px'
                  }}
                >
                  {mascot.section}
                </Link>
              ))}
            </div>

            <Link
              href="/lamanada"
              className="block text-sm font-medium text-bifido-lightgray hover:text-white transition-colors py-2 px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              La manada
            </Link>
            <Link
              href="/mercado"
              className="block text-sm font-medium text-bifido-lightgray hover:text-white transition-colors py-2 px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Mercado
            </Link>
            <Link
              href="/manifiesto"
              className="block text-sm font-medium text-bifido-lightgray hover:text-white transition-colors py-2 px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Manifiesto
            </Link>
            <Link
              href="/contactanos"
              className="block text-sm font-medium text-bifido-lightgray hover:text-white transition-colors py-2 px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contáctanos
            </Link>
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

  return (
    <Link
      href={`/${mascot.slug}`}
      className={`text-sm font-medium transition-all duration-200 flex items-center gap-2 px-3 py-1 rounded-full ${isActive ? 'bg-white/10' : ''
        }`}
      style={{
        color: isHovered || isActive ? mascot.color.primary : '#9CA3AF',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="w-2 h-2 rounded-full transition-transform duration-200"
        style={{
          backgroundColor: mascot.color.primary,
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

  return (
    <Link
      href={href}
      className={`${className || ''} text-sm font-medium transition-all duration-200 ${isActive
          ? 'bg-white/10 text-white'
          : 'text-bifido-lightgray hover:text-white'
        } ${className?.includes('px-') || className?.includes('py-') ? '' : 'px-3 py-1 rounded-full'}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
