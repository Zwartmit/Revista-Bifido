'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { getCharacterColors } from '@/lib/character-colors';

interface Props {
    section: string;
    character: any;
    articles: any[];
}

export default function MordazPage({ section, character, articles }: Props) {
    const heroRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const featuredArticle = articles[0] || null;
    const regularArticles = articles.slice(1);
    const { primary, dark } = getCharacterColors(character.slug);

    useEffect(() => {
        gsap.fromTo(
            heroRef.current?.querySelectorAll('.ha') || [],
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        );
        if (gridRef.current?.children.length) {
            gsap.fromTo(
                gridRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.3 }
            );
        }
    }, [character.id]);

    return (
        <div className="min-h-screen bg-black text-white">

            {/* ── HERO ── */}
            <div
                ref={heroRef}
                className="relative w-full min-h-[75vh] flex items-end overflow-hidden"
                style={{ background: `linear-gradient(150deg, ${dark}50 0%, #000 60%)` }}
            >
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 55% 65% at 68% 50%, ${primary}18 0%, transparent 70%)` }} />

                {character.image && (
                    <div className="absolute inset-y-0 right-0 w-[50%] lg:w-[42%] flex items-end justify-center pointer-events-none">
                        <Image src={character.image} alt={character.name} width={560} height={720}
                            className="object-contain object-bottom w-full h-full max-h-[85vh] drop-shadow-[0_0_50px_rgba(0,0,0,0.95)]" priority />
                    </div>
                )}

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
                    <span className="font-display text-3xl tracking-[0.25em] uppercase">Manifiesto</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                {articles.length === 0 ? (
                    <div className="text-center py-28 border border-[#1e1e1e]">
                        <p className="font-display text-3xl text-white/10 tracking-widest uppercase">Sin publicaciones aún</p>
                    </div>
                ) : (
                    <>
                        {/* Featured — El Nacimiento style */}
                        {featuredArticle && (
                            <Link href={`/${section}/articulos/${featuredArticle.slug}`}
                                className="group block mb-14 overflow-hidden"
                                style={{ border: `1px solid ${primary}30` }}>
                                <div className="flex flex-col lg:flex-row">
                                    <div className="relative w-full lg:w-[55%] aspect-[16/9] lg:min-h-[380px] overflow-hidden flex-shrink-0">
                                        {featuredArticle.featuredImage ? (
                                            <Image src={featuredArticle.featuredImage} alt={featuredArticle.title} fill
                                                className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${dark}40` }}>
                                                <span className="font-display text-[8rem] opacity-10" style={{ color: primary }}>M</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                                        <span className="absolute top-4 left-4 font-display text-[10px] tracking-[0.4em] px-3 py-1 uppercase"
                                            style={{ backgroundColor: primary, color: '#000' }}>El origen</span>
                                    </div>
                                    <div className="flex flex-col justify-between p-8 lg:p-12 bg-[#050505] flex-1"
                                        style={{ borderLeft: `2px solid ${primary}20` }}>
                                        <div>
                                            <span className="font-googlesans text-sm text-white/40 block mb-4">
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

                        {/* Grid */}
                        {regularArticles.length > 0 && (
                            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {regularArticles.map((article) => (
                                    <Link key={article.id} href={`/${section}/articulos/${article.slug}`}
                                        className="group flex flex-col border border-[#1e1e1e] hover:border-white/20 transition-all duration-300 overflow-hidden bg-[#080808]"
                                        style={{ borderLeftWidth: 2, borderLeftColor: `${primary}30` }}>
                                        <div className="relative w-full aspect-[4/3] overflow-hidden">
                                            {article.featuredImage ? (
                                                <Image src={article.featuredImage} alt={article.title} fill
                                                    className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${dark}30` }}>
                                                    <span className="font-display text-5xl opacity-10" style={{ color: primary }}>M</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 p-5">
                                            <span className="font-googlesans text-xs text-white/30 tracking-wider mb-2 block">
                                                {formatDate(article.publishedAt)}
                                            </span>
                                            <h3 className="font-display text-2xl text-white uppercase leading-tight mb-3 flex-1 group-hover:text-white/70 transition-colors">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm font-googlesans font-medium mt-auto" style={{ color: primary }}>
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

            {/* ── ESPECIAL: PARO 2021 ── */}
            <div className="px-6 sm:px-10 lg:px-16 xl:px-24 pb-20">
                <div className="relative overflow-hidden border border-[#1e1e1e] p-8 sm:p-12"
                    style={{ borderTopWidth: 3, borderTopColor: primary }}>
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-5 pointer-events-none"
                        style={{ background: `radial-gradient(circle, ${primary} 0%, transparent 70%)` }} />
                    <span className="font-display text-xs tracking-[0.5em] uppercase mb-3 block" style={{ color: primary }}>
                        Especial — Cubrimiento
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl text-white uppercase mb-4">
                        Paro Nacional 2021 · Boyacá
                    </h2>
                    <p className="font-googlesans text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl">
                        Artivismo y resistencia colectiva. Registro y análisis del paro nacional desde Boyacá.
                        Incluye guías ciudadanas, columnas de opinión y documentales. Próximamente.
                    </p>
                </div>
            </div>

            {/* ── SUPPORT BANNER ── */}
            <div className="mx-6 sm:mx-10 lg:mx-16 xl:mx-24 mb-20 border border-[#1e1e1e]"
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
