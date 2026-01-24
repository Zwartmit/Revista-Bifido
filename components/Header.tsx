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
    const headerBgColor = '#000000';

    const headerStyle = {
        backgroundColor: headerBgColor,
        // backgroundImage: `url('${activeMascot?.image}')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
    };

    // CSS for flag wave animation
    const flagWaveStyle = `
        @keyframes flagWave {
            0%, 100% {
                transform: translateX(0) skewX(0deg);
            }
            25% {
                transform: translateX(1px) skewX(0.5deg);
            }
            75% {
                transform: translateX(-4px) skewX(-0.5deg);
            }
        }
        .flag-stripe {
            animation: flagWave 4s ease-in-out infinite;
        }
        .flag-stripe-1 {
            animation-delay: 0s;
        }
        .flag-stripe-2 {
            animation-delay: 0.3s;
        }
        .flag-stripe-3 {
            animation-delay: 0.6s;
        }
    `;

    return (
        <>
            <style>{flagWaveStyle}</style>
            <header
                className="fixed top-0 left-0 right-0 z-50 border-b border-bifido-gray transition-colors duration-500"
                style={headerStyle}
            >
                <nav className="container mx-auto px-4 py-6">
                    {/* Mobile Layout - Logo and Menu Button side by side */}
                    <div className="flex md:hidden items-center justify-between mb-4">
                        <Link href="/" className="flex items-center">
                            <div className="flex flex-col relative group overflow-visible px-4 py-2">
                                <h1 className="font-display text-3xl text-white tracking-wider relative z-10">
                                    REVISTA BÍFIDO
                                </h1>
                                <div className="absolute inset-0 z-0 opacity-90 scale-110 pointer-events-none">
                                    <div className="flag-stripe flag-stripe-1 absolute -top-[5%] -left-[10%] w-[120%] h-[60%] bg-[#FCD116] -rotate-2 rounded-sm opacity-95" style={{ boxShadow: '0 0 10px rgba(252, 209, 22, 0.3)' }}></div>
                                    <div className="flag-stripe flag-stripe-2 absolute top-[45%] -left-[5%] w-[110%] h-[48%] bg-[#003893] rotate-1 opacity-95" style={{ boxShadow: '0 0 10px rgba(0, 56, 147, 0.3)' }}></div>
                                    <div className="flag-stripe flag-stripe-3 absolute bottom-[-15%] -left-[8%] w-[115%] h-[35%] bg-[#CE1126] -rotate-1 opacity-95" style={{ boxShadow: '0 0 10px rgba(206, 17, 38, 0.3)' }}></div>
                                </div>
                                <p className="text-sm text-white italic mt-1 relative z-10">
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
                            <div className="flex flex-col items-center text-center px-12 py-6 rounded-full backdrop-blur-md bg-black/40 relative group overflow-visible">

                                {/* Stencil Hard Background - Proportions Adjusted */}
                                <div className="absolute inset-0 z-0 opacity-90 scale-110 pointer-events-none transition-all duration-500">
                                    {/* Yellow: Top ~50% */}
                                    <div className="flag-stripe flag-stripe-1 absolute -top-[5%] -left-[10%] w-[120%] h-[60%] bg-[#FCD116] -rotate-2 rounded-sm opacity-95" style={{ boxShadow: '0 0 10px rgba(252, 209, 22, 0.3)' }}></div>

                                    {/* Blue: Middle ~45% (Updated for text) */}
                                    <div className="flag-stripe flag-stripe-2 absolute top-[45%] -left-[5%] w-[110%] h-[45%] bg-[#003893] rotate-1 opacity-95" style={{ boxShadow: '0 0 1px rgba(0, 56, 147, 0.3)' }}></div>

                                    {/* Red: Bottom ~25% - Adjusted */}
                                    <div className="flag-stripe flag-stripe-3 absolute bottom-[-14%] -left-[8%] w-[115%] h-[30%] bg-[#CE1126] -rotate-1 opacity-95" style={{ boxShadow: '0 0 10px rgba(206, 17, 38, 0.3)' }}></div>
                                </div>

                                <h1 className="font-display text-4xl text-black tracking-wider relative z-10 drop-shadow-md">
                                    REVISTA BÍFIDO
                                </h1>
                                <p
                                    ref={subtitleRef}
                                    className="text-lg text-white italic mt-2 relative z-10"
                                >
                                    Periodismo crudo para sensibilidades frágiles
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center">
                        <div className="flex items-center gap-2 mt-6">
                            {/* Secciones */}
                            {[...mascots].sort((a, b) => a.section.localeCompare(b.section)).map((mascot) => (
                                <MascotNavLink key={mascot.id} mascot={mascot} />
                            ))}
                            <div className="h-6 w-1 bg-white mx-3" />

                            <StaticNavLink href="/elparche" label="El Parche" />
                            {/* <StaticNavLink href="/mercado" label="Mercado" /> */}
                            <StaticNavLink href="/eventos" label="Eventos" />
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
                                href="/elparche"
                                label="El Parche"
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-2 px-2"
                            />
                            {/* <StaticNavLink
                            href="/mercado"
                            label="Mercado"
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 px-2"
                        /> */}
                            <StaticNavLink
                                href="/eventos"
                                label="Eventos"
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
        </>
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


