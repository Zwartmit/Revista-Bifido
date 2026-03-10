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
        <div className="min-h-screen bg-bifido-black pt-24 md:pt-40">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-bifido-red rounded-full mb-4">
                        <Users className="text-white" size={32} />
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl mb-4 text-white">
                        El Parche
                    </h1>
                    <p className="text-xl text-bifido-lightgray italic max-w-3xl mx-auto">
                        Cinco voces, cinco perspectivas, una sola misión: contar las verdades que otros callan
                    </p>
                </div>

                {/* Mascots Explorer */}
                <div ref={contentRef} className="flex flex-col md:flex-row gap-8 lg:gap-8 mb-32">

                    {/* Left Sticky Grid - Other Characters */}
                    <div className="w-full md:w-48 flex-shrink-0">
                        <div className="md:sticky md:top-32 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-0 border border-transparent overflow-hidden rounded-xl">
                                {otherMascots.map((m, i) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setActiveMascotId(m.id)}
                                        className="block aspect-square w-full relative group overflow-hidden border border-black transition-all hover:opacity-80"
                                        style={{ backgroundColor: m.color?.dark || '#333' }}
                                    >
                                        {/* Geometric backgrounds to match the screenshot style roughly */}
                                        <div className="absolute inset-0 opacity-50" style={{ backgroundColor: m.color?.primary }} />

                                        {m.image && (
                                            <Image
                                                src={m.image}
                                                alt={m.name}
                                                fill
                                                className="object-contain object-bottom p-2 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Active Mascot Showcase */}
                    <div className="flex-1">
                        <div className="relative w-full min-h-[700px] flex items-center justify-center rounded-3xl overflow-hidden border border-gray-800 transition-colors duration-500" style={{ borderColor: `${activeMascot.color?.primary}40` }}>

                            {/* Radial Glow Background */}
                            <div
                                className="absolute inset-0 transition-all duration-700"
                                style={{
                                    background: `radial-gradient(circle at center, ${activeMascot.color?.primary}40 0%, ${activeMascot.color?.dark}10 50%, transparent 80%)`
                                }}
                            />

                            {/* Center Layout: Mascot, Text, Arrows, Button */}
                            <div className="absolute inset-y-0 left-0 lg:left-10 right-0 lg:right-96 flex flex-col items-center justify-center z-20">

                                <div className="relative h-[350px] w-full flex items-end justify-center mb-8">
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
                                <div className="absolute top-[320px] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none opacity-40">
                                    <div className="w-[300px] h-[50px] rounded-[100%] border border-white absolute"></div>
                                    <div className="w-[200px] h-[34px] rounded-[100%] border border-white absolute"></div>
                                    <div className="w-[100px] h-[16px] rounded-[100%] border border-white absolute"></div>
                                </div>

                                {/* Title */}
                                <div className="flex flex-col items-center mt-6">
                                    <h2 className="font-display text-3xl text-white mb-2">
                                        Hola, soy {activeMascot.name}
                                    </h2>
                                    <div className="w-full h-[2px] bg-white mb-6"></div>
                                </div>

                                {/* Arrows */}
                                <div className="flex items-center gap-24 mb-6">
                                    <button onClick={handlePrev} className="text-white opacity-70 hover:opacity-100 hover:scale-110 transition-all">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                    </button>
                                    <button onClick={handleNext} className="text-white opacity-70 hover:opacity-100 hover:scale-110 transition-all">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                    </button>
                                </div>

                                {/* CTA Button */}
                                <Link
                                    href={`/${activeMascot.slug}`}
                                    className="bg-white text-black font-display tracking-widest py-3 px-8 rounded-full text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all uppercase"
                                >
                                    Ver artículos
                                </Link>
                            </div>

                            {/* Glassmorphism Bio Card */}
                            <div className="absolute bottom-8 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-20 left-4 right-4 lg:left-auto lg:right-8 lg:w-[340px]">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl">

                                    <div className="bg-white text-black font-display text-xl text-center py-2 px-4 rounded-xl mb-6 mx-auto w-fit">
                                        Hola, soy {activeMascot.name}
                                    </div>

                                    <h3 className="text-center font-bold mb-4 tracking-wider text-sm" style={{ color: activeMascot.color?.primary }}>
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
                                            <span className="text-white font-bold">Color Favorito: </span>
                                            <span className="text-gray-300 font-light">{activeMascot.favoriteColor}</span>
                                        </div>
                                        {/* Progress Bar mapped to Color Favorito */}
                                        <div className="mt-3 w-full h-[18px] bg-white/30 rounded-full overflow-hidden border border-white p-[2px]">
                                            <div className="h-full rounded-full transition-all duration-700" style={{ backgroundColor: activeMascot.color?.primary, width: '85%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <section className="pb-24">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Nuestro Equipo</h2>
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
                                    <div className="flex items-center gap-3">
                                        {member.email && (
                                            <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-bifido-neon transition-colors">
                                                <Mail size={18} />
                                            </a>
                                        )}
                                        {member.socialMedia?.instagram && (
                                            <a href={member.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bifido-neon transition-colors">
                                                <Instagram size={18} />
                                            </a>
                                        )}
                                        {member.socialMedia?.twitter && (
                                            <a href={member.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bifido-neon transition-colors">
                                                <Twitter size={18} />
                                            </a>
                                        )}
                                        {member.socialMedia?.website && (
                                            <a href={member.socialMedia.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bifido-neon transition-colors">
                                                <Globe size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-bifido-gray/30 rounded-2xl border border-dashed border-gray-700">
                            <p className="text-gray-500 mb-4">Aún no se han añadido integrantes al equipo.</p>
                            <Link href="/contactanos" className="text-bifido-neon hover:underline font-bold">
                                ¡Únete al parche!
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
