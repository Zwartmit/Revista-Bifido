import { getCharacterBySlug as getCharacterBySlugFromAPI } from '@/lib/api';
import { getCharacterBySlug as getCharacterBySlugStatic } from '@/lib/characters';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CharacterLandingClient from './CharacterLandingClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const character = await getCharacterBySlugFromAPI(slug) || getCharacterBySlugStatic(slug);
    return {
        title: character ? `${character.name} | Revista Bífido` : 'Personaje | Revista Bífido',
        description: character?.description,
        openGraph: {
            title: character?.name,
            description: character?.description,
            images: character?.image ? [character.image] : [],
        },
    };
}

export default async function CharacterLandingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const character = await getCharacterBySlugFromAPI(slug) || getCharacterBySlugStatic(slug);

    if (!character) {
        notFound();
    }

    return <CharacterLandingClient character={character} />;
}
