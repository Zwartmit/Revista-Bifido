import { getArticleBySlug, getMascotBySlug } from '@/lib/api';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: Promise<{ section: string, slug: string }> }) {
  const { section, slug } = await params;

  const article = await getArticleBySlug(slug);
  const mascot = await getMascotBySlug(section);

  if (!article || !mascot) {
    notFound();
  }

  // Optional: Verify if article belongs to section if needed, 
  // currently we just display them based on params.

  return <ArticleClient article={article} mascot={mascot} />;
}
