'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getCharacterColors } from '@/lib/character-colors';

export default function CategoryClient({ initialArticles }: { initialArticles: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

    // Get unique authors for the filter dropdown
    const authors = useMemo(() => {
        const uniqueAuthors = new Set<string>();
        initialArticles.forEach(article => {
            if (article.author) uniqueAuthors.add(article.author);
        });
        return Array.from(uniqueAuthors).sort();
    }, [initialArticles]);

    // Filter articles based on search query and selected author
    const filteredArticles = useMemo(() => {
        return initialArticles.filter(article => {
            const matchesSearch = article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesAuthor = selectedAuthor ? article.author === selectedAuthor : true;
            return matchesSearch && matchesAuthor;
        });
    }, [initialArticles, searchQuery, selectedAuthor]);

    return (
        <div className="w-full flex flex-col">
            {/* Toolbar: Search and Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                {/* Search */}
                <div className="relative w-full sm:w-96">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar en esta categoría..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#b8ff00] text-white font-mono text-sm py-3 pl-10 pr-10 outline-none transition-colors rounded-none"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filter */}
                {authors.length > 0 && (
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Filter size={18} className="text-white/40" />
                        <select
                            value={selectedAuthor || ''}
                            onChange={(e) => setSelectedAuthor(e.target.value || null)}
                            className="bg-white/5 border border-white/10 hover:border-white/20 text-white font-mono text-sm py-3 px-4 outline-none transition-colors w-full sm:w-auto cursor-pointer appearance-none"
                        >
                            <option value="" className="bg-[#111] text-white">Todos los autores</option>
                            {authors.map(author => (
                                <option key={author} value={author} className="bg-[#111] text-white">{author}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Results */}
            {filteredArticles.length === 0 ? (
                <div className="text-center py-28 border border-[#1e1e1e]">
                    <p className="font-display text-3xl text-white/80 tracking-widest uppercase mb-3">
                        Sin resultados
                    </p>
                    <p className="font-googlesans text-white/60 text-sm">
                        No encontramos artículos que coincidan con tu búsqueda.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredArticles.map((article: any) => {
                        const { primary: charColor } = getCharacterColors(article.characterId || article.section);
                        return (
                            <Link
                                key={article.id}
                                href={`/${article.section}/articulos/${article.slug}`}
                                className="group flex flex-col border border-[#1e1e1e] hover:border-transparent transition-all duration-300 overflow-hidden bg-[#080808]"
                                style={{ '--hover-border-color': charColor } as React.CSSProperties}
                            >
                                <style>{`
                                    .group:hover {
                                        border-color: var(--hover-border-color) !important;
                                    }
                                    .group:hover h3 {
                                        color: var(--hover-border-color) !important;
                                    }
                                `}</style>
                                {/* Thumbnail */}
                                <div className="relative w-full aspect-[4/3] overflow-hidden">
                                    {article.featuredImage ? (
                                        <Image
                                            src={article.featuredImage}
                                            alt={article.title}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
                                            <span className="font-display text-6xl opacity-10 text-white">B</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <span
                                            className="font-mono text-xs uppercase tracking-widest px-2 py-1"
                                            style={{ color: charColor, backgroundColor: `${charColor}15` }}
                                        >
                                            {article.author}
                                        </span>
                                        <span className="font-googlesans text-xs text-white/30 tracking-wider">
                                            {formatDate(article.publishedAt)}
                                        </span>
                                    </div>

                                    <h3 className="font-display text-2xl text-white uppercase leading-tight mb-3 flex-1 transition-colors line-clamp-3">
                                        {article.title}
                                    </h3>

                                    <p className="font-googlesans text-gray-500 text-sm line-clamp-2 mt-auto">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
