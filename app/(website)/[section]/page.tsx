import { getCharacterBySlug as getCharacterBySlugFromAPI, getArticlesBySection } from '@/lib/api';
import { getCharacterBySlug as getCharacterBySlugStatic } from '@/lib/characters';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import MalandraPage from './characters/MalandraPage';
import IncendiaPage from './characters/IncendiaPage';
import MordazPage from './characters/MordazPage';
import AnikaPage from './characters/AnikaPage';
import PunkibriPage from './characters/PunkibriPage';
import SectionClient from './SectionClient'; // Fallback genérico

export const dynamic = 'force-dynamic';

// Map slug → component
const CHARACTER_PAGES: Record<string, React.ComponentType<any>> = {
    malandra: MalandraPage,
    incendia: IncendiaPage,
    mordaz: MordazPage,
    anika: AnikaPage,
    punkibri: PunkibriPage,
};

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
    const { section } = await params;
    const character = await getCharacterBySlugFromAPI(section) || getCharacterBySlugStatic(section);
    return {
        title: character ? `${character.name} | Revista Bífido` : 'Sección | Revista Bífido',
        description: character?.description,
    };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
    const { section } = await params;

    // Try Payload CMS first, fall back to static characters array
    const character = await getCharacterBySlugFromAPI(section) || getCharacterBySlugStatic(section);

    if (!character) {
        notFound();
    }

    const articles = await getArticlesBySection(section);

    // Select the specific character page component, or fall back to generic
    const PageComponent = CHARACTER_PAGES[character.id] || CHARACTER_PAGES[section] || SectionClient;

    return <PageComponent section={section} character={character} articles={articles} />;
}
