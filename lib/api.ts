// API Service para integración con Payload CMS
import qs from 'qs';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

/**
 * Función genérica para construir URLs de Payload
 */
function getPayloadURL(path: string = '') {
  return `${PAYLOAD_URL}${path}`;
}

export const KNOWN_CHARACTER_SLUGS: Record<string | number, { name: string; slug: string }> = {
  1: { name: 'Punkibrí', slug: 'punkibri' },
  2: { name: 'Ánika', slug: 'anika' },
  3: { name: 'Mordáz', slug: 'mordaz' },
  4: { name: 'Malandra', slug: 'malandra' },
  5: { name: 'Incendia', slug: 'incendia' },
  6: { name: 'Incendia', slug: 'incendia' },
  punkibri: { name: 'Punkibrí', slug: 'punkibri' },
  anika: { name: 'Ánika', slug: 'anika' },
  mordaz: { name: 'Mordáz', slug: 'mordaz' },
  malandra: { name: 'Malandra', slug: 'malandra' },
  incendia: { name: 'Incendia', slug: 'incendia' },
};

/**
 * Función genérica para hacer llamadas a la API de Payload de forma segura
 */
async function fetchPayload(collection: string, params: any = {}, options: RequestInit = {}) {
  const stringifiedParams = qs.stringify(params, { addQueryPrefix: true });
  const url = `${getPayloadURL(`/api/${collection}`)}${stringifiedParams}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-store', // Para Next.js: siempre obtener datos frescos en dev
    });

    if (!res.ok) {
      console.warn(`Payload API call failed for ${collection}: ${res.status} ${res.statusText}`);
      return { docs: [] };
    }

    const data = await res.json();
    // Guarantee docs exists to prevent .map() crashes downstream
    if (data && !data.docs) {
      data.docs = [];
    }
    return data || { docs: [] };
  } catch (error) {
    console.error(`Network or fetch error while requesting ${collection}:`, error);
    return { docs: [] };
  }
}

/**
 * Asegura que relaciones críticas como la imagen destacada y el autor
 * estén resueltas como objetos completos aunque Payload devuelva solo IDs
 */
async function ensureArticleRelations(doc: any) {
  if (!doc) return doc;

  // 1. Si featuredImage no vino poblado y es solo un ID
  if (doc.featuredImage && typeof doc.featuredImage !== 'object') {
    const mediaId = String(doc.featuredImage);
    if (!mediaId.startsWith('http') && !mediaId.startsWith('/')) {
      try {
        const res = await fetch(getPayloadURL(`/api/media/${encodeURIComponent(mediaId)}`), {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        if (res.ok) {
          doc.featuredImage = await res.json();
        }
      } catch (e) {
        console.warn('Error fetching media fallback for article:', e);
      }
    }
  }

  // 2. Si author no vino poblado y es solo un ID
  if (doc.author && typeof doc.author !== 'object') {
    const authorId = String(doc.author);
    try {
      const res = await fetch(getPayloadURL(`/api/characters/${encodeURIComponent(authorId)}`), {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      if (res.ok) {
        doc.author = await res.json();
      }
    } catch (e) {
      console.warn('Error fetching character fallback for article:', e);
    }
  }

  return doc;
}

/**
 * Obtener todos los artículos
 */
export async function getArticles(limit?: number) {
  const params = {
    sort: '-publishedAt', // Descending
    limit: limit || 10,
    depth: 1,
    where: {
      status: {
        equals: 'published',
      },
    }
  };
  const data = await fetchPayload('articles', params);
  return data.docs.map(transformPayloadArticle);
}

/**
 * Obtener un artículo por su slug (con depth 2 para cargar bloques, imágenes y autor)
 */
export async function getArticleBySlug(slug: string) {
  const decoded = decodeURIComponent(slug);
  const where = slug === decoded
    ? { slug: { equals: slug } }
    : { or: [{ slug: { equals: slug } }, { slug: { equals: decoded } }] };
  const params = {
    where,
    limit: 1,
    depth: 2,
  };
  const data = await fetchPayload('articles', params);
  if (!data.docs?.[0]) return null;
  const doc = await ensureArticleRelations(data.docs[0]);
  return transformPayloadArticle(doc);
}

/**
 * Obtener un artículo por su slug sin filtro de status (para preview/borradores)
 */
export async function getArticleBySlugForPreview(slug: string) {
  const decoded = decodeURIComponent(slug);
  const where = slug === decoded
    ? { slug: { equals: slug } }
    : { or: [{ slug: { equals: slug } }, { slug: { equals: decoded } }] };
  const params = {
    where,
    limit: 1,
    depth: 2,
    // Sin filtro de status: permite ver borradores
  };
  const data = await fetchPayload('articles', params);
  if (!data.docs?.[0]) return null;
  const doc = await ensureArticleRelations(data.docs[0]);
  return transformPayloadArticle(doc);
}

/**
 * Obtener artículos por personaje (author), opcionalmente filtrados
 */
export async function getArticlesByCharacter(characterSlug: string, search?: string, categorySlug?: string) {
  const where: any = {
    'author.slug': {
      equals: characterSlug,
    },
    status: {
      equals: 'published',
    },
  };

  if (search) {
    where.or = [
      { title: { like: search } },
      { excerpt: { like: search } },
    ];
  }

  if (categorySlug) {
    where['categories.slug'] = {
      equals: categorySlug,
    };
  }

  const params = {
    where,
    sort: '-publishedAt',
    depth: 1,
    limit: 100,
  };
  const data = await fetchPayload('articles', params);
  return data.docs.map(transformPayloadArticle);
}

/**
 * Obtener artículos por categoría (de cualquier personaje)
 */
export async function getArticlesByCategory(categorySlug: string) {
  const where: any = {
    'categories.slug': {
      equals: categorySlug,
    },
    status: {
      equals: 'published',
    },
  };

  const params = {
    where,
    sort: '-publishedAt',
    depth: 1,
    limit: 100,
  };
  const data = await fetchPayload('articles', params);
  return data.docs.map(transformPayloadArticle);
}

/**
 * Obtener todas los personajes
 */
export async function getCharacters() {
  const params = { depth: 1 };
  const data = await fetchPayload('characters', params);
  return data.docs.map(transformPayloadCharacter);
}

/**
 * Obtener un personaje por su slug
 */
export async function getCharacterBySlug(slug: string) {
  const params = {
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  };
  const data = await fetchPayload('characters', params);
  return data.docs[0] ? transformPayloadCharacter(data.docs[0]) : null;
}

/**
 * Obtener un personaje por su ID o slug (soporta IDs numéricos de Payload)
 */
export async function getCharacterById(id: string | number) {
  const known = KNOWN_CHARACTER_SLUGS[id];
  if (known) {
    const char = await getCharacterBySlug(known.slug);
    if (char) return char;
  }

  const url = `${getPayloadURL(`/api/characters/${encodeURIComponent(String(id))}?depth=1`)}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const doc = await res.json();
    return doc ? transformPayloadCharacter(doc) : null;
  } catch (error) {
    console.error(`Error fetching character by id ${id}:`, error);
    return null;
  }
}

