'use client';

import { useEffect, useRef, useState } from 'react';
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

// ─── Helper: YouTube / Vimeo embed URL ────────────────────────────────────────
const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return url;
};

// ─── Lexical richText node renderer (used inside RichTextBlock) ───────────────
const renderNode = (node: any, index: number, characterColor: string): React.ReactNode => {
    switch (node.type) {
        case 'text': {
            let text: React.ReactNode = node.text;
            if (node.format & 1)  text = <strong key={`b${index}`}>{text}</strong>;
            if (node.format & 2)  text = <em key={`i${index}`}>{text}</em>;
            if (node.format & 8)  text = <u key={`u${index}`}>{text}</u>;
            if (node.format & 4)  text = <s key={`s${index}`}>{text}</s>;
            if (node.format & 32) text = <code key={`c${index}`} className="bg-white/10 px-1 rounded font-mono text-sm">{text}</code>;
            if (node.format & 16) text = <sub key={`sub${index}`}>{text}</sub>;
            if (node.format & 64) text = <sup key={`sup${index}`}>{text}</sup>;
            return <span key={index}>{text}</span>;
        }
        case 'linebreak':
            return <br key={index} />;
        case 'link':
            return (
                <a key={index} href={node.fields?.url || node.url} target={node.fields?.newTab ? '_blank' : '_self'} rel="noopener noreferrer" className="underline underline-offset-2" style={{ color: characterColor }}>
                    {node.children?.map((c: any, i: number) => renderNode(c, i, characterColor))}
                </a>
            );
        case 'paragraph':
            return (
                <p key={index} className="mb-5 text-gray-300 leading-relaxed text-base md:text-lg">
                    {node.children?.map((c: any, i: number) => renderNode(c, i, characterColor))}
                </p>
            );
        case 'heading': {
            const sizes: Record<string, string> = {
                h1: 'text-4xl md:text-5xl mt-12 mb-5', h2: 'text-3xl md:text-4xl mt-10 mb-4',
                h3: 'text-2xl md:text-3xl mt-8 mb-3',  h4: 'text-xl md:text-2xl mt-6 mb-3',
                h5: 'text-lg md:text-xl mt-5 mb-2',    h6: 'text-base md:text-lg mt-4 mb-2',
            };
            const Tag = node.tag as keyof JSX.IntrinsicElements;
            return <Tag key={index} className={`font-display font-bold text-white ${sizes[node.tag] || ''}`}>{node.children?.map((c: any, i: number) => renderNode(c, i, characterColor))}</Tag>;
        }
        case 'quote':
            return (
                <blockquote key={index} className="border-l-4 pl-5 py-1 italic my-6 text-gray-400 bg-white/5 rounded-r-lg" style={{ borderColor: characterColor }}>
                    {node.children?.map((c: any, i: number) => renderNode(c, i, characterColor))}
                </blockquote>
            );
        case 'list': {
            const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
            return (
                <ListTag key={index} className={`pl-7 mb-6 ${node.tag === 'ol' ? 'list-decimal' : 'list-disc'} text-gray-300 space-y-1`}>
                    {node.children?.map((c: any, i: number) => renderNode(c, i, characterColor))}
                </ListTag>
            );
        }
        case 'listitem':
            return <li key={index} className="leading-relaxed">{node.children?.map((c: any, i: number) => renderNode(c, i, characterColor))}</li>;
        case 'horizontalrule':
            return <hr key={index} className="my-10 border-white/20" />;
        case 'upload': {
            const { value, fields } = node;
            if (!value?.url) return null;
            const al = fields?.alignment || 'center';
            const alignClass = al === 'left' ? 'float-left mr-6 mb-4 clear-left' : al === 'right' ? 'float-right ml-6 mb-4 clear-right' : 'mx-auto my-6 clear-both';
            return (
                <figure key={index} className={`${alignClass} max-w-[500px] w-full`}>
                    <Image src={value.url} alt={fields?.caption || value.filename || 'imagen'} width={value.width || 800} height={value.height || 600} className="rounded-lg object-cover w-full h-auto" />
                    {fields?.caption && <figcaption className="text-center text-xs text-gray-500 mt-2">{fields.caption}</figcaption>}
                </figure>
            );
        }
        default:
            return node.children?.length
                ? <div key={index}>{node.children.map((c: any, i: number) => renderNode(c, i, characterColor))}</div>
                : null;
    }
};

