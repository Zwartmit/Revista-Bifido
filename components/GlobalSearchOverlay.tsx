'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { X, Search, FileText, Calendar, User } from 'lucide-react';
import { globalSearch } from '@/lib/api';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ articles: any[]; events: any[]; characters: any[]; liveArchive: any[]; categories: any[] }>({
    articles: [],
    events: [],
    characters: [],
    liveArchive: [],
    categories: []
  });
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Animation on open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, backdropFilter: 'blur(0px)' },
        { opacity: 1, backdropFilter: 'blur(20px)', duration: 0.5, ease: 'power3.out' }
      );
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power4.out', delay: 0.1 }
      );
      // Focus input after a slight delay
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 500);
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  // Debounce search
  useEffect(() => {
    if (!query || query.trim() === '') {
      setResults({ articles: [], events: [], characters: [], liveArchive: [], categories: [] });
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const data = await globalSearch(query);
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasResults = results.articles.length > 0 || results.events.length > 0 || results.characters.length > 0 || results.liveArchive?.length > 0 || results.categories?.length > 0;
  const isSearching = query.trim().length > 0;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/90"
      style={{
        background: "radial-gradient(circle at 50% -50%, rgba(204,253,41,0.15) 0%, rgba(0,0,0,0.95) 100%)",
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .search-glitch { position:relative; }
        .search-glitch::after { content:attr(data-text); position:absolute; inset:0; color:#b8ff00; opacity:0.5; z-index:-1; transform:translate(-2px, 2px); }
        .search-glitch::before { content:attr(data-text); position:absolute; inset:0; color:#E63946; opacity:0.5; z-index:-1; transform:translate(2px, -2px); }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none filter sepia blur-[1px] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <button
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-[#b8ff00] transition-colors p-2 z-[110] group hover:rotate-90 duration-300"
      >
        <X size={36} strokeWidth={1.5} />
      </button>

      {/* Scrollable Container */}
      <div className="absolute inset-0 overflow-y-auto pt-12 md:pt-24 px-4 flex flex-col">
        <div ref={contentRef} className="w-full max-w-4xl mx-auto flex flex-col relative z-10 pb-20">

          {/* Input Area */}
          <div className="relative mb-12 mt-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#b8ff00]/50 w-12 h-12 flex items-center justify-center">
              {loading ? (
                <div className="w-6 h-6 border-2 border-[#b8ff00]/30 border-t-[#b8ff00] rounded-full animate-spin"></div>
              ) : (
                <Image src="/icons/search.svg" alt="Searching..." width={32} height={32} className="opacity-70" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/10 hover:border-white/30 focus:border-[#b8ff00] text-white font-display text-4xl md:text-5xl py-4 pl-16 outline-none transition-colors"
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
            <div className="absolute bottom-0 left-0 h-[2px] bg-[#b8ff00] transition-all duration-300 ease-out" style={{ width: isSearching ? '100%' : '0%', opacity: loading ? 0.5 : 1 }} />
          </div>

          {/* Results Area */}
          {!isSearching && (
            <div className="text-center py-20 opacity-60 mt-6">
              <p className="font-display text-2xl md:text-5xl uppercase text-white">INGRESA UN TÉRMINO PARA EMPEZAR A BUSCAR</p>
              <p className="font-mono mt-4 tracking-[0.2em] text-xs md:text-sm text-white">
                <span className="hidden lg:inline">PRESIONA ESC PARA SALIR</span>
                <span className="lg:hidden">TOCA LA X PARA SALIR</span>
              </p>
            </div>
          )}

          {isSearching && !hasResults && !loading && (
            <div className="text-center py-20 opacity-60 mt-6">
              <p className="font-display text-2xl md:text-5xl uppercase text-white">NO SE ENCONTRARON RESULTADOS</p>
              <p className="font-mono mt-4 tracking-[0.2em] text-xs md:text-sm text-white">INTENTA CON OTRA PALABRA</p>
            </div>
          )}

          {hasResults && (
            <div className="flex flex-col gap-12 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-500">

              {/* Categories Results */}
              {results.categories?.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[#b8ff00] mb-4 flex items-center gap-2">
                    <FileText size={14} /> CATEGORÍAS <span className="opacity-50">({results.categories.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {results.categories.map((cat) => (
                      <Link href={`/categorias/${cat.slug}`} key={cat.id} onClick={onClose} className="px-4 py-2 border border-[#b8ff00] text-[#b8ff00] hover:bg-[#b8ff00] hover:text-black font-mono text-sm tracking-widest uppercase transition-colors">
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Characters Results */}
              {results.characters.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[#b8ff00] mb-4 flex items-center gap-2">
                    <User size={14} /> LA MANADA <span className="opacity-50">({results.characters.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {results.characters.map((char) => (
                      <Link href={`/${char.slug}`} key={char.id} onClick={onClose} className="group block border border-white/5 hover:border-white/20 bg-white/5 overflow-hidden transition-all duration-300">
                        <div className="aspect-square relative w-full overflow-hidden bg-black/50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={char.image} alt={char.name} className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="font-display text-lg uppercase leading-none drop-shadow-md text-white group-hover:text-[#b8ff00] transition-colors line-clamp-1">{char.name}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles Results */}
              {results.articles.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[#b8ff00] mb-4 flex items-center gap-2">
                    <FileText size={14} /> ARTÍCULOS <span className="opacity-50">({results.articles.length})</span>
                  </h3>
                  <div className="flex flex-col gap-3">
                    {results.articles.map((article) => (
                      <Link href={`/${article.section}/articulos/${article.slug}`} key={article.id} onClick={onClose} className="group flex gap-4 p-3 border-l-2 border-transparent hover:border-[#b8ff00] hover:bg-white/5 transition-all duration-200">
                        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-zinc-900 relative overflow-hidden hidden sm:block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                        <div className="flex flex-col justify-center flex-1">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">{article.section}</span>
                          <h4 className="font-display text-xl md:text-2xl text-white group-hover:text-white transition-colors leading-[1.1] mb-2 line-clamp-2">{article.title}</h4>
                          <p className="font-sans text-sm text-gray-400 line-clamp-1 hidden md:block">{article.excerpt}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Events Results */}
              {results.events.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[#b8ff00] mb-4 flex items-center gap-2">
                    <Calendar size={14} /> EVENTOS <span className="opacity-50">({results.events.length})</span>
                  </h3>
                  <div className="flex flex-col gap-3">
                    {results.events.map((ev) => (
                      <Link href={`/eventos/${ev.slug}`} key={ev.id} onClick={onClose} className="group flex items-center justify-between p-4 border border-white/10 hover:border-[#b8ff00] bg-black/40 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#b8ff00] opacity-0 group-hover:opacity-5 transition-opacity" />

                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-1 min-w-0 z-10">
                          {ev.date && (
                            <div className="flex-shrink-0 font-mono text-sm tracking-widest bg-white/10 px-3 py-1 text-white/70 group-hover:bg-[#b8ff00] group-hover:text-black transition-colors w-max">
                              {new Date(ev.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase()}
                            </div>
                          )}
                          <h4 className="font-display text-xl md:text-2xl uppercase truncate text-white leading-none">{ev.title}</h4>
                        </div>

                        <div className="flex-shrink-0 hidden md:flex items-center gap-2 text-xs font-mono text-white/40 ml-4 z-10 w-32 justify-end">
                          <span className="truncate">{ev.location}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Archive Results */}
              {results.liveArchive?.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[#b8ff00] mb-4 flex items-center gap-2">
                    <User size={14} /> ARCHIVO VIVO <span className="opacity-50">({results.liveArchive.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {results.liveArchive.map((member) => (
                      <Link href={`/archivo-vivo/${member.slug}`} key={member.id} onClick={onClose} className="group block border border-white/5 hover:border-[#E63946] bg-white/5 overflow-hidden transition-all duration-300">
                        <div className="aspect-square relative w-full overflow-hidden bg-black/50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={member.profileImage} alt={member.name} className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="font-display text-lg uppercase leading-none drop-shadow-md text-white group-hover:text-[#E63946] transition-colors line-clamp-1">{member.name}</p>
                            <p className="font-mono text-[10px] uppercase text-white/50 mt-1 truncate">{member.profession || 'Archivo Vivo'}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
