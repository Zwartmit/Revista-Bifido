'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { mascots } from '@/lib/mascots';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

interface MascotCardProps {
  mascot: typeof mascots[0];
  position: [number, number, number];
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

function MascotCard({ mascot, position, onHover, onClick }: MascotCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Animación de flotación
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Rotación suave cuando está en hover
      if (hovered) {
        meshRef.current.rotation.y += 0.02;
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
      scale={hovered ? 1.2 : 1}
    >
      <boxGeometry args={[1, 1.5, 0.1]} />
      <meshStandardMaterial 
        color={mascot.color.primary}
        emissive={hovered ? mascot.color.secondary : mascot.color.dark}
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
      
      {hovered && (
        <Html center>
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg pointer-events-none">
            <p className="font-display text-lg whitespace-nowrap" style={{ color: mascot.color.primary }}>
              {mascot.section}
            </p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Scene() {
  const router = useRouter();
  const [hoveredMascot, setHoveredMascot] = useState<string | null>(null);

  const handleMascotClick = (slug: string) => {
    router.push(`/${slug}`);
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {mascots.map((mascot) => (
        <MascotCard
          key={mascot.id}
          mascot={mascot}
          position={mascot.position}
          onHover={(hovered) => setHoveredMascot(hovered ? mascot.id : null)}
          onClick={() => handleMascotClick(mascot.slug)}
        />
      ))}
    </>
  );
}

export default function InteractiveScene() {
  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-bifido-gray to-bifido-black rounded-lg overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
