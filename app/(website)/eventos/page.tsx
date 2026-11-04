import { getEvents } from '@/lib/api';
import EventsClient from './EventsClient';
import { Metadata } from 'next';
import { pageMetadata, ogCard } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    title: 'Eventos',
    description: 'Espacios de encuentro, diálogo y resistencia.',
    path: '/eventos',
    image: ogCard('eventos', undefined, 'Eventos de Revista Bífido: espacios de encuentro, diálogo y resistencia.'),
});

export const dynamic = 'force-dynamic';

export default async function EventosPage() {
    const events = await getEvents();

    return <EventsClient events={events} />;
}