const renderRichText = (content: any, characterColor: string) => {
    if (!content?.root?.children) return null;
    return content.root.children.map((node: any, i: number) => renderNode(node, i, characterColor));
};

// ─── Block Renderers ──────────────────────────────────────────────────────────

const RichTextBlockRenderer = ({ block, color }: { block: any; color: string }) => (
    <div className="mb-2 after:content-[''] after:block after:clear-both">
        {renderRichText(block.content, color)}
    </div>
);

const ImageBlockRenderer = ({ block }: { block: any }) => {
    if (!block.image?.url) return null;
    const al = block.alignment || 'center';
    const sizeMap: Record<string, string> = { small: 'max-w-[40%]', medium: 'max-w-[60%]', large: 'max-w-[80%]', full: 'max-w-full' };
    const alignClass = al === 'full' ? 'w-full my-8' : al === 'left' ? `${sizeMap[block.size || 'medium']} float-left mr-6 mb-4 clear-left` : al === 'right' ? `${sizeMap[block.size || 'medium']} float-right ml-6 mb-4 clear-right` : `${sizeMap[block.size || 'medium']} mx-auto my-8 clear-both`;
    return (
        <figure className={`${alignClass}`}>
            <Image src={block.image.url} alt={block.caption || block.image.filename || 'imagen'} width={block.image.width || 1200} height={block.image.height || 800} className="rounded-xl object-cover w-full h-auto" />
            {block.caption && <figcaption className="text-center text-sm text-gray-500 mt-3">{block.caption}</figcaption>}
        </figure>
    );
};

const VideoBlockRenderer = ({ block }: { block: any }) => {
    const embedUrl = getEmbedUrl(block.url);
    if (!embedUrl) return null;
    return (
        <figure className="my-10 clear-both">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl bg-black shadow-2xl">
                <iframe src={embedUrl} className="absolute top-0 left-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={block.caption || 'video'} />
            </div>
            {block.caption && <figcaption className="text-center text-sm text-gray-500 mt-3">{block.caption}</figcaption>}
        </figure>
    );
};

const TwoColumnsBlockRenderer = ({ block }: { block: any }) => {
    const imgRight = block.imagePosition === 'right';
    const ratioMap: Record<string, [string, string]> = {
        '50-50': ['md:w-1/2', 'md:w-1/2'],
        '40-60': ['md:w-2/5', 'md:w-3/5'],
        '60-40': ['md:w-3/5', 'md:w-2/5'],
    };
    const [imgW, txtW] = ratioMap[block.columnRatio || '50-50'];
    return (
        <div className={`flex flex-col md:flex-row gap-6 my-10 clear-both items-start ${imgRight ? 'md:flex-row-reverse' : ''}`}>
            {block.image?.url && (
                <figure className={`${imgW} shrink-0`}>
                    <Image src={block.image.url} alt={block.imageCaption || block.image.filename || 'imagen'} width={block.image.width || 800} height={block.image.height || 600} className="rounded-xl object-cover w-full h-auto" />
                    {block.imageCaption && <figcaption className="text-center text-xs text-gray-500 mt-2">{block.imageCaption}</figcaption>}
                </figure>
            )}
            <div className={`${txtW} text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line`}>
                {block.text}
            </div>
        </div>
    );
};

const GalleryBlockRenderer = ({ block }: { block: any }) => {
    if (!block.images?.length) return null;
    const gridClass = block.layout === 'grid-3' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2';
    return (
        <div className={`grid ${gridClass} gap-3 my-10 clear-both`}>
            {block.images.map((item: any, i: number) => (
                item.image?.url && (
                    <figure key={i} className="overflow-hidden rounded-xl group cursor-pointer">
                        <Image src={item.image.url} alt={item.caption || item.image.filename || `foto ${i + 1}`} width={item.image.width || 800} height={item.image.height || 600} className="object-cover w-full h-48 md:h-64 group-hover:scale-105 transition-transform duration-300" />
                        {item.caption && <figcaption className="text-center text-xs text-gray-500 mt-1 pb-1">{item.caption}</figcaption>}
                    </figure>
                )
            ))}
        </div>
    );
};

