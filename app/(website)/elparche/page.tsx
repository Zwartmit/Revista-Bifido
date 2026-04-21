'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { characters } from '@/lib/characters';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getAuthors } from '@/lib/api';
import dynamic from 'next/dynamic';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FluidSimulation = dynamic(() => import('@/components/FluidSimulation'), { ssr: false });

export default function ElParchePage() {
    // ── Refs ──────────────────────────────────────────────────────────
    const pageRef       = useRef<HTMLDivElement>(null);
    const contentRef    = useRef<HTMLDivElement>(null);
    const introRef      = useRef<HTMLDivElement>(null);
    const introh1Ref    = useRef<HTMLHeadingElement>(null);
    const introPRef     = useRef<HTMLParagraphElement>(null);
    const leftGridRef   = useRef<HTMLDivElement>(null);
    const showcaseRef   = useRef<HTMLDivElement>(null);
    const bioCardRef    = useRef<HTMLDivElement>(null);
    const bridgeRef     = useRef<HTMLDivElement>(null);
    const bridgeLineRef = useRef<HTMLDivElement>(null);
    const bridgeTextRef = useRef<HTMLDivElement>(null);
    const heroTitleRef  = useRef<HTMLHeadingElement>(null);
    const teamRef       = useRef<HTMLDivElement>(null);

    // ── State ─────────────────────────────────────────────────────────
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCharacterId, setActiveCharacterId] = useState(characters[0].id);
    const activeCharacter = characters.find(m => m.id === activeCharacterId) || characters[0];
    const otherCharacters = characters.filter((m) => m.id !== activeCharacterId);

    const handlePrev = () => {
        const currentIndex = characters.findIndex(m => m.id === activeCharacterId);
        const prevIndex = (currentIndex - 1 + characters.length) % characters.length;
        setActiveCharacterId(characters[prevIndex].id);
    };

    const handleNext = () => {
        const currentIndex = characters.findIndex(m => m.id === activeCharacterId);
        const nextIndex = (currentIndex + 1) % characters.length;
        setActiveCharacterId(characters[nextIndex].id);
    };

    // ── Data fetch ────────────────────────────────────────────────────
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const authors = await getAuthors();
                setTeam(authors);
            } catch (error) {
                console.error('Error fetching team:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    // ── GSAP Animations ───────────────────────────────────────────────
    useGSAP(() => {
        const ctx = gsap.context(() => {

            // 1. INTRO: title slides up with clip, paragraph fades after
            if (introh1Ref.current && introPRef.current) {
                gsap.fromTo(
                    introh1Ref.current,
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.05 }
                );
                gsap.fromTo(
                    introPRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
                );
            }

            // 2. LEFT ACCORDION: stripes slide in from left in stagger
            if (leftGridRef.current) {
                const items = leftGridRef.current.querySelectorAll(':scope > div');
                gsap.fromTo(
                    items,
                    { x: -60, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
                );
            }

            // 3. SHOWCASE: image scales from 1.08 + bio card floats up
            if (showcaseRef.current) {
                gsap.fromTo(
                    showcaseRef.current,
                    { scale: 1.06, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.1 }
                );
            }
            if (bioCardRef.current) {
                gsap.fromTo(
                    bioCardRef.current,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
                );
            }

            // 4. BRIDGE: neon line draws left-to-right, then text fades
            if (bridgeRef.current && bridgeLineRef.current && bridgeTextRef.current) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: bridgeRef.current,
                        start: 'top 80%',
                        once: true,
                    },
                });
                tl.fromTo(
                    bridgeLineRef.current,
                    { scaleX: 0, transformOrigin: 'left center' },
                    { scaleX: 1, duration: 0.5, ease: 'power2.out' }
                ).fromTo(
                    bridgeTextRef.current.children,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' },
                    '-=0.3'
                );
            }

            // 5. HERO TITLE "SIN FILTROS": dramatic clip reveal on scroll
            if (heroTitleRef.current) {
                gsap.fromTo(
                    heroTitleRef.current,
                    { y: 80, opacity: 0 },
                    {
                        y: 0, opacity: 1,
                        duration: 0.8, ease: 'expo.out',
                        scrollTrigger: {
                            trigger: heroTitleRef.current,
                            start: 'top 85%',
                            once: true,
                        },
                    }
                );
            }

        }, pageRef); // scope to page
        return () => ctx.revert();
    }, { scope: pageRef });

    // 6. TEAM CARDS: stagger pop when scrolled into view (fires when data arrives)
    useEffect(() => {
        if (!loading && team.length > 0 && teamRef.current) {
            const cards = teamRef.current.querySelectorAll(':scope > div');
            gsap.fromTo(
                cards,
                { opacity: 0, y: 40, scale: 0.93 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.6, stagger: 0.08, ease: 'back.out(1.2)',
                    scrollTrigger: {
                        trigger: teamRef.current,
                        start: 'top 85%',
                        once: true,
                    },
                }
            );
        }
    }, [loading, team]);

    return (
        <div ref={pageRef} className="min-h-screen bg-black">

            {/* ── INTRO: PERSONAJES ── */}
            <div className="w-full bg-black px-6 py-10">
                <div className="w-full mx-auto flex flex-col items-center text-center gap-3">
                    {/* Etiqueta superior */}
                    <div className="flex flex-col items-center gap-2 w-full">
                        <h1 ref={introh1Ref} className="font-anton text-2xl md:text-5xl text-white uppercase leading-tight w-full">
                            Bífido tiene voces que la representan
                        </h1>
                        <p ref={introPRef} className="text-white/55 text-sm md:text-lg max-w-6xl">
                            Esta es la manada. Cada uno representa y defiende distintos sectores de la cultura, el arte y lo marginal.{' '}
                            <span className="text-white/80">Conócelos.</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Characters Explorer - Full Width Layout */}
            <div ref={contentRef} className="flex flex-col md:flex-row w-full bg-black isolate relative overflow-hidden">
                
                {/* Dynamic Global Glow based on Active Character */}
                <div 
                    className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-50"
                    style={{
                        background: `radial-gradient(ellipse at 15% 100%, ${activeCharacter.color?.primary || '#b4ff00'}33 0%, transparent 60%)`
                    }}
                />

                {/* Left Sticky Grid - Other Characters */}
                <div className="hidden md:block w-full md:w-[34%] lg:w-[28%] xl:w-[22%] flex-shrink-0 bg-transparent z-30">
                    <div className="md:sticky md:top-40 md:h-[calc(100vh-10rem)] flex flex-col overflow-hidden">
                        <div ref={leftGridRef} className="relative flex-1 overflow-hidden bg-transparent flex flex-col group min-h-[350px] md:min-h-[500px]">
                            {/* Interactive Accordion Items */}
                            {otherCharacters.map((m, i) => (
                                <div
                                    key={m.id}
                                    onClick={() => setActiveCharacterId(m.id)}
                                    className="flex-[1] hover:flex-[4] group/item flex flex-col cursor-pointer overflow-hidden transition-all duration-500 ease-out relative"
                                    style={{ backgroundColor: 'transparent' }}
                                >
                                    {/* Subtle Background Glow */}
                                    <div
                                        className="absolute inset-0 opacity-20 group-hover/item:opacity-40 transition-opacity duration-500 pointer-events-none"
                                        style={{
                                            background: `radial-gradient(ellipse at 50% 20%, ${m.color?.primary}80 0%, ${m.color?.primary}00 70%)`
                                        }}
                                    ></div>

                                    {/* Character Image */}
                                    {m.image && (
                                        <Image
                                            src={m.image}
                                            alt={m.name}
                                            width={400}
                                            height={500}
                                            className="absolute right-0 md:right-4 lg:right-12 bottom-0 h-[85%] md:h-[95%] lg:h-[105%] lg:group-hover/item:h-[95%] w-auto object-contain object-bottom filter grayscale group-hover/item:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-60 group-hover:opacity-20 group-hover/item:!opacity-100 transform origin-bottom z-10"
                                        />
                                    )}

                                    {/* Typography - Single Element with Dynamic Position Transition */}
                                    <div
                                        className="absolute transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] z-20 pointer-events-none 
                                        left-4 top-1/2 translate-x-0 -translate-y-1/2 
                                        md:left-6 
                                        group-hover/item:left-[100%] group-hover/item:top-[100%] 
                                        group-hover/item:translate-x-[calc(-100%-1rem)] group-hover/item:translate-y-[calc(-100%-1rem)] 
                                        md:group-hover/item:translate-x-[calc(-100%-1.5rem)] md:group-hover/item:translate-y-[calc(-100%-1.5rem)]"
                                    >
                                        <span
                                            className="font-display text-2xl lg:text-3xl xl:text-3xl lg:group-hover/item:text-6xl tracking-widest transition-all duration-700 opacity-80 group-hover:opacity-20 group-hover/item:!opacity-100 [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl] md:group-hover:[writing-mode:horizontal-tb] md:rotate-180 md:group-hover:rotate-0 uppercase drop-shadow-4xl leading-none block origin-center text-right group-hover:scale-90 group-hover/item:scale-100"
                                            style={{ color: m.color?.primary || 'white', textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)' }}
                                        >
                                            {m.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content - Active Character Showcase */}
                <div ref={showcaseRef} className="flex-1 bg-transparent relative md:min-h-[calc(100vh-10rem)] flex flex-col">
                    <div className="absolute inset-0 w-full h-full transition-colors duration-500 overflow-hidden">
                        {/* Animated Smoky Background */}
                        <div className="absolute inset-0 flex items-center justify-center transition-all duration-700 bg-transparent">
                            {/* Stronger Corner Smoke / Glow Vignette */}
                            <div
                                className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 opacity-60 md:opacity-40"
                                style={{
                                    background: `radial-gradient(circle at 50% 40%, ${activeCharacter.color?.primary}44 0%, ${activeCharacter.color?.primary}11 50%, transparent 100%)`
                                }}
                            />

                            {/* Interactive WebGL Fluid Simulation */}
                            <FluidSimulation
                                color={activeCharacter.color?.primary}
                                opacity={0.5}
                                className="absolute inset-0 z-0 pointer-events-none"
                            />
                        </div>
                    </div>
                    
                    <div className="relative w-full flex-1 flex items-start lg:items-center justify-center">

                        {/* Mobile Horizontal Avatar Carrousel (Hidden on Desktop) */}
                        <div className="absolute top-0 left-0 w-full z-40 flex md:hidden justify-center items-start py-6 px-4 gap-2 sm:gap-6 bg-gradient-to-b from-black via-black/80 to-transparent">
                            {otherCharacters.map(m => (
                                <button 
                                    key={m.id}
                                    onClick={() => setActiveCharacterId(m.id)}
                                    className="flex-1 flex flex-col items-center gap-2 group max-w-[90px]"
                                >
                                    <div className="w-[clamp(45px,16vw,75px)] h-[clamp(45px,16vw,75px)] rounded-full overflow-hidden relative flex items-center justify-center bg-black transition-all border-2 border-[#222] group-hover:border-white shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                                         style={{ borderColor: m.color?.primary }}>
                                        {m.image && (
                                            <Image 
                                                src={m.image} 
                                                alt={m.name} 
                                                width={75} 
                                                height={75} 
                                                className="object-cover object-top filter grayscale group-hover:grayscale-0 scale-[1.35] pt-1 transition-all duration-300 w-full h-full"
                                            />
                                        )}
                                    </div>
                                    <span className="text-[clamp(8px,2.8vw,12px)] font-display tracking-widest uppercase transition-colors leading-tight text-center"
                                          style={{ color: m.color?.primary || '#aaa' }}>
                                        {m.name}
                                    </span>
                                </button>
                            ))}
                        </div>


                        {/* Content Group (Centered Automatically via Flexbox) */}
                        <div className="relative z-20 w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 xl:gap-32 px-4 pt-28 pb-10 lg:py-0">

                            {/* 1. Center Layout: Character, Text, Arrows, Button */}
                            <div className="flex flex-col items-center justify-center relative w-full lg:w-auto">

                                <div className="relative z-10 h-[300px] sm:h-[350px] w-full sm:w-[400px] flex items-end justify-center mb-0 mx-auto">
                                    {/* Left Arrow */}
                                    <button onClick={handlePrev} className="absolute left-[-10px] sm:-left-10 top-1/2 -translate-y-1/2 text-white opacity-70 hover:opacity-100 hover:scale-110 transition-all z-20">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                    </button>

                                    {/* Character Image */}
                                    {activeCharacter.image && (
                                        <Image
                                            key={activeCharacter.id}
                                            src={activeCharacter.image}
                                            alt={activeCharacter.name}
                                            width={400}
                                            height={500}
                                            className="object-contain object-bottom h-full max-w-[80%] drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] animate-float"
                                            priority
                                        />
                                    )}

                                    {/* Right Arrow */}
                                    <button onClick={handleNext} className="absolute right-[-10px] sm:-right-10 top-1/2 -translate-y-1/2 text-white opacity-70 hover:opacity-100 hover:scale-110 transition-all z-20">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                    </button>
                                </div>

                                {/* Base concentric circles */}
                                <div className="absolute z-0 top-[270px] sm:top-[320px] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none opacity-40">
                                    <div className="w-[200px] sm:w-[300px] h-[34px] sm:h-[50px] rounded-[100%] border border-white absolute"></div>
                                    <div className="w-[140px] sm:w-[200px] h-[24px] sm:h-[34px] rounded-[100%] border border-white absolute"></div>
                                    <div className="w-[70px] sm:w-[100px] h-[12px] sm:h-[16px] rounded-[100%] border border-white absolute"></div>
                                </div>

                                {/* Title */}
                                <div className="flex flex-col items-center mt-0">
                                    <h2 className="font-display text-2xl sm:text-3xl text-white mb-2 uppercase">
                                        ¡Hola, soy {activeCharacter.name}!
                                    </h2>
                                    <div className="w-full h-[2px] bg-white mb-4"></div>
                                </div>

                                <div className="h-2"></div>

                                {/* CTA Buttons */}
                                <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={() => {
                                            if (window.innerWidth < 1024) {
                                                document.getElementById('bio-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }
                                        }}
                                        className="bg-transparent border border-white text-white font-display tracking-widest py-3 px-6 sm:px-8 rounded-3xl text-[clamp(11px,3.5vw,14px)] hover:bg-white/10 transition-all uppercase text-center"
                                    >
                                        Conóceme
                                    </button>
                                    <Link
                                        href={`/${activeCharacter.slug}`}
                                        className="bg-white text-black font-display tracking-widest py-3 px-6 sm:px-8 rounded-3xl text-[clamp(11px,3.5vw,14px)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all uppercase text-center"
                                    >
                                        Lee mis artículos
                                    </Link>
                                </div>
                            </div>

                            {/* 2. Glassmorphism Bio Card */}
                            <div id="bio-card" ref={bioCardRef} className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0">
                                <div className="bg-black/20 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10">

                                    <h3 className="text-center font-bold mb-4 tracking-wider text-3xl" style={{ color: activeCharacter.color?.primary }}>
                                        Biografía
                                    </h3>

                                    <p className="text-sm text-gray-200 mb-8 leading-relaxed text-center font-light">
                                        {activeCharacter.description}
                                    </p>

                                    <div className="space-y-4 text-sm tracking-wide">
                                        <div>
                                            <span className="text-white font-bold">Religión: </span>
                                            <span className="text-gray-300 font-light">{activeCharacter.religion}.</span>
                                        </div>
                                        <div>
                                            <span className="text-white font-bold">Edad: </span>
                                            <span className="text-gray-300 font-light">{activeCharacter.age}</span>
                                        </div>
                                        <div>
                                            <span className="text-white font-bold">Color favorito: </span>
                                            <span className="text-gray-300 font-light">{activeCharacter.favoriteColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BRIDGE: TRANSICIÓN PERSONAJES → EQUIPO ── */}
            <div ref={bridgeRef} className="w-full bg-black py-12 md:py-16 px-6 md:px-12 lg:px-16 relative overflow-hidden">
                {/* Light spill from Characters section */}
                <div 
                    className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-60"
                    style={{
                        background: `radial-gradient(ellipse at 15% 0%, ${activeCharacter.color?.primary || '#b4ff00'}33 0%, transparent 70%)`
                    }}
                />
                
                <div className="max-w-[85rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    {/* Texto de transición */}
                    <div ref={bridgeTextRef} className="flex flex-col gap-2">
                        <span className="font-display text-xl text-bifido-neon uppercase">
                            // Y DETRÁS DE TODO ESTO HAY PERSONAS REALES QUE HACEN POSIBLE EL PARCHE...
                        </span>
                        <p className="font-anton text-2xl md:text-4xl text-white uppercase leading-tight max-w-xl">
                            NUESTRO PARCHE, ARCHIVO VIVO.
                        </p>
                    </div>

                    {/* Flecha / indicador visual */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <div ref={bridgeLineRef} className="hidden md:block w-16 h-[2px] bg-bifido-neon" />
                        <svg
                            className="w-8 h-8 md:w-12 md:h-12 text-bifido-neon animate-bounce"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ── DESDE ADENTRO / SIN FILTROS ── */}
            <div 
                className="relative w-full bg-cover bg-center bg-[url('/backgrounds/team_movil.jpeg')] lg:bg-[url('/backgrounds/team_desk.png')]"
            >
                    {/* Overlay oscuro para que el texto siga siendo legible */}
                    <div className="absolute inset-0 bg-black/70 pointer-events-none"></div>

                    <div className="relative z-10">

                    {/* Hero header: text + badge */}
                    <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[85rem]">
                        <div className="flex items-start justify-between py-6 md:py-10 gap-6">

                            {/* Left: label + big title + tagline */}
                            <div className="flex-1 min-w-0">
                                {/* DESDE ADENTRO */}
                                <div className="flex items-center gap-3 mb-5">
                                    <Image
                                        src="/icons/user.svg"
                                        alt="Equipo"
                                        width={40}
                                        height={40}
                                        className="flex-shrink-0"
                                    />
                                    <span className="font-anton text-4xl md:text-[3rem] tracking-normal text-[#fe5e00] uppercase leading-none">
                                        DESDE ADENTRO
                                    </span>
                                </div>

                                {/* SIN FILTROS */}
                                <h2 ref={heroTitleRef} className="font-anton text-[clamp(4.5rem,13vw,10.5rem)] leading-[0.85] text-black uppercase tracking-normal [-webkit-text-stroke:1.5px_white] md:[-webkit-text-stroke:2.5px_white] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                                    SIN FILTROS
                                </h2>

                                {/* Tagline */}
                                <div className="pt-4 space-y-1">
                                    <p className="font-display text-[11px] md:text-xl tracking-[0.18em] text-white uppercase">
                                        // NO SOMOS UN EQUIPO, SOMOS UN{' '}
                                        <span className="underline underline-offset-4">ARCHIVO VIVO</span> →{' '}
                                        <span className="font-display text-[11px] md:text-xl tracking-[0.18em] text-[#fe5e00] uppercase">NARRAMOS, SEÑALAMOS, REGISTRAMOS</span>
                                    </p>
                                </div>
                            </div>

                            {/* Right: Bifido badge */}
                            <div className="hidden md:flex flex-shrink-0 items-center justify-center mt-2">
                                <Image
                                    src="/icons/bifido_contact.svg"
                                    alt="Periodismo crudo para sensibilidades frágiles"
                                    width={170}
                                    height={170}
                                    className="opacity-90 brightness-0 invert"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Team Cards */}
                    <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[85rem] pb-24">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bifido-neon" />
                            </div>
                        ) : team.length > 0 ? (
                            <div ref={teamRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {team.map((member) => {
                                    const rawHandle = member.socialMedia?.instagram || '';
                                    const instagramHandle = rawHandle
                                        ? rawHandle
                                            .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
                                            .replace(/\/$/, '')
                                        : null;
                                    const instagramHref = rawHandle
                                        ? (rawHandle.startsWith('http') ? rawHandle : `https://instagram.com/${rawHandle}`)
                                        : null;
                                    const memberSlug = member.slug || member.id;

                                    return (
                                        <div
                                            key={member.id}
                                            className="border border-[#2a2a2a] bg-black flex flex-col group hover:border-bifido-neon/40 transition-colors duration-300"
                                        >
                                            {/* Avatar */}
                                            <div className="flex justify-center pt-7 pb-4 px-4">
                                                <div className="relative w-28 h-28 rounded-full overflow-hidden border-[3px] border-white flex-shrink-0">
                                                    <Image
                                                        src={member.profileImage}
                                                        alt={member.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>

                                            {/* Name bar – neon green */}
                                            <div className="bg-bifido-neon py-2 px-3">
                                                <h3 className="font-display text-black text-center uppercase tracking-[0.12em] text-sm leading-tight truncate">
                                                    {member.name}
                                                </h3>
                                            </div>

                                            {/* Card body */}
                                            <div className="p-4 flex flex-col flex-1 gap-3">
                                                {/* Bio */}
                                                <p className="text-white/55 text-[11px] leading-relaxed line-clamp-3">
                                                    {member.biography || 'Miembro del equipo de Revista Bífido.'}
                                                </p>

                                                {/* Skill tags */}
                                                {member.tags && member.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {member.tags.map((tag: string) => (
                                                            <span
                                                                key={tag}
                                                                className="border border-white/25 text-white/45 text-[9px] px-2 py-0.5 uppercase tracking-wider"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Actions – pushed to bottom */}
                                                <div className="flex flex-col gap-2 mt-auto pt-1">
                                                    {instagramHandle && (
                                                        <a
                                                            href={instagramHref!}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="border border-bifido-neon text-bifido-neon text-center text-[10px] py-1.5 px-2 uppercase tracking-wider font-display hover:bg-bifido-neon hover:text-black transition-all duration-200 truncate"
                                                        >
                                                            @{instagramHandle}
                                                        </a>
                                                    )}
                                                    <Link
                                                        href={`/autores/${memberSlug}`}
                                                        className="border border-white/30 text-white/70 text-center text-[10px] py-1.5 px-2 uppercase tracking-wider font-display hover:bg-white hover:text-black transition-all duration-200"
                                                    >
                                                        Ver Más
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-2xl font-display tracking-widest uppercase">Mutando...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
