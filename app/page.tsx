'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Importación dinámica del componente 3D para evitar problemas de SSR
const InteractiveScene = dynamic(() => import('@/components/InteractiveScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gradient-to-b from-bifido-gray to-bifido-black rounded-lg flex items-center justify-center">
      <p className="text-white text-xl">Cargando experiencia interactiva...</p>
    </div>
  ),
});

// Datos de ejemplo - En producción vendrían del CMS
const featuredArticles: Article[] = [
  {
    id: '1',
    slug: 'crisis-climatica-2024',
    title: 'La crisis climática que nadie quiere ver',
    excerpt: 'Un análisis crudo sobre las consecuencias del cambio climático en América Latina.',
    content: '',
    author: 'Ana Martínez',
    publishedAt: '2024-10-20',
    featuredImage: '/images/placeholder-article.jpg',
    section: 'ecorebeldia',
    mascotId: 'punkibri',
  },
  {
    id: '2',
    slug: 'politica-sin-filtros',
    title: 'Política sin filtros: Las mentiras del sistema',
    excerpt: 'Desenmascarando las contradicciones de la clase política actual.',
    content: '',
    author: 'Carlos Ruiz',
    publishedAt: '2024-10-18',
    featuredImage: '/images/placeholder-article.jpg',
    section: 'opinion',
    mascotId: 'mordaz',
  },
  {
    id: '3',
    slug: 'arte-urbano-resistencia',
    title: 'Arte urbano como forma de resistencia',
    excerpt: 'Cómo el graffiti y el muralismo transforman las ciudades latinoamericanas.',
    content: '',
    author: 'Laura Gómez',
    publishedAt: '2024-10-15',
    featuredImage: '/images/placeholder-article.jpg',
    section: 'cultura',
    mascotId: 'malandra',
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Animación de entrada del hero
    if (titleRef.current && subtitleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
      );
    }

    // Animación de las tarjetas de artículos
    gsap.fromTo(
      '.article-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.articles-grid',
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1
            ref={titleRef}
            className="font-display text-5xl md:text-7xl mb-4 text-white"
          >
            REVISTA BÍFIDO
          </h1>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-bifido-lightgray italic"
          >
            &quot;Periodismo crudo para sensibilidades frágiles&quot;
          </p>
        </div>

        {/* Escena 3D Interactiva */}
        <div className="mb-12">
          <div className="text-center">
            <p className="text-bifido-lightgray">
              Selecciona uno de nuestros personajes para explorar su parche
            </p>
          </div>
          <InteractiveScene />
        </div>

      </section>

      {/* Featured Articles Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-4xl mb-8 text-center">
          Lo más fresquito...
        </h2>

        <div className="articles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <div key={article.id} className="article-card">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-bifido-gray text-white py-16 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl mb-4">
            Únete a la conversación
          </h2>
          <p className="text-lg mb-8 text-bifido-lightgray">
            Periodismo independiente, crítico y sin censura
          </p>
          <a
            href="/contactanos"
            className="inline-block bg-white text-bifido-black px-8 py-3 rounded-full font-semibold hover:bg-bifido-lightgray transition-colors"
          >
            Contáctanos
          </a>
        </div>
      </section>
    </div>
  );
}
