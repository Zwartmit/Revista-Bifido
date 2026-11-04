import type { MetadataRoute } from 'next';
import { characters } from '@/lib/characters';
import { getArticles, getCategories, getEvents } from '@/lib/api';
import { SITE_URL } from '@/lib/seo';

// El contenido sale del CMS: se genera en cada petición, nunca durante el build
export const dynamic = 'force-dynamic';

type Entry = MetadataRoute.Sitemap[number];

/** Ejecuta una consulta al CMS; si falla, el sitemap sigue con las páginas estáticas. */
async function safe(query: Promise<any[]>): Promise<any[]> {
    try {
        return await query;
    } catch {
        return [];
    }
}

const toDate = (value?: string) => {
    const d = value ? new Date(value) : undefined;
    return d && !Number.isNaN(d.getTime()) ? d : undefined;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [articles, events, categories] = await Promise.all([
        safe(getArticles(1000)),
        safe(getEvents()),
        safe(getCategories()),
    ]);

    const staticPages: Entry[] = [
        { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
        { url: `${SITE_URL}/elparche`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/eventos`, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${SITE_URL}/mercado`, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${SITE_URL}/contactanos`, changeFrequency: 'yearly', priority: 0.4 },
    ];

    const characterPages: Entry[] = characters.flatMap((c) => [
        { url: `${SITE_URL}/${c.slug}`, changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${SITE_URL}/${c.slug}/articulos`, changeFrequency: 'weekly' as const, priority: 0.7 },
    ]);

    const articlePages: Entry[] = articles
        .filter((a) => a.slug && a.section && a.section !== 'general')
        .map((a) => ({
            url: `${SITE_URL}/${a.section}/articulos/${a.slug}`,
            lastModified: toDate(a.publishedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

    const eventPages: Entry[] = events
        .filter((e) => e.slug)
        .map((e) => ({
            url: `${SITE_URL}/eventos/${e.slug}`,
            lastModified: toDate(e.date),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

    const categoryPages: Entry[] = categories
        .filter((c) => c.slug)
        .map((c) => ({ url: `${SITE_URL}/categorias/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.4 }));

    return [...staticPages, ...characterPages, ...articlePages, ...eventPages, ...categoryPages];
}
