'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getMascotBySlug } from '@/lib/mascots';
import { formatDate } from '@/lib/utils';
import { Article } from '@/types';
import { Calendar, User, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { notFound } from 'next/navigation';

// Función para obtener artículos de una sección - En producción vendría del CMS
const getArticlesBySection = (section: string): Article[] => {
    const mascot = getMascotBySlug(section);
    if (!mascot) return [];

    // Datos de ejemplo - En producción estos vendrían del CMS
    return [
        {
            id: '1',
            slug: 'articulo-ejemplo-1',
            title: 'El futuro de la resistencia: Nuevas formas de activismo',
            excerpt: 'Exploramos cómo las nuevas generaciones están redefiniendo el activismo y la lucha social en el siglo XXI.',
            content: '',
            author: 'Equipo Bífido',
            publishedAt: '2024-11-10',
            featuredImage: '/images/placeholder-article.jpg',
            section: section,
            mascotId: mascot.id,
        },
        {
            id: '2',
            slug: 'articulo-ejemplo-2',
            title: 'Voces desde el margen: Historias que no se cuentan',
            excerpt: 'Damos espacio a las narrativas que los medios tradicionales prefieren ignorar.',
            content: '',
            author: 'Colaboradores',
            publishedAt: '2024-11-05',
            featuredImage: '/images/placeholder-article.jpg',
            section: section,
            mascotId: mascot.id,
        },
        {
            id: '3',
            slug: 'articulo-ejemplo-3',
            title: 'Reflexiones sobre la autonomía y la libertad',
            excerpt: 'Un análisis profundo sobre qué significa ser libre en un mundo cada vez más controlado.',
            content: '',
            author: mascot.name,
            publishedAt: '2024-10-28',
            featuredImage: '/images/placeholder-article.jpg',
            section: section,
            mascotId: mascot.id,
        },
        {
            id: '4',
            slug: 'articulo-ejemplo-4',
            title: 'Cultura underground: Lo que la sociedad rechaza',
            excerpt: 'Celebramos las expresiones artísticas y culturales que desafían el status quo.',
            content: '',
            author: 'Redacción',
            publishedAt: '2024-10-20',
            featuredImage: '/images/placeholder-article.jpg',
            section: section,
            mascotId: mascot.id,
        },
    ];
};

export default function SectionPage() {
    const params = useParams();
    const section = params.section as string;

    const mascot = getMascotBySlug(section);
    const articles = getArticlesBySection(section);
    const contentRef = useRef<HTMLDivElement>(null);

    if (!mascot) {
        notFound();
    }

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }
            );
        }
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section
                className="relative py-32 overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${mascot.color.dark} 0%, ${mascot.color.primary} 100%)`,
                }}
            >
                {/* Mascot Background */}
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src={mascot.image}
                        alt={mascot.name}
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <h1 className="font-display text-5xl md:text-7xl mb-6">
                            {mascot.section}
                        </h1>
                        <p className="text-xl md:text-2xl mb-4 italic">
                            {mascot.description}
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm opacity-90">
                            <span>Por {mascot.name}</span>
                            <span>•</span>
                            <span>{mascot.religion}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-20 bg-bifido-black">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
                            Artículos Recientes
                        </h2>
                        <div
                            className="h-1 w-24 rounded-full"
                            style={{ backgroundColor: mascot.color.primary }}
                        />
                    </div>

                    <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/${section}/${article.slug}`}
                                className="group bg-bifido-gray rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-white"
                            >
                                {/* Image */}
                                <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                                    {/* Placeholder - Replace with actual image when available */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                            className="w-24 h-24 rounded-full opacity-20"
                                            style={{ backgroundColor: mascot.color.primary }}
                                        />
                                    </div>
                                    {/* Uncomment when images are available
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  */}

                                    {/* Category Badge */}
                                    <div
                                        className="absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-bold text-white"
                                        style={{ backgroundColor: mascot.color.primary }}
                                    >
                                        {mascot.section}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="font-display text-2xl md:text-3xl mb-3 text-white group-hover:opacity-80 transition-opacity">
                                        {article.title}
                                    </h3>

                                    <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                                        {article.excerpt}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            <span>{article.author}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>{formatDate(article.publishedAt)}</span>
                                        </div>
                                    </div>

                                    {/* Read More */}
                                    <div className="flex items-center gap-2 font-bold group-hover:gap-3 transition-all">
                                        <span style={{ color: mascot.color.primary }}>
                                            Leer más
                                        </span>
                                        <ArrowRight
                                            size={20}
                                            style={{ color: mascot.color.primary }}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty State */}
                    {articles.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg mb-4">
                                Aún no hay artículos en esta sección.
                            </p>
                            <p className="text-gray-600">
                                Vuelve pronto para descubrir nuevo contenido de {mascot.name}.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* About Mascot Section */}
            <section className="py-20 bg-bifido-gray">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {/* Mascot Image */}
                            <div className="relative w-64 h-64 flex-shrink-0">
                                <Image
                                    src={mascot.image}
                                    alt={mascot.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Mascot Info */}
                            <div className="flex-1 text-white">
                                <h3 className="font-display text-3xl mb-4">
                                    Sobre {mascot.name}
                                </h3>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    {mascot.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-bold block mb-1">Religión:</span>
                                        <span className="text-gray-400">{mascot.religion}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold block mb-1">Edad:</span>
                                        <span className="text-gray-400">{mascot.age}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold block mb-1">Color favorito:</span>
                                        <span className="text-gray-400">{mascot.favoriteColor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
