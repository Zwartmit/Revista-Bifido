import { getEvents } from '@/lib/api';
import EventsClient from './EventsClient';

export const dynamic = 'force-dynamic';

export default async function EventosPage() {
    const events = await getEvents();

    return <EventsClient events={events} />;
}
