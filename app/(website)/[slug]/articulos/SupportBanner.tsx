import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import abstractBg from '@/public/backgrounds/apoyo.png';
interface SupportBannerProps {
    primaryColor: string;
}

export default function SupportBanner({ primaryColor }: SupportBannerProps) {
    return (
        <div className="mx-6 sm:mx-10 lg:mx-16 xl:mx-24 mb-20 border border-[#1e1e1e] relative overflow-hidden group"
            style={{ borderTopColor: `${primaryColor}40` }}>

            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={abstractBg}
                    alt="Apoya el periodismo libre"
                    fill
                    className="object-cover group-hover:scale-105 transition-all duration-700"
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
            </div>

            <div className="relative z-10 p-10 sm:p-14 text-center">
                <span className="font-display text-md tracking-[0.5em] uppercase block mb-4" style={{ color: primaryColor }}>
                    Periodismo independiente
                </span>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white uppercase mb-4 leading-tight">
                    Apoya el periodismo libre
                </h2>
                <p className="font-googlesans text-gray-300 max-w-full mx-auto mb-8 text-base md:text-lg leading-relaxed">
                    Bífido existe porque hay personas que creen en el periodismo crudo y honesto. Si lo que lees te mueve, considera apoyarnos.
                </p>
                <Link href="/elparche" className="inline-block font-display tracking-[0.25em] text-black text-md px-8 py-4 uppercase hover:scale-105 transition-all shadow-lg"
                    style={{ backgroundColor: primaryColor }}>
                    Colaborar
                </Link>
            </div>
        </div>
    );
}
