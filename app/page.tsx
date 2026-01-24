'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mascots, getMascotBySlug } from '@/lib/mascots';
import { formatDate } from '@/lib/utils';
import { Article } from '@/types';
import gsap from 'gsap';
import { ArrowRight, Newspaper, Calendar, User, Star, Clock } from 'lucide-react';

// Mock data - En producción vendría del CMS
const getAllArticles = (): Article[] => {
    const allArticles: Article[] = [];

    mascots.forEach((mascot) => {
        // Artículos de ejemplo para cada sección
        const sectionArticles: Article[] = [
            {
                id: `${mascot.id}-1`,
                slug: 'articulo-destacado-1',
                title: `${mascot.section}: Una nueva perspectiva sobre la resistencia`,
                excerpt: 'Exploramos las formas contemporáneas de activismo y cómo están transformando nuestra sociedad.',
                content: '',
                author: mascot.name,
                publishedAt: '2024-11-15',
                featuredImage: '/images/placeholder-article.jpg',
                section: mascot.slug,
                mascotId: mascot.id,
                featured: mascot.id === 'incendia' || mascot.id === 'punkibri',
            },
            {
                id: `${mascot.id}-2`,
                slug: 'articulo-reciente-1',
                title: `Voces desde ${mascot.section}`,
                excerpt: 'Historias que necesitan ser contadas, perspectivas que merecen ser escuchadas.',
                content: '',
                author: 'Equipo Bífido',
                publishedAt: '2024-11-12',
                featuredImage: '/images/placeholder-article.jpg',
                section: mascot.slug,
                mascotId: mascot.id,
                featured: mascot.id === 'mordaz',
            },
        ];
        allArticles.push(...sectionArticles);
    });

    return allArticles;
};

