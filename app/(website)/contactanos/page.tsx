'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { RiFacebookFill, RiWhatsappFill, RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
import gsap from 'gsap';

export default function ContactPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  return (
    <div className="relative min-h-[70vh] md:min-h-[75vh] lg:min-h-screen py-16 lg:py-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgrounds/contact_bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/45"></div>
      </div>

      <div className="container mx-auto px-4 pt-0 relative z-10">
        <div ref={contentRef} className="flex flex-col items-center gap-8 lg:gap-12">

          {/* Heading Section */}
          <div className="text-center w-full px-2">
            <h1 className="font-googlesans font-bold text-[clamp(2.5rem,12vw,7rem)] leading-none text-bifido-neon tracking-tighter uppercase">
              CONTÁCTANOS
            </h1>
          </div>

          {/* Top Section: Email | Logo | Socials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-8 w-full max-w-6xl">

            {/* Logo - top on mobile/tablet (spans 2), center on desktop */}
            <div className="order-1 md:col-span-2 lg:col-span-1 lg:order-2 relative w-40 h-40 lg:w-56 lg:h-56 flex items-center justify-center group">
              <Image
                src="/icons/bifido_contact.svg"
                alt="Bífido Logo"
                width={224}
                height={224}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Left/Bottom-Left: Email Pill */}
            <div className="order-3 md:order-2 md:col-span-1 lg:col-span-1 lg:order-1 flex justify-center md:justify-end w-full">
              <div className="bg-white rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform duration-300">
                <div className="relative overflow-hidden w-9 h-9 rounded-full bg-bifido-neon flex items-center justify-center hover:scale-110 transition-transform group">
                  <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                        <Mail className="text-black" size={20} />
                      </div>
                    ))}
                  </div>
                  <Mail className="text-black" size={20} />
                </div>
                <span className="font-anton text-black text-xl tracking-wider">bifidomedio@gmail.com</span>
              </div>
            </div>

            {/* Right/Bottom-Right: Social Pill */}
            <div className="order-2 md:order-3 md:col-span-1 lg:col-span-1 lg:order-3 flex justify-center md:justify-start w-full">
              <div className="bg-white rounded-full px-8 py-3 flex items-center gap-4 shadow-2xl hover:scale-105 transition-transform duration-300">
                {[
                  { Icon: RiFacebookFill, href: "https://www.facebook.com/revistabifido/" },
                  { Icon: RiWhatsappFill, href: "https://wa.me/" },
                  { Icon: RiInstagramFill, href: "https://www.instagram.com/revistabifido/" },
                  { Icon: RiYoutubeFill, href: "https://www.youtube.com/@revistabifido" },
                ].map(({ Icon, href }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden w-9 h-9 rounded-full bg-bifido-neon flex items-center justify-center hover:scale-110 transition-transform group"
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                          <Icon size={20} />
                        </div>
                      ))}
                    </div>
                    <div className="relative z-10 text-black flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Message Pill */}
          <div className="bg-[#1a2e05]/90 backdrop-blur-sm border border-bifido-neon/20 rounded-full px-8 py-3 max-w-4xl w-full text-center shadow-2xl hover:border-bifido-neon transition-colors">
            <p className="text-white font-googlesans font-medium text-sm lg:text-base tracking-wide">
              ¿Tienes una historia que contar?, ¿Quieres colaborar con nosotros?, Estamos aquí para escucharte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
