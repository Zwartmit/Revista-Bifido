'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { characters } from '@/lib/characters';
import { getCharacterColors } from '@/lib/character-colors';
import GlobalSearchOverlay from './GlobalSearchOverlay';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCharacterMenuOpen, setIsCharacterMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsCharacterMenuOpen(false);
            }
        };

        if (isCharacterMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCharacterMenuOpen]);

    // Lock body scroll when mobile menu is active
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Find active character based on pathname
    const activeCharacter = characters.find(m => pathname === `/${m.slug}`);
    return (
        <>
            <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <header
                className="fixed top-0 left-0 right-0 z-50 border-b-2 border-bifido-neon bg-black transition-colors duration-500"
            >
                <nav className="container mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-4 relative z-[70]" ref={menuRef}>
                    {/* Mobile Layout - Logo and Menu Button side by side */}
                    <div className="flex lg:hidden items-center justify-between">
                        <Link href="/" className="relative h-12 w-48 lg:h-14 lg:w-56" onClick={() => setIsMenuOpen(false)}>
                            <Image
                                src="/icons/bifido_w.png"
                                alt="Revista Bífido"
                                fill
                                sizes="(max-width: 1024px) 192px, 224px"
                                className="object-contain"
                                priority
                            />
                        </Link>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-1 hover:scale-110 transition-transform"
                                aria-label="Open search"
                            >
                                <svg viewBox="0 0 107.9 108.93" className="w-6 h-6 shrink-0 fill-bifido-neon">
                                    <path d="M82.45,41.62c-.12,4.06-.91,9.13-2.88,13.94-1.16,2.84-.6,5.02,1.67,7.16,8.34,7.87,16.55,15.89,24.83,23.82,2.27,2.17,2.48,3.28.35,5.45-4.98,5.08-10.01,10.13-15.14,15.07-2.69,2.59-3.74,2.46-6.49-.19-6.34-6.11-12.6-12.3-19.02-18.32-2.14-2.01-2.03-3.54.03-5.37,1.47-1.32,8.13-7.68,8.76-8.58.34-.49-22.63,6.32-29.05,7.13C23.75,84.46,2.48,67.65.23,45.77-2.24,21.79,15.73,1.07,39.9.04c22.52-.97,42.36,17.91,42.55,41.58ZM41.43,17.96c-12.95-.13-23.22,9.96-23.31,22.91-.09,12.82,9.96,23.09,22.71,23.21,12.8.11,23.41-10.26,23.47-22.93.06-12.68-10.18-23.06-22.87-23.19Z"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-1 hover:scale-110 transition-transform"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X size={28} className="text-bifido-neon" /> : <img src="/icons/navmobil.svg" alt="Menu" className="object-contain w-8 h-8 shrink-0" />}
                            </button>
                         </div>
                    </div>

                    {/* Desktop Layout - Logo left, Links center/right */}
                    <div className="hidden lg:flex items-center justify-between gap-8">
                        <Link href="/" className="flex items-center flex-shrink-0">
                            <Image
                                src="/icons/bifido_w.png"
                                alt="Revista Bífido"
                                width={180}
                                height={50}
                                priority
                                className="object-contain w-[180px] h-[50px]"
                            />
                        </Link>
                        {/* Desktop Navigation */}
                        <div className="flex items-center gap-4 lg:gap-6 h-10 whitespace-nowrap">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-1 hover:scale-110 transition-transform"
                                aria-label="Open search"
                            >
                                <svg viewBox="0 0 107.9 108.93" className="w-6 h-6 shrink-0 fill-bifido-neon">
                                    <path d="M82.45,41.62c-.12,4.06-.91,9.13-2.88,13.94-1.16,2.84-.6,5.02,1.67,7.16,8.34,7.87,16.55,15.89,24.83,23.82,2.27,2.17,2.48,3.28.35,5.45-4.98,5.08-10.01,10.13-15.14,15.07-2.69,2.59-3.74,2.46-6.49-.19-6.34-6.11-12.6-12.3-19.02-18.32-2.14-2.01-2.03-3.54.03-5.37,1.47-1.32,8.13-7.68,8.76-8.58.34-.49-22.63,6.32-29.05,7.13C23.75,84.46,2.48,67.65.23,45.77-2.24,21.79,15.73,1.07,39.9.04c22.52-.97,42.36,17.91,42.55,41.58ZM41.43,17.96c-12.95-.13-23.22,9.96-23.31,22.91-.09,12.82,9.96,23.09,22.71,23.21,12.8.11,23.41-10.26,23.47-22.93.06-12.68-10.18-23.06-22.87-23.19Z"/>
                                </svg>
                            </button>

                            <svg width="2" height="16" className="shrink-0 opacity-80" shapeRendering="crispEdges"><rect width="2" height="16" fill="#b8ff00" /></svg>

                            <Link href="/" className={`flex items-center gap-2 font-display tracking-wider text-lg transition-colors uppercase px-2 ${pathname === '/' ? 'text-bifido-neon' : 'text-white hover:text-bifido-neon'}`}>
                                <svg viewBox="0 0 121.64 113.24" className="w-5 h-5 shrink-0 fill-current">
                                    <path d="M.03,85.06C.03,76.95.08,68.84,0,60.72c-.02-1.93.57-3.39,1.93-4.74,14.99-14.96,29.94-29.95,44.9-44.94,3.15-3.15,6.4-6.2,9.4-9.48,2.08-2.28,3.68-1.9,5.65.08,6.27,6.32,12.65,12.54,18.96,18.83,11.85,11.8,23.65,23.65,35.55,35.4,1.9,1.88,2.79,3.88,2.77,6.55-.09,15.53-.06,31.07-.1,46.6,0,3.7-.47,4.17-4.06,4.18-11.78.02-23.56.02-35.33,0-3.62,0-3.92-.32-3.93-3.87-.02-9.3-.11-18.6.04-27.9.05-2.89-.94-3.75-3.76-3.7-7.92.15-15.84.14-23.75,0-2.64-.05-3.41.88-3.38,3.44.11,9.4-.03,18.8.07,28.2.03,2.77-.89,3.89-3.76,3.87-12.47-.11-24.94-.11-37.41-.02-2.82.02-3.78-.96-3.73-3.82.16-8.11.06-16.23.06-24.34-.03,0-.05,0-.08,0ZM85.02,56.39v-.02c-4.05,0-8.1-.05-12.14.03-1.16.02-2.9-.75-3.3.98-.33,1.4.18,2.95,1.42,3.99,9.09,7.59,18.19,15.17,27.3,22.73.57.47,1.15,1.35,2.01.84.64-.38.4-1.26.4-1.93,0-7.9-.06-15.79,0-23.69.02-2.14-.76-3.02-2.95-2.96-4.24.11-8.49.03-12.74.03Z"/>
                                </svg>
                                INICIO
                            </Link>

                            <svg width="2" height="16" className="shrink-0 opacity-80" shapeRendering="crispEdges"><rect width="2" height="16" fill="#b8ff00" /></svg>

                            {/* Character buttons Dropdown */}
                            <div
                                className="relative h-full flex items-center"
                                onMouseEnter={() => {
                                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                    setIsCharacterMenuOpen(true);
                                }}
                                onMouseLeave={() => {
                                    timeoutRef.current = setTimeout(() => {
                                        setIsCharacterMenuOpen(false);
                                    }, 200);
                                }}
                            >
                                <button
                                    className="flex items-center gap-1 text-white font-display tracking-wider text-lg hover:text-bifido-neon transition-colors uppercase px-2 py-1"
                                >
                                    LA MANADA
                                    <ChevronDown size={18} className={`transform transition-transform duration-200 ${isCharacterMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Invisible bridge to prevent gap issues */}
                                <div className={`absolute top-full h-2 w-full z-40 ${isCharacterMenuOpen ? 'block' : 'hidden'}`} />

                                <div className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-max min-w-[240px] bg-black border border-bifido-neon rounded-2xl py-4 px-2 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(204,253,41,0.1)] flex flex-col gap-1 z-50 transition-all duration-300 origin-top ${isCharacterMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'}`}>
                                    {characters.map((character) => (
                                        <div key={character.id} onClick={() => setIsCharacterMenuOpen(false)} className="w-full">
                                            <CharacterNavLink character={character} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <svg width="2" height="16" className="shrink-0 opacity-80" shapeRendering="crispEdges"><rect width="2" height="16" fill="#b8ff00" /></svg>

                            <StaticNavLink href="/elparche" label="EL PARCHE" className="font-display tracking-wider text-lg uppercase" />

                            <svg width="2" height="16" className="shrink-0 opacity-80" shapeRendering="crispEdges"><rect width="2" height="16" fill="#b8ff00" /></svg>

                            <StaticNavLink href="/eventos" label="EVENTOS" className="font-display tracking-wider text-lg uppercase" />

                            <svg width="2" height="16" className="shrink-0 opacity-80" shapeRendering="crispEdges"><rect width="2" height="16" fill="#b8ff00" /></svg>

                            <StaticNavLink href="/contactanos" label="CONTÁCTANOS" className="font-display tracking-wider text-lg uppercase" />

                        </div>
                    </div>

                    {/* Mobile Navigation - Brutalismo Neón Overlay */}
                    <div className={`fixed inset-0 z-[100] bg-black transition-all duration-500 lg:hidden flex flex-col overflow-y-auto ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>

                        {/* Modal Internal Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b-2 border-bifido-neon shrink-0 w-full mb-4">
                            <Link href="/" className="relative h-12 w-48" onClick={() => setIsMenuOpen(false)}>
                                <Image
                                    src="/icons/bifido.svg"
                                    alt="Revista Bífido"
                                    fill
                                    sizes="(max-width: 1024px) 192px, 224px"
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-1 hover:scale-110 transition-transform"
                                aria-label="Close menu"
                            >
                                <X size={36} className="text-bifido-neon" />
                            </button>
                        </div>

                        <div className="flex flex-col w-full h-full justify-start">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className={`w-full border-t border-b border-white/20 py-6 px-6 font-display text-3xl sm:text-4xl uppercase transition-all duration-300 ${pathname === '/' ? 'bg-bifido-neon text-black' : 'text-white hover:bg-white hover:text-black'}`}>
                                INICIO
                            </Link>

                            {/* Character Mobile Dropdown */}
                            <div className="flex flex-col w-full">
                                <button
                                    onClick={() => setIsCharacterMenuOpen(!isCharacterMenuOpen)}
                                    className={`w-full border-b border-white/20 py-6 px-6 font-display text-3xl sm:text-4xl uppercase transition-all duration-300 flex justify-between items-center ${isCharacterMenuOpen ? 'bg-bifido-neon text-black' : 'text-white hover:bg-white hover:text-black'}`}
                                >
                                    <span>LA MANADA</span>
                                    <span className="text-4xl sm:text-5xl font-mono leading-none mb-1">{isCharacterMenuOpen ? '-' : '+'}</span>
                                </button>

                                <div className={`overflow-hidden transition-all duration-500 w-full flex flex-col items-start ${isCharacterMenuOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    {characters.map((character) => {
                                        const mColors = getCharacterColors(character.slug);
                                        const isActive = pathname === `/${character.slug}`;
                                        return (
                                            <Link key={character.id} href={`/${character.slug}`} onClick={() => { setIsMenuOpen(false); setIsCharacterMenuOpen(false); }} className={`w-full border-b border-white/10 py-5 px-8 font-display text-2xl sm:text-3xl uppercase transition-colors flex items-center gap-4 bg-[#111] hover:bg-[#222] ${isActive ? 'text-bifido-neon' : 'text-white/60 hover:text-white'}`}>
                                                <div className="w-2 h-6 shrink-0 rounded-full" style={{ backgroundColor: mColors.primary }}></div>
                                                {character.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            <Link href="/elparche" onClick={() => setIsMenuOpen(false)} className={`w-full border-b border-white/20 py-6 px-6 font-display text-3xl sm:text-4xl uppercase transition-all duration-300 ${pathname === '/elparche' ? 'bg-bifido-neon text-black' : 'text-white hover:bg-white hover:text-black'}`}>
                                EL PARCHE
                            </Link>

                            <Link href="/eventos" onClick={() => setIsMenuOpen(false)} className={`w-full border-b border-white/20 py-6 px-6 font-display text-3xl sm:text-4xl uppercase transition-all duration-300 ${pathname === '/eventos' ? 'bg-bifido-neon text-black' : 'text-white hover:bg-white hover:text-black'}`}>
                                EVENTOS
                            </Link>

                            <Link href="/contactanos" onClick={() => setIsMenuOpen(false)} className={`w-full border-b border-white/20 py-6 px-6 font-display text-3xl sm:text-4xl uppercase transition-all duration-300 ${pathname === '/contactanos' ? 'bg-bifido-neon text-black' : 'text-white hover:bg-white hover:text-black'}`}>
                                CONTACTO
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Scrolling Marquee Tape */}
                <div className="w-full bg-bifido-neon overflow-hidden flex">
                    <div className="whitespace-nowrap animate-marquee flex w-max py-[6px]">
                        {/* First exact half */}
                        <div className="flex items-center justify-around flex-shrink-0">
                            {Array(5).fill(null).map((_, i) => (
                                <div key={`first-${i}`} className="flex items-center justify-center">
                                    <span style={{ fontFamily: 'var(--font-jack, "JackInput", monospace)' }} className="text-black text-sm md:text-base tracking-[0.25em] px-8 pt-[2px]">
                                        PERIODISMO CRUDO PARA SENSIBILIDADES FRÁGILES
                                    </span>
                                    <img src="/icons/arrow.svg" alt="separator" className="w-[14px] h-[14px] object-contain opacity-90 shrink-0 mx-4" />
                                </div>
                            ))}
                        </div>
                        {/* Second exact half for seamless loop */}
                        <div className="flex items-center justify-around flex-shrink-0">
                            {Array(5).fill(null).map((_, i) => (
                                <div key={`second-${i}`} className="flex items-center justify-center">
                                    <span style={{ fontFamily: 'var(--font-jack, "JackInput", monospace)' }} className="text-black text-sm md:text-base tracking-[0.25em] px-8 pt-[2px]">
                                        PERIODISMO CRUDO PARA SENSIBILIDADES FRÁGILES
                                    </span>
                                    <Image src="/icons/arrow.svg" alt="separator" width={14} height={14} className="w-5 h-5 object-contain opacity-90" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>
            {/* Adds padding to prevent content from hiding under fixed header */}
            <div className="h-[120px]"></div>
        </>
    );
}

function CharacterNavLink({ character, isMobile, onClick }: { character: typeof characters[0], isMobile?: boolean, onClick?: () => void }) {
    const [isHovered, setIsHovered] = useState(false);
    const pathname = usePathname();
    const isActive = pathname === `/${character.slug}`;
    const cColors = getCharacterColors(character.slug);

    // Check if we're on any section page
    const isOnSectionPage = characters.some(m => pathname === `/${m.slug}`);

    // Determine text color based on state and context
    let textColor;
    if (isActive) {
        textColor = cColors.primary;
    } else if (isHovered) {
        textColor = isOnSectionPage ? '#FFFFFF' : cColors.primary;
    } else {
        textColor = isOnSectionPage ? '#E5E7EB' : '#9CA3AF';
    }

    if (isMobile) {
        return (
            <Link
                href={`/${character.slug}`}
                className={`block text-xl font-display tracking-wider transition-colors py-2 rounded ${isActive
                    ? 'font-bold'
                    : 'text-white hover:bg-white/10'
                    }`}
                onClick={onClick}
                style={{
                    backgroundColor: isActive ? `${cColors.primary}1A` : 'transparent',
                    borderLeft: `4px solid ${cColors.primary}`,
                    color: isActive ? cColors.primary : textColor,
                    paddingLeft: '12px'
                }}
            >
                {character.name}
            </Link>
        );
    }

    return (
        <Link
            href={`/${character.slug}`}
            className={`font-display text-base transition-all duration-200 flex items-center gap-3 px-4 py-3 rounded-xl w-full ${!isActive ? 'hover:bg-white/5 border-l-4 border-transparent' : ''}`}
            style={{
                color: textColor,
                backgroundColor: isActive ? `${cColors.primary}1A` : undefined,
                borderLeft: isActive ? `4px solid ${cColors.primary}` : undefined,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <span
                className="w-2 h-2 rounded-full transition-transform duration-200"
                style={{
                    backgroundColor: cColors.primary,
                    transform: isHovered || isActive ? 'scale(1.5)' : 'scale(1)'
                }}
            />
            {character.name}
        </Link>
    );
}

function StaticNavLink({ href, label, onClick, className }: { href: string; label: string; onClick?: () => void; className?: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    // Check if we're on any section page
    const isOnSectionPage = characters.some(m => pathname === `/${m.slug}`);

    return (
        <Link
            href={href}
            className={`transition-all duration-200 px-2 py-1 ${isActive ? 'text-bifido-neon' : 'text-white hover:text-bifido-neon'} ${className || ''}`}
            onClick={onClick}
        >
            {label}
        </Link>
    );
}

