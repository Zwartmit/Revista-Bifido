import { getEventBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import EventClient from './EventClient';
import { Metadata } from 'next';
import nextDynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';

const PreviewEventClient = nextDynamic(() => import('./PreviewEventClient'));
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    return {
        title: event ? (event.name || event.title) : 'Evento',
        description: event?.socialExcerpt || event?.excerpt,
    };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { isEnabled: isPreview } = await draftMode();
    const event = await getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    if (isPreview) {
        return <PreviewEventClient initialEvent={event} serverURL={SERVER_URL} />;
    }

    return <EventClient event={event} />;
}

