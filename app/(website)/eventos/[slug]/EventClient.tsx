'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowLeft, Video, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaSpotify, FaYoutube, FaInstagram, FaVimeoV, FaGlobe, FaTiktok, FaSoundcloud, FaTwitter, FaFacebook, FaApple } from 'react-icons/fa';
import gsap from 'gsap';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return url;
};

const formatEventDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const formatEventTime = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};

// ─── Lexical rich-text renderer ───────────────────────────────────────────────

const renderNode = (node: any, index: number): React.ReactNode => {
    switch (node.type) {
        case 'root':
            return <>{node.children?.map((child: any, i: number) => renderNode(child, i))}</>;
        case 'paragraph':
            return (
                <p key={index} className="mb-5 leading-relaxed text-gray-200">
                    {node.children?.map((child: any, i: number) => renderNode(child, i))}
                </p>
            );
        case 'heading': {
            const Tag = node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
            const sizes: Record<string, string> = {
                h1: 'text-5xl mt-12 mb-6',
                h2: 'text-4xl mt-10 mb-5',
                h3: 'text-3xl mt-8 mb-4',
                h4: 'text-2xl mt-6 mb-3',
                h5: 'text-xl mt-5 mb-2',
                h6: 'text-lg mt-4 mb-2',
            };
            return (
                <Tag key={index} className={`font-display text-white ${sizes[node.tag] ?? ''}`}>
                    {node.children?.map((child: any, i: number) => renderNode(child, i))}
                </Tag>
            );
        }
        case 'list': {
            const ListTag = node.listType === 'number' ? 'ol' : 'ul';
            return (
                <ListTag key={index} className={`mb-5 pl-6 text-gray-200 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
                    {node.children?.map((child: any, i: number) => renderNode(child, i))}
                </ListTag>
            );
        }
        case 'listitem':
            return <li key={index} className="mb-1">{node.children?.map((child: any, i: number) => renderNode(child, i))}</li>;
        case 'quote':
            return (
                <blockquote key={index} className="border-l-4 border-bifido-neon pl-6 my-8 italic text-gray-300">
                    {node.children?.map((child: any, i: number) => renderNode(child, i))}
                </blockquote>
            );
        case 'text': {
            let text: React.ReactNode = node.text;
            if (node.format & 1) text = <strong>{text}</strong>;
            if (node.format & 2) text = <em>{text}</em>;
            if (node.format & 8) text = <u>{text}</u>;
            if (node.format & 4) text = <s>{text}</s>;
            if (node.format & 16) text = <code className="font-mono text-sm bg-white/10 px-1 rounded">{text}</code>;
            return <span key={index}>{text}</span>;
        }
        case 'linebreak':
            return <br key={index} />;
        case 'link':
            return (
                <a
                    key={index}
                    href={node.fields?.url ?? node.url ?? '#'}
                    target={node.fields?.newTab ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-bifido-neon underline"
                >
                    {node.children?.map((child: any, i: number) => renderNode(child, i))}
                </a>
            );
        default:
            return null;
    }
};

// ─── Block renderers ──────────────────────────────────────────────────────────

const RichTextBlockRenderer = ({ block }: { block: any }) => {
    const root = block.content?.root ?? block.content;
    return (
        <div className="mb-8 text-gray-200 leading-relaxed text-lg">
            {root ? renderNode(root, 0) : <p className="text-gray-500 italic">Sin contenido.</p>}
        </div>
    );
};

const ImageBlockRenderer = ({ block }: { block: any }) => {
    const src = block.image?.url ?? block.image;
    if (!src) return null;
    return (
        <figure className="mb-10">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <Image src={src} alt={block.caption ?? 'Imagen del evento'} fill className="object-cover" />
            </div>
            {block.caption && (
                <figcaption className="text-center text-sm text-gray-500 mt-3 italic">{block.caption}</figcaption>
            )}
        </figure>
    );
};

const VideoBlockRenderer = ({ block }: { block: any }) => {
    const embedUrl = getEmbedUrl(block.url);
    if (!embedUrl) return null;
    return (
        <div className="mb-10">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                <iframe src={embedUrl} title={block.caption ?? 'Video'} className="absolute inset-0 w-full h-full" allowFullScreen />
            </div>
            {block.caption && (
                <p className="text-center text-sm text-gray-500 mt-3 italic">{block.caption}</p>
            )}
        </div>
    );
};

const GalleryBlockRenderer = ({ block }: { block: any }) => {
    const images: any[] = block.images ?? [];
    if (!images.length) return null;
    const colsClass = block.layout === 'grid-3' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2';
    return (
        <div className={`grid ${colsClass} gap-4 mb-10`}>
            {images.map((img: any, i: number) => {
                const src = img.image?.url ?? img.url ?? img;
                return (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                        <Image src={src} alt={img.caption ?? `Imagen ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                );
            })}
        </div>
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

const PullQuoteBlockRenderer = ({ block }: { block: any }) => (
    <div className="my-14 clear-both text-center px-4 md:px-16">
        <p className="font-display text-2xl md:text-4xl font-bold leading-tight mb-5 text-bifido-neon">
            <span className="opacity-60 mr-1">“</span>
            {block.quote}
            <span className="opacity-60 ml-1">”</span>
        </p>
        {block.attribution && (
            <p className="text-sm text-gray-400 uppercase tracking-widest">— {block.attribution}</p>
        )}
    </div>
);

const SeparatorBlockRenderer = ({ block }: { block: any }) => {
    if (block.style === 'space') return <div className="my-14 clear-both" />;
    if (block.style === 'dots')
        return <div className="my-12 clear-both text-center text-white/50 text-2xl tracking-[1.5rem] select-none">···</div>;
    if (block.style === 'fade')
        return <div className="my-12 clear-both h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />;
    return <hr className="my-12 clear-both border-white/40" />;
};

const ButtonLinksBlockRenderer = ({ block }: { block: any }) => {
    if (!block.buttons?.length) return null;
    
    return (
        <div className="my-14 clear-both flex flex-wrap justify-center gap-4">
            {block.buttons.map((btn: any, i: number) => {
                const btnColor = btn.color || '#CEFF00';
                
                let Icon = FaGlobe;
                if (btn.platform === 'spotify') Icon = FaSpotify;
                else if (btn.platform === 'youtube') Icon = FaYoutube;
                else if (btn.platform === 'vimeo') Icon = FaVimeoV;
                else if (btn.platform === 'instagram') Icon = FaInstagram;
                else if (btn.platform === 'tiktok') Icon = FaTiktok;
                else if (btn.platform === 'soundcloud') Icon = FaSoundcloud;
                else if (btn.platform === 'twitter') Icon = FaTwitter;
                else if (btn.platform === 'facebook') Icon = FaFacebook;
                else if (btn.platform === 'apple') Icon = FaApple;
                
                return (
                    <a 
                        key={i} 
                        href={btn.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 rounded-full border-2 transition-all hover:scale-105 group"
                        style={{ 
                            borderColor: btnColor,
                            color: '#fff',
                            backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = btnColor;
                            e.currentTarget.style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#fff';
                        }}
                    >
                        <Icon size={18} className="mr-3 shrink-0" />
                        <span className="font-display tracking-widest uppercase">{btn.label}</span>
                    </a>
                );
            })}
        </div>
    );
};

const renderBlocks = (layout: any[]) => {
    if (!layout?.length) return <p className="text-gray-500 italic">Sin contenido aún.</p>;
    return layout.map((block: any, i: number) => {
        switch (block.blockType) {
            case 'richTextBlock':   return <RichTextBlockRenderer   key={i} block={block} />;
            case 'imageBlock':      return <ImageBlockRenderer      key={i} block={block} />;
            case 'videoBlock':      return <VideoBlockRenderer      key={i} block={block} />;
            case 'galleryBlock':    return <GalleryBlockRenderer    key={i} block={block} />;
            case 'twoColumnsBlock': return <TwoColumnsBlockRenderer key={i} block={block} />;
            case 'pullQuoteBlock':  return <PullQuoteBlockRenderer  key={i} block={block} />;
            case 'separatorBlock':  return <SeparatorBlockRenderer  key={i} block={block} />;
            case 'buttonLinksBlock':return <ButtonLinksBlockRenderer key={i} block={block} />;
            default:                return null;
        }
    });
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface EventClientProps {
    event: any;
}

export default function EventClient({ event }: EventClientProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }
    }, []);

    const name = event.name ?? event.title ?? 'Evento';
    const image = event.featuredImage?.url ?? event.image;
    const isFree = event.isFree ?? event.price?.isFree;
    const price = event.priceAmount ?? event.price?.amount;

    return (
        <article className="min-h-screen bg-black pb-20">
            {/* Hero */}
            <div className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px] bg-black">
                {image && (
                    <Image src={image} alt={name} fill className="object-cover object-center opacity-60 z-10" priority />
                )}
                {/* Gradient that smoothly blends into the black background below */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 md:via-black/20 to-transparent z-20" />
                
                <div className="absolute bottom-0 left-0 right-0 py-8 md:py-16 text-white z-30">
                    <div className="container mx-auto px-4">
                        <Link
                            href="/eventos"
                            className="inline-flex items-center px-4 py-2 hover:bg-white hover:text-black transition-all text-xs font-mono font-bold tracking-widest uppercase mb-6 bg-bifido-neon text-black rounded-full"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Volver a Eventos
                        </Link>
                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-2 leading-[0.9] uppercase drop-shadow-xl">{name}</h1>
                    </div>
                </div>
            </div>

            {/* Info Bar */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-12 border-t border-white/10 mb-16">
                    {/* Date */}
                    <div className="flex flex-col items-start gap-4">
                        <div className="flex items-center gap-3 text-bifido-neon">
                            <Calendar size={24} />
                            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em]">Fecha y Hora</span>
                        </div>
                        {event.date && (
                            <div className="text-white">
                                <p className="font-display text-2xl mb-1">{formatEventDate(event.date)}</p>
                                <p className="font-mono text-gray-400 text-sm">{formatEventTime(event.date)}</p>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    <div className="flex flex-col items-start gap-4">
                        <div className="flex items-center gap-3 text-bifido-neon">
                            <MapPin size={24} />
                            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em]">Ubicación</span>
                        </div>
                        <div className="flex flex-col items-start text-white">
                            {(event.address || event.city) && (
                                <p className="font-display text-2xl mb-1 leading-tight">{event.address || event.city}</p>
                            )}
                            {(event.address && event.city) && (
                                <p className="font-mono text-gray-400 text-sm">{event.city}</p>
                            )}
                            {event.virtualLink && (
                                <a
                                    href={event.virtualLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-transparent border border-bifido-neon text-bifido-neon font-mono text-xs uppercase tracking-widest mt-4 px-6 py-2 hover:bg-bifido-neon hover:text-black transition-colors rounded-full"
                                >
                                    <Video size={16} />
                                    Ver transmisión
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Price & Ticket */}
                    <div className="flex flex-col items-start gap-4">
                        <div className="flex items-center gap-3 text-bifido-neon">
                            <span className="font-display text-2xl leading-none">$</span>
                            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em]">Entrada</span>
                        </div>
                        <div className="flex flex-col items-start">
                            <p suppressHydrationWarning className="font-display text-3xl text-white mb-4">
                                {isFree ? 'ENTRADA LIBRE' : price ? `$${Number(price).toLocaleString()} COP` : 'Consultar'}
                            </p>
                            {event.ticketLink && (
                                <a
                                    href={event.ticketLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-black font-mono text-xs font-bold px-8 py-3 uppercase tracking-widest hover:bg-bifido-neon transition-colors rounded-full"
                                >
                                    {isFree ? 'Inscribirse' : 'Comprar Ticket'}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description excerpt */}
                {event.excerpt && (
                    <div className="mb-10">
                        <p className="text-gray-300 text-lg leading-relaxed border-l-4 border-bifido-neon pl-6 italic">
                            {event.excerpt}
                        </p>
                    </div>
                )}

                {/* Rich blocks content */}
                <div ref={contentRef} className="max-w-none">
                    {event.layout?.length ? renderBlocks(event.layout) : null}
                </div>
            </div>
        </article>
    );
}
