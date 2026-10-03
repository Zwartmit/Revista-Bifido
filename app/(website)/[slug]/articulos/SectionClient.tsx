'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { getCharacterColors } from '@/lib/character-colors';
import ArticleFilters from './ArticleFilters';
import FeaturedCarousel from './FeaturedCarousel';
import SupportBanner from './SupportBanner';

interface SectionClientProps {
    section: string;
    character: any;
    articles: any[];
    categories?: any[];
}

export default function SectionClient({ section, character, articles, categories = [] }: SectionClientProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const featuredArticles = articles.filter((a: any) => a.characterFeatured);
    const featuredArticleIds = featuredArticles.map((a: any) => a.id);
    const regularArticles = articles.filter((a: any) => !featuredArticleIds.includes(a.id));

    useEffect(() => {
        const tl = gsap.timeline();

        if (heroRef.current) {
            tl.fromTo(
                heroRef.current.querySelectorAll('.hero-anim'),
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
            );
        }

        if (gridRef.current && gridRef.current.children.length > 0) {
            tl.fromTo(
                gridRef.current.children,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
                '-=0.3'
            );
        }
    }, [character.id]);

    if (!character) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Sección no encontrada</div>;

    const { primary: primaryColor, dark: darkColor } = getCharacterColors(character.slug);

    return (
        <div className="min-h-screen bg-black text-white">

            {/* ─── 1. CHARACTER HERO ─────────────────────────────────── */}
            <div
                ref={heroRef}
                className="relative w-full min-h-[75vh] flex items-end overflow-hidden"
                style={{
                    background: `linear-gradient(160deg, ${darkColor}80 0%, #000 55%)`,
                }}
            >
                {/* Radial glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse 60% 70% at 70% 50%, ${primaryColor}20 0%, transparent 70%)`,
                    }}
                />

                {/* Vertical neon stripe */}
                <div
                    className="absolute top-0 right-[38%] w-px h-full opacity-20 hidden lg:block"
                    style={{ backgroundColor: primaryColor }}
                />

                {/* Character image */}
                <div className="absolute inset-y-0 right-0 w-[55%] lg:w-[45%] flex items-end justify-center pointer-events-none">
                    {character.image && (
                        <Image
                            src={character.image}
                            alt={character.name}
                            width={600}
                            height={750}
                            className="object-contain object-bottom w-full h-full max-h-[85vh] drop-shadow-[0_0_60px_rgba(0,0,0,0.95)]"
                            priority
                        />
                    )}
                </div>

                {/* Text content */}
                <div className="relative z-10 w-full lg:w-[55%] px-6 sm:px-10 lg:px-16 xl:px-24 pb-32 pt-20 xl:pb-48">
                    {/* Back link */}
                    <Link
                        href="/elparche"
                        className="hero-anim inline-flex items-center gap-2 font-googlesans text-xs tracking-[0.25em] text-white/40 hover:text-white/70 uppercase mb-10 transition-colors"
                    >
                        <ArrowLeft size={14} /> Volver a El Parche
                    </Link>

                    {/* Section tag */}
                    <span
                        className="hero-anim block font-display text-xs tracking-[0.4em] uppercase mb-3"
                        style={{ color: primaryColor }}
                    >
                        {character.name}
                    </span>

                    {/* Character name */}
                    <h1 className="hero-anim font-display text-6xl sm:text-7xl lg:text-8xl text-white leading-none mb-5 uppercase">
                        {character.name}
                    </h1>

                    {/* Accent line */}
                    <div
                        className="hero-anim w-20 h-[3px] mb-6"
                        style={{ backgroundColor: primaryColor }}
                    />

                    {/* Description */}
                    <p className="hero-anim font-googlesans text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
                        {character.description}
                    </p>

                    {/* Article count pill */}
                    <div className="hero-anim flex items-center gap-3">
                        <span
                            className="font-display text-xs tracking-[0.3em] uppercase px-4 py-2 border"
                            style={{ borderColor: `${primaryColor}50`, color: primaryColor }}
                        >
                            {articles.length} {articles.length === 1 ? 'publicación' : 'publicaciones'}
                        </span>
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </div>

            {/* ─── 2. ARTICLES ───────────────────────────────────────── */}
            <div className="px-6 sm:px-10 lg:px-16 xl:px-24 py-20">

                {/* Section header */}
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-6 h-[3px]" style={{ backgroundColor: primaryColor }} />
                    <span className="font-display text-3xl tracking-[0.25em] text-white uppercase">
                        Publicaciones
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="font-googlesans text-white/30 text-sm tracking-widest">
                        {articles.length} artículos
                    </span>
                </div>

                {articles.length === 0 ? (
                    /* Empty state */
                    <div className="text-center py-28 border border-[#1e1e1e]">
                        <p className="font-display text-3xl text-white/10 tracking-widest uppercase mb-3">
                            Sin publicaciones aún
                        </p>
                        <p className="font-googlesans text-white/25 text-sm">
                            El contenido de {character.name} llegará pronto.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* ── Featured / Origin article ── */}
                        {featuredArticles.length > 0 && (
                            <FeaturedCarousel
                                articles={featuredArticles}
                                section={section}
                                primaryColor={primaryColor}
                                darkColor={darkColor}
                                letter={character.name[0]}
                            />
                        )}

                        {/* ── Regular articles grid ── */}
                        {regularArticles.length > 0 && (
                            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {regularArticles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/${section}/articulos/${article.slug}`}
                                        className="group flex flex-col border border-[#1e1e1e] hover:border-white/20 transition-all duration-300 overflow-hidden bg-[#080808]"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-full aspect-[4/3] overflow-hidden">
                                            {article.featuredImage ? (
                                                <Image
                                                    src={article.featuredImage}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                                                />
                                            ) : (
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center"
                                                    style={{ backgroundColor: `${darkColor}60` }}
                                                >
                                                    <span
                                                        className="font-display text-6xl opacity-10"
                                                        style={{ color: primaryColor }}
                                                    >
                                                        B
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-1 p-5">
                                            <span className="font-googlesans text-xs text-white/30 tracking-wider mb-2 block">
                                                {formatDate(article.publishedAt)}
                                            </span>
                                            <h3 className="font-display text-2xl text-white uppercase leading-[1.1] pt-1 mb-3 flex-1 group-hover:text-white/70 transition-colors">
                                                {article.title}
                                            </h3>
                                            {article.excerpt && (
                                                <p className="font-googlesans text-gray-500 text-base leading-relaxed line-clamp-2 mb-4">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                            <div
                                                className="flex items-center gap-2 text-sm font-googlesans font-medium mt-auto"
                                                style={{ color: primaryColor }}
                                            >
                                                <span>Leer</span>
                                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ─── 3. SUPPORT BANNER ─────────────────────────────────── */}
            <SupportBanner primaryColor={primaryColor} />

        </div>
    );
}
