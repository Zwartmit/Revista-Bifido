'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search, X, RotateCcw } from 'lucide-react';
import gsap from 'gsap';

interface Event {
    id: string | number;
    title: string;
    date: string;
    time: string;
    location: string;
    address: string;
    city?: string;
    description: any;
    image?: string;
    isFeatured?: boolean;
    slug?: string;
    shortDescription?: string;
    price?: { isFree?: boolean; amount?: number; currency?: string };
    ticketLink?: string;
    organizer?: string;
    status?: string;
    category?: string;
    otherCategoryName?: string;
}

interface EventsClientProps {
    events: Event[];
}

// Función para normalizar texto (ignora mayúsculas y acentos: música == musica)
function normalizeText(text?: string | null): string {
    return (text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

// ─── Featured Carousel ────────────────────────────────────────────────────────
const FeaturedEventsCarousel = ({ events, formatDate }: { events: Event[]; formatDate: (date: string) => string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
    }, [events.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    }, [events.length]);

    useEffect(() => {
        if (events.length <= 1 || isHovered) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [events.length, isHovered, nextSlide]);

    if (!events || events.length === 0) return null;

    const featuredEvent = events[currentIndex];

    return (
        <div
            className="mb-16 relative flex justify-center w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                href={`/eventos/${featuredEvent.slug || '#'}`}
                className="relative group overflow-hidden bg-black border border-white/10 hover:border-[#b8ff00] transition-all duration-300 w-full md:w-fit md:max-w-[95vw] flex flex-col md:flex-row md:min-h-[400px] mx-auto"
            >
                <div className="relative w-full md:w-fit flex flex-col justify-center shrink-0 bg-black">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2740%27 height=%2740%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z%27 fill=%27%23111%27 fill-opacity=%270.4%27 fill-rule=%27evenodd%27/%3E%3C/svg%3E')] z-10 opacity-30 pointer-events-none mix-blend-overlay" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        key={featuredEvent.id}
                        src={featuredEvent.image || '/images/placeholder-article.jpg'}
                        alt={featuredEvent.title}
                        className="w-full h-auto max-h-[60vh] md:w-auto md:h-[400px] object-contain filter grayscale-[100%] brightness-75 contrast-125 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700 z-20 animate-in fade-in zoom-in-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black to-transparent z-30 pointer-events-none" />
                </div>

                <div className="p-6 md:py-10 md:px-12 w-full md:w-fit md:max-w-[500px] shrink-0 flex flex-col justify-center relative z-20" key={`content-${featuredEvent.id}`}>
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent" />

                    <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] mb-6 shadow-sm truncate max-w-full">
                        <span className="w-2 h-2 shrink-0 rounded-full bg-[#E63946] animate-pulse" />
                        <span className="text-[#b8ff00] truncate">EVENTO DESTACADO</span>
                    </div>

                    <h2 className="font-display text-4xl lg:text-5xl text-white uppercase leading-[0.9] mb-6">
                        {featuredEvent.title}
                    </h2>

                    <div className="font-mono text-sm text-gray-400 space-y-2 mb-8 border-l-2 border-[#E63946] pl-4 py-1">
                        <p className="text-white font-bold">{formatDate(featuredEvent.date).toUpperCase()}</p>
                        <p className="truncate">{featuredEvent.location} · {featuredEvent.time}</p>
                        <p>{featuredEvent.price?.isFree ? 'ENTRADA LIBRE' : (featuredEvent.price?.amount ? '$ ' + featuredEvent.price.amount.toLocaleString('es-CO') + ' ' + (featuredEvent.price?.currency || 'COP') : 'ENTRADA PAGA')}</p>
                    </div>

                    <div className="mt-auto">
                        <button className="font-mono text-sm font-bold bg-white text-black px-6 py-3 uppercase tracking-widest group-hover:bg-[#b8ff00] transition-colors w-full md:w-auto text-center md:text-left">
                            VER DETALLES →
                        </button>
                    </div>
                </div>
            </Link>

            {events.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); prevSlide(); }}
                        className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 border-2 border-white/40 text-white rounded-full hover:bg-[#b8ff00] hover:text-black hover:border-[#b8ff00] hover:scale-110 transition-all z-40 backdrop-blur-md shadow-lg"
                        aria-label="Evento anterior"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); nextSlide(); }}
                        className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 border-2 border-white/40 text-white rounded-full hover:bg-[#b8ff00] hover:text-black hover:border-[#b8ff00] hover:scale-110 transition-all z-40 backdrop-blur-md shadow-lg"
                        aria-label="Siguiente evento"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40">
                        {events.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 opacity-100 bg-[#b8ff00]' : 'w-2 opacity-30 hover:opacity-60 bg-white'}`}
                                aria-label={`Ir al evento ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EventsClient({ events }: EventsClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
    const [search, setSearch] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    // Contadores por categoría calculados de forma reactiva
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { all: events.length };
        events.forEach((e) => {
            if (e.category) {
                counts[e.category] = (counts[e.category] || 0) + 1;
            }
        });
        return counts;
    }, [events]);

    // Categorías únicas
    const uniqueCategories = useMemo(() =>
        Array.from(new Set(events.map((e) => e.category).filter(Boolean))) as string[],
        [events]
    );

    const categoriesList = useMemo(() => [
        { id: 'all', label: 'Todos', count: categoryCounts['all'] || 0 },
        ...uniqueCategories.map((cat) => ({
            id: cat,
            label: cat,
            count: categoryCounts[cat] || 0,
        })),
    ], [uniqueCategories, categoryCounts]);

    // Lógica de filtrado combinada (búsqueda normalizada + categoría + modalidad de precio)
    const filteredEvents = useMemo(() => {
        const q = normalizeText(search);

        return events.filter((e) => {
            // Filtro de categoría
            if (selectedCategory !== 'all' && e.category !== selectedCategory) {
                return false;
            }

            // Filtro de precio (gratis vs pago)
            if (priceFilter === 'free' && !e.price?.isFree) {
                return false;
            }
            if (priceFilter === 'paid' && e.price?.isFree) {
                return false;
            }

            // Filtro de texto normalizado
            if (q) {
                const searchable = [
                    e.title,
                    e.location,
                    e.address,
                    e.city,
                    e.category,
                    e.shortDescription,
                    e.organizer,
                ].map(normalizeText).join(' ');

                // Permite búsqueda por palabras múltiples ("rock bogota")
                const words = q.split(/\s+/).filter(Boolean);
                const matchesAll = words.every((w) => searchable.includes(w));
                if (!matchesAll) return false;
            }

            return true;
        });
    }, [events, selectedCategory, priceFilter, search]);

    const featuredEvents = filteredEvents.filter((e) => e.isFeatured);
    const gridEvents = filteredEvents.filter((e) => !e.isFeatured);

    const hasActiveFilters = selectedCategory !== 'all' || priceFilter !== 'all' || search.trim() !== '';

    const handleClearFilters = () => {
        setSelectedCategory('all');
        setPriceFilter('all');
        setSearch('');
    };

    // Animación suave al cambiar filtros
    useEffect(() => {
        if (contentRef.current && contentRef.current.children.length > 0) {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, scale: 0.96, y: 24 },
                { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
            );
        }
    }, [selectedCategory, priceFilter, search]);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'FECHA INVÁLIDA';
        return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatDayMonth = (dateString: string) => {
        if (!dateString) return { day: '00', month: '---' };
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { day: '00', month: '---' };
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', ''),
        };
    };

    const getRotation = (index: number) => [-4, 5, -2, 3, -5, 2][index % 6];
    const getColors = (index: number) => [
        { bg: '#b8ff00', text: '#000' },
        { bg: '#E63946', text: '#fff' },
        { bg: '#22c55e', text: '#000' },
        { bg: '#00BCD4', text: '#000' },
    ][index % 4];
    const getClipPaths = (index: number) => [
        'polygon(4% 0%, 96% 3%, 100% 92%, 91% 100%, 7% 96%, 0% 8%)',
        'polygon(7% 3%, 98% 0%, 93% 90%, 88% 100%, 0% 96%, 4% 12%)',
        'polygon(0% 4%, 93% 8%, 100% 96%, 95% 100%, 8% 90%, 3% 0%)',
        'polygon(3% 5%, 95% 2%, 98% 98%, 91% 94%, 5% 99%, 1% 7%)',
    ][index % 4];

    return (
        <div className="min-h-screen bg-black pt-24 pb-20 relative flex flex-col">
            <style dangerouslySetInnerHTML={{ __html: `
                .rasgado-card { width:100%; max-width:280px; aspect-ratio:3/4.2; position:relative; cursor:pointer; transition:transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275); margin:0 auto; }
                .rasgado-card:hover { transform:scale(1.08) rotate(2deg) !important; z-index:10; }
                .r-layer1 { position:absolute; inset:0; transition:all .3s; }
                .rasgado-card:hover .r-layer1 { transform:translate(-8px,8px); }
                .r-layer2 { position:absolute; inset:6px; background:#000000; clip-path:polygon(0% 4%, 100% 0%, 96% 96%, 4% 100%); transition:background .3s; }
                .rasgado-card:hover .r-layer2 { background:#000000; }
                .r-layer3 { position:absolute; inset:0; background-position:center; background-size:cover; mix-blend-mode:luminosity; opacity:.4; clip-path:polygon(0% 18%, 100% 12%, 100% 82%, 0% 88%); filter:contrast(1.2); transition:opacity .3s; }
                .rasgado-card:hover .r-layer3 { opacity:.7; }
                .r-content { position:absolute; inset:0; padding:1.5rem; display:flex; flex-direction:column; justify-content:center; filter:drop-shadow(3px 4px 0px rgba(0,0,0,1)); pointer-events:none; }

                .hide-scrollbar::-webkit-scrollbar { display:none; }
                .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
            `}} />

            <div className="container mx-auto px-4 max-w-[1200px]">
                {/* Header — altura y estructura uniforme, igual a /mercado */}
                <div className="mb-12">
                    <h1
                        className="font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.85] text-[#f5f5f5] tracking-wide glitch-title uppercase"
                        data-text="EVENTOS"
                    >
                        EVENTOS
                    </h1>
                    <div className="w-48 md:w-64 h-[2px] bg-gradient-to-r from-[#b8ff00] to-transparent mt-3 md:mt-4" />
                    <p className="mt-6 font-mono text-xs md:text-base text-gray-400 tracking-widest uppercase">
                        Espacios de encuentro, diálogo y resistencia
                    </p>
                </div>

                {/* ─── Control Bar: Búsqueda y Filtros Mejorados ─── */}
                <div className="flex flex-col gap-5 mb-12">
                    {/* Fila superior: Input de búsqueda + filtro de modalidad */}
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                        {/* Search Input con estilo Bífido */}
                        <div className="relative flex-1 max-w-xl group">
                            <div className="relative flex items-center bg-black border border-white/20 focus-within:border-white/50 transition-all">
                                <Search
                                    size={15}
                                    className={`ml-4 transition-colors ${search ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="BUSCAR POR NOMBRE, LUGAR, CIUDAD O TIPO..."
                                    className="w-full bg-transparent text-white font-mono text-xs md:text-sm tracking-wider uppercase pl-3 pr-10 py-3 focus:outline-none placeholder:text-zinc-600 placeholder:font-mono"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 p-1 text-gray-500 hover:text-[#b8ff00] transition-colors"
                                        aria-label="Limpiar búsqueda"
                                        title="Limpiar búsqueda"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Modalidad de Entrada: Todos / Entrada Libre / Entrada Paga */}
                        <div className="flex items-center gap-1 border border-white/15 p-1 bg-black self-start md:self-auto">
                            <button
                                onClick={() => setPriceFilter('all')}
                                className={`px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase transition-all ${
                                    priceFilter === 'all'
                                        ? 'bg-[#b8ff00] text-black font-bold'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setPriceFilter('free')}
                                className={`px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase transition-all ${
                                    priceFilter === 'free'
                                        ? 'bg-[#b8ff00] text-black font-bold'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Entrada Libre
                            </button>
                            <button
                                onClick={() => setPriceFilter('paid')}
                                className={`px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase transition-all ${
                                    priceFilter === 'paid'
                                        ? 'bg-[#b8ff00] text-black font-bold'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Entrada Paga
                            </button>
                        </div>
                    </div>

                    {/* Chips de Categorías con contador */}
                    {categoriesList.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 border-b border-white/10 w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
                            {categoriesList.map((cat) => {
                                const isActive = selectedCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        aria-pressed={isActive}
                                        className={`whitespace-nowrap flex-shrink-0 px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all flex items-center gap-2 ${
                                            isActive
                                                ? 'bg-[#b8ff00] text-black font-bold shadow-[2px_2px_0px_#ffffff]'
                                                : 'bg-black text-gray-400 border border-white/15 hover:border-white/40 hover:text-white'
                                        }`}
                                    >
                                        <span>{cat.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                            isActive
                                                ? 'bg-black text-[#b8ff00] font-bold'
                                                : 'bg-white/10 text-gray-400'
                                        }`}>
                                            {cat.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Barra de estado con resumen y botón de reset */}
                    <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-gray-500 min-h-[24px]">
                        <span>
                            Mostrando{' '}
                            <strong className="text-white font-bold">{filteredEvents.length}</strong>{' '}
                            {filteredEvents.length === 1 ? 'evento' : 'eventos'}
                            {search && (
                                <>
                                    {' '}para &ldquo;<span className="text-[#b8ff00]">{search}</span>&rdquo;
                                </>
                            )}
                        </span>

                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-1.5 text-xs text-[#b8ff00] hover:underline transition-all"
                            >
                                <RotateCcw size={12} />
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* ─── Contenedor de Resultados ─── */}
                <div ref={contentRef}>
                    {/* Featured Events Carousel */}
                    {featuredEvents.length > 0 && (
                        <FeaturedEventsCarousel events={featuredEvents} formatDate={formatDate} />
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
                                    <Link key={event.id} href={`/eventos/${event.slug || '#'}`} className="block w-full max-w-[280px]">
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
                                                <div className="font-display text-[4rem] leading-[0.85] mb-6 drop-shadow-[3px_4px_0_rgba(0,0,0,1)]" style={{ color: theme.bg, transform: `rotate(${-rotation}deg)` }}>
                                                    {day}<br />{month}
                                                </div>

                                                <div className="font-primary font-black text-[1.8rem] leading-none text-white uppercase break-words drop-shadow-[2px_2px_0_rgba(0,0,0,1)] relative z-10" style={{ transform: `rotate(${rotation / 2}deg)` }}>
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
                        <div className="text-center py-24 border border-dashed border-white/20 max-w-2xl mx-auto px-6 bg-black">
                            <p className="text-white font-display text-3xl md:text-5xl opacity-75 mb-3">
                                {hasActiveFilters ? 'NO HAY EVENTOS QUE COINCIDAN' : 'AÚN NO HAY PARCHES PROGRAMADOS'}
                            </p>
                            <p className="font-mono text-xs md:text-sm text-gray-500 uppercase tracking-widest max-w-md mx-auto mb-6">
                                {hasActiveFilters
                                    ? 'Prueba ajustando los términos de búsqueda o cambiando los filtros seleccionados.'
                                    : 'Pronto publicaremos nuevos encuentros, festivales y conversatorios.'}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    className="px-6 py-3 bg-[#b8ff00] text-black font-mono text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all inline-flex items-center gap-2"
                                >
                                    <RotateCcw size={14} />
                                    Restablecer todos los filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
