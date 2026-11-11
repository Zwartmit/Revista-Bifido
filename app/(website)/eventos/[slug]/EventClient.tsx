'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowLeft, ArrowRight, Video, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { FaSpotify, FaYoutube, FaInstagram, FaVimeoV, FaGlobe, FaTiktok, FaSoundcloud, FaTwitter, FaFacebook, FaApple } from 'react-icons/fa';
import gsap from 'gsap';
import { getCharacterColors } from '@/lib/character-colors';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return url;
};

const parseEventDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    let normalized = dateStr;
    if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(dateStr)) {
        normalized = `${dateStr}Z`;
    }
    return new Date(normalized);
};

const formatEventDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = parseEventDate(dateStr);
    return d.toLocaleDateString('es-CO', {
        timeZone: 'America/Bogota',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const formatEventTime = (dateStr: string) => {
    if (!dateStr) return '';
    const d = parseEventDate(dateStr);
    return d.toLocaleTimeString('es-CO', {
        timeZone: 'America/Bogota',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
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
            {root ? renderNode(root, 0) : <p className="text-gray-400 italic">Sin contenido.</p>}
        </div>
    );
};

import FlipImageCard from '@/components/FlipImageCard';

const ImageBlockRenderer = ({ block }: { block: any }) => {
    const src = block.image?.url ?? block.image;
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!isZoomOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsZoomOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZoomOpen]);

    if (!src) return null;

    const hasFlip = Boolean(
        block.enableFlip && (
            (block.flipText && block.flipText.trim().length > 0) ||
            (block.flipTitle && block.flipTitle.trim().length > 0) ||
            block.flipImage?.url ||
            (typeof block.flipImage === 'string' && block.flipImage.length > 0)
        )
    );

    const lightbox = isZoomOpen && mounted ? createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={() => setIsZoomOpen(false)}
        >
            <button
                onClick={() => setIsZoomOpen(false)}
                className="fixed top-4 right-4 z-[10000] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Cerrar"
            >
                <X size={24} />
            </button>

            <div className="flex items-center justify-center w-full h-full px-6 sm:px-16 py-8 md:py-12" onClick={e => e.stopPropagation()}>
                <Image
                    src={src}
                    alt={block.caption || 'Imagen del evento'}
                    width={1600}
                    height={1200}
                    className="object-contain max-h-[85vh] max-w-full w-auto h-auto rounded-xl shadow-2xl"
                />
            </div>

            {block.caption && (
                <p className="fixed bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/70 z-[10000] bg-black/70 px-5 py-1.5 rounded-full border border-white/10">
                    {block.caption}
                </p>
            )}
        </div>,
        document.body
    ) : null;

    return (
        <>
            <figure className="mb-10">
                <FlipImageCard
                    image={src}
                    caption={block.caption}
                    enableFlip={block.enableFlip}
                    flipContentType={block.flipContentType}
                    flipTitle={block.flipTitle}
                    flipText={block.flipText}
                    flipImage={block.flipImage}
                    flipImageCaption={block.flipImageCaption}
                    fill={true}
                    aspectRatioClass="aspect-video"
                    imageClassName="object-cover rounded-2xl"
                    alt={block.caption ?? 'Imagen del evento'}
                    onZoomClick={() => setIsZoomOpen(true)}
                    onClick={() => setIsZoomOpen(true)}
                />
                {block.caption && (
                    <figcaption className="text-center text-sm text-gray-400 mt-3 italic">{block.caption}</figcaption>
                )}
                {block.linkUrl && (
                    <div className="mt-3 flex justify-center">
                        <a
                            href={block.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/30 text-xs font-mono uppercase tracking-widest transition-all hover:scale-105 shadow-md"
                        >
                            <span>{block.linkLabel || 'Ver enlace'}</span>
                            <ExternalLink size={13} />
                        </a>
                    </div>
                )}
            </figure>
            {lightbox}
        </>
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
                <p className="text-center text-sm text-gray-400 mt-3 italic">{block.caption}</p>
            )}
        </div>
    );
};

