import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { getArticlesByCategory } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { getCharacterColors } from '@/lib/character-colors';

import CategoryClient from './CategoryClient';

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const articles = await getArticlesByCategory(slug);
    const categoryName = slug.replace(/-/g, ' ');

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            
            {/* Header */}
            <div className="pt-12 pb-4 px-6 sm:px-10 lg:px-16 xl:px-24 border-b border-[#1e1e1e]">
                <span className="font-display text-[#b8ff00] text-sm tracking-[0.5em] uppercase mb-4 block">Categoría</span>
                <h1 className="font-display text-5xl md:text-7xl text-white uppercase leading-none">
                    {categoryName}
                </h1>
                <Link href="/" className="inline-flex items-center mt-4 text-[#b8ff00] hover:text-white transition-colors font-mono text-sm tracking-widest uppercase">
                    <ArrowLeft className="mr-2" size={16} /> Volver al Inicio
                </Link>
            </div>

            {/* Content */}
            <div className="px-6 sm:px-10 lg:px-16 xl:px-24 py-12 md:py-20 flex-1">
                {articles.length === 0 ? (
                    <div className="text-center py-28 border border-[#1e1e1e]">
                        <p className="font-display text-3xl text-white/10 tracking-widest uppercase mb-3">
                            Sin publicaciones aún
                        </p>
                        <p className="font-googlesans text-white/25 text-sm">
                            Aún no hay artículos publicados en esta categoría.
                        </p>
                    </div>
                ) : (
                    <CategoryClient initialArticles={articles} />
                )}
            </div>
        </div>
    );
}
