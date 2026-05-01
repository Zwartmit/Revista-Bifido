'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Facebook, Twitter, Share2, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { getCharacterColors } from '@/lib/character-colors';

interface ArticleClientProps {
    article: any;
    character: any;
}

// Basic Lexical JSON Renderer
const renderRichText = (content: any, characterColor: string) => {
    if (!content || !content.root || !content.root.children) return null;

    const renderNode = (node: any, index: number): React.ReactNode => {
        switch (node.type) {
            case 'text':
                let text = <span key={index}>{node.text}</span>;
                if (node.format & 1) text = <strong key={index}>{text}</strong>; // Bold
                if (node.format & 2) text = <em key={index}>{text}</em>; // Italic
                if (node.format & 8) text = <u key={index}>{text}</u>; // Underline
                return text;

            case 'link':
                return (
                    <a key={index} href={node.fields.url} target={node.fields.newTab ? "_blank" : "_self"} className="underline" style={{ color: characterColor }}>
                        {node.children.map((child: any, i: number) => renderNode(child, i))}
                    </a>
                );

            case 'paragraph':
                return (
                    <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                        {node.children?.map((child: any, i: number) => renderNode(child, i))}
                    </p>
                );

            case 'heading':
                const Tag = node.tag as keyof JSX.IntrinsicElements; // h1, h2, h3...
                return (
                    <Tag key={index} className="font-display font-bold mt-8 mb-4">
                        {node.children?.map((child: any, i: number) => renderNode(child, i))}
                    </Tag>
                );

            case 'quote':
                return (
                    <blockquote key={index} className="border-l-4 pl-4 italic my-6 text-gray-700" style={{ borderColor: characterColor }}>
                        {node.children?.map((child: any, i: number) => renderNode(child, i))}
                    </blockquote>
                );

            case 'list':
                const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
                const listClass = node.tag === 'ol' ? 'list-decimal' : 'list-disc';
                return (
                    <ListTag key={index} className={`pl-6 mb-6 ${listClass}`}>
                        {node.children?.map((child: any, i: number) => renderNode(child, i))}
                    </ListTag>
                );

            case 'listitem':
                return (
                    <li key={index} className="mb-2">
                        {node.children?.map((child: any, i: number) => renderNode(child, i))}
                    </li>
                );

            default:
                // Fallback for unhandled types, try to render children
                return (
                    <div key={index}>
                        {node.children?.map((child: any, i: number) => renderNode(child, i))}
                    </div>
                );
        }
    };

    return content.root.children.map((node: any, i: number) => renderNode(node, i));
};

export default function ArticleClient({ article, character }: ArticleClientProps) {
    const contentRef = useRef<HTMLDivElement>(null);

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

    if (!character) return <div>Character not found</div>;
    const { primary: charPrimary, dark: charDark } = getCharacterColors(character.slug);

    return (
        <article className="min-h-screen pt-24 md:pt-52">
            {/* Back Button */}
            <div className="container mx-auto px-4 py-6">
                <Link
                    href={`/${character.slug}/articulos`}
                    className="inline-flex items-center text-gray-600 hover:text-bifido-black transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Volver a {character.name}
                </Link>
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-[400px] md:h-[600px] mb-8">
                <div className="absolute inset-0 bg-gray-900" /> {/* Fallback color */}
                {article.featuredImage && (
                    <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
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
                            style={{ backgroundColor: charPrimary }}
                        >
                            {character.name}
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
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            aria-label="Compartir en Facebook"
                        >
                            <Facebook size={20} />
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
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
                    style={{
                        '--tw-prose-headings': charDark,
                        '--tw-prose-links': charPrimary,
                    } as React.CSSProperties}
                >
                    {renderRichText(article.content, charPrimary)}
                </div>
            </div>
        </article>
    );
}
