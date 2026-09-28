'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ArrowRight, ArrowLeft, Mic, Film, ImageIcon } from 'lucide-react';
import gsap from 'gsap';
import { getCharacterColors } from '@/lib/character-colors';

interface Props {
    section: string;
    character: any;
    articles: any[];
}

export default function IncendiaPage({ section, character, articles }: Props) {
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

    const mediaTypes = [
        { icon: <Mic size={28} />, label: 'Podcast', desc: 'Episodios de audio sobre género y diversidad' },
        { icon: <ImageIcon size={28} />, label: 'Galería', desc: 'Colecciones visuales y collage digital' },
        { icon: <Film size={28} />, label: 'Video', desc: 'Documentales y cobertura multimedia' },
    ];

    return (
        <div className="min-h-screen bg-black text-white">

            {/* ── HERO ── */}
            <div
                ref={heroRef}
                className="relative w-full min-h-[75vh] flex items-end overflow-hidden"
                style={{ background: `linear-gradient(150deg, ${dark}50 0%, #000 60%)` }}
            >
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 55% 65% at 68% 50%, ${primary}20 0%, transparent 70%)` }} />

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

            {/* ── MULTIMEDIA CAPSULES ── */}
            <div className="px-6 sm:px-10 lg:px-16 xl:px-24 py-14 border-b border-[#1a1a1a]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {mediaTypes.map((m) => (
                        <div key={m.label} className="flex items-center gap-4 border border-[#1e1e1e] p-5 hover:border-white/20 transition-colors">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${primary}20`, color: primary }}>
                                {m.icon}
                            </div>
                            <div>
                                <p className="font-display text-sm tracking-widest uppercase text-white">{m.label}</p>
                                <p className="font-googlesans text-xs text-white/30 leading-snug mt-1">{m.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── PUBLICACIONES ── */}
            <div className="px-6 sm:px-10 lg:px-16 xl:px-24 py-20">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-6 h-[3px]" style={{ backgroundColor: primary }} />
                    <span className="font-display text-3xl tracking-[0.25em] uppercase">Fuegos Diversos</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                {articles.length === 0 ? (
                    <div className="text-center py-28 border border-[#1e1e1e]">
                        <p className="font-display text-3xl text-white/10 tracking-widest uppercase">Sin publicaciones aún</p>
                    </div>
                ) : (
                    <>
                        {featuredArticle && (
                            <Link href={`/${section}/articulos/${featuredArticle.slug}`}
                                className="group block mb-14 border border-[#1e1e1e] hover:border-white/20 transition-colors duration-300 overflow-hidden">
                                <div className="flex flex-col lg:flex-row">
                                    <div className="relative w-full lg:w-[55%] aspect-[16/9] lg:min-h-[360px] overflow-hidden flex-shrink-0">
                                        {featuredArticle.featuredImage ? (
                                            <Image src={featuredArticle.featuredImage} alt={featuredArticle.title} fill sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${dark}60` }}>
                                                <span className="font-display text-[8rem] opacity-10" style={{ color: primary }}>F</span>
                                            </div>
                                        )}
                                        <span className="absolute top-4 left-4 font-display text-[10px] tracking-[0.4em] px-3 py-1 uppercase"
                                            style={{ backgroundColor: primary, color: '#000' }}>Destacado</span>
                                    </div>
                                    <div className="flex flex-col justify-between p-8 lg:p-12 bg-[#080808] flex-1">
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

                        {regularArticles.length > 0 && (
                            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {regularArticles.map((article) => (
                                    <Link key={article.id} href={`/${section}/articulos/${article.slug}`}
                                        className="group flex flex-col border border-[#1e1e1e] hover:border-white/20 transition-all duration-300 overflow-hidden bg-[#080808]">
                                        <div className="relative w-full aspect-[4/3] overflow-hidden">
                                            {article.featuredImage ? (
                                                <Image src={article.featuredImage} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${dark}40` }}>
                                                    <span className="font-display text-5xl opacity-10" style={{ color: primary }}>F</span>
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

            {/* ── ESPECIAL 8M ── */}
            <div className="px-6 sm:px-10 lg:px-16 xl:px-24 pb-20">
                <div className="border border-[#1e1e1e] p-8 sm:p-12" style={{ borderTopColor: `${primary}40` }}>
                    <span className="font-display text-xs tracking-[0.5em] uppercase mb-3 block" style={{ color: primary }}>
                        Especial
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl text-white uppercase mb-4">
                        Conmemoración 8M
                    </h2>
                    <p className="font-googlesans text-gray-500 text-base md:text-lg leading-relaxed max-w-xl">
                        Cobertura especial del Día Internacional de la Mujer con podcast, galería y video documental. Próximamente.
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
