import { getEventBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, ArrowLeft, Video } from 'lucide-react';
import Link from 'next/link';
import EventClient from './EventClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    return {
        title: event ? `${event.name || event.title} | Eventos | Revista Bífido` : 'Evento | Revista Bífido',
        description: event?.socialExcerpt || event?.excerpt,
    };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return <EventClient event={event} />;
}
