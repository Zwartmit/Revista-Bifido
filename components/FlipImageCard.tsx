'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, RotateCcw } from 'lucide-react';

interface FlipImageCardProps {
    image: any;
    caption?: string;
    enableFlip?: boolean;
    flipContentType?: 'text' | 'image';
    flipTitle?: string;
    flipText?: string;
    flipImage?: any;
    flipImageCaption?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    aspectRatioClass?: string;
    className?: string;
    imageClassName?: string;
    alt?: string;
    imageFit?: 'cover' | 'contain';
    onZoomClick?: () => void;
    onClick?: () => void;
}

export default function FlipImageCard({
    image,
    caption,
    enableFlip,
    flipContentType = 'text',
    flipTitle,
    flipText,
    flipImage,
    flipImageCaption,
    width = 1200,
    height = 800,
    fill = false,
    aspectRatioClass,
    className = '',
    imageClassName = 'rounded-2xl object-cover w-full h-auto',
    alt,
    imageFit = 'cover',
    onZoomClick,
    onClick,
}: FlipImageCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const imageUrl = typeof image === 'string' ? image : (image?.url || '');
    if (!imageUrl) return null;

    const finalAlt = alt || caption || (typeof image === 'object' && image?.filename) || 'imagen';
    const backImageUrl = typeof flipImage === 'string' ? flipImage : (flipImage?.url || '');

    // Se activa el flip si el usuario configuró enableFlip y hay contenido en el reverso
    const hasFlip = Boolean(
        enableFlip && (
            (flipText && flipText.trim().length > 0) ||
            (flipTitle && flipTitle.trim().length > 0) ||
            Boolean(backImageUrl)
        )
    );

    // Ajuste de clases según si es contain o cover
    const isContain = imageFit === 'contain';
    const baseFitClass = isContain
        ? imageClassName.replace('object-cover', 'object-contain').concat(' object-contain')
        : imageClassName;

    const handleZoomOrClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onZoomClick) {
            onZoomClick();
        } else if (onClick) {
            onClick();
        }
    };

    // Botón de zoom / ampliar: fino, elegante y con contraste nítido (borde fino 1px, fondo oscuro con blur y sombra suave)
    const zoomButton = onZoomClick ? (
        <button
            type="button"
            onClick={handleZoomOrClick}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute top-2.5 left-2.5 bg-black/85 hover:bg-black backdrop-blur-md text-white/90 hover:text-bifido-neon border border-white/30 hover:border-bifido-neon/70 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.85)] transition-all duration-200 z-30 pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 group/zoom"
            aria-label="Ver imagen ampliada"
            title="Ver imagen en tamaño completo"
        >
            <ZoomIn size={13} className="text-white/80 group-hover/zoom:text-bifido-neon transition-colors" />
            <span>Ampliar</span>
        </button>
    ) : null;

    // Caso estándar: Sin efecto flip
    if (!hasFlip) {
        if (fill) {
            return (
                <div 
                    className={`relative ${aspectRatioClass || 'w-full h-full'} ${className} ${(onClick || onZoomClick) ? 'cursor-pointer' : ''} bg-black rounded-2xl overflow-hidden border border-white/10 group`}
                    onClick={handleZoomOrClick}
                >
                    <Image
                        src={imageUrl}
                        alt={finalAlt}
                        fill
                        className={`${baseFitClass} ${isContain ? 'p-2' : ''} transition-transform duration-300 group-hover:scale-105`}
                    />
                    {zoomButton}
                </div>
            );
        }
        return (
            <div 
                className={`relative group ${className} ${(onClick || onZoomClick) ? 'cursor-pointer' : ''}`}
                onClick={handleZoomOrClick}
            >
                <Image
                    src={imageUrl}
                    alt={finalAlt}
                    width={width}
                    height={height}
                    className={baseFitClass}
                />
                {zoomButton}
            </div>
        );
    }

    // Caso con efecto 3D Flip:
    // NO gira por hover para que el usuario no pierda el control.
    // Gira solo al pulsar el botón "Girar ↺".
    return (
        <div
            className={`bifido-flip-container relative select-none ${fill ? 'w-full h-full' : ''} ${className}`}
        >
            <div
                className={`bifido-flip-inner relative w-full ${fill ? 'h-full' : ''} ${aspectRatioClass || ''} rounded-2xl ${isFlipped ? 'is-flipped' : ''}`}
                style={{
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    WebkitTransform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* ── Cara Frontal ── */}
                <div 
                    className={`bifido-flip-face relative w-full h-full rounded-2xl border border-white/10 hover:border-white/25 transition-colors shadow-2xl bg-black overflow-hidden ${(onClick || onZoomClick) ? 'cursor-pointer' : ''} ${isFlipped ? 'pointer-events-none' : 'pointer-events-auto'}`}
                    onClick={handleZoomOrClick}
                >
                    {fill ? (
                        <Image
                            src={imageUrl}
                            alt={finalAlt}
                            fill
                            className={`${baseFitClass} ${isContain ? 'p-2' : ''} rounded-2xl select-none`}
                        />
                    ) : (
                        <Image
                            src={imageUrl}
                            alt={finalAlt}
                            width={width}
                            height={height}
                            className={`${baseFitClass} rounded-2xl select-none block`}
                        />
                    )}

                    {/* Botón lupa para ver imagen ampliada en Lightbox */}
                    {zoomButton}

                    {/* Botón interactivo para girar tarjeta en 3D (borde fino 1px y diseño refinado) */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsFlipped(true);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute bottom-2.5 right-2.5 bg-black/85 hover:bg-black backdrop-blur-md text-white/90 hover:text-bifido-neon border border-white/30 hover:border-bifido-neon/70 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.85)] pointer-events-auto cursor-pointer transition-all duration-200 z-30 hover:scale-105 active:scale-95 group/flip"
                        aria-label="Voltear tarjeta para ver reverso"
                        title="Girar para ver reverso"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-bifido-neon animate-pulse" />
                        <span>Girar ↺</span>
                    </button>
                </div>

                {/* ── Cara Trasera (Reverso 3D) ── */}
                <div
                    className={`bifido-flip-back absolute inset-0 w-full h-full rounded-2xl border border-white/15 bg-black flex flex-col justify-between items-center p-5 md:p-6 text-center z-20 shadow-2xl overflow-hidden cursor-pointer ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(false);
                    }}
                >
                    {/* Header del reverso */}
                    <div className="w-full flex items-center justify-between pointer-events-auto z-30">
                        {onZoomClick && flipContentType === 'image' && backImageUrl ? (
                            <button
                                type="button"
                                onClick={handleZoomOrClick}
                                onMouseDown={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="bg-black/85 hover:bg-black backdrop-blur-md text-white/90 hover:text-bifido-neon border border-white/30 hover:border-bifido-neon/70 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.85)] transition-all group/backzoom"
                                aria-label="Ver reverso ampliado"
                                title="Ver en grande"
                            >
                                <ZoomIn size={13} className="text-white/80 group-hover/backzoom:text-bifido-neon" />
                                <span>Ampliar</span>
                            </button>
                        ) : (
                            <span />
                        )}

                        <span className="bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15 text-[10px] font-mono uppercase tracking-wider text-gray-300">
                            Reverso
                        </span>
                    </div>

                    {/* Contenido central del reverso */}
                    {flipContentType === 'image' && backImageUrl ? (
                        <div className="relative w-full flex-1 my-2 min-h-0 flex flex-col items-center justify-center">
                            <Image
                                src={backImageUrl}
                                alt={flipImageCaption || 'Imagen al reverso'}
                                fill
                                className={`${isContain ? 'object-contain p-2' : 'object-cover'} rounded-xl select-none`}
                            />
                            {flipImageCaption && (
                                <div className="absolute bottom-2 inset-x-2 bg-black/90 backdrop-blur-md py-1.5 px-3 rounded-lg text-xs text-gray-200 font-sans border border-white/10 z-10">
                                    {flipImageCaption}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full max-w-lg overflow-y-auto max-h-full custom-scrollbar my-auto p-2">
                            {flipTitle && (
                                <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold text-bifido-neon mb-2 flex items-center gap-2">
                                    <span className="w-2 h-0.5 bg-bifido-neon inline-block" />
                                    {flipTitle}
                                    <span className="w-2 h-0.5 bg-bifido-neon inline-block" />
                                </span>
                            )}
                            {flipText ? (
                                <p className="font-sans text-xs md:text-sm lg:text-base text-gray-200 leading-relaxed italic whitespace-pre-line">
                                    “{flipText}”
                                </p>
                            ) : (
                                <p className="font-sans text-xs text-gray-400 italic">
                                    (Sin texto especificado)
                                </p>
                            )}
                        </div>
                    )}

                    {/* Botón para volver al frente */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsFlipped(false);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 text-xs font-mono uppercase tracking-wider transition-all duration-200 pointer-events-auto cursor-pointer shadow-md hover:scale-105 active:scale-95 z-30"
                        title="Volver a la imagen frontal"
                    >
                        <RotateCcw size={12} />
                        <span>Volver ↺</span>
                    </button>
                </div>
            </div>
        </div>
    );
}