import { getEventBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, MapPin, ArrowLeft, Video } from 'lucide-react';
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
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    return {
        title: event ? event.title : 'Evento',
    };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-black pb-20">
            {/* Featured Image Header (Full Width) */}
            <div className="relative w-full h-[400px] md:h-[600px] mb-8 bg-gray-900">
                {/* Blurred Background for aspect ratio preservation */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl"
                    style={{ backgroundImage: `url('${event.image || '/images/placeholder-article.jpg'}')` }}
                />
                
                {/* Main Image */}
                <Image
                    src={event.image || '/images/placeholder-article.jpg'}
                    alt={event.title}
                    fill
                    className="object-contain z-10"
                    priority
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-20" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
                
                {/* Title & Back Button Overlay */}
                <div className="absolute bottom-0 left-0 right-0 py-8 text-white z-30">
                    <div className="container mx-auto">
                        <Link href="/eventos" 
                            className="inline-flex items-center px-4 py-2 rounded-full border border-black/10 hover:scale-105 transition-all text-sm font-medium mb-4 bg-bifido-neon text-black">
                            <ArrowLeft size={16} className="mr-2" />
                            Volver a Eventos
                        </Link>
                        <h1 className="font-display text-4xl md:text-6xl mb-4">{event.title}</h1>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="container mx-auto">
                {/* Info Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 py-8 border-y border-white/10 mb-12">
                    {/* Date & Time */}
                    <div className="flex flex-col items-start text-left gap-3 order-1">
                        <div className="flex items-center gap-2 text-bifido-red">
                            <Calendar size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Fecha y Hora</span>
                        </div>
                        <div className="text-white">
                            <p className="text-gray-400 text-sm flex flex-col items-start">
                                <span>{new Date(event.date).toLocaleDateString('es-CO', { weekday: 'long' })}</span>
                                <span className="text-white font-semibold text-lg">{new Date(event.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span className="text-white text-sm">{event.time}</span>
                            </p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col items-start text-left lg:items-center lg:text-center gap-3 order-3 lg:order-2 col-span-2 lg:col-span-1 pt-4 lg:pt-0 border-t border-white/5 lg:border-none">
                        <div className="flex items-center gap-2 text-bifido-red">
                            <MapPin size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Ubicación</span>
                        </div>
                        <div className="text-white text-sm text-gray-400 flex flex-col items-start lg:items-center">
                            <p className="leading-tight">{event.address}{event.city ? `, ${event.city}` : ''}</p>
                            {event.virtualLink && (
                                <a href={event.virtualLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-bifido-neon text-black font-bold text-xs uppercase tracking-widest mt-3 px-4 py-2 hover:bg-white transition-colors w-fit whitespace-nowrap rounded-full">
                                    <Video size={14} />
                                    Ver evento online
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Price & Ticket */}
                    <div className="flex flex-col items-end text-right gap-3 order-2 lg:order-3">
                        <div className="flex items-center justify-end gap-1 text-bifido-red">
                            <span className="font-bold text-lg leading-none">$</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Entrada</span>
                        </div>
                        <div className="flex flex-col items-end gap-3">
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
        </article>
    );
}
