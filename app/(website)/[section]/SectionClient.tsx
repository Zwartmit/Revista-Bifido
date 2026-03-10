'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
// import { Article } from '@/types'; 
import { Calendar, User, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

import { mascots as allMascots } from '@/lib/mascots';

interface SectionClientProps {
    section: string;
    mascot: any;
    articles: any[];
}

export default function SectionClient({ section, mascot, articles }: SectionClientProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const otherMascots = allMascots.filter((m) => m.id !== mascot.id);

    useEffect(() => {
        if (contentRef.current && contentRef.current.children.length > 0) {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, scale: 0.95, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [mascot.id]);

    if (!mascot) return <div>Section not found</div>;

    return (
        <div className="min-h-screen bg-black pt-24 md:pt-32 text-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">

                    {/* Left Sticky Grid - Other Characters */}
                    <div className="hidden md:block w-32 lg:w-48 flex-shrink-0">
                        <div className="sticky top-40 flex flex-col gap-4">
                            <h3 className="font-display text-bifido-neon tracking-wider mb-2">LA MANADA</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {allMascots.map((m) => (
                                    <Link
                                        href={`/${m.slug}`}
                                        key={m.id}
                                        className={`block aspect-square w-full relative group overflow-hidden border transition-colors ${m.id === mascot.id ? 'border-white' : 'border-transparent hover:border-gray-500'}`}
                                        style={{ backgroundColor: m.color?.dark || '#333' }}
                                    >
                                        <div className="absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" style={{ backgroundColor: m.color?.primary }} />
                                        {m.image && (
                                            <Image
                                                src={m.image}
                                                alt={m.name}
                                                fill
                                                className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Mascot Showcase */}
                    <div className="flex-1 flex flex-col gap-12 pb-24">

                        {/* Mascot Hero & Glass Card */}
                        <div className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center rounded-3xl overflow-hidden border border-gray-800">

                            {/* Radial Glow Background */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `radial-gradient(circle at center, ${mascot.color?.primary}40 0%, ${mascot.color?.dark}10 40%, transparent 70%)`
                                }}
                            />

                            {/* Mascot Image */}
                            <div className="absolute inset-x-0 bottom-0 h-full flex justify-center items-end" style={{ zIndex: 10 }}>
                                {mascot.image && (
                                    <Image
                                        src={mascot.image}
                                        alt={mascot.name}
                                        width={600}
                                        height={800}
                                        className="object-contain object-bottom w-[80%] md:w-[60%] lg:w-[50%] max-h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                                        priority
                                    />
                                )}
                            </div>

                            {/* Glassmorphism Bio Card */}
                            <div className="absolute bottom-4 left-4 right-4 md:bottom-10 md:left-10 md:w-96 z-20">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl">
                                    <h1 className="font-display text-3xl md:text-4xl mb-2" style={{ color: mascot.color?.primary }}>
                                        HOLA, SOY {mascot.name.toUpperCase()}
                                    </h1>
                                    <h2 className="text-gray-300 font-bold mb-4 tracking-wider text-sm uppercase">
                                        {mascot.section}
                                    </h2>
                                    <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                                        {mascot.description}
                                    </p>

                                    <div className="space-y-4 text-xs font-bold tracking-widest uppercase">
                                        <div>
                                            <div className="flex justify-between text-gray-400 mb-1">
                                                <span>Religión</span>
                                                <span className="text-white text-right">{mascot.religion}</span>
                                            </div>
                                            <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                                                <div className="h-full w-[85%]" style={{ backgroundColor: mascot.color?.primary }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-gray-400 mb-1">
                                                <span>Edad</span>
                                                <span className="text-white text-right">{mascot.age}</span>
                                            </div>
                                            <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                                                <div className="h-full w-[60%]" style={{ backgroundColor: mascot.color?.primary }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-gray-400 mb-1">
                                                <span>Color</span>
                                                <span className="text-white text-right">{mascot.favoriteColor}</span>
                                            </div>
                                            <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                                                <div className="h-full w-[100%]" style={{ backgroundColor: mascot.color?.primary }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Articles from this Mascot */}
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-8 h-1" style={{ backgroundColor: mascot.color?.primary }} />
                                <h2 className="font-display text-3xl text-white tracking-widest">
                                    PUBLICACIONES
                                </h2>
                            </div>

                            <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {articles.length > 0 ? articles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/${section}/${article.slug}`}
                                        className="group flex flex-col bg-bifido-gray/30 border border-gray-800 rounded-xl overflow-hidden hover:border-white transition-all duration-300"
                                    >
                                        <div className="relative h-48 w-full overflow-hidden">
                                            {article.featuredImage ? (
                                                <Image
                                                    src={article.featuredImage}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gray-900" />
                                            )}
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between text-gray-400 text-xs mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    <span>{formatDate(article.publishedAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User size={14} />
                                                    <span>{article.author}</span>
                                                </div>
                                            </div>

                                            <h3 className="font-display text-xl mb-3 text-white flex-1 group-hover:text-white transition-colors" style={{ color: mascot.color?.secondary }}>
                                                {article.title}
                                            </h3>

                                            <div className="flex items-center gap-2 text-sm font-bold mt-4" style={{ color: mascot.color?.primary }}>
                                                <span>Leer artículo</span>
                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="col-span-1 md:col-span-2 text-center py-12 border border-gray-800 rounded-xl bg-gray-900/20">
                                        <p className="text-gray-500 text-sm tracking-widest uppercase">
                                            Aún no hay artículos publicados aquí.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
