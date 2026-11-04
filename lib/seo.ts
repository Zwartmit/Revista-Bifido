import type { Metadata } from 'next';

/** Dominio público. Se puede sobreescribir con NEXT_PUBLIC_SITE_URL (p. ej. en previews). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://revistabifido.com').replace(/\/$/, '');
export const SITE_NAME = 'Revista Bífido';
export const SITE_TAGLINE = 'Periodismo crudo para sensibilidades frágiles';
export const SITE_DESCRIPTION = 'Revista digital, cultural, alternativa e independiente';

/** Imagen por defecto para redes: 1200x630 JPG (~120 KB). Next no hereda la del layout si la página define su propio openGraph. */
export const DEFAULT_OG_IMAGE = {
    url: '/og-home.jpg',
    width: 1200,
    height: 630,
    alt: 'Revista Bífido. Periodismo crudo para sensibilidades frágiles. Cultura, activismo, medio ambiente, género y diversidad.',
};

/** Tarjeta de El Parche: imagen estática (fondo fotográfico) generada desde /og/parche. */
export const PARCHE_OG_IMAGE = {
    url: '/og-parche.jpg',
    width: 1200,
    height: 630,
    alt: 'Cinco voces. Una manada. Somos un Archivo Vivo: narramos, señalamos, registramos.',
};

export type OgCardType = 'personaje' | 'articulos' | 'articulo' | 'evento' | 'eventos' | 'mercado' | 'parche' | 'contacto';

/** Tarjeta social dinámica (app/og): el texto sale del CMS a partir del slug. */
export function ogCard(type: OgCardType, slug?: string, alt?: string) {
    return {
        url: slug ? `/og/${type}?slug=${encodeURIComponent(slug)}` : `/og/${type}`,
        width: 1200,
        height: 630,
        alt: alt ?? DEFAULT_OG_IMAGE.alt,
    };
}

type OgImage = typeof DEFAULT_OG_IMAGE;

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
    /** Imagen para redes: tarjeta dinámica (ogCard), URL absoluta o ruta relativa. Si falta, se usa la tarjeta base. */
    image?: string | OgImage | null;
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
    const img: OgImage | { url: string } = typeof image === 'string' ? { url: image } : image ?? DEFAULT_OG_IMAGE;
    const images = [img];

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
            images: [img],
        },
    };
}
