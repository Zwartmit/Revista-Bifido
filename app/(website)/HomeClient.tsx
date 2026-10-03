'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import gsap from 'gsap';
import { ArrowRight, Newspaper, Calendar, Clock, Star } from 'lucide-react';
import { getCharacterColors } from '@/lib/character-colors';

// Interface for props
interface HomeClientProps {
    articles: any[]; // Replace with correct Article type
    characters: any[];
}

export default function HomeClient({ articles, characters }: HomeClientProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const recentRef = useRef<HTMLDivElement>(null);

    const featuredArticles = articles.filter((a: any) => a.featured).slice(0, 6);
    const recentArticles = articles.filter((a: any) => !a.featured).slice(0, 6);

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

    // Helper to get character data (name, etc) from the passed characters list
    const getCharacter = (slug: string) => characters.find((m: any) => m.slug === slug) || characters[0];

    const renderArticleCard = (article: any) => {
        const character = getCharacter(article.characterId || article.section);
        const { primary: color } = getCharacterColors(article.characterId || article.section);

        return (
            <Link
                key={article.id}
                href={`/${article.section}/articulos/${article.slug}`}
                className="group flex flex-col bg-bifido-gray/50 border border-bifido-gray/30 rounded-xl overflow-hidden hover:border-transparent transition-all duration-300"
                style={{ '--hover-color': color } as React.CSSProperties}
            >
                <style>{`
                    .group:hover {
                        border-color: var(--hover-color) !important;
                    }
                    .group:hover h3 {
                        color: var(--hover-color) !important;
                    }
                `}</style>
                <div className="relative aspect-video w-full overflow-hidden">
                    {article.featuredImage && (
                        <Image
                            src={article.featuredImage}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        />
                    )}
                    <div
                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg text-black font-mono uppercase tracking-widest"
                        style={{ backgroundColor: color }}
                    >
                        {character?.name || article.section}
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                        <Calendar size={14} />
                        <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    <h3 className="font-display text-xl mb-3 text-white flex-1 transition-colors line-clamp-3">{article.title}</h3>

                    <div className="flex items-center gap-2 text-sm font-bold mt-4" style={{ color }}>
                        <span className='text-white'>Leer artículo</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-white" />
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative w-full h-[55vh] md:h-[65vh] lg:h-[85vh] overflow-hidden mt-0 group">
                {/* Desktop Hero */}
                <Image
                    src="/hero/desk.png"
                    alt="La Manada Bífido"
                    fill
                    sizes="100vw"
                    className="hidden lg:block object-cover object-bottom"
                    priority
                />
                {/* Mobile/Tablet Hero */}
                <Image
                    src="/hero/movil.png"
                    alt="La Manada Bífido"
                    fill
                    sizes="100vw"
                    className="block lg:hidden object-cover object-[center_90%] md:object-[center_70%]"
                    priority
                />

                {/* Explora el Parche Button - Inside Hero */}
                <div className="absolute bottom-4 md:bottom-6 lg:bottom-2 left-1/2 -translate-x-1/2 z-20 w-fit">
                    <Link href="/elparche" className="group/btn relative inline-block">
                        <div className="absolute -inset-1 rounded-full blur opacity-25 group-hover/btn:opacity-100 transition duration-1000 group-hover/btn:duration-200"></div>
                        <div className="relative flex items-center gap-3 md:gap-6 px-6 md:px-8 py-2 md:py-3 bg-black/40 backdrop-blur-sm border-2 border-[#fe5e00] rounded-full font-display text-xl md:text-3xl text-white transition-all duration-300 group-hover/btn:border-[#fe5e00] group-hover/btn:scale-105 active:scale-95 group-hover/btn:bg-black/60 whitespace-nowrap">
                            CONOCE EL PARCHE
                            <Image
                                src="/icons/arrow_o.svg"
                                alt="arrow"
                                width={32}
                                height={28}
                                className="w-7 h-6 object-contain md:w-[32px] md:h-[28px] transition-transform duration-300 group-hover/btn:translate-x-2 animate-pulse"
                            />
                        </div>
                    </Link>
                </div>

                {/* Shadow Gradient at the Bottom of Hero */}
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            </section>

            {/* Separator */}
            <div className="w-full flex justify-center py-4 md:py-8 bg-black relative z-10">
                <div className="w-[90%] md:w-[70%] h-[1px] bg-gradient-to-r from-transparent via-bifido-neon/20 to-transparent blur-[0.5px]"></div>
            </div>

            {/* Featured Articles Section */}
            {featuredArticles.length > 0 && (
                <section className="pt-12 pb-8 bg-black relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-4 mb-12 justify-center">
                            <Star className="text-white" size={32} />
                            <h2 className="font-display text-4xl text-white tracking-widest uppercase">Destacados</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredArticles.map((article: any) => renderArticleCard(article))}
                        </div>
                    </div>
                </section>
            )}

            {/* Recent Articles Section */}
            <section className="pt-8 pb-20 md:pt-16 bg-black relative z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-12 justify-center">
                        <Clock className="text-white" size={32} />
                        <h2 className="font-display text-4xl text-white tracking-widest uppercase">Lo más fresquito</h2>
                    </div>

                    <div ref={recentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentArticles.map((article: any) => renderArticleCard(article))}
                    </div>

                    {recentArticles.length === 0 && (
                        <p className="text-center text-gray-500 mt-8">Pronto podrás informarte de lo más reciente.</p>
                    )}
                </div>
            </section>

            {/* Contact CTA Section */}
            <section className="pb-32 pt-24 relative overflow-hidden bg-black">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center grayscale brightness-[0.25] opacity-90"
                    style={{ backgroundImage: "url('/backgrounds/snake_scale.jpg')" }}
                ></div>
                {/* Gradients to fade in/out */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-0"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="font-display text-4xl md:text-7xl text-white mb-8 drop-shadow-lg">
                        ¿TIENES ALGO QUE <span className="text-bifido-neon">CONTAR</span>?
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-14 text-lg md:text-2xl font-googlesans leading-relaxed px-4 drop-shadow-md">
                        Estamos siempre buscando nuevas voces y parches para visibilizar lo que pasa en la calle. No te quedes con las ganas.
                    </p>
                    <Link href="/contactanos" className="group relative inline-block">
                        <div className="relative flex items-center gap-6 px-8 py-3 bg-bifido-neon text-black rounded-full font-display text-2xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap">
                            CONTÁCTANOS
                            <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
