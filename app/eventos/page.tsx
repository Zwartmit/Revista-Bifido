'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import gsap from 'gsap';

// Dummy data for events
const events = [
    {
        id: 1,
        title: 'Conversatorio: Periodismo Independiente en Colombia',
        date: '2024-11-15',
        time: '18:00',
        location: 'Centro Cultural Alternativo',
        address: 'Calle 45 #23-12, Bogotá',
        description: 'Un espacio para discutir los retos y oportunidades del periodismo independiente en el contexto colombiano actual.',
        category: 'Conversatorio',
        attendees: 45,
        status: 'upcoming',
    },
    {
        id: 2,
        title: 'Taller: Reducción de Daños y Autocuidado',
        date: '2024-11-20',
        time: '15:00',
        location: 'Casa Comunitaria La Resistencia',
        address: 'Carrera 7 #34-56, Bogotá',
        description: 'Taller práctico sobre estrategias de reducción de daños y autocuidado comunitario, facilitado por Anika.',
        category: 'Taller',
        attendees: 30,
        status: 'upcoming',
    },
    {
        id: 3,
        title: 'Feria del Libro Alternativo',
        date: '2024-11-25',
        time: '10:00',
        location: 'Parque Nacional',
        address: 'Carrera 7 con Calle 39, Bogotá',
        description: 'Bífido estará presente con un stand de fanzines, merchandising y conversaciones informales con la comunidad.',
        category: 'Feria',
        attendees: 200,
        status: 'upcoming',
    },
    {
        id: 4,
        title: 'Cine Foro: Documentales de Resistencia',
        date: '2024-10-28',
        time: '19:00',
        location: 'Cinemateca Distrital',
        address: 'Carrera 7 #22-79, Bogotá',
        description: 'Proyección de documentales sobre movimientos sociales seguida de conversatorio con activistas.',
        category: 'Cine Foro',
        attendees: 80,
        status: 'past',
    },
];

export default function EventosPage() {
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
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
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen py-20 bg-bifido-black">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
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
                <div className="flex justify-center gap-4 mb-12">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === 'all'
                                ? 'bg-white text-bifido-black'
                                : 'bg-bifido-gray text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === 'upcoming'
                                ? 'bg-white text-bifido-black'
                                : 'bg-bifido-gray text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        Próximos
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === 'past'
                                ? 'bg-white text-bifido-black'
                                : 'bg-bifido-gray text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        Pasados
                    </button>
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
                            {/* Header */}
                            <div className={`p-6 ${event.status === 'upcoming' ? 'bg-bifido-red' : 'bg-gray-700'}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <span className="px-3 py-1 bg-black/30 rounded-full text-xs font-bold text-white">
                                        {event.category}
                                    </span>
                                    {event.status === 'upcoming' && (
                                        <span className="px-3 py-1 bg-white text-bifido-black rounded-full text-xs font-bold">
                                            Próximo
                                        </span>
                                    )}
                                </div>
                                <h2 className="font-display text-2xl md:text-3xl text-white mt-3">
                                    {event.title}
                                </h2>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    {event.description}
                                </p>

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

                                    <div className="flex items-start gap-3 text-sm">
                                        <Users className="text-bifido-red flex-shrink-0 mt-0.5" size={18} />
                                        <p className="text-gray-300">{event.attendees} asistentes esperados</p>
                                    </div>
                                </div>

                                {/* CTA */}
                                {event.status === 'upcoming' && (
                                    <button className="w-full bg-white text-bifido-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                                        Más información
                                        <ExternalLink size={16} />
                                    </button>
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
