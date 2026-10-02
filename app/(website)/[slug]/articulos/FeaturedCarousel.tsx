'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    featuredImage?: string;
    publishedAt: string;
}

interface FeaturedCarouselProps {
    articles: Article[];
    section: string;
    primaryColor: string;
    darkColor: string;
    letter?: string;
}

export default function FeaturedCarousel({ articles, section, primaryColor, darkColor, letter = 'A' }: FeaturedCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, [articles.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    }, [articles.length]);

    useEffect(() => {
        if (articles.length <= 1 || isHovered) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [articles.length, isHovered, nextSlide]);

    if (!articles || articles.length === 0) return null;

    const currentArticle = articles[currentIndex];

    // Helper para fecha
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return d.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div 
            className="relative mb-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The Main Link wrapper is difficult to animate cleanly if we wrap everything,
                so we wrap the content and put arrows outside the link, or absolute positioned over it */}
            <Link 
                href={`/${section}/articulos/${currentArticle.slug}`}
                className="group block border border-[#1e1e1e] hover:border-white/20 transition-all duration-300 overflow-hidden relative"
            >
                <div className="flex flex-col lg:flex-row">
                    <div className="relative w-full lg:w-[50%] aspect-[16/9] lg:min-h-[320px] overflow-hidden flex-shrink-0 bg-[#080808]">
                        {currentArticle.featuredImage ? (
                            <Image 
                                key={currentArticle.featuredImage} // forces re-render/fade if desired, though Next image is fast
                                src={currentArticle.featuredImage} 
                                alt={currentArticle.title} 
                                fill 
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 animate-in fade-in zoom-in-95" 
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center animate-in fade-in" style={{ backgroundColor: `${darkColor}50` }}>
                                <span className="font-display text-[8rem] opacity-10" style={{ color: primaryColor }}>{letter}</span>
                            </div>
                        )}
                        <span className="absolute top-4 left-4 font-display text-[10px] tracking-[0.4em] px-3 py-1 uppercase z-10"
                            style={{ backgroundColor: primaryColor, color: '#000' }}>Destacado</span>
                    </div>
                    
                    <div className="flex flex-col justify-between p-8 lg:p-10 bg-[#080808] flex-1 z-10">
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <span className="font-googlesans text-sm text-white/40 block mb-4">
                                {formatDate(currentArticle.publishedAt)}
                            </span>
                            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-tight mb-5 line-clamp-3">
                                {currentArticle.title}
                            </h2>
                            {currentArticle.excerpt && (
                                <p className="font-googlesans text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3">
                                    {currentArticle.excerpt}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-8 font-googlesans text-base font-medium" style={{ color: primaryColor }}>
                            <span>Leer artículo</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>

            {/* Controls (only show if > 1 article) */}
            {articles.length > 1 && (
                <>
                    <button 
                        onClick={(e) => { e.preventDefault(); prevSlide(); }}
                        className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 border-2 border-white/40 text-white rounded-full hover:bg-white hover:text-black hover:scale-110 transition-all z-20 backdrop-blur-md shadow-lg"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={(e) => { e.preventDefault(); nextSlide(); }}
                        className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 border-2 border-white/40 text-white rounded-full hover:bg-white hover:text-black hover:scale-110 transition-all z-20 backdrop-blur-md shadow-lg"
                    >
                        <ChevronRight size={24} />
                    </button>
                    
                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                        {articles.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 opacity-100' : 'w-2 opacity-30 hover:opacity-60'}`}
                                style={{ backgroundColor: idx === currentIndex ? primaryColor : '#ffffff' }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
