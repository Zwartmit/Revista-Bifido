'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [filter]);

    const filteredEvents = filter === 'all'
        ? events
        : events.filter(event => event.status === filter);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-black pt-24 md:pt-52">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-bifido-red rounded-full mb-4">
                        <Calendar className="text-white" size={32} />
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl mb-4 text-white">
                        Eventos
                    </h1>
                    <p className="text-xl text-bifido-lightgray italic max-w-2xl mx-auto">
                        Espacios de encuentro, diálogo y resistencia colectiva
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === f.id
                                ? 'bg-white text-bifido-black'
                                : 'bg-bifido-gray text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Events Grid */}
                <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className={`bg-bifido-gray rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${event.status === 'upcoming'
                                ? 'border-bifido-red hover:border-white'
                                : 'border-gray-700 opacity-75'
                                }`}
                        >
                            {/* Image */}
                            <div className="relative h-48 w-full group-hover:scale-105 transition-transform duration-500">
                                <Image
                                    src={event.image || '/images/placeholder-article.jpg'}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Header */}
                            <div className={`p-6 ${event.status === 'upcoming' ? 'bg-bifido-red' : 'bg-gray-700'}`}>
                                <div className="flex justify-between items-start gap-4">
                                    <h2 className="font-display text-2xl md:text-3xl text-white leading-tight">
                                        {event.title}
                                    </h2>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${event.status === 'upcoming' ? 'bg-white text-bifido-black' :
                                            event.status === 'ongoing' ? 'bg-green-500 text-white' :
                                                event.status === 'cancelled' ? 'bg-red-500 text-white' :
                                                    'bg-gray-700 text-gray-300'
                                            }`}>
                                            {event.status === 'upcoming' ? 'Próximo' :
                                                event.status === 'ongoing' ? 'En Curso' :
                                                    event.status === 'cancelled' ? 'Cancelado' :
                                                        'Pasado'}
                                        </span>

                                        <span className="bg-black/50 text-gray-300 px-3 py-1 rounded-full text-xs font-bold border border-gray-700">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Description */}
                                <div className="text-gray-300 mb-6 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                                    {event.shortDescription || 'Este evento no tiene descripción corta.'}
                                </div>

                                {/* Event Details */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3 text-sm">
                                        <Calendar className="text-bifido-red flex-shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <p className="text-white font-semibold">
                                                {formatDate(event.date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm">
                                        <Clock className="text-bifido-red flex-shrink-0 mt-0.5" size={18} />
                                        <p className="text-gray-300">{event.time}</p>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin className="text-bifido-red flex-shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <p className="text-white font-semibold">{event.location}</p>
                                            <p className="text-gray-400 text-xs">{event.address}</p>
                                        </div>
                                    </div>
                                    {/* Price & Organizer */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${event.price?.isFree ? 'bg-green-900 text-green-100' : 'bg-yellow-900 text-yellow-100'}`}>
                                                {event.price?.isFree ? 'Gratis' : `$${event.price?.amount?.toLocaleString() || ''}`}
                                            </span>
                                        </div>
                                        {event.organizer && (
                                            <div className="text-xs text-bifido-lightgray text-right">
                                                Organiza: <span className="text-white">{event.organizer}</span>
                                            </div>
                                        )}
                                    </div>


                                </div>

                                {/* CTA */}
                                {event.status === 'upcoming' && (
                                    <Link
                                        href={`/eventos/${event.slug || '#'}`}
                                        className="w-full bg-white text-bifido-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        Más información
                                        <ExternalLink size={16} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay eventos en esta categoría.</p>
                        <button
                            onClick={() => setFilter('all')}
                            className="mt-4 text-bifido-red hover:underline font-medium"
                        >
                            Ver todos los eventos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
