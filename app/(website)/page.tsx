import { getArticles, getCharacters, getFeaturedHomeEvents } from '@/lib/api';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic'; // Ensure fresh data on every request

export default async function HomePage() {
    const [articles, characters, featuredEvents] = await Promise.all([
        getArticles(10), // Fetch latest 10 articles
        getCharacters(),
        getFeaturedHomeEvents(4),
    ]);

    return (
        <HomeClient
            articles={articles}
            characters={characters}
            featuredEvents={featuredEvents}
        />
    );
}
