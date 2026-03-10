'use client';

import { useEffect, useRef } from 'react';
import { Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { RiTwitterXLine, RiTiktokLine } from "react-icons/ri";
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
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen pt-24 md:pt-52">
      <div className="container mx-auto px-4 max-w-4xl">
        <div ref={contentRef} className="flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-bifido-gray rounded-full mb-4">
              <Mail className="text-white" size={32} />
            </div>
            <h1 className="font-display text-5xl md:text-6xl mb-4">
              Contáctanos
            </h1>
            <p className="text-xl text-bifido-lightgray max-w-2xl mx-auto">
              ¿Tienes una historia que contar? ¿Quieres colaborar con nosotros?
              Estamos aquí para escucharte.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="w-full grid md:grid-cols-2 gap-8 mb-12">
            {/* Email Card */}
            <div className="bg-bifido-gray rounded-2xl p-8 text-center hover:bg-bifido-gray/80 transition-colors group flex flex-col items-center justify-center min-h-[250px]">
              <h2 className="font-display text-3xl mb-6 text-white">Escríbenos</h2>
              <a
                href="mailto:bifidomedio@gmail.com"
                className="text-xl md:text-2xl text-bifido-lightgray group-hover:text-white transition-colors break-all"
              >
                bifidomedio@gmail.com
              </a>
            </div>

            {/* Social Media Card */}
            <div className="bg-bifido-gray rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
              <h2 className="font-display text-3xl mb-6 text-white">Síguenos</h2>
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="https://www.facebook.com/revistabifido/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-bifido-black rounded-full text-bifido-lightgray hover:text-white hover:scale-110 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="https://www.instagram.com/revistabifido/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-bifido-black rounded-full text-bifido-lightgray hover:text-white hover:scale-110 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="https://x.com/revistabifido"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-bifido-black rounded-full text-bifido-lightgray hover:text-white hover:scale-110 transition-all"
                  aria-label="Twitter"
                >
                  <RiTwitterXLine size={24} />
                </a>
                <a
                  href="https://www.youtube.com/@revistabifido"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-bifido-black rounded-full text-bifido-lightgray hover:text-white hover:scale-110 transition-all"
                  aria-label="YouTube"
                >
                  <Youtube size={24} />
                </a>
                <a
                  href="https://www.tiktok.com/@revistabifido"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-bifido-black rounded-full text-bifido-lightgray hover:text-white hover:scale-110 transition-all"
                  aria-label="Tiktok"
                >
                  <RiTiktokLine size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
