import { getArticleBySlug, getCharacterBySlug } from '@/lib/api';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string; article: string }> }): Promise<Metadata> {
    const { slug, article } = await params;
    const articleData = await getArticleBySlug(article);
    
    // If article doesn't exist or doesn't belong to this character, return fallback
    if (!articleData || articleData.section !== slug) {
        return { title: 'Artículo | Revista Bífido' };
    }

    return {
        title: `${articleData.title} | Revista Bífido`,
        description: articleData.socialExcerpt || articleData.excerpt,
        openGraph: {
            title: articleData.title,
            description: articleData.socialExcerpt || articleData.excerpt,
        }
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; article: string }> }) {
    const { slug, article } = await params;

    const articleData = await getArticleBySlug(article);
    const character = await getCharacterBySlug(slug);

    // 404 if article doesn't exist, character doesn't exist,
    // or the article doesn't belong to this character's section
    if (!articleData || !character || articleData.section !== slug) {
        notFound();
    }

    return <ArticleClient article={articleData} character={character} />;
}
