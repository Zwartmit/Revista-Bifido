'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { getCharacterColors } from '@/lib/character-colors';
import ArticleFilters from '../ArticleFilters';
import FeaturedCarousel from '../FeaturedCarousel';
import SupportBanner from '../SupportBanner';

interface Props {
    section: string;
    character: any;
    articles: any[];
    categories?: any[];
}

export default function AnikaPage({ section, character, articles, categories = [] }: Props) {
    const heroRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentCategory, setCurrentCategory] = useState('');

    const filteredArticles = articles.filter(article => {
        if (currentCategory) {
            const hasCat = article.categories?.some((c: any) => 
                c === currentCategory || c.slug === currentCategory
            );
            if (!hasCat) return false;
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const title = article.title?.toLowerCase() || '';
            const excerpt = article.excerpt?.toLowerCase() || '';
            if (!title.includes(q) && !excerpt.includes(q)) return false;
        }
        return true;
    });

    const featuredArticles = filteredArticles.filter((a: any) => a.characterFeatured);
    const featuredArticleIds = featuredArticles.map((a: any) => a.id);
    const regularArticles = filteredArticles.filter((a: any) => !featuredArticleIds.includes(a.id));
    const { primary, dark } = getCharacterColors(character.slug);

    useEffect(() => {
        window.scrollTo(0, 0);
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

            {/* ── MANIFESTO STRIP ── */}
            <div className="px-6 sm:px-10 lg:px-16 xl:px-24 py-10 border-b border-[#1a1a1a]">
                <blockquote className="font-display text-2xl sm:text-3xl text-white/20 uppercase leading-snug max-w-2xl"
                    style={{ borderLeft: `4px solid ${primary}`, paddingLeft: '1.5rem' }}>
                    Reducción de riesgos. Información sin juicio. Cuidado colectivo.
                </blockquote>
            </div>

            {/* ── PUBLICACIONES ── */}
            <div className="px-6 sm:px-10 lg:px-16 xl:px-24 py-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-6 h-[3px]" style={{ backgroundColor: primary }} />
                    <span className="font-display text-3xl tracking-[0.25em] uppercase">Muda de Piel</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* FILTERS */}
                <ArticleFilters 
                    categories={categories} 
                    primaryColor={primary} 
                    currentCategory={currentCategory}
                    onFilterChange={(s, c) => {
                        setSearchQuery(s);
                        setCurrentCategory(c);
                    }}
                />

                {filteredArticles.length === 0 ? (
                    <div className="text-center py-28 border border-[#1e1e1e]">
                        <p className="font-display text-3xl text-white/10 tracking-widest uppercase">Sin publicaciones aún</p>
                    </div>
                ) : (
                    <>
                        {/* Featured */}
                        {featuredArticles.length > 0 && (
                            <FeaturedCarousel
                                articles={featuredArticles}
                                section={section}
                                primaryColor={primary}
                                darkColor={dark}
                                letter={character.name[0]}
                            />
                        )}

                        {/* Grid layout */}
                        {regularArticles.length > 0 && (
                            <div ref={listRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {regularArticles.map((article) => (
                                    <Link key={article.id} href={`/${section}/articulos/${article.slug}`}
                                        className="group flex flex-col border border-[#1e1e1e] hover:border-white/20 transition-all duration-300 overflow-hidden bg-[#080808]">
                                        <div className="relative w-full aspect-[4/3] overflow-hidden">
                                            {article.featuredImage ? (
                                                <Image src={article.featuredImage} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${dark}30` }}>
                                                    <span className="font-display text-4xl opacity-20" style={{ color: primary }}>{character.name[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <span className="font-googlesans text-xs text-white/30 tracking-wider block mb-2">
                                                {formatDate(article.publishedAt)}
                                            </span>
                                            <h3 className="font-display text-2xl text-white uppercase leading-[1.1] pt-1 mb-4 group-hover:text-white/80 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <div className="mt-auto flex items-center gap-2 font-googlesans text-sm font-medium" style={{ color: primary }}>
                                                <span>Leer artículo</span>
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── SUPPORT BANNER ── */}
            <SupportBanner primaryColor={primary} />
        </div>
    );
}
