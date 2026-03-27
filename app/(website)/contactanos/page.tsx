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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
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

      <div className="container mx-auto px-4 relative z-10">
        <div ref={contentRef} className="flex flex-col items-center gap-12 md:gap-14">
          
          {/* Heading Section */}
          <div className="text-center">
            <h1 className="font-googlesans font-bold text-[60px] md:text-[120px] leading-none text-bifido-neon tracking-tighter uppercase">
              CONTÁCTANOS
            </h1>
          </div>

          {/* Top Section: Email | Logo | Socials */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-items-center gap-8 md:gap-0 w-full max-w-6xl">
            
            {/* Left: Email Pill (Justified right on desktop) */}
            <div className="flex justify-center md:justify-end w-full">
              <div className="bg-white rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform duration-300">
                <div className="relative overflow-hidden w-9 h-9 rounded-full bg-bifido-neon flex items-center justify-center hover:scale-110 transition-transform group">
                    {/* Long Shadow Effect using flattened opacity stacking context */}
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

            {/* Center: Official Circular Logo */}
            <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center group">
              <Image 
                src="/logos/bifido_contact.svg" 
                alt="Bífido Logo" 
                width={224} 
                height={224} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right: Social Pill (Justified left on desktop) */}
            <div className="flex justify-center md:justify-start w-full">
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
                    {/* Long Shadow Effect using flattened opacity stacking context */}
                    <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                          <Icon size={20} />
                        </div>
                      ))}
                    </div>
                    {/* Main Icon */}
                    <div className="relative z-10 text-black flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Message Pill */}
          <div className="bg-[#1a2e05]/90 backdrop-blur-sm border border-bifido-neon/20 rounded-full px-10 py-4 max-w-6xl w-full text-center shadow-2xl hover:border-bifido-neon transition-colors">
            <p className="text-white font-googlesans font-medium text-lg md:text-xl tracking-wide">
              ¿Tienes una historia que contar?, ¿Quieres colaborar con nosotros?, Estamos aquí para escucharte.
            </p>
          </div>

        </div>
      </div>

      {/* Shadow Gradient at the Bottom of Hero */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
    </div>
  );
}
