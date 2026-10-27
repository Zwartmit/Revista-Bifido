'use client';

import { useLivePreview } from '@payloadcms/live-preview-react';
import EventClient from './EventClient';
import { transformPayloadEvent } from '@/lib/api';

interface PreviewEventClientProps {
    initialEvent: any;
    serverURL: string;
}

export default function PreviewEventClient({ initialEvent, serverURL }: PreviewEventClientProps) {
    const { data } = useLivePreview({
        initialData: initialEvent,
        serverURL,
        depth: 2,
    });

    const event = data ? transformPayloadEvent(data) : initialEvent;

    return <EventClient event={event} />;
}
