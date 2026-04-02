'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { characters } from '@/lib/characters';
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

    // Find active character based on pathname
    const activeCharacter = characters.find(m => pathname === `/${m.slug}`);
    return (
        <>
            <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <header
                className="fixed top-0 left-0 right-0 z-50 border-b-2 border-bifido-neon bg-black transition-colors duration-500"
            >
                <nav className="container mx-auto px-4 py-4" ref={menuRef}>
                    {/* Mobile Layout - Logo and Menu Button side by side */}
                    <div className="flex lg:hidden items-center justify-between">
                        <Link href="/" className="relative h-12 w-48 lg:h-14 lg:w-56" onClick={() => setIsMenuOpen(false)}>
                            <Image
                                src="/icons/bifido.svg"
                                alt="Revista Bífido"
                                fill
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
                                <Image src="/icons/search.svg" alt="Search" width={24} height={24} className="object-contain" />
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-1 hover:scale-110 transition-transform"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X size={28} className="text-bifido-neon" /> : <Image src="/icons/menu.svg" alt="Menu" width={24} height={24} className="object-contain" />}
                            </button>
                        </div>
                    </div>

                    {/* Desktop Layout - Logo left, Links center/right */}
                    <div className="hidden lg:flex items-center justify-between">
                        <Link href="/" className="flex items-center flex-shrink-0">
                            <Image
                                src="/icons/bifido.svg"
                                alt="Revista Bífido"
                                width={180}
                                height={50}
                                priority
                                className="object-contain"
                            />
                        </Link>
                        {/* Desktop Navigation */}
                        <div className="flex items-center gap-4 lg:gap-6 h-10">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-1 hover:scale-110 transition-transform"
                                aria-label="Open search"
                            >
                                <Image src="/icons/search.svg" alt="Search" width={24} height={24} className="object-contain" />
                            </button>

                            <svg width="2" height="16" className="shrink-0 opacity-80" shapeRendering="crispEdges"><rect width="2" height="16" fill="#CCFD29" /></svg>

                            <Link href="/" className={`flex items-center gap-2 font-display tracking-wider text-lg transition-colors uppercase px-2 ${pathname === '/' ? 'text-bifido-neon' : 'text-white hover:text-bifido-neon'}`}>
                                <Image src="/icons/home.svg" alt="Inicio" width={20} height={20} className="object-contain" />
                                INICIO
                            </Link>

                            <svg width="2" height="16" className="shrink-0 opacity-80" shapeRendering="crispEdges"><rect width="2" height="16" fill="#CCFD29" /></svg>

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

                            <svg width="2" height="16" className="shrink-0 opacity-80" shapeRendering="crispEdges"><rect width="2" height="16" fill="#CCFD29" /></svg>

                            <StaticNavLink href="/elparche" label="EL PARCHE" className="font-display tracking-wider text-lg uppercase" />

                            <svg width="2" height="16" className="shrink-0 opacity-80" shapeRendering="crispEdges"><rect width="2" height="16" fill="#CCFD29" /></svg>

                            <StaticNavLink href="/eventos" label="EVENTOS" className="font-display tracking-wider text-lg uppercase" />

                            <svg width="2" height="16" className="shrink-0 opacity-80" shapeRendering="crispEdges"><rect width="2" height="16" fill="#CCFD29" /></svg>

                            <StaticNavLink href="/contactanos" label="CONTÁCTANOS" className="font-display tracking-wider text-lg uppercase" />

                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="lg:hidden mt-4 pb-4 space-y-4">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-2 font-display tracking-wider text-lg transition-colors px-2 ${pathname === '/' ? 'text-bifido-neon' : 'text-white hover:text-bifido-neon'}`}>
                                <Image src="/icons/home.svg" alt="Home" width={20} height={20} className="object-contain" />
                                Inicio
                            </Link>

                            {/* Character Mobile Dropdown */}
                            <div className="pb-2">
                                <button
                                    onClick={() => setIsCharacterMenuOpen(!isCharacterMenuOpen)}
                                    className="flex w-full items-center justify-between font-display tracking-wider text-lg px-2 text-white hover:text-bifido-neon transition-colors uppercase"
                                >
                                    LA MANADA
                                    <ChevronDown size={24} className={`transform transition-transform duration-200 ${isCharacterMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${isCharacterMenuOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="space-y-3 px-2">
                                        {characters.map((character) => (
                                            <div key={character.id} className="px-2">
                                                <CharacterNavLink character={character} isMobile onClick={() => { setIsMenuOpen(false); setIsCharacterMenuOpen(false); }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <StaticNavLink
                                href="/elparche"
                                label="El Parche"
                                onClick={() => setIsMenuOpen(false)}
                                className="block font-display tracking-wider text-lg px-2"
                            />
                            <StaticNavLink
                                href="/eventos"
                                label="Eventos"
                                onClick={() => setIsMenuOpen(false)}
                                className="block font-display tracking-wider text-lg px-2"
                            />
                            <StaticNavLink
                                href="/contactanos"
                                label="Contáctanos"
                                onClick={() => setIsMenuOpen(false)}
                                className="block font-display tracking-wider text-lg px-2"
                            />
                        </div>
                    )}
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
                                    <Image src="/icons/arrow.svg" alt="separator" width={14} height={14} className="w-5 h-5 object-contain opacity-90" />
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

    // Check if we're on any section page
    const isOnSectionPage = characters.some(m => pathname === `/${m.slug}`);

    // Determine text color based on state and context
    let textColor;
    if (isActive) {
        textColor = '#000000'; // Black for active link on colored background
    } else if (isHovered) {
        textColor = isOnSectionPage ? '#FFFFFF' : character.color.primary;
    } else {
        textColor = isOnSectionPage ? '#E5E7EB' : '#9CA3AF'; // Light gray on section pages, normal gray otherwise
    }

    if (isMobile) {
        return (
            <Link
                href={`/${character.slug}`}
                className={`block text-xl font-display tracking-wider transition-colors py-2 rounded ${isActive
                    ? 'bg-bifido-neon text-black font-bold'
                    : 'text-white hover:bg-white/10'
                    }`}
                onClick={onClick}
                style={{
                    borderLeft: isActive ? '4px solid #000000' : `4px solid ${character.color.primary}`,
                    paddingLeft: '12px'
                }}
            >
                {character.section}
            </Link>
        );
    }

    return (
        <Link
            href={`/${character.slug}`}
            className={`text-base font-medium transition-all duration-200 flex items-center gap-3 px-4 py-3 rounded-xl w-full ${isActive ? 'bg-bifido-neon/10 border-l-4 border-bifido-neon' : 'hover:bg-white/5 border-l-4 border-transparent'
                }`}
            style={{
                color: textColor,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <span
                className="w-2 h-2 rounded-full transition-transform duration-200"
                style={{
                    backgroundColor: isActive ? '#000000' : character.color.primary,
                    transform: isHovered || isActive ? 'scale(1.5)' : 'scale(1)'
                }}
            />
            {character.section}
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