const PullQuoteBlockRenderer = ({ block, color }: { block: any; color: string }) => (
    <div className="my-14 clear-both text-center px-4 md:px-16">
        <span className="text-7xl font-display leading-none select-none opacity-20" style={{ color }}>"</span>
        <p className="font-display text-2xl md:text-4xl font-bold leading-tight -mt-4 mb-5" style={{ color }}>
            {block.quote}
        </p>
        {block.attribution && (
            <p className="text-sm text-gray-500 uppercase tracking-widest">— {block.attribution}</p>
        )}
    </div>
);

const SeparatorBlockRenderer = ({ block }: { block: any }) => {
    if (block.style === 'space') return <div className="my-12 clear-both" />;
    if (block.style === 'dots') return <div className="my-12 clear-both text-center text-gray-600 text-2xl tracking-[1rem]">···</div>;
    return <hr className="my-12 clear-both border-white/15" />;
};

// ─── Main block router ────────────────────────────────────────────────────────
const renderBlocks = (layout: any[], characterColor: string) => {
    if (!layout?.length) return <p className="text-gray-500 italic">Sin contenido aún.</p>;
    return layout.map((block: any, i: number) => {
        switch (block.blockType) {
            case 'richTextBlock':   return <RichTextBlockRenderer   key={i} block={block} color={characterColor} />;
            case 'imageBlock':      return <ImageBlockRenderer       key={i} block={block} />;
            case 'videoBlock':      return <VideoBlockRenderer       key={i} block={block} />;
            case 'twoColumnsBlock': return <TwoColumnsBlockRenderer  key={i} block={block} />;
            case 'galleryBlock':    return <GalleryBlockRenderer     key={i} block={block} />;
            case 'pullQuoteBlock':  return <PullQuoteBlockRenderer   key={i} block={block} color={characterColor} />;
            case 'separatorBlock':  return <SeparatorBlockRenderer   key={i} block={block} />;
            default:                return null;
        }
    });
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ArticleClient({ article, character }: ArticleClientProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        setShareUrl(window.location.href);
        if (contentRef.current) {
            gsap.fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }
    }, []);

    if (!character) return <div>Character not found</div>;
    const { primary: charPrimary, dark: charDark } = getCharacterColors(character.slug);

    return (
        <article className="min-h-screen">
            {/* Featured Image */}
            <div className="relative w-full h-[400px] md:h-[600px] mb-8">
                <div className="absolute inset-0 bg-gray-900" />
                {article.featuredImage && (
                    <Image src={article.featuredImage} alt={article.title} fill className="object-cover" priority />
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
                <div className="absolute bottom-0 left-0 right-0 py-8 text-white">
                    <div className="container mx-auto">
                        <Link href={`/${character.slug}/articulos`} className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-all text-sm font-medium mb-4">
                            <ArrowLeft size={16} className="mr-2" />
                            Volver a {character.name}
                        </Link>
                        <h1 className="font-display text-4xl md:text-6xl mb-4">{article.title}</h1>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div ref={contentRef} className="container mx-auto pb-20 mt-12">
                {/* Meta */}
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-800">
                    <div>
                        <p className="text-lg font-semibold text-white">{article.author}</p>
                        <p className="text-gray-400">{formatDate(article.publishedAt)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors" aria-label="Compartir en Facebook"><Facebook size={20} /></a>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors" aria-label="Compartir en Twitter"><Twitter size={20} /></a>
                        <button onClick={() => navigator.share?.({ title: article.title, text: article.excerpt, url: shareUrl })} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors" aria-label="Compartir"><Share2 size={20} /></button>
                    </div>
                </div>

                {/* Blocks */}
                <div className="max-w-none" style={{ '--character-color': charPrimary, '--character-dark': charDark } as React.CSSProperties}>
                    {renderBlocks(article.layout, charPrimary)}
                </div>
            </div>
        </article>
    );
}