/**
 * Obtener todas las categorías
 */
export async function getCategories() {
  const params = { depth: 1 };
  const data = await fetchPayload('categories', params);
  return data.docs.map(transformPayloadCategory);
}

/**
 * Buscar artículos
 */
export async function searchArticles(query: string) {
  const params = {
    where: {
      or: [
        {
          title: {
            like: query,
          },
        },
        {
          excerpt: {
            like: query,
          },
        },
      ],
      status: {
        equals: 'published',
      },
    },
  };
  const data = await fetchPayload('articles', params);
  return data.docs.map(transformPayloadArticle);
}

/**
 * Artículos destacados para la página de inicio
 */
export async function getFeaturedArticles() {
  const params = {
    where: {
      featured: {
        equals: true,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 5,
    sort: '-publishedAt',
    depth: 1,
  };
  const data = await fetchPayload('articles', params);
  return data.docs.map(transformPayloadArticle);
}

/**
 * Artículo destacado principal del personaje (o el más reciente)
 */
export async function getCharacterFeaturedArticle(characterSlug: string) {
  // 1. Intentar buscar el que tenga el check 'characterFeatured' activado
  const featuredParams = {
    where: {
      and: [
        {
          'author.slug': {
            equals: characterSlug,
          },
        },
        {
          characterFeatured: {
            equals: true,
          },
        },
      ],
      status: {
        equals: 'published',
      },
    },
    limit: 1,
    sort: '-publishedAt',
    depth: 1,
  };
  const featuredData = await fetchPayload('articles', featuredParams);
  if (featuredData.docs.length > 0) {
    return transformPayloadArticle(featuredData.docs[0]);
  }

  // 2. Si no hay ninguno marcado explícitamente, traer el más reciente publicado
  const recentParams = {
    where: {
      'author.slug': {
        equals: characterSlug,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
    sort: '-publishedAt',
    depth: 1,
  };
  const recentData = await fetchPayload('articles', recentParams);
  return recentData.docs[0] ? transformPayloadArticle(recentData.docs[0]) : null;
}

/**
 * Artículos destacados para un personaje (excluyendo uno específico)
 */
export async function getCharacterArticles(characterSlug: string, excludeSlug?: string, limit: number = 3) {
  const where: any = {
    'author.slug': {
      equals: characterSlug,
    },
    status: {
      equals: 'published',
    },
  };

  if (excludeSlug) {
    where.slug = {
      not_equals: excludeSlug,
    };
  }

  const params = {
    where,
    limit,
    sort: '-publishedAt',
    depth: 1,
  };
  const data = await fetchPayload('articles', params);
  return data.docs.map(transformPayloadArticle);
}

/**
 * Artículos relacionados (misma categoría o autor, excluyendo el actual)
 */
export async function getRelatedArticles(currentSlug: string, characterSlug: string, categoryIds: string[] = [], limit: number = 3) {
  const params = {
    limit,
    sort: '-publishedAt',
    depth: 1,
    where: {
      and: [
        {
          slug: {
            not_equals: currentSlug,
          },
        },
        {
          or: [
            {
              'author.slug': {
                equals: characterSlug,
              },
            },
            {
              'categories.id': {
                in: categoryIds,
              },
            },
          ],
        },
      ],
      status: {
        equals: 'published',
      },
    },
  };
  const data = await fetchPayload('articles', params);
  return data.docs.map(transformPayloadArticle);
}

/**
 * Búsqueda Global: artículos, eventos y personajes
 */
export async function globalSearch(query: string) {
  if (!query || query.trim() === '') return { articles: [], events: [], characters: [], liveArchive: [], categories: [] };

  const articleParams = {
    where: {
      or: [
        { title: { like: query } },
        { excerpt: { like: query } },
      ],
      status: { equals: 'published' },
    },
    limit: 6,
  };

  const eventParams = {
    where: {
      or: [
        { name: { like: query } },
        { excerpt: { like: query } },
      ],
    },
    limit: 6,
  };

  const characterParams = {
    where: {
      or: [
        { name: { like: query } },
        { description: { like: query } },
      ]
    },
    limit: 4,
  };

  const liveArchiveParams = {
    where: {
      or: [
        { name: { like: query } },
        { lema: { like: query } },
        { biography: { like: query } },
      ]
    },
    limit: 4,
  };

  const categoryParams = {
    where: {
      name: { like: query },
    },
    limit: 4,
  };

  try {
    const [articlesRes, eventsRes, charactersRes, liveArchiveRes, categoriesRes] = await Promise.all([
      fetchPayload('articles', articleParams),
      fetchPayload('events', eventParams),
      fetchPayload('characters', characterParams),
      fetchPayload('live-archive', liveArchiveParams),
      fetchPayload('categories', categoryParams)
    ]).catch((e) => {
      console.warn("One or more search endpoints failed, returning empty arrays", e);
      return [{ docs: [] }, { docs: [] }, { docs: [] }, { docs: [] }, { docs: [] }];
    });

    return {
      articles: articlesRes?.docs ? articlesRes.docs.map(transformPayloadArticle) : [],
      events: eventsRes?.docs ? eventsRes.docs.map(transformPayloadEvent) : [],
      characters: charactersRes?.docs ? charactersRes.docs.map(transformPayloadCharacter) : [],
      liveArchive: liveArchiveRes?.docs ? liveArchiveRes.docs.map(transformPayloadLiveArchiveMember) : [],
      categories: categoriesRes?.docs ? categoriesRes.docs.map(transformPayloadCategory) : []
    };
  } catch (error) {
    console.error('Error en globalSearch:', error);
    return { articles: [], events: [], characters: [], liveArchive: [], categories: [] };
  }
}

/**
 * Obtener todos los eventos
 */
export async function getEvents() {
  const params = {
    sort: 'date', // Ascending (nearest first)
    limit: 50,
    depth: 1, // Include relations
  };
  const data = await fetchPayload('events', params);
  return data.docs.map(transformPayloadEvent);
}

/**
 * Obtener un evento por su slug
 */
export async function getEventBySlug(slug: string) {
  const params = {
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2, // Include relations and layout block media
  };
  const data = await fetchPayload('events', params);
  return data.docs[0] ? transformPayloadEvent(data.docs[0]) : null;
}

/**
 * Obtener todos los miembros del archivo vivo
 */
export async function getLiveArchiveMembers() {
  const params = {
    sort: 'name', // Ascending alphabetically by name
    depth: 1, // Include relations for images and 3D models
  };
  const data = await fetchPayload('live-archive', params);
  return data.docs.map(transformPayloadLiveArchiveMember);
}

// Transformadores de datos (Payload -> Frontend Interface)

export function transformPayloadArticle(doc: any) {
  const authorObj = typeof doc.author === 'object' && doc.author !== null ? doc.author : null;
  const authorId = !authorObj && doc.author ? doc.author : (authorObj?.id || null);
  const authorKnown = authorId ? KNOWN_CHARACTER_SLUGS[authorId] : null;

  const authorName = authorObj?.name || authorKnown?.name || 'Revista Bífido';
  const authorSlug = authorObj?.slug || authorKnown?.slug || (typeof authorId === 'string' && isNaN(Number(authorId)) ? authorId : 'general');

  let featuredImageUrl = '/images/placeholder-article.jpg';
  if (doc.featuredImage) {
    if (typeof doc.featuredImage === 'object' && doc.featuredImage?.url) {
      featuredImageUrl = doc.featuredImage.url;
    } else if (typeof doc.featuredImage === 'string' && (doc.featuredImage.startsWith('http') || doc.featuredImage.startsWith('/'))) {
      featuredImageUrl = doc.featuredImage;
    }
  }

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    socialExcerpt: doc.socialExcerpt || doc.excerpt || '',
    layout: doc.layout || [], // Bloques de contenido (Opción 2)
    author: authorName,
    publishedAt: doc.publishedAt,
    featuredImage: featuredImageUrl,
    // Section derived directly from the author (character)
    section: authorSlug,
    characterId: authorSlug,
    categories: doc.categories?.map((c: any) => ({ name: c.name, slug: c.slug })) || [],
    featured: doc.featured || false,
    characterFeatured: doc.characterFeatured || false,
  };
}

export function transformPayloadCharacter(doc: any) {
  return {
    id: doc.slug,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    religion: doc.religion || '',
    age: doc.age || '',
    favoriteColor: doc.favoriteColor || '',
    image: doc.image?.url || '/images/placeholder.png',
    model3d: doc.model3d?.url || null,
  };
}

export function transformPayloadEvent(doc: any) {
  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,                    // nombre real del evento
    title: doc.name,                   // alias para compatibilidad
    isFeatured: doc.isFeatured || false,
    date: doc.date,
    time: doc.date ? new Date(doc.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '',
    category: typeof doc.category === 'object' ? doc.category?.name : (doc.category || 'other'),
    locationType: typeof doc.locationType === 'object' ? doc.locationType?.slug : doc.locationType,
    location: typeof doc.locationType === 'object' ? doc.locationType?.name : 'Presencial',
    address: doc.address || '',
    city: doc.city || '',
    virtualLink: doc.virtualLink,
    ticketLink: doc.ticketLink,
    isFree: doc.isFree ?? true,
    priceAmount: doc.priceAmount,
    // Legacy price object for compatibility
    price: {
      isFree: doc.isFree,
      amount: doc.priceAmount,
      currency: 'COP'
    },
    excerpt: doc.excerpt,
    socialExcerpt: doc.socialExcerpt || doc.excerpt || '',
    // Imagen destacada: url directa o placeholder
    featuredImage: doc.featuredImage ? { url: doc.featuredImage.url || doc.featuredImage } : null,
    image: doc.featuredImage?.url || '/images/placeholder-article.jpg',
    // Bloques de contenido enriquecido
    layout: doc.layout || [],
    // Galería legacy (puede ya no existir en nuevos eventos)
    gallery: doc.gallery?.map((item: any) => ({
      id: item.id,
      url: item.image?.url || '',
      alt: item.image?.alt || ''
    })) || [],
  };
}

export function transformPayloadLiveArchiveMember(doc: any) {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    lema: doc.lema,
    biography: doc.biography,
    profession: doc.profession || '',
    profileImage: doc.profileImage?.url || '/images/placeholder-author.jpg',
    identifierImage: doc.identifierImage?.url || '',
    email: doc.email,
    location: doc.location || '',
    characteristics: doc.characteristics?.map((c: any) => c.text) || [],
    socialMedia: doc.socialMedia || {},
    tags: doc.tags || [],
    photos: doc.photos?.map((p: any) => p.image?.url || '') || [],
    model3d: doc.model3d?.url || null,
  };
}

export function transformPayloadCategory(doc: any) {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
  };
}
