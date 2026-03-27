import { getEvents } from '@/lib/api';
import EventsClient from './EventsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Eventos',
};

export const dynamic = 'force-dynamic';

export default async function EventosPage() {
    const events = await getEvents();

    return <EventsClient events={events} />;
}
