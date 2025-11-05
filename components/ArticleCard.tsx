import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import { getMascotById } from '@/lib/mascots';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const mascot = getMascotById(article.mascotId);

  return (
    <Link href={`/${article.section}/${article.slug}`} className="group block">
      <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {mascot && (
            <div 
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: mascot.color.primary }}
            >
              {mascot.section}
            </div>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="font-display text-xl mb-2 group-hover:text-bifido-gray transition-colors">
            {article.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{article.author}</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
