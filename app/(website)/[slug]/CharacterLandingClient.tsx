'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { getCharacterColors } from '@/lib/character-colors';
import { Character } from '@/types';

interface Props {
    character: Character;
}

export default function CharacterLandingClient({ character }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { primary, dark } = getCharacterColors(character.slug);

    useEffect(() => {
        if (!containerRef.current) return;
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.cl-anim', { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 })
          .fromTo('.cl-image', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1 }, '-=0.5')
          .fromTo('.cl-tag', { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08 }, '-=0.4');
    }, []);

    const infoItems = [
        { label: 'Religión', value: character.religion },
        { label: 'Edad', value: character.age },
        { label: 'Color favorito', value: character.favoriteColor },
    ].filter(item => item.value);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">

            {/* ─── HERO FULLBLEED ─────────────────────────────────── */}
            <section
                className="relative w-full min-h-screen flex items-end"
                style={{ background: `linear-gradient(145deg, ${dark}55 0%, #000 55%)` }}
            >
                {/* Ambient glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 60% 80% at 72% 40%, ${primary}18 0%, transparent 70%)` }}
                />

                {/* Vertical decorative line */}
                <div
                    className="absolute top-0 left-[38%] w-px h-full opacity-10 hidden lg:block"
                    style={{ backgroundColor: primary }}
                />

                {/* Character image — right pinned */}
                <div className="cl-image absolute inset-y-0 right-0 w-[58%] lg:w-[48%] flex items-end justify-center pointer-events-none">
                    {character.image && (
                        <Image
                            src={character.image}
                            alt={character.name}
                            width={640}
                            height={820}
                            className="object-contain object-bottom w-full h-full max-h-screen drop-shadow-[0_0_80px_rgba(0,0,0,0.98)]"
                            priority
                        />
                    )}
                </div>

                {/* Content */}
                <div className="relative z-10 w-full lg:w-[55%] px-6 sm:px-10 lg:px-16 xl:px-24 pb-20 pt-36">

                    {/* Back */}
                    <Link
                        href="/elparche"
                        className="cl-anim inline-flex items-center gap-2 font-googlesans text-[11px] tracking-[0.3em] text-white/30 hover:text-white/60 uppercase mb-12 transition-colors"
                    >
                        ← El Parche
                    </Link>

                    {/* Label */}
                    <span
                        className="cl-anim block font-display text-[11px] tracking-[0.5em] uppercase mb-4"
                        style={{ color: primary }}
                    >
                        La Manada
                    </span>

                    {/* Name */}
                    <h1 className="cl-anim font-display text-7xl sm:text-8xl lg:text-[9rem] text-white leading-[0.9] mb-6 uppercase tracking-tight">
                        {character.name}
                    </h1>

                    {/* Accent line */}
                    <div className="cl-anim w-24 h-[3px] mb-8" style={{ backgroundColor: primary }} />

                    {/* Description */}
                    <p className="cl-anim font-googlesans text-gray-300 text-base leading-relaxed max-w-md mb-10">
                        {character.description}
                    </p>

                    {/* CTA buttons */}
                    <div className="cl-anim flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/${character.slug}/articulos`}
                            className="group inline-flex items-center gap-3 px-7 py-4 font-display text-sm tracking-[0.25em] uppercase text-black transition-all duration-300 hover:opacity-90"
                            style={{ backgroundColor: primary }}
                        >
                            Ver artículos
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#ficha"
                            className="group inline-flex items-center gap-3 px-7 py-4 font-display text-sm tracking-[0.25em] uppercase text-white border transition-all duration-300 hover:border-white/50"
                            style={{ borderColor: `${primary}40` }}
                        >
                            Ficha técnica
                            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </section>

            {/* ─── FICHA TÉCNICA ──────────────────────────────────── */}
            <section id="ficha" className="px-6 sm:px-10 lg:px-16 xl:px-24 py-24 border-t border-white/5">

                <div className="flex items-center gap-4 mb-16">
                    <div className="w-6 h-[3px]" style={{ backgroundColor: primary }} />
                    <span className="font-display text-2xl tracking-[0.3em] text-white uppercase">Ficha técnica</span>
                    <div className="flex-1 h-px bg-white/8" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Left: info tags */}
                    <div className="flex flex-col gap-0 border-l-2" style={{ borderColor: `${primary}30` }}>
                        {infoItems.map((item, i) => (
                            <div
                                key={i}
                                className="cl-tag flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-8 py-7 border-b border-white/5"
                            >
                                <span
                                    className="font-display text-[10px] tracking-[0.4em] uppercase w-32 shrink-0"
                                    style={{ color: primary }}
                                >
                                    {item.label}
                                </span>
                                <span className="font-googlesans text-white/80 text-base">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Right: bio or placeholder */}
                    <div className="lg:pl-16 pt-10 lg:pt-0">
                        {character.biography ? (
                            <div className="font-googlesans text-gray-400 text-base leading-relaxed space-y-4">
                                {typeof character.biography === 'string'
                                    ? character.biography.split('\n').map((p, i) => <p key={i}>{p}</p>)
                                    : <p>Ver perfil completo.</p>
                                }
                            </div>
                        ) : (
                            <div
                                className="border border-dashed p-10 flex flex-col items-start gap-4"
                                style={{ borderColor: `${primary}20` }}
                            >
                                <span
                                    className="font-display text-[10px] tracking-[0.4em] uppercase"
                                    style={{ color: primary }}
                                >
                                    Biografía
                                </span>
                                <p className="font-googlesans text-white/20 text-sm leading-relaxed">
                                    La historia de {character.name} se está escribiendo. Vuelve pronto.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ─── CALL TO ACTION — CONTENIDO ─────────────────────── */}
            <section
                className="mx-6 sm:mx-10 lg:mx-16 xl:mx-24 mb-24 overflow-hidden"
                style={{ borderTop: `2px solid ${primary}` }}
            >
                <div
                    className="p-12 sm:p-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10"
                    style={{ background: `linear-gradient(120deg, ${dark}22 0%, transparent 70%)` }}
                >
                    <div className="max-w-lg">
                        <span
                            className="font-display text-[10px] tracking-[0.5em] uppercase block mb-4"
                            style={{ color: primary }}
                        >
                            Contenido
                        </span>
                        <h2 className="font-display text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
                            Artículos<br />de {character.name}
                        </h2>
                        <p className="font-googlesans text-gray-500 text-sm leading-relaxed">
                            Crónicas, podcasts y publicaciones. Todo el contenido de {character.name} en un solo lugar.
                        </p>
                    </div>
                    <Link
                        href={`/${character.slug}/articulos`}
                        className="group shrink-0 inline-flex items-center gap-3 px-8 py-5 font-display text-sm tracking-[0.3em] uppercase text-black transition-all duration-300 hover:opacity-85"
                        style={{ backgroundColor: primary }}
                    >
                        Ir al contenido
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

        </div>
    );
}
