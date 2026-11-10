'use client';

import React from 'react';
import Link from 'next/link';

interface RasgadoEventCardProps {
    event: any;
    index: number;
    primaryColor?: string;
}

const getRotation = (index: number) => [-4, 5, -2, 3, -5, 2][index % 6];

const getColors = (index: number, primaryColor?: string) => {
    if (primaryColor && index === 0) {
        return { bg: primaryColor, text: '#000' };
    }
    return [
        { bg: primaryColor || '#b8ff00', text: '#000' },
        { bg: '#E63946', text: '#fff' },
        { bg: '#22c55e', text: '#000' },
        { bg: '#00BCD4', text: '#000' },
    ][index % 4];
};

const getClipPaths = (index: number) => [
    'polygon(4% 0%, 96% 3%, 100% 92%, 91% 100%, 7% 96%, 0% 8%)',
    'polygon(7% 3%, 98% 0%, 93% 90%, 88% 100%, 0% 96%, 4% 12%)',
    'polygon(0% 4%, 93% 8%, 100% 96%, 95% 100%, 8% 90%, 3% 0%)',
    'polygon(3% 5%, 95% 2%, 98% 98%, 91% 94%, 5% 99%, 1% 7%)',
][index % 4];

const parseEventDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    let normalized = dateStr;
    if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(dateStr)) {
        normalized = `${dateStr}Z`;
    }
    return new Date(normalized);
};

const formatDayMonth = (dateString: string) => {
    if (!dateString) return { day: '00', month: '---' };
    const date = parseEventDate(dateString);
    if (isNaN(date.getTime())) return { day: '00', month: '---' };
    return {
        day: new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', day: '2-digit' }).format(date),
        month: new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', month: 'short' }).format(date).toUpperCase().replace('.', ''),
    };
};

export default function RasgadoEventCard({ event, index, primaryColor }: RasgadoEventCardProps) {
    const { day, month } = formatDayMonth(event.date);
    const rotation = getRotation(index);
    const theme = getColors(index, primaryColor);
    const clip = getClipPaths(index);

    const title = event.name || event.title || 'Evento';
    const image = event.image || event.featuredImage?.url || '/images/placeholder-article.webp';
    const location = event.location || event.city || event.address || (event.isFree ? 'Entrada Libre' : 'Presencial');

    return (
        <Link href={`/eventos/${event.slug || '#'}`} className="block w-full max-w-[280px]">
            <div
                className="rasgado-card group mx-auto"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <div className="r-layer1" style={{ background: theme.bg, clipPath: clip }} />
                <div className="r-layer2" />
                <div
                    className="r-layer3"
                    style={{ backgroundImage: `url('${image}')` }}
                />

                <div className="r-content">
                    <div
                        className="font-display text-[4rem] leading-[0.85] mb-6 drop-shadow-[3px_4px_0_rgba(0,0,0,1)]"
                        style={{ color: theme.bg, transform: `rotate(${-rotation}deg)` }}
                    >
                        {day}<br />{month}
                    </div>

                    <div
                        className="font-primary font-black text-[1.8rem] leading-none text-white uppercase break-words drop-shadow-[2px_2px_0_rgba(0,0,0,1)] relative z-10"
                        style={{ transform: `rotate(${rotation / 2}deg)` }}
                    >
                        {title}
                    </div>

                    <div className="mt-8 self-start max-w-full">
                        <span
                            className="font-mono text-xs font-bold px-3 py-1.5 uppercase shadow-[2px_2px_0_rgba(0,0,0,1)] inline-block truncate max-w-full"
                            style={{ background: theme.bg, color: theme.text, transform: `rotate(${-rotation}deg)` }}
                        >
                            {location}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
