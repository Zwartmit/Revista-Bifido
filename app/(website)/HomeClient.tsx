'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
// import { Article } from '@/types'; // Removing explicit type import to direct usage or let inference handle it if needed
import gsap from 'gsap';
import { ArrowRight, Newspaper, Calendar, Clock } from 'lucide-react';
import { getCharacterBySlug } from '@/lib/characters'; // Still using local helper for character colors/info if applicable, or pass from server?

// Interface for props
interface HomeClientProps {
    articles: any[]; // Replace with correct Article type
    characters: any[];
}

export default function HomeClient({ articles, characters }: HomeClientProps) {
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

    // Helper to get character data (color, etc) from the passed characters list
    const getCharacter = (slug: string) => characters.find((m: any) => m.slug === slug) || characters[0];

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative w-full h-[55vh] md:h-[65vh] lg:h-[85vh] overflow-hidden mt-0 group">
                {/* Desktop Hero */}
                <Image
                    src="/hero/desk.png"
                    alt="La Manada Bífido"
                    fill
                    className="hidden lg:block object-cover object-bottom"
                    priority
                />
                {/* Mobile/Tablet Hero */}
                <Image
                    src="/hero/movil.png"
                    alt="La Manada Bífido"
                    fill
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
                                width={28}
                                height={24}
                                className="object-contain md:w-[32px] md:h-[28px] transition-transform duration-300 group-hover/btn:translate-x-2 animate-pulse"
                            />
                        </div>
                    </Link>
                </div>

                {/* Shadow Gradient at the Bottom of Hero */}
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            </section>

            {/* La Manada Section (Currently Hidden/Commented Characters) */}
            <section id="la-manada" className="pb-0 relative bg-black">
                {/* Background Green Element */}
                <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none overflow-hidden flex justify-end">
                    <div className="w-[800px] h-[800px] bg-[url('/backgrounds/gradiente-verde.png')] bg-contain bg-right bg-no-repeat mix-blend-screen opacity-50 translate-x-1/4" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Characters Section - Hidden for now */}
                    {/*                     
                    <div className="flex justify-center flex-wrap gap-x-8 gap-y-12 items-end">
                        {characters.map((character: any, index: number) => {
                            ...
                        })}
                    </div>
                    */}
                </div>
            </section>

            {/* Separator */}
            <div className="w-full flex justify-center py-4 md:py-8 bg-black relative z-10">
                <div className="w-[90%] md:w-[70%] h-[1px] bg-gradient-to-r from-transparent via-bifido-neon/20 to-transparent blur-[0.5px]"></div>
            </div>

            {/* Recent Articles Section */}
            <section className="pt-8 pb-20 md:pt-16 bg-black relative z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-12 justify-center">
                        <Clock className="text-bifido-orange" size={32} />
                        <h2 className="font-display text-4xl text-white tracking-widest">LO MÁS FRESQUITO</h2>
                    </div>

                    <div ref={recentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentArticles.map((article: any) => {
                            const character = getCharacter(article.section);
                            const color = character?.color?.primary || '#CCFD29';

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
                                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-black shadow-lg text-white"
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

                                        <h3 className="font-display text-xl mb-3 text-white flex-1 group-hover:text-bifido-neon transition-colors">{article.title}</h3>

                                        <div className="flex items-center gap-2 text-sm font-bold mt-4" style={{ color }}>
                                            <span className='text-white'>Leer artículo</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-white" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
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
