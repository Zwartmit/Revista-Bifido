'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center, Html, useProgress, ContactShadows } from '@react-three/drei';

// Componente de carga personalizado
function Loader({ primaryColor = '#b8ff00', secondaryColor = '#fe5e00' }: { primaryColor?: string, secondaryColor?: string }) {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center min-w-[150px]">
        {/* Definición de la animación de rotación 3D para el ADN */}
        <style>{`
          @keyframes spinY {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
        `}</style>

        {/* Text */}
        <div className="mb-6 text-[14px] text-white/60 font-mono tracking-[0.2em] uppercase flex flex-col items-center justify-center">
          <span className="animate-pulse text-center whitespace-nowrap">SINTETIZANDO ORGANISMO</span>
        </div>

        {/* Generative DNA Helix */}
        <div className="flex flex-col gap-1.5 items-center justify-center [perspective:500px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="relative w-10 h-2 flex items-center justify-between [transform-style:preserve-3d]"
              style={{
                animation: `spinY 2s linear infinite`,
                animationDelay: `${i * -0.15}s`,
              }}
            >
              {/* Aminoácido 1 (Primario) */}
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}
              />

              {/* Enlace genético */}
              <div className="absolute left-2 right-2 h-[1px] bg-white/20" />

              {/* Aminoácido 2 (Secundario) */}
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: secondaryColor, boxShadow: `0 0 10px ${secondaryColor}` }}
              />
            </div>
          ))}
        </div>
      </div>
    </Html>
  );
}

function ModelContent({ url, onLoaded }: { url: string; onLoaded?: () => void }) {
  const gltf = useGLTF(url);
  
  useEffect(() => {
    if (onLoaded) {
      onLoaded();
    }
  }, [onLoaded]);

  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  );
}

export default function ModelViewer({
  modelUrl,
  fallbackImage,
  transparent = false,
  primaryColor = '#b8ff00',
  secondaryColor = '#fe5e00'
}: {
  modelUrl?: string,
  fallbackImage?: string,
  transparent?: boolean,
  primaryColor?: string,
  secondaryColor?: string
}) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!modelUrl) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${transparent ? 'bg-transparent' : 'bg-zinc-900/10'}`}>
        {fallbackImage ? (
          <div className={`relative w-full h-full ${transparent ? 'drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)]' : 'p-8 opacity-50 grayscale'}`}>
            <Image
              src={fallbackImage}
              alt="Fallback"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="text-zinc-500 font-display text-sm uppercase tracking-widest">Sin modelo 3D</div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full cursor-grab active:cursor-grabbing relative ${transparent ? 'bg-transparent' : 'bg-zinc-950'}`}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onPointerDown={() => setIsHovered(true)}
    >
      {/* Neon Aura Gradient (Solo en modo oscuro) */}
      {!transparent && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(204, 253, 41, 0.3) 0%, transparent 70%)'
          }}
        />
      )}
      <Canvas
        shadows={!transparent}
        camera={{ position: [0, 0, 6], fov: 16 }} // Zoom extremo (FOV 16)
        style={{ pointerEvents: 'auto' }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance" }}
      >
        {/* Iluminación */}
        {transparent ? (
          <ambientLight intensity={3} /> // Luz plana pura sin brillos
        ) : (
          <>
            <ambientLight intensity={1.5} />
            <pointLight position={[5, 5, 5]} intensity={1.5} />
            <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={1} />
          </>
        )}

        <Suspense fallback={<Loader primaryColor={primaryColor} secondaryColor={secondaryColor} />}>
          <ModelContent url={modelUrl} onLoaded={() => setIsLoaded(true)} />
          
          {/* Sombra de contacto realista en la base (Optimizada para móvil con frames={1}) */}
          <ContactShadows position={[0, -1.4, 0]} opacity={0.65} scale={10} blur={2.5} far={4} color="#000000" resolution={256} frames={1} />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={4} // Evita que se metan dentro de la cabeza
            maxDistance={10} // Evita que se alejen al infinito
            autoRotate={!isHovered}
            autoRotateSpeed={1}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            makeDefault
            target={[0, 0, 0]} // Objetivo centrado
          />
        </Suspense>
      </Canvas>

      {/* Indicador de Interactividad 3D */}
      <div
        className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 pointer-events-none transition-all duration-700 ease-out font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase z-50 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white shadow-2xl ${(!isLoaded || isHovered) ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
      >
        <span className="text-center whitespace-nowrap">Gira y haz zoom para interactuar</span>
      </div>
    </div>
  );
}
