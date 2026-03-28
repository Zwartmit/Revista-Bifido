'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mascots } from '@/lib/mascots';
import gsap from 'gsap';
import { Users, Mail, Instagram, Twitter, Facebook, Globe } from 'lucide-react';
import { getAuthors } from '@/lib/api';
import { useState } from 'react';

export default function ElParchePage() {
    const contentRef = useRef<HTMLDivElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeMascotId, setActiveMascotId] = useState(mascots[0].id);
    const activeMascot = mascots.find(m => m.id === activeMascotId) || mascots[0];
    const otherMascots = mascots.filter((m) => m.id !== activeMascotId);

    const handlePrev = () => {
        const currentIndex = mascots.findIndex(m => m.id === activeMascotId);
        const prevIndex = (currentIndex - 1 + mascots.length) % mascots.length;
        setActiveMascotId(mascots[prevIndex].id);
    };

    const handleNext = () => {
        const currentIndex = mascots.findIndex(m => m.id === activeMascotId);
        const nextIndex = (currentIndex + 1) % mascots.length;
        setActiveMascotId(mascots[nextIndex].id);
    };

    useEffect(() => {
        // Fetch authors
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

        // Animate content appearance
        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
        }
    }, []);

    // Animation for team section when it loads
    useEffect(() => {
        if (!loading && team.length > 0 && teamRef.current) {
            gsap.fromTo(
                teamRef.current.children,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' }
            );
        }
    }, [loading, team]);

    return (
        <div className="min-h-screen bg-black">
            {/* Mascots Explorer - Full Width Layout */}
            <div ref={contentRef} className="flex flex-col md:flex-row w-full bg-black">

                {/* Left Sticky Grid - Other Characters */}
                <div className="w-full md:w-[34%] lg:w-[28%] xl:w-[22%] flex-shrink-0 bg-black z-30 border-r-2 border-black">
                    <div className="md:sticky md:top-40 md:h-[calc(100vh-10rem)] flex flex-col">
                        <div className="relative flex-1 overflow-hidden bg-black flex flex-col group min-h-[350px] md:min-h-[500px]">
                            {/* Interactive Accordion Items */}
                            {otherMascots.map((m, i) => (
                                <div
                                    key={m.id}
                                    onClick={() => setActiveMascotId(m.id)}
                                    className="flex-[1] hover:flex-[4] group/item flex flex-col cursor-pointer overflow-hidden border-b border-[#333] transition-all duration-500 ease-out relative"
                                    style={{ backgroundColor: i % 2 === 0 ? '#111' : '#1a1a1a' }}
                                >
                                    {/* Subtle Background Glow */}
                                    <div
                                        className="absolute inset-0 opacity-20 group-hover/item:opacity-40 transition-opacity duration-500 pointer-events-none"
                                        style={{
                                            background: `radial-gradient(ellipse at 50% 20%, ${m.color?.primary}80 0%, ${m.color?.primary}00 70%)`
                                        }}
                                    ></div>
                                    
                                    {/* Mascot Image */}
                                    {m.image && (
                                        <Image
                                            src={m.image}
                                            alt={m.name}
                                            width={400}
                                            height={500}
                                            className="absolute right-0 md:right-4 lg:right-12 bottom-0 h-[85%] md:h-[95%] lg:h-[105%] lg:group-hover/item:h-[95%] w-auto object-contain object-bottom filter grayscale group-hover/item:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-40 group-hover/item:opacity-100 transform origin-bottom"
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
                                            className="font-display text-2xl lg:text-3xl xl:text-3xl lg:group-hover/item:text-5xl tracking-widest transition-all duration-700 opacity-50 group-hover/item:opacity-100 [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl] md:group-hover/item:[writing-mode:horizontal-tb] md:rotate-180 md:group-hover/item:rotate-0 uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-none block origin-center text-right"
                                            style={{ color: m.color?.primary || 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
                                        >
                                            {m.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>
                    </div>

                    {/* Right Content - Active Mascot Showcase */}
                    <div className="flex-1 bg-black overflow-hidden relative border-y-[2px] md:border-y-0 border-black">
                        <div className="relative w-full h-full min-h-[70vh] md:min-h-[calc(100vh-10rem)] flex items-center justify-center overflow-hidden transition-colors duration-500">

                            {/* Animated Smoky Background */}
                            <div className="absolute inset-0 overflow-hidden flex items-center justify-center transition-all duration-700 bg-black">
                                {/* Base color tint that recolors the smoke */}
                                <div 
                                    className="absolute inset-0 transition-colors duration-700 z-10 mix-blend-color pointer-events-none opacity-80" 
                                    style={{ backgroundColor: activeMascot.color?.primary }} 
                                />
                                
                                {/* Smoke Layer 1 */}
                                <div className="absolute w-[150%] h-[150%] opacity-60 mix-blend-screen animate-smoke pointer-events-none z-0">
                                    <Image 
                                        src="/backgrounds/gradiente-verde.png"
                                        alt="Smoke"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {/* Smoke Layer 2 (Reverse animated) */}
                                <div className="absolute w-[150%] h-[150%] opacity-40 mix-blend-screen animate-smoke-reverse pointer-events-none z-0">
                                    <Image 
                                        src="/backgrounds/gradiente-amarillo.png"
                                        alt="Smoke"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Content Group (Centered Automatically via Flexbox) */}
                            <div className="relative z-20 w-full h-full min-h-screen lg:min-h-0 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 xl:gap-24 px-4 py-24 lg:py-0">
                                
                                {/* 1. Center Layout: Mascot, Text, Arrows, Button */}
                                <div className="flex flex-col items-center justify-center relative w-full lg:w-auto">

                                    <div className="relative z-10 h-[300px] sm:h-[350px] w-full flex items-end justify-center mb-8">
                                        {/* Mascot Image */}
                                        {activeMascot.image && (
                                            <Image
                                                key={activeMascot.id}
                                                src={activeMascot.image}
                                                alt={activeMascot.name}
                                                width={400}
                                                height={500}
                                                className="object-contain object-bottom h-full max-w-[80%] drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] animate-float"
                                                priority
                                            />
                                        )}
                                    </div>

                                    {/* Base concentric circles */}
                                    <div className="absolute z-0 top-[270px] sm:top-[320px] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none opacity-40">
                                        <div className="w-[200px] sm:w-[300px] h-[34px] sm:h-[50px] rounded-[100%] border border-white absolute"></div>
                                        <div className="w-[140px] sm:w-[200px] h-[24px] sm:h-[34px] rounded-[100%] border border-white absolute"></div>
                                        <div className="w-[70px] sm:w-[100px] h-[12px] sm:h-[16px] rounded-[100%] border border-white absolute"></div>
                                    </div>

                                    {/* Title */}
                                    <div className="flex flex-col items-center mt-6">
                                        <h2 className="font-display text-2xl sm:text-3xl text-white mb-2 uppercase">
                                            ¡Hola, soy {activeMascot.name}!
                                        </h2>
                                        <div className="w-full h-[2px] bg-white mb-6"></div>
                                    </div>

                                    {/* Arrows */}
                                    <div className="flex items-center gap-16 sm:gap-24 mb-6">
                                        <button onClick={handlePrev} className="text-white opacity-70 hover:opacity-100 hover:scale-110 transition-all">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                        </button>
                                        <button onClick={handleNext} className="text-white opacity-70 hover:opacity-100 hover:scale-110 transition-all">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        </button>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                        <Link
                                            href={`/${activeMascot.slug}`}
                                            className="bg-white text-black font-display tracking-widest py-3 px-8 rounded-full text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all uppercase text-center w-full sm:w-auto"
                                        >
                                            Mis artículos
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (window.innerWidth < 1024) {
                                                    document.getElementById('bio-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }
                                            }}
                                            className="bg-transparent border border-white text-white font-display tracking-widest py-3 px-8 rounded-full text-sm hover:bg-white/10 transition-all uppercase text-center w-full sm:w-auto"
                                        >
                                            Conóceme
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Glassmorphism Bio Card */}
                                <div id="bio-card" className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0">
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10">

                                        <h3 className="text-center font-bold mb-4 tracking-wider text-3xl" style={{ color: activeMascot.color?.primary }}>
                                            Biografía
                                        </h3>

                                        <p className="text-sm text-gray-200 mb-8 leading-relaxed text-center font-light">
                                            {activeMascot.description}
                                        </p>

                                        <div className="space-y-4 text-sm tracking-wide">
                                            <div>
                                                <span className="text-white font-bold">Religión: </span>
                                                <span className="text-gray-300 font-light">{activeMascot.religion}.</span>
                                            </div>
                                            <div>
                                                <span className="text-white font-bold">Edad: </span>
                                                <span className="text-gray-300 font-light">{activeMascot.age}</span>
                                            </div>
                                            <div>
                                                <span className="text-white font-bold">Color favorito: </span>
                                                <span className="text-gray-300 font-light">{activeMascot.favoriteColor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Team Section */}
                    <section className="pb-24 pt-16 bg-black">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">El Equipo</h2>
                        <div className="w-24 h-1 bg-bifido-neon mx-auto rounded-full shadow-[0_0_10px_rgba(204,253,41,0.5)]"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bifido-neon"></div>
                        </div>
                    ) : team.length > 0 ? (
                        <div ref={teamRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member) => (
                                <div key={member.id} className="bg-bifido-gray/50 border border-bifido-gray/30 rounded-2xl p-6 flex flex-col items-center text-center hover:border-bifido-neon transition-all duration-300 group">
                                    <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-bifido-gray group-hover:border-bifido-neon transition-colors duration-300">
                                        <Image
                                            src={member.profileImage}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="font-display text-2xl text-white mb-2">{member.name}</h3>
                                    <p className="text-bifido-lightgray text-sm mb-4 flex-1 line-clamp-3">
                                        {member.biography || 'Miembro del equipo de Revista Bífido.'}
                                    </p>

                                    {/* Social Links */}
                                    <div className="flex items-center gap-4">
                                        {member.email && (
                                            <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-bifido-neon transition-colors">
                                                <Mail size={20} />
                                            </a>
                                        )}
                                        {member.socialMedia?.instagram && (
                                            <a href={member.socialMedia.instagram.startsWith('http') ? member.socialMedia.instagram : `https://${member.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bifido-neon transition-colors">
                                                <Instagram size={20} />
                                            </a>
                                        )}
                                        {member.socialMedia?.twitter && (
                                            <a href={member.socialMedia.twitter.startsWith('http') ? member.socialMedia.twitter : `https://${member.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bifido-neon transition-colors">
                                                <Twitter size={20} />
                                            </a>
                                        )}
                                        {member.socialMedia?.website && (
                                            <a href={member.socialMedia.website.startsWith('http') ? member.socialMedia.website : `https://${member.socialMedia.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bifido-neon transition-colors">
                                                <Globe size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-2xl font-display tracking-widest uppercase">Estamos mutando...</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
