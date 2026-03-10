import { getArticles, getMascots } from '@/lib/api';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic'; // Ensure fresh data on every request

export default async function HomePage() {
    const [articles, mascots] = await Promise.all([
        getArticles(10), // Fetch latest 10 articles
        getMascots(),
    ]);

    return (
        <HomeClient
            articles={articles}
            mascots={mascots}
        />
    );
}
