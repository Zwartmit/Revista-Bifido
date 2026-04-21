'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import gsap from 'gsap';

interface Event {
    id: string | number;
    title: string;
    date: string;
    time: string;
    location: string;
    address: string;
    description: any; // RichText or string
    image?: string;
    slug?: string;
    shortDescription?: string;
    price?: { isFree: boolean; amount?: number; currency?: string };
    ticketLink?: string;
    organizer?: string;
    status: string;
    category?: string;
}

interface EventsClientProps {
    events: Event[];
}

export default function EventsClient({ events }: EventsClientProps) {
    const [filter, setFilter] = useState('upcoming');

    const filters = [
        { id: 'all', label: 'Todos' },
        { id: 'upcoming', label: 'Próximos' },
        { id: 'ongoing', label: 'En Curso' },
        { id: 'finished', label: 'Pasados' },
        { id: 'cancelled', label: 'Cancelados' },
    ];

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current && contentRef.current.children.length > 0) {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, scale: 0.95, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [filter]);

    const filteredEvents = filter === 'all'
        ? events
        : events.filter(event => event.status === filter);

    const featuredEvent = filteredEvents.length > 0 ? filteredEvents[0] : null;
    const gridEvents = filteredEvents.length > 1 ? filteredEvents.slice(1) : [];

    const formatDayMonth = (dateString: string) => {
        if (!dateString) return { day: '00', month: '---' };
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { day: '00', month: '---' };
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '')
        };
    };
    
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'FECHA INVÁLIDA';
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRotation = (index: number) => {
        const rots = [ -4, 5, -2, 3, -5, 2 ];
        return rots[index % rots.length];
    };

    const getColors = (index: number) => {
        const colors = [
            { bg: '#CCFD29', text: '#000' }, // Neon
            { bg: '#E63946', text: '#fff' }, // Red
            { bg: '#22c55e', text: '#000' }, // Green
            { bg: '#00BCD4', text: '#000' }  // Cyan
        ];
        return colors[index % colors.length];
    };

    const getClipPaths = (index: number) => {
        const clips = [
            'polygon(4% 0%, 96% 3%, 100% 92%, 91% 100%, 7% 96%, 0% 8%)',
            'polygon(7% 3%, 98% 0%, 93% 90%, 88% 100%, 0% 96%, 4% 12%)',
            'polygon(0% 4%, 93% 8%, 100% 96%, 95% 100%, 8% 90%, 3% 0%)',
            'polygon(3% 5%, 95% 2%, 98% 98%, 91% 94%, 5% 99%, 1% 7%)'
        ];
        return clips[index % clips.length];
    };

    return (
        <div className="flex-1 w-full pt-12 pb-12 relative flex flex-col" style={{
            background: "#030303 url('data:image/svg+xml,%3Csvg width=\\'80\\' height=\\'80\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'n\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'.75\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23n)\\' opacity=\\'.07\\'/%3E%3C/svg%3E') repeat"
        }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes glitch { 0%,100%{ clip-path:inset(0 0 95% 0); transform:translate(-2px,0); } 20%{ clip-path:inset(30% 0 60% 0); transform:translate(2px,0); } 40%{ clip-path:inset(60% 0 20% 0); transform:translate(-1px,0); } 60%{ clip-path:inset(5% 0 75% 0); transform:translate(3px,0); } 80%{ clip-path:inset(80% 0 5% 0); transform:translate(-2px,0); } }
                .glitch-title { position:relative; display:inline-block; }
                .glitch-title::after { content:attr(data-text); position:absolute; inset:0; color:#CCFD29; animation:glitch 4s infinite; opacity:.7; pointer-events:none; }
                
                .rasgado-card { width:100%; max-width:340px; aspect-ratio:3/4.2; position:relative; cursor:pointer; transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin:0 auto; }
                .rasgado-card:hover { transform:scale(1.08) rotate(2deg) !important; z-index:10; }
                
                .r-layer1 { position:absolute; inset:0; transition:all .3s; }
                .rasgado-card:hover .r-layer1 { transform:translate(-8px,8px); }
                .r-layer2 { position:absolute; inset:6px; background:#0a0a0a; clip-path:polygon(0% 4%, 100% 0%, 96% 96%, 4% 100%); transition:background .3s; }
                .rasgado-card:hover .r-layer2 { background:#111; }
                .r-layer3 { position:absolute; inset:0; background-position:center; background-size:cover; mix-blend-mode:luminosity; opacity:.4; clip-path:polygon(0% 18%, 100% 12%, 100% 82%, 0% 88%); filter:contrast(1.2); transition:opacity .3s; }
                .rasgado-card:hover .r-layer3 { opacity:.7; }
                
                .r-content { position:absolute; inset:0; padding:2rem; display:flex; flex-direction:column; justify-content:center; filter:drop-shadow(3px 4px 0px rgba(0,0,0,1)); pointer-events:none; }
                
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />

            <div className="container mx-auto px-4 max-w-[1200px]">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.85] text-[#f5f5f5] tracking-wide glitch-title uppercase" data-text="EVENTOS">
                        EVENTOS
                    </h1>
                    <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-[#CCFD29] to-transparent mt-3 md:mt-4"></div>
                    <p className="mt-6 font-mono text-xs md:text-base text-gray-400 tracking-widest uppercase">
                        Espacios de encuentro, diálogo y resistencia
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible hide-scrollbar gap-2 md:gap-4 mb-12 border-b border-white/10 pb-4 md:pb-6 w-[calc(100%+2rem)] -mx-4 px-4 md:w-full md:mx-0 md:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`whitespace-nowrap flex-shrink-0 px-4 md:px-5 py-2 text-[10px] md:text-sm font-mono tracking-widest uppercase transition-all ${filter === f.id
                                ? 'bg-[#CCFD29] text-black font-bold shadow-[2px_2px_0px_#fff]'
                                : 'bg-transparent text-gray-400 border border-white/20 hover:border-white/50 hover:text-white'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                    {/* Trailing spacer to avoid cut-off on mobile scrolling */}
                    <div className="w-1 md:hidden flex-shrink-0"></div>
                </div>

                <div ref={contentRef}>
                    {/* Featured Event */}
                    {featuredEvent && (
                        <div className="mb-16 relative">
                            <Link href={`/eventos/${featuredEvent.slug || '#'}`} className="block relative group overflow-hidden bg-[#080808] border border-white/10 hover:border-[#CCFD29] transition-all duration-300">
                                <div className="flex flex-col md:flex-row h-full">
                                    {/* Image Section */}
                                    <div className="relative w-full md:w-3/5 min-h-[400px] overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z\\' fill=\\'%23111\\' fill-opacity=\\'0.4\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')] z-10 opacity-30 pointer-events-none mix-blend-overlay" />
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={featuredEvent.image || '/images/placeholder-article.jpg'}
                                            alt={featuredEvent.title}
                                            className="w-full h-full object-cover filter grayscale-[100%] brightness-75 contrast-125 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700 pointer-events-none relative z-0"
                                        />
                                        {/* Overlay gradient to blend img and content */}
                                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#080808] to-transparent z-10"></div>
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className="p-8 md:p-12 w-full md:w-2/5 flex flex-col justify-center relative z-20">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent"></div>
                                        
                                        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] mb-6 shadow-sm truncate max-w-full">
                                            <span className="w-2 h-2 shrink-0 rounded-full bg-[#E63946] animate-pulse"></span>
                                            <span className="text-[#CCFD29] truncate">EVENTO DESTACADO</span>
                                        </div>
                                        
                                        <h2 className="font-display text-4xl lg:text-5xl text-white uppercase leading-[0.9] mb-6 glitch-title break-words" data-text={featuredEvent.title}>
                                            {featuredEvent.title}
                                        </h2>
                                        
                                        <div className="font-mono text-sm text-gray-400 space-y-2 mb-8 border-l-2 border-[#E63946] pl-4 py-1">
                                            <p className="text-white font-bold">{formatDate(featuredEvent.date).toUpperCase()}</p>
                                            <p className="truncate">{featuredEvent.location} · {featuredEvent.time}</p>
                                            <p>{featuredEvent.price?.isFree ? 'ENTRADA LIBRE' : (featuredEvent.price?.amount ? '$' + featuredEvent.price.amount : 'ENTRADA PAGA')}</p>
                                        </div>

                                        <div className="mt-auto">
                                            <button className="font-mono text-sm font-bold bg-white text-black px-6 py-3 uppercase tracking-widest group-hover:bg-[#CCFD29] transition-colors w-full md:w-auto text-center md:text-left">
                                                VER DETALLES →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Grid Events (Papel Rasgado Collage) */}
                    {gridEvents.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-16 pt-8">
                            {gridEvents.map((event, i) => {
                                const { day, month } = formatDayMonth(event.date);
                                const rotation = getRotation(i);
                                const theme = getColors(i);
                                const clip = getClipPaths(i);

                                return (
                                    <Link key={event.id} href={`/eventos/${event.slug || '#'}`} className="block">
                                        <div 
                                            className="rasgado-card group mx-auto" 
                                            style={{ transform: `rotate(${rotation}deg)` }}
                                        >
                                            <div className="r-layer1" style={{ background: theme.bg, clipPath: clip }} />
                                            <div className="r-layer2" />
                                            <div 
                                                className="r-layer3" 
                                                style={{ backgroundImage: `url('${event.image || '/images/placeholder-article.jpg'}')` }}
                                            />
                                            
                                            <div className="r-content">
                                                <div className="font-display text-[5rem] leading-[0.8] mb-8 drop-shadow-[3px_4px_0_rgba(0,0,0,1)]" style={{ color: theme.bg, transform: `rotate(${-rotation}deg)` }}>
                                                    {day}<br/>{month}
                                                </div>
                                                
                                                <div className="font-primary font-black text-[2.4rem] leading-none text-white uppercase break-words drop-shadow-[2px_2px_0_rgba(0,0,0,1)] relative z-10" style={{ transform: `rotate(${rotation/2}deg)` }}>
                                                    {event.title}
                                                </div>
                                                
                                                <div className="mt-8 self-start max-w-full">
                                                    <span 
                                                        className="font-mono text-xs font-bold px-3 py-1.5 uppercase shadow-[2px_2px_0_rgba(0,0,0,1)] inline-block truncate max-w-full"
                                                        style={{ background: theme.bg, color: theme.text, transform: `rotate(${-rotation}deg)` }}
                                                    >
                                                        {event.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-24 border-2 border-dashed border-white/20 max-w-2xl mx-auto">
                            <p className="text-white font-display text-3xl md:text-5xl opacity-50">PRONTO VERÁS TODOS LOS PARCHES</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
