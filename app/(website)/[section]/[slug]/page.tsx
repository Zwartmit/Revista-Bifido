import { getArticleBySlug, getCharacterBySlug } from '@/lib/api';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ section: string, slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return {
    title: article ? article.title : 'Artículo',
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ section: string, slug: string }> }) {
  const { section, slug } = await params;

  const article = await getArticleBySlug(slug);
  const character = await getCharacterBySlug(section);

  if (!article || !character) {
    notFound();
  }

  // Optional: Verify if article belongs to section if needed, 
  // currently we just display them based on params.

  return <ArticleClient article={article} character={character} />;
}
