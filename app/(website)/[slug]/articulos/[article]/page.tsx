import { getArticleBySlug, getCharacterBySlug } from '@/lib/api';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string; article: string }> }): Promise<Metadata> {
    const { article } = await params;
    const articleData = await getArticleBySlug(article);
    return {
        title: articleData ? `${articleData.title} | Revista Bífido` : 'Artículo | Revista Bífido',
        description: articleData?.socialExcerpt || articleData?.excerpt,
        openGraph: {
            title: articleData?.title,
            description: articleData?.socialExcerpt || articleData?.excerpt,
        }
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; article: string }> }) {
    const { slug, article } = await params;

    const articleData = await getArticleBySlug(article);
    const character = await getCharacterBySlug(slug);

    if (!articleData || !character) {
        notFound();
    }

    return <ArticleClient article={articleData} character={character} />;
}
