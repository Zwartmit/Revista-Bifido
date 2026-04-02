import { getCharacterBySlug, getArticlesBySection } from '@/lib/api';
import SectionClient from './SectionClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
    const { section } = await params;
    const character = await getCharacterBySlug(section);
    return {
        title: character ? character.section : 'Sección',
    };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
    const { section } = await params;

    // We assume the section slug matches the character slug logic
    const character = await getCharacterBySlug(section);

    if (!character) {
        notFound();
    }

    const articles = await getArticlesBySection(section);

    return <SectionClient section={section} character={character} articles={articles} />;
}
