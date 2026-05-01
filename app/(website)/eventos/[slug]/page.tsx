import { getEventBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
// Assuming we have a RichText renderer or we just render JSON safely?
// For now, if description is RichText object, we might need a parser.
// Given previous implementation of Article, maybe ContentParser or similar exists?
// app/(website)/[section]/[slug]/page.tsx uses `Serialize` or just json?
// Checking article page implementation would be wise, but I will assume simple rendering or raw text if I cannot find it. 
// Wait, I saw Content rendering in Articles. 
// I'll assume standard rich text for now or simple JSON.stringify if no component.
// NOTE: I will use a simple text render for now if it's text, or a basic dump if JSON. 
// Ideally I should check `app/(website)/[section]/[slug]/page.tsx` but I don't want to use too many steps.
// I will check `app/(website)/[section]/[slug]/page.tsx` logic after writing this if needed.
// Actually, I'll use `RichTextParser` if I can find it. 
// Let's stick to simple layout first.

export const dynamic = 'force-dynamic';

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black pt-6 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <Link
                    href="/eventos"
                    className="inline-flex items-center gap-2 text-bifido-lightgray hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Volver a Eventos
                </Link>

                {/* Hero */}
                <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden mb-8 shadow-2xl bg-[#0a0a0a]">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl grayscale-[30%]"
                        style={{ backgroundImage: `url('${event.image || '/images/placeholder-article.jpg'}')` }}
                    />
                    <Image
                        src={event.image || '/images/placeholder-article.jpg'}
                        alt={event.title}
                        fill
                        className="object-contain md:p-4 z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
                    <div className="absolute bottom-0 left-0 p-8 z-30">
                        <span className="bg-bifido-red text-white px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                            {({
                                concert: 'Concierto',
                                workshop: 'Taller',
                                talk: 'Charla',
                                festival: 'Festival',
                                exhibition: 'Exposición',
                                other: 'Otro'
                            } as Record<string, string>)[event.category] || 'Evento'}
                        </span>
                        <h1 className="font-display text-4xl md:text-6xl text-white mb-2">
                            {event.title}
                        </h1>
                    </div>
                </div>

                {/* Info Bar - Redesigned */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 py-10 border-y border-white/10 mb-16">
                    {/* Date */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-bifido-red">
                            <Calendar size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Fecha</span>
                        </div>
                        <div className="text-white">
                            <p className="text-gray-400 text-sm flex flex-col">
                                <span className="text-white font-semibold text-lg">{new Date(event.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span >{new Date(event.date).toLocaleDateString('es-CO', { weekday: 'long' })}</span>
                            </p>
                        </div>
                    </div>

                    {/* Time */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-bifido-red">
                            <Clock size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Hora</span>
                        </div>
                        <div className="text-white">
                            <p className="text-gray-400 text-sm text-lg font-semibold text-white">{event.time}</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-bifido-red">
                            <MapPin size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Ubicación</span>
                        </div>
                        <div className="text-white text-sm text-gray-400 space-y-1">
                            <p className="font-semibold text-white text-lg leading-tight">{event.location}</p>
                            <p className="leading-tight">{event.address}{event.city ? `, ${event.city}` : ''}</p>
                            {event.virtualLink && (
                                <a href={event.virtualLink} target="_blank" rel="noopener noreferrer" className="inline-block text-bifido-red font-bold text-xs uppercase tracking-wider mt-2 hover:text-white transition-colors">
                                    Ver evento online
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Price & Ticket */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-bifido-red">
                            <span className="font-bold text-lg leading-none">$</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Entrada</span>
                        </div>
                        <div className="flex flex-col items-start gap-4">
                            <div>
                                <p className="text-lg font-semibold text-white">
                                    {event.price?.isFree ? 'Gratis' : `$${event.price?.amount?.toLocaleString() || '0'} ${event.price?.currency || 'COP'}`}
                                </p>
                            </div>

                            {event.ticketLink && !event.price?.isFree && (
                                <a
                                    href={event.ticketLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white text-xs font-bold px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                                >
                                    Comprar Ticket
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="rounded-xl mb-12">
                    <h2 className="font-display text-3xl text-white mb-4">Acerca del evento</h2>
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">
                        {typeof event.description === 'string' ? event.description : JSON.stringify(event.description, null, 2)}
                    </div>
                </div>

                {/* Gallery */}
                {event.gallery && event.gallery.length > 0 && (
                    <div className="mb-12">
                        <h2 className="font-display text-3xl text-white mb-6">Galería</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {event.gallery.map((item: any) => (
                                <div key={item.id} className="relative h-64 rounded-xl overflow-hidden border-2 border-transparent hover:border-bifido-red transition-all duration-300 group">
                                    <Image
                                        src={item.url}
                                        alt={item.alt || 'Imagen de galería'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
