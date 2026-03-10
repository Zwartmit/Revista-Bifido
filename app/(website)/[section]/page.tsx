import { getMascotBySlug, getArticlesBySection } from '@/lib/api';
import SectionClient from './SectionClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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
