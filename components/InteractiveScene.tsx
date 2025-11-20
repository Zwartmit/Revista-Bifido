'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { mascots } from '@/lib/mascots';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

interface MascotHotspotProps {
  mascot: typeof mascots[0];
  position: [number, number, number];
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

function MascotHotspot({ mascot, position, onHover, onClick }: MascotHotspotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Animación de flotación más orgánica
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.15;

      // Rotación constante
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;

      // Escala pulsante suave al hacer hover
      if (hovered) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
        meshRef.current.scale.set(scale * 1.2, scale * 1.2, scale * 1.2);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => {
        setHovered(true);
        onHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={onClick}
    >
      {/* Forma de cristal/diamante */}
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color={mascot.color.primary}
        emissive={mascot.color.primary}
        emissiveIntensity={hovered ? 2 : 0.5}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.9}
      />

      {/* Halo de luz al hacer hover */}
      {hovered && (
        <pointLight distance={3} intensity={2} color={mascot.color.primary} />
      )}

      {hovered && (
        <Html position={[0, 0.8, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
          <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] whitespace-nowrap transform transition-all duration-200">
            <p className="font-display text-sm font-bold tracking-wider text-white">
              {mascot.section}
            </p>
            <div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45 border-r border-b border-white/20"
            />
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Scene() {
  const router = useRouter();
  // const [hoveredMascot, setHoveredMascot] = useState<string | null>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 7; // Threshold for mobile layout in 3D units

  const handleMascotClick = (slug: string) => {
    router.push(`/${slug}`);
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.2}
        maxAzimuthAngle={Math.PI / 6}
        minAzimuthAngle={-Math.PI / 6}
      />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {mascots.map((mascot, index) => {
        // Calculate position based on layout
        // Desktop: Horizontal spread from -4 to 4
        // Mobile: Vertical spread from 3 to -3
        let position: [number, number, number];

        if (isMobile) {
          const yOffset = 3 - (index * 1.5);
          position = [0, yOffset, 0];
        } else {
          position = mascot.position;
        }

        return (
          <MascotHotspot
            key={mascot.id}
            mascot={mascot}
            position={position}
            onHover={() => { }}
            onClick={() => handleMascotClick(mascot.slug)}
          />
        );
      })}
    </>
  );
}

export default function InteractiveScene() {
  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105 bg-[url('/hero/hero2.png')] md:bg-[url('/hero/hero1.png')]"
      >
        {/* Overlay oscuro para mejorar contraste de los elementos 3D */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Canvas 3D transparente */}
      <div className="absolute inset-0 z-10">
        <Canvas gl={{ alpha: true, antialias: true }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