const GalleryBlockRenderer = ({ block }: { block: any }) => {
    const images: any[] = block.images ?? [];
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    if (!images.length) return null;

    const isCarousel = block.layout === 'carousel';
    const isMasonry = block.layout === 'masonry';
    const gridCols = block.layout === 'grid-3' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2';

    const aspectMap: Record<string, string> = {
        square: 'aspect-square w-full',
        landscape: 'aspect-video w-full',
        classic: 'aspect-[4/3] w-full',
        portrait: 'aspect-[3/4] w-full',
        natural: 'w-full h-auto',
    };
    const aspectRatio = block.aspectRatio || (isCarousel ? 'landscape' : 'square');
    const isNatural = aspectRatio === 'natural';
    const aspectClass = aspectMap[aspectRatio] || 'aspect-video w-full';
    const imageFit = (block.imageFit || 'contain') as 'cover' | 'contain';

    const openLightbox = (i: number) => setLightboxIndex(i);
    const closeLightbox = () => setLightboxIndex(null);
    const goPrev = (e: React.MouseEvent) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i - 1 + images.length) % images.length : null); };
    const goNext = (e: React.MouseEvent) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i + 1) % images.length : null); };

    const prevCarouselSlide = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCarouselIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const nextCarouselSlide = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCarouselIndex((prev) => (prev + 1) % images.length);
    };

    const currentLightboxItem = lightboxIndex !== null ? images[lightboxIndex] : null;
    const currentLightboxSrc = currentLightboxItem
        ? (currentLightboxItem.image?.url || (typeof currentLightboxItem.image === 'string' ? currentLightboxItem.image : (typeof currentLightboxItem === 'string' ? currentLightboxItem : '')))
        : '';

    const lightbox = lightboxIndex !== null && mounted ? createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={closeLightbox}
        >
            <button
                onClick={closeLightbox}
                className="fixed top-4 right-4 z-[10000] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Cerrar"
            >
                <X size={24} />
            </button>

            <span className="fixed top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-mono z-[10000]">
                {lightboxIndex + 1} / {images.length}
            </span>

            {images.length > 1 && (
                <button
                    onClick={goPrev}
                    className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[10000]"
                    aria-label="Anterior"
                >
                    <ChevronLeft size={28} />
                </button>
            )}

            <div className="flex items-center justify-center w-full h-full px-16 py-8 md:py-12" onClick={e => e.stopPropagation()}>
                {currentLightboxSrc && (
                    <Image
                        src={currentLightboxSrc}
                        alt={currentLightboxItem?.caption || 'Imagen del evento'}
                        width={1600}
                        height={1200}
                        className="object-contain max-h-[80vh] max-w-full w-auto h-auto rounded-xl shadow-2xl"
                    />
                )}
            </div>

            {currentLightboxItem?.caption && (
                <p className="fixed bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/60 z-[10000] bg-black/50 px-4 py-1 rounded-full">{currentLightboxItem.caption}</p>
            )}

            {images.length > 1 && (
                <button
                    onClick={goNext}
                    className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[10000]"
                    aria-label="Siguiente"
                >
                    <ChevronRight size={28} />
                </button>
            )}
        </div>,
        document.body
    ) : null;

    if (isCarousel) {
        const currentItem = images[carouselIndex] || images[0];
        const currentData = currentItem?.image ?? currentItem;

        return (
            <>
                <div className="relative my-8 md:my-12 clear-both max-w-4xl mx-auto border border-white/10 rounded-2xl p-4 sm:p-6 bg-black shadow-2xl">
                    <div className="relative w-full h-[460px] sm:h-[580px] md:h-[680px] max-h-[80vh] flex items-center justify-center bg-black/90 rounded-xl overflow-hidden border border-white/5">
                        <figure className="w-full h-full flex items-center justify-center">
                            <FlipImageCard
                                image={currentData}
                                caption={currentItem.caption}
                                enableFlip={currentItem.enableFlip}
                                flipContentType={currentItem.flipContentType}
                                flipTitle={currentItem.flipTitle}
                                flipText={currentItem.flipText}
                                flipImage={currentItem.flipImage}
                                flipImageCaption={currentItem.flipImageCaption}
                                fill={true}
                                className="w-full h-full"
                                aspectRatioClass="w-full h-full"
                                imageFit="contain"
                                imageClassName="object-contain p-2 sm:p-4"
                                onZoomClick={() => openLightbox(carouselIndex)}
                                onClick={() => openLightbox(carouselIndex)}
                            />
                        </figure>

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prevCarouselSlide}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/75 hover:bg-white text-white hover:text-black border border-white/20 rounded-full transition-all backdrop-blur-md z-20 shadow-xl"
                                    aria-label="Imagen anterior"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <button
                                    type="button"
                                    onClick={nextCarouselSlide}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/75 hover:bg-white text-white hover:text-black border border-white/20 rounded-full transition-all backdrop-blur-md z-20 shadow-xl"
                                    aria-label="Siguiente imagen"
                                >
                                    <ChevronRight size={22} />
                                </button>
                            </>
                        )}
                    </div>

                    {currentItem.linkUrl && (
                        <div className="mt-4 mb-2 flex justify-center">
                            <a
                                href={currentItem.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black hover:bg-[#b8ff00] hover:text-black font-mono text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-xl"
                            >
                                <span>{currentItem.linkLabel || 'Ver enlace'}</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    )}

                    <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-2 border-t border-white/10">
                        <div className="flex-1 text-center sm:text-left">
                            {currentItem.caption && (
                                <p className="text-sm text-gray-300 font-googlesans">{currentItem.caption}</p>
                            )}
                        </div>

                        {images.length > 1 && (
                            <span className="font-mono text-xs text-white/60 tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                {carouselIndex + 1} / {images.length}
                            </span>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-3 pt-1">
                            {images.map((_: any, idx: number) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCarouselIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        idx === carouselIndex ? 'w-6 bg-white opacity-100' : 'w-2 bg-white/30 hover:bg-white/60'
                                    }`}
                                    aria-label={`Ir a imagen ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {lightbox}
            </>
        );
    }

    if (isMasonry) {
        return (
            <>
                <div className="columns-1 sm:columns-2 md:columns-3 gap-4 mb-10 [column-fill:_balance]">
                    {images.map((img: any, i: number) => {
                        const imgData = img.image ?? img;
                        return (
                            <figure key={i} className="break-inside-avoid mb-4 flex flex-col">
                                <FlipImageCard
                                    image={imgData}
                                    caption={img.caption}
                                    enableFlip={img.enableFlip}
                                    flipContentType={img.flipContentType}
                                    flipTitle={img.flipTitle}
                                    flipText={img.flipText}
                                    flipImage={img.flipImage}
                                    flipImageCaption={img.flipImageCaption}
                                    fill={false}
                                    width={imgData.width || 800}
                                    height={imgData.height || 600}
                                    imageClassName="rounded-xl w-full h-auto object-cover"
                                    imageFit="cover"
                                    onZoomClick={() => openLightbox(i)}
                                    onClick={() => openLightbox(i)}
                                />
                                {img.caption && (
                                    <figcaption className="text-center text-xs text-gray-400 mt-2 pb-1">
                                        {img.caption}
                                    </figcaption>
                                )}
                                {img.linkUrl && (
                                    <div className="mt-2 flex justify-center">
                                        <a
                                            href={img.linkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-mono uppercase tracking-wider transition-all"
                                        >
                                            <span>{img.linkLabel || 'Ver más'}</span>
                                            <ExternalLink size={12} />
                                        </a>
                                    </div>
                                )}
                            </figure>
                        );
                    })}
                </div>
                {lightbox}
            </>
        );
    }

    return (
        <>
            <div className={`grid ${gridCols} gap-4 mb-10`}>
                {images.map((img: any, i: number) => {
                    const imgData = img.image ?? img;

                    if (isNatural) {
                        return (
                            <figure key={i} className="flex flex-col">
                                <FlipImageCard
                                    image={imgData}
                                    caption={img.caption}
                                    enableFlip={img.enableFlip}
                                    flipContentType={img.flipContentType}
                                    flipTitle={img.flipTitle}
                                    flipText={img.flipText}
                                    flipImage={img.flipImage}
                                    flipImageCaption={img.flipImageCaption}
                                    fill={false}
                                    width={imgData.width || 800}
                                    height={imgData.height || 600}
                                    imageClassName="rounded-xl w-full h-auto object-cover"
                                    imageFit="cover"
                                    onZoomClick={() => openLightbox(i)}
                                    onClick={() => openLightbox(i)}
                                />
                                {img.caption && (
                                    <figcaption className="text-center text-xs text-gray-400 mt-2 pb-1">
                                        {img.caption}
                                    </figcaption>
                                )}
                                {img.linkUrl && (
                                    <div className="mt-2 flex justify-center">
                                        <a
                                            href={img.linkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-mono uppercase tracking-wider transition-all"
                                        >
                                            <span>{img.linkLabel || 'Ver más'}</span>
                                            <ExternalLink size={12} />
                                        </a>
                                    </div>
                                )}
                            </figure>
                        );
                    }

                    return (
                        <figure key={i} className="flex flex-col">
                            <div className={`relative ${aspectClass}`}>
                                <FlipImageCard
                                    image={imgData}
                                    caption={img.caption}
                                    enableFlip={img.enableFlip}
                                    flipContentType={img.flipContentType}
                                    flipTitle={img.flipTitle}
                                    flipText={img.flipText}
                                    flipImage={img.flipImage}
                                    flipImageCaption={img.flipImageCaption}
                                    fill={true}
                                    aspectRatioClass={aspectClass}
                                    imageFit={imageFit}
                                    imageClassName="rounded-xl"
                                    onZoomClick={() => openLightbox(i)}
                                    onClick={() => openLightbox(i)}
                                />
                            </div>
                            {img.caption && (
                                <figcaption className="text-center text-xs text-gray-400 mt-2 pb-1">
                                    {img.caption}
                                </figcaption>
                            )}
                            {img.linkUrl && (
                                <div className="mt-2 flex justify-center">
                                    <a
                                        href={img.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-mono uppercase tracking-wider transition-all"
                                    >
                                        <span>{img.linkLabel || 'Ver más'}</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            )}
                        </figure>
                    );
                })}
            </div>
            {lightbox}
        </>
    );
};

const TwoColumnsBlockRenderer = ({ block }: { block: any }) => {
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const imgRight = block.imagePosition === 'right';
    const ratioMap: Record<string, [string, string]> = {
        '50-50': ['md:w-1/2', 'md:w-1/2'],
        '40-60': ['md:w-2/5', 'md:w-3/5'],
        '60-40': ['md:w-3/5', 'md:w-2/5'],
    };
    const [imgW, txtW] = ratioMap[block.columnRatio || '50-50'];

    const lightbox = isZoomOpen && mounted && block.image?.url ? createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={() => setIsZoomOpen(false)}
        >
            <button
                onClick={() => setIsZoomOpen(false)}
                className="fixed top-4 right-4 z-[10000] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Cerrar"
            >
                <X size={24} />
            </button>
            <div className="flex items-center justify-center w-full h-full px-6 sm:px-16 py-8 md:py-12" onClick={e => e.stopPropagation()}>
                <Image
                    src={block.image.url}
                    alt={block.imageCaption || block.image.filename || ''}
                    width={1600}
                    height={1200}
                    className="object-contain max-h-[85vh] max-w-full w-auto h-auto rounded-xl shadow-2xl"
                />
            </div>
            {block.imageCaption && (
                <p className="fixed bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/70 z-[10000] bg-black/70 px-5 py-1.5 rounded-full border border-white/10">
                    {block.imageCaption}
                </p>
            )}
        </div>,
        document.body
    ) : null;

    return (
        <div className={`flex flex-col md:flex-row gap-6 my-10 clear-both items-start ${imgRight ? 'md:flex-row-reverse' : ''}`}>
            {block.image?.url && (
                <figure className={`${imgW} shrink-0`}>
                    <FlipImageCard
                        image={block.image}
                        caption={block.imageCaption}
                        enableFlip={block.enableFlip}
                        flipContentType={block.flipContentType}
                        flipTitle={block.flipTitle}
                        flipText={block.flipText}
                        flipImage={block.flipImage}
                        flipImageCaption={block.flipImageCaption}
                        width={block.image.width || 800}
                        height={block.image.height || 600}
                        imageClassName="rounded-xl object-cover w-full h-auto"
                        onZoomClick={() => setIsZoomOpen(true)}
                        onClick={() => setIsZoomOpen(true)}
                    />
                    {block.imageCaption && <figcaption className="text-center text-xs text-gray-400 mt-2">{block.imageCaption}</figcaption>}
                </figure>
            )}
            <div className={`${txtW} text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line`}>
                {block.text}
            </div>
            {lightbox}
        </div>
    );
};

const PullQuoteBlockRenderer = ({ block }: { block: any }) => (
    <div className="my-8 md:my-14 clear-both text-center px-4 md:px-16">
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
    if (block.style === 'space') return <div className="my-8 md:my-14 clear-both" />;
    if (block.style === 'dots')
        return <div className="my-8 md:my-12 clear-both text-center text-white/50 text-2xl tracking-[1.5rem] select-none">···</div>;
    if (block.style === 'fade')
        return <div className="my-8 md:my-12 clear-both h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />;
    return <hr className="my-8 md:my-12 clear-both border-white/40" />;
};

const ButtonLinksBlockRenderer = ({ block }: { block: any }) => {
    if (!block.buttons?.length) return null;
    
    return (
        <div className="my-8 md:my-14 clear-both flex flex-wrap justify-center gap-4">
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
    if (!layout?.length) return <p className="text-gray-400 italic">Sin contenido aún.</p>;
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
        <article className="min-h-screen bg-black pb-12 md:pb-20">
            {/* Hero */}
            <div className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px] bg-black">
                {image && (
                    <Image src={image} alt={name} fill className="object-cover object-center opacity-60 z-10" priority />
                )}
                {/* Gradient that smoothly blends into the black background below */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 md:via-black/20 to-transparent z-20" />
                
                <div className="absolute bottom-0 left-0 right-0 py-8 md:py-10 md:py-16 text-white z-30">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-8 md:py-12 border-t border-white/10 mb-10 md:mb-16">
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
                                    data-track="ticket_click"
                                    data-track-label={event.name}
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

                {/* ── PERSONAJES ASOCIADOS AL EVENTO & CTA ── */}
                {event.characters && event.characters.length > 0 && (
                    <section className="mt-12 md:mt-20 pt-12 border-t border-white/10 flex flex-col items-center">
                        <div className="w-full flex flex-wrap justify-center gap-6">
                            {event.characters.map((char: any) => {
                                const colors = getCharacterColors(char.slug);
                                return (
                                    <div
                                        key={char.id || char.slug}
                                        className="relative w-full max-w-xl p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group overflow-hidden"
                                    >
                                        <div
                                            className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                                            style={{ backgroundColor: colors.primary }}
                                        />

                                        <div>
                                            <div className="flex items-center gap-4 mb-4">
                                                {char.image && (
                                                    <div
                                                        className="relative w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0 bg-black"
                                                        style={{ borderColor: colors.primary }}
                                                    >
                                                        <Image
                                                            src={char.image}
                                                            alt={char.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-[12px] font-mono uppercase tracking-widest text-gray-400">
                                                        La Manada Bífido
                                                    </span>
                                                    <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide">
                                                        {char.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            {char.description && (
                                                <p className="text-gray-300 font-googlesans text-sm leading-relaxed mb-6 line-clamp-2 h-[2.75rem] overflow-hidden">
                                                    {char.description}
                                                </p>
                                            )}
                                        </div>

                                        <Link
                                            href={`/${char.slug}/articulos`}
                                            className="self-center inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg mt-3 w-fit max-w-full text-center"
                                            style={{
                                                backgroundColor: colors.primary,
                                                color: '#000000',
                                            }}
                                        >
                                            <span>Ver todas las publicaciones de {char.name}</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </article>
    );
}
