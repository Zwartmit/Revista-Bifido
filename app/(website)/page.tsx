import { getArticles, getCharacters } from '@/lib/api';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic'; // Ensure fresh data on every request

export default async function HomePage() {
    const [articles, characters] = await Promise.all([
        getArticles(10), // Fetch latest 10 articles
        getCharacters(),
    ]);

    return (
        <HomeClient
            articles={articles}
            characters={characters}
        />
    );
}
