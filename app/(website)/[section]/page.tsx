import { getMascotBySlug, getArticlesBySection } from '@/lib/api';
import SectionClient from './SectionClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
    const { section } = await params;
    const mascot = await getMascotBySlug(section);
    return {
        title: mascot ? mascot.section : 'Sección',
    };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
    const { section } = await params;

    // We assume the section slug matches the mascot slug logic
    const mascot = await getMascotBySlug(section);

    if (!mascot) {
        notFound();
    }

    const articles = await getArticlesBySection(section);

    return <SectionClient section={section} mascot={mascot} articles={articles} />;
}
