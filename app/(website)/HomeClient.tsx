'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
// import { Article } from '@/types'; // Removing explicit type import to direct usage or let inference handle it if needed
import gsap from 'gsap';
import { ArrowRight, Newspaper, Calendar, Clock } from 'lucide-react';
import { getMascotBySlug } from '@/lib/mascots'; // Still using local helper for mascot colors/info if applicable, or pass from server?

// Interface for props
interface HomeClientProps {
    articles: any[]; // Replace with correct Article type
    mascots: any[];
}

export default function HomeClient({ articles, mascots }: HomeClientProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const recentRef = useRef<HTMLDivElement>(null);

    const recentArticles = articles.slice(0, 6);

    useEffect(() => {
        // Hero animation
        if (heroRef.current) {
            gsap.fromTo(
                heroRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
            );
        }

        // Recent articles animation
        if (recentRef.current && recentRef.current.children.length > 0) {
            gsap.fromTo(
                recentRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
            );
        }
    }, []);

    // Helper to get mascot data (color, etc) from the passed mascots list
    const getMascot = (slug: string) => mascots.find((m: any) => m.slug === slug) || mascots[0];

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative w-full h-screen overflow-hidden mt-0">
                <Image
                    src="/hero/Hero.png"
                    alt="La Manada Bífido"
                    fill
                    className="object-cover object-bottom pt-10"
                    priority
                />
            </section>

            {/* Separator Gradient */}
            <div className="w-full h-32 bg-gradient-to-b from-transparent to-black" style={{ marginTop: '-8rem', position: 'relative', zIndex: 10 }} />

            {/* La Manada Section */}
            <section id="la-manada" className="py-20 relative bg-black">
                {/* Background Green Element */}
                <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none overflow-hidden flex justify-end">
                    <div className="w-[800px] h-[800px] bg-[url('/gradiente-verde.png')] bg-contain bg-right bg-no-repeat mix-blend-screen opacity-50 translate-x-1/4" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex justify-center mb-16">
                        <div className="inline-block relative">
                            <h2 className="font-display text-4xl text-white tracking-widest bg-gradient-to-r from-transparent to-black/50 px-8 py-2 rounded flex items-center gap-4">
                                LA MANADA 
                                <Image src="/icons/arrow_o.svg" alt="arrow" width={24} height={20} className="object-contain" />
                            </h2>
                        </div>
                    </div>

                    <div className="flex justify-center flex-wrap gap-x-8 gap-y-12 items-end">
                        {mascots.map((mascot: any, index: number) => {
                            // Select background aura image
                            const bgImage = mascot.slug === 'ecorebeldia' ? '/gradiente-verde.png' : '/gradiente-amarillo.png';
                            // Apply hue rotation to yellow gradient for other mascots based on their primary colors to approximate the visual
                            let hueRotate = '0deg';
                            if (mascot.slug === 'malandra' || mascot.slug === 'anika' || mascot.slug === 'punkibri' || mascot.slug === 'mordaz') {
                                // Since we don't know the exact color required for all, we can fallback to CSS hue-rotate,
                                // or just rely on the primary color as an underlay glow.
                                // The image has purple for someone, let's use a subtle drop-shadow trick below instead.
                            }

                            return (
                                <Link
                                    key={mascot.id}
                                    href={`/${mascot.slug}`}
                                    className="group relative flex flex-col items-center animate-float hover:z-20"
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <div className="relative w-40 h-56 md:w-56 md:h-72 transition-transform duration-300 group-hover:scale-110">
                                        {/* Colored underlay glow to tint the aura slightly */}
                                        <div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full opacity-60 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                                            style={{ backgroundColor: mascot.color?.primary }}
                                        />

                                        {/* Image-based Aura (Swirl) */}
                                        <div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] mix-blend-screen opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                            style={{
                                                backgroundImage: `url('${bgImage}')`,
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                                ...(mascot.slug === 'anika' ? { filter: 'hue-rotate(240deg)' } : {}),
                                                ...(mascot.slug === 'punkibri' ? { filter: 'hue-rotate(50deg)' } : {}),
                                                ...(mascot.slug === 'malandra' ? { filter: 'hue-rotate(320deg)' } : {})
                                            }}
                                        />

                                        {/* 3D Mascot Image */}
                                        {mascot.image && (
                                            <Image
                                                src={mascot.image}
                                                alt={mascot.name}
                                                fill
                                                className="object-contain relative z-10 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:drop-shadow-[0_25px_35px_rgba(0,0,0,1)]"
                                            />
                                        )}
                                    </div>
                                    <h3
                                        className="absolute -bottom-8 font-display text-xl text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-2 pointer-events-none"
                                        style={{ color: mascot.color?.primary || 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                                    >
                                        {mascot.name}
                                    </h3>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Recent Articles Section (Kept from existing) */}
            <section className="py-20 bg-black relative z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-12 justify-center">
                        <Clock className="text-bifido-orange" size={32} />
                        <h2 className="font-display text-4xl text-white tracking-widest">LO ÚLTIMO</h2>
                    </div>

                    <div ref={recentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentArticles.map((article: any) => {
                            const mascot = getMascot(article.section);
                            const color = mascot?.color?.primary || '#CCFD29';

                            return (
                                <Link
                                    key={article.id}
                                    href={`/${article.section}/${article.slug}`}
                                    className="group flex flex-col bg-bifido-gray/50 border border-bifido-gray/30 rounded-xl overflow-hidden hover:border-bifido-neon transition-all duration-300"
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        {article.featuredImage && (
                                            <Image
                                                src={article.featuredImage}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                            />
                                        )}
                                        <div
                                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-black shadow-lg"
                                            style={{ backgroundColor: color }}
                                        >
                                            {mascot?.name || article.section}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                                            <Calendar size={14} />
                                            <span>{formatDate(article.publishedAt)}</span>
                                        </div>

                                        <h3 className="font-display text-xl mb-3 text-white flex-1 group-hover:text-bifido-neon transition-colors">{article.title}</h3>

                                        <div className="flex items-center gap-2 text-sm font-bold mt-4" style={{ color }}>
                                            <span>Leer artículo</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {recentArticles.length === 0 && (
                        <p className="text-center text-gray-500 mt-8">No hay artículos recientes.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
