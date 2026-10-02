'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { getCharacterColors } from '@/lib/character-colors';
import ArticleFilters from '../ArticleFilters';

interface Props {
    section: string;
    character: any;
    articles: any[];
    categories?: any[];
}

export default function MalandraPage({ section, character, articles, categories = [] }: Props) {
    const heroRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const featuredArticle = articles.find((a: any) => a.characterFeatured) || null;
    const regularArticles = articles.filter((a: any) => a.id !== featuredArticle?.id);
    const { primary, dark } = getCharacterColors(character.slug);

    useEffect(() => {
        gsap.fromTo(
            heroRef.current?.querySelectorAll('.ha') || [],
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        );
        if (listRef.current?.children.length) {
            gsap.fromTo(
                listRef.current.children,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', delay: 0.4 }
            );
        }
    }, [character.id]);

    return (
        <div className="min-h-screen bg-black text-white">

            {/* ── HERO ── */}
            <div
                ref={heroRef}
                className="relative w-full min-h-[75vh] flex items-end overflow-hidden"
                style={{ background: `linear-gradient(150deg, ${dark}60 0%, #000 60%)` }}
            >
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 55% 65% at 68% 50%, ${primary}20 0%, transparent 70%)` }} />

                {/* Character image */}
                <div className="absolute inset-y-0 right-0 w-[50%] lg:w-[42%] flex items-end justify-center pointer-events-none">
                    {character.image && (
                        <Image src={character.image} alt={character.name} width={560} height={720}
                            className="object-contain object-bottom w-full h-full max-h-[85vh] drop-shadow-[0_0_50px_rgba(0,0,0,0.95)]" priority />
                    )}
                </div>

                <div className="relative z-10 w-full lg:w-[58%] px-6 sm:px-10 lg:px-16 xl:px-24 pb-32 pt-20 xl:pb-48">
                    <Link href="/elparche" className="ha inline-flex items-center gap-2 font-googlesans text-xs tracking-[0.25em] text-white/40 hover:text-white/70 uppercase mb-10 transition-colors">
                        <ArrowLeft size={14} /> Volver a El Parche
                    </Link>
                    <h1 className="ha font-display text-6xl sm:text-7xl lg:text-8xl text-white leading-none mb-4 uppercase">
                        {character.name}
                    </h1>
                    <div className="ha w-16 h-[3px] mb-6" style={{ backgroundColor: primary }} />
                    <p className="ha font-googlesans text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
                        {character.description}
                    </p>
                    <span className="ha inline-block font-display text-xs tracking-[0.3em] uppercase px-4 py-2 border"
                        style={{ borderColor: `${primary}50`, color: primary }}>
                        {articles.length} publicaciones
                    </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </div>

            {/* ── PUBLICACIONES ── */}
            <div className="px-6 sm:px-10 lg:px-16 xl:px-24 py-20">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-6 h-[3px]" style={{ backgroundColor: primary }} />
                    <span className="font-display text-3xl tracking-[0.25em] uppercase">Mala Fama</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                {articles.length === 0 ? (
                    <div className="text-center py-28 border border-[#1e1e1e]">
                        <p className="font-display text-3xl text-white/10 tracking-widest uppercase">Sin publicaciones aún</p>
                    </div>
                ) : (
                    <>
                        {/* Featured */}
                        {featuredArticle && (
                            <Link href={`/${section}/articulos/${featuredArticle.slug}`}
                                className="group block mb-12 border border-[#1e1e1e] hover:border-white/20 transition-colors duration-300 overflow-hidden">
                                <div className="flex flex-col lg:flex-row">
                                    <div className="relative w-full lg:w-[55%] aspect-[16/9] lg:min-h-[340px] overflow-hidden flex-shrink-0">
                                        {featuredArticle.featuredImage ? (
                                            <Image src={featuredArticle.featuredImage} alt={featuredArticle.title} fill sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${dark}60` }}>
                                                <span className="font-display text-[8rem] opacity-10" style={{ color: primary }}>M</span>
                                            </div>
                                        )}
                                        <span className="absolute top-4 left-4 font-display text-[10px] tracking-[0.4em] px-3 py-1 uppercase"
                                            style={{ backgroundColor: primary, color: '#000' }}>Destacado</span>
                                    </div>
                                    <div className="flex flex-col justify-between p-8 lg:p-12 bg-[#080808] flex-1">
                                        <div>
                                            <span className="font-googlesans text-sm text-white/40 tracking-wider block mb-4">
                                                {formatDate(featuredArticle.publishedAt)}
                                            </span>
                                            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-tight mb-5">
                                                {featuredArticle.title}
                                            </h2>
                                            {featuredArticle.excerpt && (
                                                <p className="font-googlesans text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3">
                                                    {featuredArticle.excerpt}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-8 font-googlesans text-base font-medium" style={{ color: primary }}>
                                            <span>Leer artículo</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Article list — horizontal layout */}
                        {regularArticles.length > 0 && (
                            <div ref={listRef} className="flex flex-col gap-4">
                                {regularArticles.map((article) => (
                                    <Link key={article.id} href={`/${section}/articulos/${article.slug}`}
                                        className="group flex items-center gap-5 border border-[#1e1e1e] hover:border-white/20 transition-all duration-300 overflow-hidden bg-[#080808] p-4">
                                        {/* Thumbnail */}
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-24 flex-shrink-0 overflow-hidden">
                                            {article.featuredImage ? (
                                                <Image src={article.featuredImage} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover opacity-60 group-hover:opacity-90 transition-all duration-400" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${dark}40` }}>
                                                    <span className="font-display text-3xl opacity-20" style={{ color: primary }}>M</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="font-googlesans text-xs text-white/30 tracking-wider block mb-1">
                                                {formatDate(article.publishedAt)}
                                            </span>
                                            <h3 className="font-display text-xl text-white uppercase leading-tight group-hover:text-white/70 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                        </div>
                                        <ArrowRight size={18} className="flex-shrink-0 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── EVENTOS Y LA MANADA ── */}
            <div className="px-6 sm:px-10 lg:px-16 xl:px-24 pb-20">
                <div className="border border-[#1e1e1e] p-8 sm:p-12" style={{ borderTopColor: `${primary}30` }}>
                    <span className="font-display text-xs tracking-[0.5em] uppercase mb-3 block" style={{ color: primary }}>
                        La comunidad
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl text-white uppercase mb-6">
                        Eventos & La Manada
                    </h2>
                    <p className="font-googlesans text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl">
                        Recaps, festivales, emprendimientos y la escena local que documenta Malandra. Próximamente.
                    </p>
                </div>
            </div>

            {/* ── SUPPORT BANNER ── */}
            <div className="mx-6 sm:mx-10 lg:mx-16 xl:mx-24 mb-20 border border-[#1e1e1e] overflow-hidden"
                style={{ borderTopColor: `${primary}40` }}>
                <div className="p-10 sm:p-14 text-center bg-[#080808]">
                    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white uppercase mb-4 leading-tight">
                        Apoya el periodismo libre
                    </h2>
                    <p className="font-googlesans text-gray-500 max-w-lg mx-auto mb-8 text-base md:text-lg leading-relaxed">
                        Bífido existe porque hay personas que creen en el periodismo crudo y honesto.
                    </p>
                    <a href="#" className="inline-block font-display tracking-[0.25em] text-black text-base px-8 py-4 uppercase hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: primary }}>
                        Colaborar
                    </a>
                </div>
            </div>
        </div>
    );
}
