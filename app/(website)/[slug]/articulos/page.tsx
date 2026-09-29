import { getCharacterBySlug as getCharacterBySlugFromAPI, getArticlesByCharacter, getCategories } from '@/lib/api';
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const character = await getCharacterBySlugFromAPI(slug) || getCharacterBySlugStatic(slug);
    return {
        title: character ? `${character.name} — Artículos | Revista Bífido` : 'Artículos | Revista Bífido',
        description: character?.description,
    };
}

export default async function ArticlesFeedPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
    const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;

    const character = await getCharacterBySlugFromAPI(slug) || getCharacterBySlugStatic(slug);

    if (!character) {
        notFound();
    }

    const [articles, categories] = await Promise.all([
        getArticlesByCharacter(slug, search, category),
        getCategories(),
    ]);

    const PageComponent = CHARACTER_PAGES[character.id] || CHARACTER_PAGES[slug] || SectionClient;

    return <PageComponent section={slug} character={character} articles={articles} categories={categories} />;
}
