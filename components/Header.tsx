'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { mascots } from '@/lib/mascots';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMascotMenuOpen, setIsMascotMenuOpen] = useState(false);
    const pathname = usePathname();
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

    // Find active mascot based on pathname
    const activeMascot = mascots.find(m => pathname === `/${m.slug}`);
    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-50 border-b-2 border-bifido-neon bg-black transition-colors duration-500"
            >
                <nav className="container mx-auto px-4 py-4" ref={menuRef}>
                    {/* Mobile Layout - Logo and Menu Button side by side */}
                    <div className="flex lg:hidden items-center justify-between">
                        <Link href="/" className="relative h-12 w-48 lg:h-14 lg:w-56" onClick={() => setIsMenuOpen(false)}>
                            <Image
                                src="/logos/bifido.svg"
                                alt="Revista Bífido"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-bifido-neon p-2"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    {/* Desktop Layout - Logo left, Links center/right */}
                    <div className="hidden lg:flex items-center justify-between">
                        <Link href="/" className="flex items-center flex-shrink-0">
                            <Image
                                src="/logos/bifido.svg"
                                alt="Revista Bífido"
                                width={180}
                                height={50}
                                priority
                                className="object-contain"
                            />
                        </Link>
                        {/* Desktop Navigation */}
                        <div className="flex items-center gap-4 lg:gap-6 h-10">
                            <Link href="/" className={`flex items-center gap-2 font-display tracking-wider text-lg transition-colors uppercase px-2 ${pathname === '/' ? 'text-bifido-neon' : 'text-white hover:text-bifido-neon'}`}>
                                <Image src="/icons/home.svg" alt="Inicio" width={20} height={20} className="object-contain" />
                                INICIO
                            </Link>

                            <div className="h-4 w-[2px] bg-bifido-neon" />

                            {/* Mascot buttons Dropdown */}
                            <div className="relative h-full flex items-center">
                                <button
                                    onClick={() => setIsMascotMenuOpen(!isMascotMenuOpen)}
                                    className="flex items-center gap-1 text-white font-display tracking-wider text-lg hover:text-bifido-neon transition-colors uppercase px-2"
                                >
                                    LA MANADA
                                    <ChevronDown size={18} className={`transform transition-transform duration-200 ${isMascotMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isMascotMenuOpen && (
                                    <div className="fixed top-[100px] left-1/2 -translate-x-1/2 w-max max-w-[95vw] overflow-x-auto bg-black border border-bifido-neon rounded-full py-4 px-6 lg:px-8 shadow-[0_0_15px_rgba(204,253,41,0.2)] flex flex-row items-center gap-4 lg:gap-8 justify-center z-50">
                                        {mascots.map((mascot) => (
                                            <div key={mascot.id} onClick={() => setIsMascotMenuOpen(false)}>
                                                <MascotNavLink mascot={mascot} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="h-4 w-[2px] bg-bifido-neon" />

                            <StaticNavLink href="/elparche" label="EL PARCHE" className="font-display tracking-wider text-lg uppercase" />

                            <div className="h-4 w-[2px] bg-bifido-neon" />

                            <StaticNavLink href="/eventos" label="EVENTOS" className="font-display tracking-wider text-lg uppercase" />

                            <div className="h-4 w-[2px] bg-bifido-neon" />

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

                            {/* Mascot Mobile Dropdown */}
                            <div className="pb-2">
                                <button
                                    onClick={() => setIsMascotMenuOpen(!isMascotMenuOpen)}
                                    className="flex w-full items-center justify-between font-display tracking-wider text-lg px-2 text-white hover:text-bifido-neon transition-colors uppercase"
                                >
                                    LA MANADA
                                    <ChevronDown size={24} className={`transform transition-transform duration-200 ${isMascotMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${isMascotMenuOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="space-y-3 px-2">
                                        {mascots.map((mascot) => (
                                            <div key={mascot.id} className="px-2">
                                                <MascotNavLink mascot={mascot} isMobile onClick={() => { setIsMenuOpen(false); setIsMascotMenuOpen(false); }} />
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

function MascotNavLink({ mascot, isMobile, onClick }: { mascot: typeof mascots[0], isMobile?: boolean, onClick?: () => void }) {
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

    if (isMobile) {
        return (
            <Link
                href={`/${mascot.slug}`}
                className={`block text-xl font-display tracking-wider transition-colors py-2 rounded ${isActive
                    ? 'bg-bifido-neon text-black font-bold'
                    : 'text-white hover:bg-white/10'
                    }`}
                onClick={onClick}
                style={{
                    borderLeft: isActive ? '4px solid #000000' : `4px solid ${mascot.color.primary}`,
                    paddingLeft: '12px'
                }}
            >
                {mascot.section}
            </Link>
        );
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
            onClick={onClick}
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
            className={`transition-all duration-200 px-2 py-1 ${isActive ? 'text-bifido-neon' : 'text-white hover:text-bifido-neon'} ${className || ''}`}
            onClick={onClick}
        >
            {label}
        </Link>
    );
}

