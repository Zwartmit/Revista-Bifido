'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getMascotBySlug } from '@/lib/mascots';
import { formatDate } from '@/lib/utils';
import { Article } from '@/types';
import { Facebook, Twitter, Share2, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { notFound } from 'next/navigation';

// Función para obtener artículo - En producción vendría del CMS
const getArticle = (section: string, slug: string): Article | null => {
  // Aquí se haría la llamada al CMS
  const mascot = getMascotBySlug(section);
  if (!mascot) return null;

  return {
    id: '1',
    slug: slug,
    title: 'Título del Artículo de Ejemplo',
    excerpt: 'Este es el extracto del artículo que aparece en las redes sociales.',
    content: `
      <p>Este es el contenido completo del artículo. En una implementación real, este contenido vendría del CMS y estaría formateado en HTML enriquecido.</p>
      
      <h2>Subtítulo del Artículo</h2>
      <p>Más contenido del artículo con información relevante y bien estructurada. El periodismo de Bífido se caracteriza por su enfoque crudo y directo.</p>
      
      <blockquote>"Una cita destacada que resalta un punto importante del artículo"</blockquote>
      
      <p>Continuación del contenido con análisis profundo y perspectivas únicas que caracterizan a la Revista Bífido.</p>
      
      <h2>Conclusión</h2>
      <p>Párrafo final que cierra el artículo con reflexiones importantes sobre el tema tratado.</p>
    `,
    author: 'Nombre del Autor',
    publishedAt: '2024-10-20',
    featuredImage: '/images/placeholder-article.jpg',
    section: section,
    mascotId: mascot.id,
  };
};

export default function ArticlePage() {
  const params = useParams();
  const section = params.section as string;
  const slug = params.slug as string;
  
  const article = getArticle(section, slug);
  const mascot = getMascotBySlug(section);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!article || !mascot) {
    notFound();
  }

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <article className="min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href={`/${section}`}
          className="inline-flex items-center text-gray-600 hover:text-bifido-black transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a {mascot.section}
        </Link>
      </div>

      {/* Featured Image */}
      <div className="relative w-full h-[400px] md:h-[600px] mb-8">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: mascot.color.primary }}
            >
              {mascot.section}
            </div>
            <h1 className="font-display text-4xl md:text-6xl mb-4 max-w-4xl">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div ref={contentRef} className="container mx-auto px-4 max-w-4xl pb-20">
        {/* Meta Information */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <p className="text-lg font-semibold">{article.author}</p>
            <p className="text-gray-600">{formatDate(article.publishedAt)}</p>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center space-x-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Compartir en Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${article.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Compartir en Twitter"
            >
              <Twitter size={20} />
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: shareUrl,
                  });
                }
              }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Compartir"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{
            '--tw-prose-headings': mascot.color.dark,
            '--tw-prose-links': mascot.color.primary,
          } as React.CSSProperties}
        />

        {/* Tags or Related Articles could go here */}
      </div>
    </article>
  );
}
