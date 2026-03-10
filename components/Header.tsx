'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { mascots } from '@/lib/mascots';
import { useRef } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMascotMenuOpen, setIsMascotMenuOpen] = useState(false);
    const pathname = usePathname();

    // Find active mascot based on pathname
    const activeMascot = mascots.find(m => pathname === `/${m.slug}`);
    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-50 border-b-2 border-bifido-neon bg-black transition-colors duration-500"
            >
                <nav className="container mx-auto px-4 py-4">
                    {/* Mobile Layout - Logo and Menu Button side by side */}
                    <div className="flex md:hidden items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo-white.png"
                                alt="Revista Bífido"
                                width={150}
                                height={40}
                                priority
                                className="object-contain"
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
                    <div className="hidden md:flex items-center justify-between">
                        <Link href="/" className="flex items-center flex-shrink-0">
                            <Image
                                src="/logo-white.png"
                                alt="Revista Bífido"
                                width={180}
                                height={50}
                                priority
                                className="object-contain"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="flex items-center gap-2 lg:gap-4">
                            <Link href="/" className="flex items-center gap-2 text-bifido-neon font-display tracking-wider text-lg transition-colors uppercase">
                                <Image src="/icons/Home.png" alt="Inicio" width={20} height={20} className="object-contain" />
                                INICIO
                            </Link>

                            <div className="h-4 w-[2px] bg-bifido-neon mx-1 lg:mx-2" />

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
                                        {/* Horizontal Mascot Menu centered on viewport */}
                                        <div className="fixed top-[100px] left-1/2 -translate-x-1/2 w-max max-w-[95vw] overflow-x-auto bg-black border border-bifido-neon rounded-full py-4 px-6 lg:px-8 shadow-[0_0_15px_rgba(204,253,41,0.2)] flex flex-row items-center gap-4 lg:gap-8 justify-center z-50">
                                            {[...mascots].sort((a, b) => a.section.localeCompare(b.section)).map((mascot) => (
                                                <div key={mascot.id} onClick={() => setIsMascotMenuOpen(false)}>
                                                    <MascotNavLink mascot={mascot} />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="h-4 w-[2px] bg-bifido-neon mx-1 lg:mx-2" />

                            <StaticNavLink href="/elparche" label="EL PARCHE" className="font-display tracking-wider text-lg hover:!text-bifido-neon" />

                            <div className="h-4 w-[2px] bg-bifido-neon mx-1 lg:mx-2" />

                            <StaticNavLink href="/eventos" label="EVENTOS" className="font-display tracking-wider text-lg hover:!text-bifido-neon" />

                            <div className="h-4 w-[2px] bg-bifido-neon mx-1 lg:mx-2" />

                            <StaticNavLink href="/contactanos" label="CONTÁCTANOS" className="font-display tracking-wider text-lg hover:!text-bifido-neon" />
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 space-y-4">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-bifido-neon font-display tracking-wider text-xl hover:text-white transition-colors px-2">
                                <Image src="/icons/Home.png" alt="Home" width={24} height={24} className="object-contain" />
                                Inicio
                            </Link>

                            {/* Mascot Mobile Dropdown */}
                            <div className="border-b border-bifido-neon/20 pb-4 mb-4">
                                <button
                                    onClick={() => setIsMascotMenuOpen(!isMascotMenuOpen)}
                                    className="flex w-full items-center justify-between font-display tracking-wider text-xl px-2 text-white hover:text-bifido-neon transition-colors uppercase"
                                >
                                    LA MANADA
                                    <ChevronDown size={24} className={`transform transition-transform duration-200 ${isMascotMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${isMascotMenuOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="space-y-3 px-4 border-l-2 border-bifido-neon/30 ml-2">
                                        {[...mascots].sort((a, b) => a.section.localeCompare(b.section)).map((mascot) => (
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
                                className="block font-display tracking-wider text-xl px-2"
                            />
                            <StaticNavLink
                                href="/eventos"
                                label="Eventos"
                                onClick={() => setIsMenuOpen(false)}
                                className="block font-display tracking-wider text-xl px-2"
                            />
                            <StaticNavLink
                                href="/contactanos"
                                label="Contáctanos"
                                onClick={() => setIsMenuOpen(false)}
                                className="block font-display tracking-wider text-xl px-2"
                            />
                        </div>
                    )}
                </nav>

                {/* Scrolling Marquee Tape */}
                <div className="w-full bg-bifido-neon overflow-hidden py-1 border-b border-black">
                    <div className="whitespace-nowrap animate-marquee flex items-center gap-6 text-black font-display tracking-widest text-lg py-2">
                        {/* First set of items */}
                        {Array(5).fill(null).map((_, i) => (
                            <div key={`first-${i}`} className="flex items-center gap-12">
                                <span>PERIODISMO CRUDO PARA SENSIBILIDADES FRÁGILES</span>
                                <span>•</span>
                            </div>
                        ))}
                        {/* Duplicated set for seamless loop */}
                        {Array(5).fill(null).map((_, i) => (
                            <div key={`second-${i}`} className="flex items-center gap-12">
                                <span>PERIODISMO CRUDO PARA SENSIBILIDADES FRÁGILES</span>
                                <span>•</span>
                            </div>
                        ))}
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


