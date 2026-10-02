'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { getCharacterColors } from '@/lib/character-colors';
import ArticleFilters from './ArticleFilters';

interface SectionClientProps {
    section: string;
    character: any;
    articles: any[];
    categories?: any[];
}

export default function SectionClient({ section, character, articles, categories = [] }: SectionClientProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const featuredArticle = articles.find((a: any) => a.characterFeatured) || null;
    const regularArticles = articles.filter((a: any) => a.id !== featuredArticle?.id);

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
                        {featuredArticle && (
                            <Link
                                href={`/${section}/articulos/${featuredArticle.slug}`}
                                className="group block mb-14 border border-[#1e1e1e] hover:border-white/20 transition-colors duration-300 overflow-hidden"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Image */}
                                    <div className="relative w-full lg:w-[55%] aspect-[16/9] lg:aspect-auto lg:min-h-[380px] overflow-hidden flex-shrink-0">
                                        {featuredArticle.featuredImage ? (
                                            <Image
                                                src={featuredArticle.featuredImage}
                                                alt={featuredArticle.title}
                                                fill
                                                className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center"
                                                style={{ backgroundColor: `${darkColor}60` }}
                                            >
                                                <span
                                                    className="font-display text-[8rem] leading-none opacity-10"
                                                    style={{ color: primaryColor }}
                                                >
                                                    B
                                                </span>
                                            </div>
                                        )}
                                        {/* DESTACADO badge */}
                                        <span
                                            className="absolute top-4 left-4 font-display text-[10px] tracking-[0.4em] px-3 py-1 uppercase"
                                            style={{ backgroundColor: primaryColor, color: '#000' }}
                                        >
                                            Destacado
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col justify-between p-8 lg:p-12 bg-[#080808] flex-1">
                                        <div>
                                            <span className="font-googlesans text-sm text-white/40 tracking-wider block mb-4">
                                                {formatDate(featuredArticle.publishedAt)}
                                            </span>
                                            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6 uppercase group-hover:text-white/80 transition-colors">
                                                {featuredArticle.title}
                                            </h2>
                                            {featuredArticle.excerpt && (
                                                <p className="font-googlesans text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3">
                                                    {featuredArticle.excerpt}
                                                </p>
                                            )}
                                        </div>
                                        <div
                                            className="flex items-center gap-2 mt-8 font-googlesans text-base font-medium"
                                            style={{ color: primaryColor }}
                                        >
                                            <span>Leer artículo</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
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
                                            <h3 className="font-display text-2xl text-white uppercase leading-tight mb-3 flex-1 group-hover:text-white/70 transition-colors">
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
            <div
                className="mx-6 sm:mx-10 lg:mx-16 xl:mx-24 mb-20 border border-[#1e1e1e] overflow-hidden"
                style={{ borderTopColor: `${primaryColor}40` }}
            >
                <div className="p-10 sm:p-14 text-center bg-[#080808]">
                    <span
                        className="font-display text-xs tracking-[0.5em] uppercase block mb-4"
                        style={{ color: primaryColor }}
                    >
                        Periodismo independiente
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white uppercase mb-4 leading-tight">
                        Apoya el periodismo libre
                    </h2>
                    <p className="font-googlesans text-gray-500 max-w-lg mx-auto mb-8 text-base md:text-lg leading-relaxed">
                        Bífido existe porque hay personas que creen en el periodismo crudo y honesto.
                        Si lo que lees te mueve, considera apoyarnos.
                    </p>
                    <a
                        href="#"
                        className="inline-block font-display tracking-[0.25em] text-black text-base px-8 py-4 uppercase hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Colaborar
                    </a>
                </div>
            </div>

        </div>
    );
}
