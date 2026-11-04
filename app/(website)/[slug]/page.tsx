import { getCharacterBySlug as getCharacterBySlugFromAPI, getCharacterById } from '@/lib/api';
import { getCharacterBySlug as getCharacterBySlugStatic } from '@/lib/characters';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { pageMetadata, ogCard } from '@/lib/seo';
import AnikaLanding from './landings/AnikaLanding';
import IncendiaLanding from './landings/IncendiaLanding';
import MalandraLanding from './landings/MalandraLanding';
import MordazLanding from './landings/MordazLanding';
import PunkibriLanding from './landings/PunkibriLanding';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const character = await getCharacterBySlugFromAPI(slug) || getCharacterBySlugStatic(slug);
    return pageMetadata({
        title: character ? character.name : 'Personaje',
        description: character?.description,
        path: `/${slug}`,
        image: character ? ogCard('personaje', slug, `${character.name}, personaje de Revista Bífido`) : undefined,
    });
}

export default async function CharacterLandingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let character = await getCharacterBySlugFromAPI(slug) || getCharacterBySlugStatic(slug);

    if (!character) {
        const charById = await getCharacterById(slug);
        if (charById?.slug) {
            redirect(`/${charById.slug}`);
        }
        notFound();
    }

    switch (slug) {
        case 'anika':    return <AnikaLanding />;
        case 'incendia': return <IncendiaLanding />;
        case 'malandra': return <MalandraLanding />;
        case 'mordaz':   return <MordazLanding />;
        case 'punkibri': return <PunkibriLanding />;
        default:         notFound();
    }
}

