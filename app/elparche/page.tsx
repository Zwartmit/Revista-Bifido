'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mascots } from '@/lib/mascots';
import gsap from 'gsap';
import { Users } from 'lucide-react';

export default function ElParchePage() {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }
            );
        }
    }, []);

    return (
        <div className="min-h-screen py-20 bg-bifido-black">
            <div className="container mx-auto px-4">
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

                {/* Mascots Grid */}
                <div ref={contentRef} className="space-y-12">
                    {mascots.map((mascot, index) => (
                        <Link
                            key={mascot.id}
                            href={`/${mascot.slug}`}
                            className="group block"
                        >
                            <div
                                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    } gap-8 bg-bifido-gray rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-white`}
                            >
                                {/* Image */}
                                <div className="relative w-full md:w-1/2 h-80 md:h-96 overflow-hidden">
                                    <div
                                        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                                        style={{
                                            background: `linear-gradient(135deg, ${mascot.color.primary} 0%, ${mascot.color.dark} 100%)`,
                                        }}
                                    />
                                    <Image
                                        src={mascot.image}
                                        alt={mascot.name}
                                        fill
                                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                                    <h2
                                        className="font-display text-4xl md:text-5xl mb-3 text-white group-hover:opacity-80 transition-opacity"
                                        style={{ color: mascot.color.primary }}
                                    >
                                        {mascot.name}
                                    </h2>

                                    <h3 className="text-2xl font-bold mb-4 text-white">
                                        {mascot.section}
                                    </h3>

                                    <p className="text-bifido-lightgray text-lg mb-6 leading-relaxed">
                                        {mascot.description}
                                    </p>

                                    {/* Details */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">Religión:</span>
                                            <span className="text-gray-300">{mascot.religion}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">Edad:</span>
                                            <span className="text-gray-300">{mascot.age}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">Color favorito:</span>
                                            <span className="text-gray-300">{mascot.favoriteColor}</span>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="mt-6">
                                        <span
                                            className="inline-block px-6 py-3 rounded-lg font-bold text-white transition-all group-hover:scale-105"
                                            style={{ backgroundColor: mascot.color.primary }}
                                        >
                                            Explorar {mascot.section} →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
