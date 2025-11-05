'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { mascots } from '@/lib/mascots';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bifido-black/95 backdrop-blur-sm border-b border-bifido-gray">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="font-display text-3xl text-white tracking-wider">
              BÍFIDO
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Secciones Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsSectionsOpen(true)}
              onMouseLeave={() => setIsSectionsOpen(false)}
            >
              <button className="text-sm font-medium text-bifido-lightgray hover:text-white transition-colors flex items-center space-x-1">
                <span>Secciones</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isSectionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full left-0 pt-2 w-64 transition-all duration-200 origin-top ${
                  isSectionsOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
                }`}
              >
                <div className="bg-bifido-black/98 backdrop-blur-sm border border-bifido-gray rounded-lg shadow-xl overflow-hidden">
                {mascots.map((mascot, index) => (
                  <Link
                    key={mascot.id}
                    href={`/${mascot.slug}`}
                    className="block px-4 py-3 text-sm text-bifido-lightgray hover:bg-bifido-gray hover:text-white transition-all duration-150 border-l-4 border-transparent hover:border-current"
                    style={{ 
                      borderLeftColor: mascot.color.primary,
                      transitionDelay: isSectionsOpen ? `${index * 30}ms` : '0ms'
                    } as React.CSSProperties}
                  >
                    <div className="font-semibold">{mascot.section}</div>
                    <div className="text-xs text-gray-500 mt-0.5">con {mascot.name}</div>
                  </Link>
                ))}
                </div>
              </div>
            </div>

            <Link
              href="/parche"
              className="text-sm font-medium text-bifido-lightgray hover:text-white transition-colors"
            >
              El Parche
            </Link>
            <Link
              href="/manifiesto"
              className="text-sm font-medium text-bifido-lightgray hover:text-white transition-colors"
            >
              Manifiesto
            </Link>
            <Link
              href="/buzon"
              className="text-sm font-medium text-bifido-lightgray hover:text-white transition-colors"
            >
              Buzón
            </Link>
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
              href="/parche"
              className="block text-sm font-medium text-bifido-lightgray hover:text-white transition-colors py-2 px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              El Parche
            </Link>
            <Link
              href="/manifiesto"
              className="block text-sm font-medium text-bifido-lightgray hover:text-white transition-colors py-2 px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Manifiesto
            </Link>
            <Link
              href="/buzon"
              className="block text-sm font-medium text-bifido-lightgray hover:text-white transition-colors py-2 px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Buzón
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