export default function HomePage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const mascotsRef = useRef<HTMLDivElement>(null);
    const featuredRef = useRef<HTMLDivElement>(null);
    const recentRef = useRef<HTMLDivElement>(null);

    const allArticles = getAllArticles();
    const featuredArticles = allArticles.filter(a => a.featured).slice(0, 3);
    const recentArticles = allArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 6);

    useEffect(() => {
        // Hero animation
        if (heroRef.current) {
            gsap.fromTo(
                heroRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
            );
        }

        // Mascots animation
        if (mascotsRef.current) {
            gsap.fromTo(
                mascotsRef.current.children,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)', delay: 0.5 }
            );
        }

        // Featured articles animation
        if (featuredRef.current) {
            gsap.fromTo(
                featuredRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
            );
        }

        // Recent articles animation
        if (recentRef.current) {
            gsap.fromTo(
                recentRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
            );
        }
    }, []);

    return (
        <div className="min-h-screen bg-bifido-black">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-bifido-gray to-bifido-black opacity-50" />

                {/* <div ref={heroRef} className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-bifido-red rounded-full mb-6">
                        <Newspaper className="text-white" size={40} />
                    </div>

                    <h1 className="font-display text-6xl md:text-8xl mb-6 text-white">
                        REVISTA BÍFIDO
                    </h1>

                    <p className="text-2xl md:text-3xl text-bifido-lightgray italic mb-8 max-w-3xl mx-auto">
                        Periodismo crudo para sensibilidades frágiles
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/elparche"
                            className="group bg-white text-bifido-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                            Explora las secciones
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>

                        <Link
                            href="/contactanos"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-bifido-black transition-all"
                        >
                            Contáctanos
                        </Link>
                    </div>
                </div> */}
            </section>

            {/* Featured Articles Section */}
            <section className="py-20 bg-bifido-gray">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between mb-12">
                        <div>
                            <div className="flex flex-col items-center gap-3 mb-2">
                                <Star className="text-bifido-red" size={32} />
                                <h2 className="font-display text-4xl md:text-5xl text-white">
                                    Artículos Destacados
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div ref={featuredRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredArticles.map((article) => {
                            const mascot = getMascotBySlug(article.section);
                            if (!mascot) return null;

                            return (
                                <Link
                                    key={article.id}
                                    href={`/${article.section}/${article.slug}`}
                                    className="group relative bg-bifido-black rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-white"
                                >
                                    {/* Featured Badge */}
                                    <div className="absolute top-4 right-4 z-10 bg-bifido-red px-3 py-1 rounded-full flex items-center gap-1">
                                        <Star size={14} className="text-white fill-white" />
                                        <span className="text-xs font-bold text-white">Destacado</span>
                                    </div>

                                    {/* Image */}
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                background: `linear-gradient(135deg, ${mascot.color.dark} 0%, ${mascot.color.primary} 100%)`,
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div
                                                className="w-32 h-32 rounded-full opacity-20"
                                                style={{ backgroundColor: mascot.color.primary }}
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div
                                            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
                                            style={{ backgroundColor: mascot.color.primary }}
                                        >
                                            {mascot.section}
                                        </div>

                                        <h3 className="font-display text-2xl mb-3 text-white group-hover:opacity-80 transition-opacity line-clamp-2">
                                            {article.title}
                                        </h3>

                                        <p className="text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">
                                            {article.excerpt}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                            <div className="flex items-center gap-1">
                                                <User size={14} />
                                                <span>{article.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>{formatDate(article.publishedAt)}</span>
                                            </div>
                                        </div>

                                        {/* Read More */}
                                        <div className="flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all">
                                            <span style={{ color: mascot.color.primary }}>
                                                Leer artículo
                                            </span>
                                            <ArrowRight
                                                size={16}
                                                style={{ color: mascot.color.primary }}
                                                className="group-hover:translate-x-1 transition-transform"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Recent Articles Section */}
            <section className="py-20 bg-bifido-black">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between mb-12">
                        <div>
                            <div className="flex flex-col items-center gap-3 mb-2">
                                <Clock className="text-bifido-red" size={32} />
                                <h2 className="font-display text-4xl md:text-5xl text-white">
                                    Artículos Recientes
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div ref={recentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentArticles.map((article) => {
                            const mascot = getMascotBySlug(article.section);
                            if (!mascot) return null;

                            return (
                                <Link
                                    key={article.id}
                                    href={`/${article.section}/${article.slug}`}
                                    className="group bg-bifido-gray rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-white"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <div
                                            className="absolute inset-0 opacity-20"
                                            style={{
                                                background: `linear-gradient(135deg, ${mascot.color.dark} 0%, ${mascot.color.primary} 100%)`,
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div
                                                className="w-24 h-24 rounded-full opacity-30"
                                                style={{ backgroundColor: mascot.color.primary }}
                                            />
                                        </div>

                                        {/* Category Badge */}
                                        <div
                                            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                                            style={{ backgroundColor: mascot.color.primary }}
                                        >
                                            {mascot.section}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="font-display text-xl mb-2 text-white group-hover:opacity-80 transition-opacity line-clamp-2">
                                            {article.title}
                                        </h3>

                                        <p className="text-gray-300 mb-3 line-clamp-2 text-sm leading-relaxed">
                                            {article.excerpt}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                            <div className="flex items-center gap-1">
                                                <User size={12} />
                                                <span>{article.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                <span>{formatDate(article.publishedAt)}</span>
                                            </div>
                                        </div>

                                        {/* Read More */}
                                        <div className="flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all">
                                            <span style={{ color: mascot.color.primary }}>
                                                Leer más
                                            </span>
                                            <ArrowRight
                                                size={14}
                                                style={{ color: mascot.color.primary }}
                                                className="group-hover:translate-x-1 transition-transform"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/elparche"
                            className="inline-flex items-center gap-2 text-white hover:text-bifido-red transition-colors font-bold text-lg"
                        >
                            Ver todas las secciones
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mascots Section */}
            <section className="py-20 bg-bifido-gray">
                <div className="container mx-auto px-4">
                    <h2 className="font-display text-4xl md:text-5xl text-center mb-4 text-white">
                        Conoce el parche
                    </h2>
                    <p className="text-center text-bifido-lightgray text-lg mb-12 max-w-2xl mx-auto">
                        Cada sección tiene su propia voz, su propia perspectiva, su propia lucha
                    </p>

                    <div ref={mascotsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                        {mascots.map((mascot) => (
                            <Link
                                key={mascot.id}
                                href={`/${mascot.slug}`}
                                className="group relative bg-bifido-black rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-white"
                                style={{
                                    ['--mascot-color' as string]: mascot.color.primary,
                                }}
                            >
                                {/* Image */}
                                <div className="relative h-64 w-full overflow-hidden bg-gradient-to-b from-transparent to-black/50">
                                    <Image
                                        src={mascot.image}
                                        alt={mascot.name}
                                        fill
                                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="font-display text-2xl mb-2 text-white group-hover:text-[var(--mascot-color)] transition-colors">
                                        {mascot.name}
                                    </h3>
                                    <p className="text-sm font-bold mb-3" style={{ color: mascot.color.primary }}>
                                        {mascot.section}
                                    </p>
                                    <p className="text-gray-300 text-sm line-clamp-3">
                                        {mascot.description}
                                    </p>
                                </div>

                                {/* Hover indicator */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--mascot-color)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/elparche"
                            className="inline-flex items-center gap-2 text-white hover:text-bifido-red transition-colors font-bold text-lg"
                        >
                            Ver todas las secciones
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-bifido-black">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display text-4xl md:text-5xl mb-6 text-white">
                        Únete a la conversación
                    </h2>
                    <p className="text-bifido-lightgray text-lg mb-8 max-w-2xl mx-auto">
                        Bífido es más que una revista. Es una comunidad de voces que se niegan a ser silenciadas.
                    </p>
                    <Link
                        href="/contactanos"
                        className="inline-block bg-bifido-red text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-all"
                    >
                        Contáctanos
                    </Link>
                </div>
            </section>
        </div>
    );
}
