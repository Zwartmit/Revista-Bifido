'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getMascotBySlug } from '@/lib/mascots';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types';
import gsap from 'gsap';
import { notFound } from 'next/navigation';

// Datos de ejemplo - En producción vendrían del CMS
const getArticlesBySection = (section: string): Article[] => {
  // Aquí se haría la llamada al CMS
  return [
    {
      id: '1',
      slug: 'articulo-ejemplo-1',
      title: 'Artículo de ejemplo 1',
      excerpt: 'Este es un extracto del artículo de ejemplo para esta sección.',
      content: 'Contenido completo del artículo...',
      author: 'Autor Ejemplo',
      publishedAt: '2024-10-20',
      featuredImage: '/images/placeholder-article.jpg',
      section: section,
      mascotId: getMascotBySlug(section)?.id || '',
    },
    {
      id: '2',
      slug: 'articulo-ejemplo-2',
      title: 'Artículo de ejemplo 2',
      excerpt: 'Otro extracto interesante para mostrar en la tarjeta del artículo.',
      content: 'Contenido completo del artículo...',
      author: 'Autor Ejemplo',
      publishedAt: '2024-10-18',
      featuredImage: '/images/placeholder-article.jpg',
      section: section,
      mascotId: getMascotBySlug(section)?.id || '',
    },
  ];
};

export default function SectionPage() {
  const params = useParams();
  const section = params.section as string;
  const mascot = getMascotBySlug(section);
  const headerRef = useRef<HTMLDivElement>(null);

  if (!mascot) {
    notFound();
  }

  const articles = getArticlesBySection(section);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }

    gsap.fromTo(
      '.section-article-card',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      }
    );
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={headerRef}
        className="py-20 mb-12"
        style={{
          background: `linear-gradient(135deg, ${mascot.color.primary} 0%, ${mascot.color.dark} 100%)`,
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="font-display text-5xl md:text-6xl mb-4">
            {mascot.section}
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
            {mascot.description}
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <p className="text-sm font-semibold">
              Con {mascot.name}
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 pb-20">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.id} className="section-article-card">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              Próximamente habrá contenido en esta sección
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
