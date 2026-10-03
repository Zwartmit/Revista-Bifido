import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { RiInstagramFill } from 'react-icons/ri';
import { FaUserSecret, FaGlobe } from 'react-icons/fa';

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { ssr: false });

interface LiveArchiveModalProps {
    selectedMember: any;
    setSelectedMember: (member: any | null) => void;
    team: any[];
}

export default function LiveArchiveModal({ selectedMember, setSelectedMember, team }: LiveArchiveModalProps) {
    const [modalPhotoIndex, setModalPhotoIndex] = useState(0);

    if (!selectedMember) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-12 md:px-24 bg-black/95 backdrop-blur-sm">
            <div className="w-full max-w-5xl bg-black border border-gray-800 rounded-xl relative flex flex-col max-h-full overflow-hidden">

                {/* Header/Close */}
                <div className="absolute top-4 right-4 z-[110]">
                    <button
                        onClick={() => setSelectedMember(null)}
                        className="flex items-center gap-2 text-white hover:text-bifido-neon transition-colors font-mono text-sm tracking-widest"
                    >
                        CERRAR <span className="text-xl font-bold text-orange-500">X</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex flex-col md:flex-row w-full flex-1 min-h-0 overflow-y-scroll md:overflow-hidden p-6 md:p-8 gap-2 md:gap-12 custom-scrollbar">

                    {/* Left: 3D Model Viewer (Pill shape) */}
                    <div className="w-full md:w-[40%] flex-shrink-0 flex flex-col items-center justify-center min-h-0 relative z-10">
                        {/* Mobile Header (Hidden on Desktop) */}
                        <div className="flex flex-col md:hidden w-full mb-6">
                            <span className="font-jack text-orange-500 text-xs tracking-[0.2em] mb-2 uppercase">Manifiesto personal</span>
                            <div className="flex items-center gap-3 mb-2">
                                <Image
                                    src="/icons/message.svg"
                                    alt="Manifiesto"
                                    width={24}
                                    height={24}
                                    className="flex-shrink-0"
                                    style={{ filter: 'brightness(0) saturate(100%) invert(53%) sepia(98%) saturate(1831%) hue-rotate(348deg) brightness(101%) contrast(96%)' }}
                                />
                                <h2 className="text-4xl font-display uppercase tracking-widest text-orange-500 leading-none mt-2">
                                    {selectedMember.name}
                                </h2>
                            </div>
                            {selectedMember.profession && (
                                <div className="font-mono text-xs text-bifido-neon uppercase tracking-widest font-bold">
                                    {selectedMember.profession}
                                </div>
                            )}
                        </div>
                        <div className="w-full relative">
                            {/* Navigation Arrows Overlay (Mobile Only) */}
                            {team.length > 1 && (
                                <div className="absolute inset-y-0 -left-2 -right-2 flex md:hidden items-center justify-between pointer-events-none z-10">
                                    <button
                                        onClick={() => {
                                            const currentIndex = team.findIndex(m => m.id === selectedMember.id);
                                            const prevIndex = currentIndex <= 0 ? team.length - 1 : currentIndex - 1;
                                            setSelectedMember(team[prevIndex]);
                                            setModalPhotoIndex(0);
                                        }}
                                        className="pointer-events-auto group flex items-center transition-colors p-2"
                                        title="Anterior"
                                    >
                                        <div className="flex items-center rotate-180 group-hover:-translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(255,102,0,0.8)] transition-all">
                                            <Image src="/icons/arrow_o.svg" alt="Anterior" width={32} height={32} />
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentIndex = team.findIndex(m => m.id === selectedMember.id);
                                            const nextIndex = currentIndex === team.length - 1 ? 0 : currentIndex + 1;
                                            setSelectedMember(team[nextIndex]);
                                            setModalPhotoIndex(0);
                                        }}
                                        className="pointer-events-auto group flex items-center transition-colors p-2"
                                        title="Siguiente"
                                    >
                                        <div className="flex items-center group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(255,102,0,0.8)] transition-all">
                                            <Image src="/icons/arrow_o.svg" alt="Siguiente" width={32} height={32} />
                                        </div>
                                    </button>
                                </div>
                            )}

                            <div className="w-full aspect-[1/2] max-h-[60vh] md:max-h-full rounded-[100px] bg-white/5 overflow-hidden relative flex items-center justify-center border border-white/10">
                                <ModelViewer
                                    modelUrl={selectedMember.model3d}
                                    fallbackImage={selectedMember.profileImage}
                                    transparent={true}
                                />
                            </div>

                            {/* Pagination indicator (Mobile Only) */}
                            {team.length > 1 && (
                                <div className="absolute bottom-6 left-0 right-0 flex md:hidden justify-center pointer-events-none z-10">
                                    <span className="text-gray-300 font-sans text-xs bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                        {(team.findIndex(m => m.id === selectedMember.id) + 1)}/{team.length}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="w-full md:w-[60%] relative z-10">
                        <div className="flex flex-col text-left py-2 md:absolute md:inset-0 md:overflow-hidden min-h-0">
                            
                            {/* Header (Sticky on desktop) */}
                            <div className="hidden md:flex flex-col flex-shrink-0">
                                <span className="font-jack text-orange-500 text-xs tracking-[0.2em] mb-2 uppercase">Manifiesto personal</span>

                                <div className="flex items-center gap-3 mb-4">
                                    <Image
                                        src="/icons/message.svg"
                                        alt="Manifiesto"
                                        width={28}
                                        height={28}
                                        className="flex-shrink-0 w-7 h-7"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(53%) sepia(98%) saturate(1831%) hue-rotate(348deg) brightness(101%) contrast(96%)' }}
                                    />
                                    <h2 className="text-3xl md:text-5xl font-display uppercase tracking-widest text-orange-500 leading-none mt-2">
                                        {selectedMember.name}
                                    </h2>
                                </div>

                                {/* Profession */}
                                {selectedMember.profession && (
                                    <div className="font-mono text-[13px] text-bifido-neon uppercase tracking-widest mb-4 font-bold">
                                        {selectedMember.profession}
                                    </div>
                                )}
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 min-h-0 md:overflow-y-auto md:pr-4 custom-scrollbar flex flex-col justify-start pt-2 pb-6 order-3 md:order-2">
                                <div className="font-mono text-sm md:text-sm text-gray-300 leading-relaxed text-justify whitespace-pre-line">
                                    {selectedMember.biography || 'Miembro del equipo de Revista Bífido.'}
                                </div>
                            </div>

                            {/* Tags & IG - Ficha Técnica */}
                            <div className="flex flex-row justify-between items-start mt-2 mb-2 border-t border-gray-800/60 pt-4 w-full flex-shrink-0 order-4 md:order-3">
                                {/* Left: Rasgos & Base */}
                                <div className="flex flex-col gap-4">
                                    {/* Rasgos */}
                                    {selectedMember.characteristics && selectedMember.characteristics.length > 0 && (
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[11px] text-gray-500 font-display tracking-widest uppercase">Rasgos y gustos</span>
                                            <div className="font-mono text-xs text-bifido-neon tracking-wide uppercase">
                                                {selectedMember.characteristics.join(" / ")}
                                            </div>
                                        </div>
                                    )}
                                    {/* Base / Ubicación */}
                                    {selectedMember.location && (
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[11px] text-gray-500 font-display tracking-widest uppercase">Base</span>
                                            <span className="font-mono text-xs text-gray-300 uppercase tracking-wide">
                                                {selectedMember.location}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Redes */}
                                {(selectedMember.socialMedia?.website || selectedMember.socialMedia?.instagram) && (
                                    <div className="flex flex-col gap-3 items-end">
                                        <span className="text-[11px] text-gray-500 font-display tracking-widest uppercase">Contacto</span>
                                        <div className="flex flex-wrap justify-end gap-3 max-w-[76px]">
                                            {selectedMember.socialMedia?.website && (
                                                <a
                                                    href={selectedMember.socialMedia.website.startsWith('http') ? selectedMember.socialMedia.website : `https://${selectedMember.socialMedia.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative overflow-hidden w-8 h-8 rounded-full bg-bifido-neon flex items-center justify-center hover:scale-110 transition-transform group"
                                                    title="Sitio Web"
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                                                        {Array.from({ length: 15 }).map((_, i) => (
                                                            <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                                                                <FaGlobe size={16} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="relative z-10 text-black flex items-center justify-center">
                                                        <FaGlobe size={16} />
                                                    </div>
                                                </a>
                                            )}
                                            {selectedMember.socialMedia?.instagram && (
                                                <a
                                                    href={`https://instagram.com/${selectedMember.socialMedia.instagram.replace('@', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative overflow-hidden w-8 h-8 rounded-full bg-bifido-neon flex items-center justify-center hover:scale-110 transition-transform group"
                                                    title="Instagram"
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center text-black opacity-20 pointer-events-none">
                                                        {Array.from({ length: 15 }).map((_, i) => (
                                                            <div key={i} className="absolute" style={{ transform: `translate(${i + 1}px, ${i + 1}px)` }}>
                                                                <RiInstagramFill size={16} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="relative z-10 text-black flex items-center justify-center">
                                                        <RiInstagramFill size={16} />
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Navigation (Member Navigation) - Desktop Only */}
                            {team.length > 1 && (
                                <div className="hidden md:flex w-full md:border-t md:pt-4 md:mt-4 px-4 items-center justify-between text-gray-400 font-sans text-sm flex-shrink-0 order-4">
                                    <button
                                        onClick={() => {
                                            const currentIndex = team.findIndex(m => m.id === selectedMember.id);
                                            const prevIndex = currentIndex <= 0 ? team.length - 1 : currentIndex - 1;
                                            setSelectedMember(team[prevIndex]);
                                            setModalPhotoIndex(0);
                                        }}
                                        className="group flex items-center gap-3 transition-colors"
                                    >
                                        <div className="flex items-center mt-[2px] rotate-180 group-hover:-translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(255,102,0,0.8)] transition-all">
                                            <img src="/icons/arrow_o.svg" alt="Anterior" className="w-6 h-6 shrink-0" />
                                        </div>
                                        <span className="text-white mt-[2px] group-hover:text-orange-500 transition-colors">Anterior</span>
                                    </button>
                                    <span className="mt-[2px]">{(team.findIndex(m => m.id === selectedMember.id) + 1)}/{team.length}</span>
                                    <button
                                        onClick={() => {
                                            const currentIndex = team.findIndex(m => m.id === selectedMember.id);
                                            const nextIndex = currentIndex === team.length - 1 ? 0 : currentIndex + 1;
                                            setSelectedMember(team[nextIndex]);
                                            setModalPhotoIndex(0);
                                        }}
                                        className="group flex items-center gap-3 transition-colors"
                                    >
                                        <span className="text-white mt-[2px] group-hover:text-orange-500 transition-colors">Siguiente</span>
                                        <div className="flex items-center mt-[2px] group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(255,102,0,0.8)] transition-all">
                                            <img src="/icons/arrow_o.svg" alt="Siguiente" className="w-6 h-6 shrink-0" />
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
