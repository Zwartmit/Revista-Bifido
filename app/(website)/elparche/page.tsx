'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { characters } from '@/lib/characters';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getLiveArchiveMembers } from '@/lib/api';
import dynamic from 'next/dynamic';
import { RiInstagramFill } from 'react-icons/ri';
import { FaUserSecret, FaGlobe } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FluidSimulation = dynamic(() => import('@/components/FluidSimulation'), { ssr: false });

export default function ElParchePage() {
    // ── Refs ──────────────────────────────────────────────────────────
    const pageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
    const introh1Ref = useRef<HTMLHeadingElement>(null);
    const introPRef = useRef<HTMLParagraphElement>(null);
    const leftGridRef = useRef<HTMLDivElement>(null);
    const showcaseRef = useRef<HTMLDivElement>(null);
    const bioCardRef = useRef<HTMLDivElement>(null);
    const bridgeRef = useRef<HTMLDivElement>(null);
    const bridgeTextRef = useRef<HTMLDivElement>(null);
    const heroTitleRef = useRef<HTMLHeadingElement>(null);
    const teamLabelRef = useRef<HTMLDivElement>(null);
    const teamTaglineRef = useRef<HTMLDivElement>(null);
    const teamBadgeRef = useRef<HTMLDivElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);

    // ── State ─────────────────────────────────────────────────────────
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCharacterId, setActiveCharacterId] = useState(characters[0].id);
    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const [modalPhotoIndex, setModalPhotoIndex] = useState(0);

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
                const archiveMembers = await getLiveArchiveMembers();
                setTeam(archiveMembers);
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
                    { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.15 }
                );
                gsap.fromTo(
                    introPRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.4 }
                );
            }

            // 2. LEFT ACCORDION: stripes slide in from left in stagger
            if (leftGridRef.current) {
                const items = leftGridRef.current.querySelectorAll(':scope > div');
                gsap.fromTo(
                    items,
                    { x: -60, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1.0, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
                );
            }

            // 3. SHOWCASE: image scales from 1.08 + bio card floats up
            if (showcaseRef.current) {
                gsap.fromTo(
                    showcaseRef.current,
                    { scale: 1.06, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
                );
            }
            if (bioCardRef.current) {
                gsap.fromTo(
                    bioCardRef.current,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.4 }
                );
            }

            // 4. BRIDGE: text fades in sequence
            if (bridgeRef.current && bridgeTextRef.current) {
                gsap.fromTo(
                    bridgeTextRef.current.children,
                    { y: 30, opacity: 0 },
                    { 
                        y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: bridgeRef.current,
                            start: 'top 80%',
                            once: true,
                        }
                    }
                );
            }

            // 5. HERO HEADER: timeline for label, title, tagline, badge
            if (heroTitleRef.current) {
                const tlHero = gsap.timeline({
                    scrollTrigger: {
                        trigger: heroTitleRef.current,
                        start: 'top 85%',
                        once: true,
                    }
                });

                if (teamLabelRef.current) tlHero.fromTo(teamLabelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0);
                
                tlHero.fromTo(heroTitleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out' }, 0.15);
                
                if (teamTaglineRef.current) tlHero.fromTo(teamTaglineRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out' }, 0.4);
                
                if (teamBadgeRef.current) tlHero.fromTo(teamBadgeRef.current, { scale: 0.5, opacity: 0, rotation: -45 }, { scale: 1, opacity: 1, rotation: 0, duration: 1.0, ease: 'back.out(1.5)' }, 0.5);
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
                    duration: 0.8, stagger: 0.1, ease: 'back.out(1.2)',
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
            <div className="w-full bg-black px-6 py-4 lg:pt-10 lg:pb-4">
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
            <div ref={contentRef} className="flex flex-col md:flex-row w-full bg-black isolate relative">

                {/* Dynamic Global Glow based on Active Character */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-50"
                    style={{
                        background: `radial-gradient(ellipse at 15% 100%, ${activeCharacter.color?.primary || '#b4ff00'}33 0%, transparent 60%)`
                    }}
                />

                {/* Left Sticky Grid - Other Characters */}
                <div className="hidden md:block w-full md:w-[34%] lg:w-[28%] xl:w-[22%] flex-shrink-0 bg-transparent z-30">
                    <div className="md:sticky md:top-40 flex flex-col overflow-hidden">
                        <div ref={leftGridRef} className="relative flex-1 overflow-hidden bg-transparent flex flex-col group min-h-[350px] md:min-h-[500px]">
                            {/* Interactive Accordion Items */}
                            {otherCharacters.map((m, i) => (
                                <div
                                    key={m.id}
                                    onClick={() => setActiveCharacterId(m.id)}
                                    className="flex-[1] hover:flex-[4] group/item flex flex-col cursor-pointer overflow-hidden transition-all duration-500 ease-out relative min-h-[90px]"
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
                                            className="font-display text-xl lg:text-2xl xl:text-3xl lg:group-hover/item:text-6xl tracking-widest transition-all duration-700 opacity-80 group-hover:opacity-20 group-hover/item:!opacity-100 [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl] md:group-hover:[writing-mode:horizontal-tb] md:rotate-180 md:group-hover:rotate-0 uppercase drop-shadow-4xl leading-none block origin-center text-right group-hover:scale-90 group-hover/item:scale-100"
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
                <div ref={showcaseRef} className="grow bg-transparent relative md:min-h-[calc(100vh-10rem)] flex flex-col">
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

                    <div className="relative w-full grow flex items-start lg:items-center justify-center">

                        {/* Mobile Horizontal Avatar Carrousel (Hidden on Desktop) */}
                        <div className="absolute top-0 left-0 w-full z-40 flex md:hidden justify-center items-start py-6 px-4 gap-2 sm:gap-6 bg-gradient-to-b from-black via-black/80 to-transparent">
                            {otherCharacters.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveCharacterId(m.id)}
                                    className="flex-1 flex flex-col items-center gap-2 group max-w-[90px]"
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 transition-transform group-hover:scale-110 flex-shrink-0 bg-bifido-gray flex items-center justify-center p-1"
                                        style={{ borderColor: m.color?.primary }}>
                                        <Image
                                            src={`/icons/${m.slug}.png`}
                                            alt={m.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover rounded-full"
                                        />
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

                                {/* CTA Buttons */}
                                <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full sm:w-auto mt-8 sm:mt-10">
                                    <Link
                                        href={`/${activeCharacter.slug}`}
                                        className="bg-white text-black font-googlesans text-base sm:text-lg py-3 px-6 sm:px-8 rounded-3xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all text-center"
                                    >
                                        Lee mis artículos
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (window.innerWidth < 1024) {
                                                document.getElementById('bio-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }
                                        }}
                                        className="bg-transparent border border-white text-white font-googlesans text-base sm:text-lg py-3 px-6 sm:px-8 rounded-3xl hover:bg-white/10 transition-all text-center"
                                    >
                                        Conóceme
                                    </button>
                                </div>
                            </div>

                            {/* 2. Glassmorphism Bio Card */}
                            <div id="bio-card" ref={bioCardRef} className="w-[85%] sm:w-[320px] md:w-[340px] lg:w-[340px] xl:w-[380px] flex-shrink-0">
                                <div className="bg-black/20 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10">

                                    <div className="flex flex-col items-center mb-4">
                                        <h2 className="font-display text-2xl sm:text-3xl text-white mb-2 uppercase">
                                            ¡Hola, soy {activeCharacter.name}!
                                        </h2>
                                        <div className="w-full h-[2px] mb-0" style={{ backgroundColor: activeCharacter.color?.primary }}></div>
                                    </div>

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
            <div ref={bridgeRef} className="w-full bg-black py-12 md:py-16 relative overflow-hidden">
                {/* Light spill from Characters section */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 opacity-60"
                    style={{
                        background: `radial-gradient(ellipse at 15% 0%, ${activeCharacter.color?.primary || '#b4ff00'}33 0%, transparent 70%)`
                    }}
                />

                <div className="max-w-[85rem] mx-auto px-6 md:px-12 lg:px-16 flex flex-col items-center lg:items-start gap-8 relative z-10">
                    {/* Texto de transición */}
                    <div ref={bridgeTextRef} className="flex flex-col items-center lg:items-start w-fit">
                        <Image
                            src="/icons/arrow_g.png"
                            alt="Flecha Izquierda"
                            width={26}
                            height={62}
                            className="w-10 h-10 object-contain -rotate-90 -mb-2"
                        />
                        <span className="font-jack text-lg text-bifido-neon uppercase tracking-tight [word-spacing:-0.05em] leading-none text-center lg:text-left">
                            DETRÁS DE TODO ESTO ESTÁ NUESTRO PARCHE, ARCHIVO VIVO...
                        </span>
                        {/* <div className="flex justify-center w-full -mt-2">
                            <Image
                                src="/icons/arrow_g.png"
                                alt="Flecha Derecha"
                                width={26}
                                height={62}
                                className="w-10 h-10 object-contain rotate-90"
                            />
                        </div> */}
                    </div>
                </div>
            </div>

            {/* ── DESDE ADENTRO / SIN FILTROS ── */}
            <div
                className="relative w-full bg-black"
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
                                <div ref={teamLabelRef} className="flex items-center gap-3 mb-5">
                                    <Image
                                        src="/icons/user.svg"
                                        alt="Equipo"
                                        width={30}
                                        height={30}
                                        className="flex-shrink-0"
                                    />
                                    <span className="font-anton text-lg md:text-3xl tracking-normal text-[#fe5e00] uppercase leading-none">
                                        DESDE ADENTRO
                                    </span>
                                </div>

                                {/* SIN FILTROS */}
                                <h2 ref={heroTitleRef} className="font-anton text-[clamp(4.5rem,13vw,8rem)] leading-[0.85] text-black uppercase tracking-normal [-webkit-text-stroke:1.5px_white] md:[-webkit-text-stroke:2.5px_white] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                                    SIN FILTROS
                                </h2>

                                {/* Tagline */}
                                <div ref={teamTaglineRef} className="pt-2 space-y-0.5">
                                    <p className="font-jack text-[10px] md:text-lg text-white uppercase tracking-tight [word-spacing:-0.05em]">
                                        {"//"} NO SOMOS UN EQUIPO, SOMOS UN{' '}
                                        <span className="underline underline-offset-4">ARCHIVO VIVO</span>
                                    </p>
                                    <p className="font-jack text-[10px] md:text-lg text-white uppercase tracking-tight [word-spacing:-0.05em]">
                                        <span className="opacity-0 select-none">{"//"} </span>
                                        NARRAMOS, SEÑALAMOS, REGISTRAMOS...
                                    </p>
                                </div>
                            </div>

                            {/* Right: Bifido badge */}
                            <div ref={teamBadgeRef} className="hidden md:flex flex-shrink-0 items-center justify-center mt-8">
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
                            <div ref={teamRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-12">
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
                                            className="bg-transparent flex flex-col group w-full max-w-[320px] mx-auto mt-12 border-2 border-bifido-neon rounded-3xl shadow-2xl hover:shadow-bifido-neon/40 transition-all duration-300"
                                        >
                                            {/* Avatar (Original Bífido) */}
                                            <div className="flex justify-center pt-7 pb-4 px-4">
                                                <div className="relative w-28 h-28 rounded-full overflow-hidden border-[3px] border-white flex-shrink-0 bg-white flex items-center justify-center group-hover:border-bifido-neon transition-colors duration-300">
                                                    {/* Foto de Perfil Base */}
                                                    <div className={`transition-opacity duration-300 ${member.identifierImage ? 'group-hover:opacity-0' : ''} flex items-center justify-center w-full h-full`}>
                                                        <Image
                                                            src={member.profileImage}
                                                            alt={member.name}
                                                            width={82}
                                                            height={82}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    
                                                    {/* Imagen Identificador (Hover) */}
                                                    {member.identifierImage && (
                                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                            <Image
                                                                src={member.identifierImage}
                                                                alt={`${member.name} - Identificador`}
                                                                width={82}
                                                                height={82}
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Name bar – neon green (Original) */}
                                            <div className="bg-white py-2 px-3 mb-4">
                                                <h3 className="font-display text-black text-center uppercase tracking-[0.12em] text-2xl leading-tight truncate">
                                                    {member.name}
                                                </h3>
                                            </div>

                                            {/* Card body (Estilo Opción 2) */}
                                            <div className="px-2 pb-2 flex flex-col flex-1 items-center text-center">
                                                
                                                {/* Skill tags */}
                                                {member.characteristics && member.characteristics.length > 0 && (
                                                    <div className="font-mono text-[9px] text-bifido-neon uppercase tracking-widest mb-3">
                                                        {member.characteristics.join(' · ')}
                                                    </div>
                                                )}

                                                {/* Lema */}
                                                <p className="font-sans text-xs text-gray-400 leading-relaxed line-clamp-3 mb-3 italic">
                                                    {member.lema ? `"${member.lema}"` : 'Miembro del equipo de Revista Bífido.'}
                                                </p>

                                                {/* Actions */}
                                                <div className="flex items-center gap-3 w-full justify-center border-t border-gray-800 pt-4 pb-2 mt-auto">
                                                    {instagramHref ? (
                                                        <a
                                                            href={instagramHref}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="relative overflow-hidden w-8 h-8 rounded-full bg-bifido-neon flex items-center justify-center hover:scale-110 transition-transform group"
                                                            title="Instagram"
                                                        >
                                                            <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                                                                {Array.from({ length: 15 }).map((_, i) => (
                                                                    <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                                                                        <RiInstagramFill size={16} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="relative z-10 text-black flex items-center justify-center">
                                                                <RiInstagramFill size={16} />
                                                            </div>
                                                        </a>
                                                    ) : (
                                                        <span className="relative overflow-hidden w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-not-allowed opacity-50" title="Sin Instagram">
                                                            <RiInstagramFill size={16} className="text-gray-500" />
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedMember(member);
                                                            setModalPhotoIndex(0);
                                                        }}
                                                        className="relative overflow-hidden w-8 h-8 rounded-full bg-bifido-neon flex items-center justify-center hover:scale-110 transition-transform group"
                                                        title="Ver Expediente"
                                                    >
                                                        <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                                                            {Array.from({ length: 15 }).map((_, i) => (
                                                                <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                                                                    <FaUserSecret size={16} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="relative z-10 text-black flex items-center justify-center">
                                                            <FaUserSecret size={16} />
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-40">
                                <p className="text-gray-300 text-3xl font-display tracking-widest uppercase">Estamos mutando...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Archivo Vivo */}
            {selectedMember && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 md:px-24 bg-black/95 backdrop-blur-sm">
                    <div className="w-full max-w-5xl bg-black border border-gray-800 rounded-xl relative flex flex-col max-h-full overflow-hidden">
                        
                        {/* Header/Close */}
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="flex items-center gap-2 text-white hover:text-bifido-neon transition-colors font-mono text-sm tracking-widest"
                            >
                                CERRAR <span className="text-xl font-bold text-orange-500">X</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden p-6 md:p-12 gap-8 md:gap-16">
                            
                            {/* Left: Image Carousel (Pill shape) */}
                            <div className="w-full md:w-[40%] flex-shrink-0 flex flex-col items-center justify-center">
                                <div className="w-full aspect-[1/2] max-h-[60vh] md:max-h-none rounded-[100px] bg-white overflow-hidden relative flex items-center justify-center">
                                    {selectedMember.photos && selectedMember.photos.length > 0 ? (
                                        <Image
                                            src={selectedMember.photos[modalPhotoIndex]}
                                            alt={`${selectedMember.name} foto ${modalPhotoIndex + 1}`}
                                            fill
                                            className="object-contain p-4"
                                        />
                                    ) : (
                                        <Image
                                            src={selectedMember.profileImage}
                                            alt={selectedMember.name}
                                            fill
                                            className="object-contain p-4"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Right: Info */}
                            <div className="w-full md:w-[60%] flex flex-col justify-center text-left py-4">
                                <span className="font-jack text-orange-500 text-xs tracking-[0.2em] mb-2 uppercase">Manifiesto personal</span>
                                
                                <div className="flex items-center gap-3 mb-8">
                                    <Image 
                                        src="/icons/message.svg" 
                                        alt="Manifiesto" 
                                        width={32} 
                                        height={32} 
                                        className="flex-shrink-0"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(53%) sepia(98%) saturate(1831%) hue-rotate(348deg) brightness(101%) contrast(96%)' }}
                                    />
                                    <h2 className="text-3xl md:text-5xl font-display uppercase tracking-widest text-orange-500 leading-none mt-2">
                                        {selectedMember.name}
                                    </h2>
                                </div>

                                <div className="font-mono text-sm md:text-sm text-gray-300 leading-relaxed text-justify mb-12 whitespace-pre-line">
                                    {selectedMember.biography || 'Miembro del equipo de Revista Bífido.'}
                                </div>

                                {/* Tags & IG - Ficha Técnica */}
                                <div className="flex flex-row justify-between items-start mt-auto mb-4 border-t border-gray-800/60 pt-5 w-full">
                                    {/* Left: Rasgos & Base */}
                                    <div className="flex flex-col gap-4">
                                        {/* Rasgos */}
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[11px] text-gray-500 font-display tracking-widest uppercase">Rasgos y gustos</span>
                                            <div className="font-mono text-xs text-bifido-neon tracking-wide uppercase">
                                                {selectedMember.characteristics?.join(" / ")}
                                            </div>
                                        </div>
                                        {/* Base / Ubicación */}
                                        {selectedMember.location && (
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[11px] text-gray-500 font-display tracking-widest uppercase">Base</span>
                                                <span className="font-mono text-xs text-gray-300 uppercase tracking-wide">
                                                    {selectedMember.location}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Right: Redes */}
                                    <div className="flex flex-col gap-3 items-end">
                                        <span className="text-[11px] text-gray-500 font-display tracking-widest uppercase">Contacto</span>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedMember.socialMedia?.website && (
                                                <a
                                                    href={selectedMember.socialMedia.website.startsWith('http') ? selectedMember.socialMedia.website : `https://${selectedMember.socialMedia.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative overflow-hidden w-8 h-8 rounded-full bg-bifido-neon flex items-center justify-center hover:scale-110 transition-transform group"
                                                    title="Sitio Web"
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                                                        {Array.from({ length: 15 }).map((_, i) => (
                                                            <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                                                                <FaGlobe size={16} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="relative z-10 text-black flex items-center justify-center">
                                                        <FaGlobe size={16} />
                                                    </div>
                                                </a>
                                            )}
                                            {selectedMember.socialMedia?.instagram && (
                                                <a
                                                    href={`https://instagram.com/${selectedMember.socialMedia.instagram.replace('@', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative overflow-hidden w-8 h-8 rounded-full bg-bifido-neon flex items-center justify-center hover:scale-110 transition-transform group"
                                                    title="Instagram"
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                                                        {Array.from({ length: 15 }).map((_, i) => (
                                                            <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                                                                <RiInstagramFill size={16} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="relative z-10 text-black flex items-center justify-center">
                                                        <RiInstagramFill size={16} />
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Navigation (Member Navigation) */}
                                <div className="w-full border-t border-gray-800 pt-4 mt-12 flex items-center justify-between text-gray-400 font-sans text-sm">
                                    <button
                                        onClick={() => {
                                            const currentIndex = team.findIndex(m => m.id === selectedMember.id);
                                            const prevIndex = currentIndex <= 0 ? team.length - 1 : currentIndex - 1;
                                            setSelectedMember(team[prevIndex]);
                                            setModalPhotoIndex(0);
                                        }}
                                        className="group flex items-center gap-3 transition-colors"
                                    >
                                        <div className="flex items-center mt-[2px] rotate-180 group-hover:-translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(255,102,0,0.8)] transition-all">
                                            <Image src="/icons/arrow_o.svg" alt="Anterior" width={24} height={24} />
                                        </div>
                                        <span className="text-white mt-[2px] group-hover:text-orange-500 transition-colors">Anterior</span>
                                    </button>
                                    <span className="mt-[2px]">{(team.findIndex(m => m.id === selectedMember.id) + 1)}/{team.length}</span>
                                    <button
                                        onClick={() => {
                                            const currentIndex = team.findIndex(m => m.id === selectedMember.id);
                                            const nextIndex = currentIndex === team.length - 1 ? 0 : currentIndex + 1;
                                            setSelectedMember(team[nextIndex]);
                                            setModalPhotoIndex(0);
                                        }}
                                        className="group flex items-center gap-3 transition-colors"
                                    >
                                        <span className="text-white mt-[2px] group-hover:text-orange-500 transition-colors">Siguiente</span>
                                        <div className="flex items-center mt-[2px] group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(255,102,0,0.8)] transition-all">
                                            <Image src="/icons/arrow_o.svg" alt="Siguiente" width={24} height={24} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
