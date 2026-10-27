'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';

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
    onZoomClick,
    onClick,
}: FlipImageCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const imageUrl = typeof image === 'string' ? image : (image?.url || '');
    if (!imageUrl) return null;

    const finalAlt = alt || caption || (typeof image === 'object' && image?.filename) || 'imagen';
    const backImageUrl = typeof flipImage === 'string' ? flipImage : (flipImage?.url || '');

    // Se activa el flip si el usuario marcó enableFlip
    const hasFlip = Boolean(
        enableFlip && (
            (flipText && flipText.trim().length > 0) ||
            (flipTitle && flipTitle.trim().length > 0) ||
            Boolean(backImageUrl)
        )
    );

    // Caso estándar: Sin efecto flip
    if (!hasFlip) {
        if (fill) {
            return (
                <div 
                    className={`relative ${aspectRatioClass || 'w-full h-full'} ${className} ${onClick ? 'cursor-pointer' : ''}`}
                    onClick={onClick}
                >
                    <Image
                        src={imageUrl}
                        alt={finalAlt}
                        fill
                        className={imageClassName}
                    />
                </div>
            );
        }
        return (
            <div 
                className={`relative ${className} ${onClick ? 'cursor-pointer' : ''}`}
                onClick={onClick}
            >
                <Image
                    src={imageUrl}
                    alt={finalAlt}
                    width={width}
                    height={height}
                    className={imageClassName}
                />
            </div>
        );
    }

    const showBack = isHovered || isFlipped;

    const handleCardClick = (e: React.MouseEvent) => {
        // En móviles/touch o clic en el cuerpo de la tarjeta, alternar giro
        setIsFlipped(prev => !prev);
        if (onClick) {
            onClick();
        }
    };

    return (
        <div
            className={`bifido-flip-container relative select-none cursor-pointer ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsFlipped(false);
            }}
            onClick={handleCardClick}
            title="Pasa el cursor o pulsa para voltear"
        >
            <div
                className={`bifido-flip-inner relative w-full ${aspectRatioClass || ''} rounded-2xl ${isFlipped ? 'is-flipped' : ''}`}
                style={{
                    transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    WebkitTransform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* ── Cara Frontal ── */}
                <div className="bifido-flip-face relative w-full h-full rounded-2xl border border-white/10 hover:border-bifido-neon/50 transition-colors shadow-2xl bg-black">
                    {fill ? (
                        <Image
                            src={imageUrl}
                            alt={finalAlt}
                            fill
                            className={`${imageClassName} rounded-2xl select-none`}
                        />
                    ) : (
                        <Image
                            src={imageUrl}
                            alt={finalAlt}
                            width={width}
                            height={height}
                            className={`${imageClassName} rounded-2xl select-none block`}
                        />
                    )}

                    {/* Botón opcional de zoom a lightbox */}
                    {onZoomClick && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onZoomClick();
                            }}
                            className="absolute top-3 left-3 bg-black/75 hover:bg-black/95 backdrop-blur-md p-1.5 rounded-full border border-white/20 text-white/90 hover:text-bifido-neon transition-all z-20"
                            aria-label="Ver imagen ampliada"
                            title="Ver en grande"
                        >
                            <ZoomIn size={16} />
                        </button>
                    )}

                    {/* Badge indicador de giro */}
                    <div 
                        className={`absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] font-mono uppercase tracking-wider text-white/90 flex items-center gap-1.5 pointer-events-none transition-opacity duration-300 z-10 ${showBack ? 'opacity-0' : 'opacity-100'}`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-bifido-neon animate-pulse" />
                        Girar ↺
                    </div>
                </div>

                {/* ── Cara Trasera (Reverso 3D) ── */}
                <div
                    className="bifido-flip-back absolute inset-0 w-full h-full rounded-2xl border border-bifido-neon/40 bg-[#0d0d0d] flex flex-col justify-center items-center p-5 md:p-6 text-center z-20 shadow-2xl"
                >
                    {flipContentType === 'image' && backImageUrl ? (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <Image
                                src={backImageUrl}
                                alt={flipImageCaption || 'Imagen al reverso'}
                                fill
                                className="object-cover rounded-2xl select-none"
                            />
                            {flipImageCaption && (
                                <div className="absolute bottom-3 inset-x-3 bg-black/85 backdrop-blur-md py-1.5 px-3 rounded-lg text-xs text-gray-300 font-sans z-10">
                                    {flipImageCaption}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full max-w-lg overflow-y-auto max-h-full custom-scrollbar p-2">
                            {flipTitle && (
                                <span className="text-xs uppercase tracking-[0.25em] font-mono text-bifido-neon mb-2 flex items-center gap-2">
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

                    {/* Botón opcional de zoom en reverso si es imagen */}
                    {onZoomClick && flipContentType === 'image' && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onZoomClick();
                            }}
                            className="absolute top-3 left-3 bg-black/75 hover:bg-black/95 backdrop-blur-md p-1.5 rounded-full border border-white/20 text-white/90 hover:text-bifido-neon transition-all z-20"
                            aria-label="Ver imagen ampliada"
                            title="Ver en grande"
                        >
                            <ZoomIn size={16} />
                        </button>
                    )}

                    {/* Badge indicador reverso */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-mono uppercase text-gray-400 pointer-events-none z-10">
                        Reverso
                    </div>
                </div>
            </div>
        </div>
    );
}
