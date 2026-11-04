import type { Metadata } from 'next';

/** Dominio público. Se puede sobreescribir con NEXT_PUBLIC_SITE_URL (p. ej. en previews). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://revistabifido.com').replace(/\/$/, '');
export const SITE_NAME = 'Revista Bífido';
export const SITE_TAGLINE = 'Periodismo crudo para sensibilidades frágiles';
export const SITE_DESCRIPTION = 'Revista digital, cultural, alternativa e independiente';

/** Imagen por defecto para redes: 1200x630 JPG (~120 KB). Next no hereda la del layout si la página define su propio openGraph. */
export const DEFAULT_OG_IMAGE = {
    url: '/og-default.jpg',
    width: 1200,
    height: 630,
    alt: 'Revista Bífido: los cinco personajes de la manada en un callejón urbano, con el lema Periodismo crudo para sensibilidades frágiles',
};

export const SOCIAL_PROFILES = [
    'https://www.facebook.com/revistabifido/',
    'https://www.instagram.com/revistabifido/',
    'https://www.youtube.com/@revistabifido',
];

interface PageSeo {
    /** Título sin sufijo: el template del layout agrega "| Revista Bífido". */
    title?: string;
    description?: string;
    /** Ruta relativa canónica, p. ej. "/anika/articulos". */
    path: string;
    /** Imagen para redes (URL absoluta o ruta relativa a metadataBase). Si falta, se usa opengraph-image. */
    image?: string | null;
    type?: 'website' | 'article';
    publishedTime?: string;
}

/**
 * Metadata completa (title, description, canonical, Open Graph y Twitter) para una página.
 * Next.js reemplaza `openGraph` del layout cuando una página define el suyo, por eso cada
 * página debe declarar og:type, og:url y og:site_name por su cuenta: este helper lo centraliza.
 */
export function pageMetadata({ title, description, path, image, type = 'website', publishedTime }: PageSeo): Metadata {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : undefined;
    const images = image ? [{ url: image }] : [DEFAULT_OG_IMAGE];

    const openGraph: NonNullable<Metadata['openGraph']> =
        type === 'article'
            ? { type: 'article', ...(publishedTime ? { publishedTime } : {}) }
            : { type: 'website' };

    return {
        ...(title ? { title } : {}),
        description,
        alternates: { canonical: path },
        openGraph: {
            ...openGraph,
            url: path,
            siteName: SITE_NAME,
            locale: 'es_CO',
            title: fullTitle,
            description,
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: image ? [image] : [DEFAULT_OG_IMAGE],
        },
    };
}
