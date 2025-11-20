'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { mascots } from '@/lib/mascots';
import { X, PawPrint } from 'lucide-react';
import gsap from 'gsap';

export default function LaManadaPage() {
  const [selectedMascot, setSelectedMascot] = useState<typeof mascots[0] | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }

    gsap.fromTo(
      '.mascot-card',
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        delay: 0.3,
      }
    );
  }, []);

  return (
    <div className="min-h-screen py-12">
      {/* Header */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-bifido-gray rounded-full mb-4">
          <PawPrint className="text-white" size={32} />
        </div>
        <h1 ref={titleRef} className="font-display text-5xl md:text-6xl mb-4">
          La Manada
        </h1>
        <p className="text-xl text-bifido-lightgray max-w-2xl mx-auto">
          Conoce a los personajes que representan cada sección de Bífido.
          Cada una tiene su propia personalidad y visión del mundo.
        </p>
      </div>

      {/* Mascots Grid */}
      <div ref={cardsRef} className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {mascots.map((mascot) => (
            <div
              key={mascot.id}
              className="mascot-card cursor-pointer group"
              onClick={() => setSelectedMascot(mascot)}
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                style={{
                  background: `linear-gradient(135deg, ${mascot.color.primary} 0%, ${mascot.color.dark} 100%)`,
                }}
              >
                <div className="aspect-square relative">
                  <Image
                    src={mascot.image}
                    alt={mascot.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-white">
                  <h3 className="font-display text-2xl mb-2">{mascot.name}</h3>
                  <p className="text-sm opacity-90">{mascot.section}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedMascot && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMascot(null)}
        >
          <div
            className="bg-bifido-gray rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMascot(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black shadow-lg z-10"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Image Section */}
              <div
                className="rounded-xl p-8 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${selectedMascot.color.primary} 0%, ${selectedMascot.color.dark} 100%)`,
                }}
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={selectedMascot.image}
                    alt={selectedMascot.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Info Section */}
              <div className="flex flex-col justify-center">
                <div
                  className="inline-block px-4 py-2 rounded-full text-white text-sm font-semibold mb-4 self-start"
                  style={{ backgroundColor: selectedMascot.color.primary }}
                >
                  {selectedMascot.section}
                </div>

                <h2 className="font-display text-4xl mb-2">
                  Hola, mi nombre es {selectedMascot.name}
                </h2>

                <div className="space-y-4 mt-6">
                  <div>
                    <h3 className="font-semibold text-gray-300 mb-1">Biografía</h3>
                    <p className="text-gray-400">{selectedMascot.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-300 mb-1">Religión</h3>
                      <p className="text-gray-400">{selectedMascot.religion}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-300 mb-1">Edad</h3>
                      <p className="text-gray-400">{selectedMascot.age}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-300 mb-1">Color Favorito</h3>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-600"
                        style={{ backgroundColor: selectedMascot.color.primary }}
                      />
                      <p className="text-gray-400">{selectedMascot.favoriteColor}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={`/${selectedMascot.slug}`}
                  className="mt-8 inline-block text-center px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: selectedMascot.color.primary }}
                >
                  Ver artículos de {selectedMascot.section}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
