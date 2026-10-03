// API Service para integración con Payload CMS
import qs from 'qs';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

/**
 * Función genérica para construir URLs de Payload
 */
function getPayloadURL(path: string = '') {
  return `${PAYLOAD_URL}${path}`;
}

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
 * Obtener un artículo por su slug
 */
export async function getArticleBySlug(slug: string) {
  const params = {
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  };
  const data = await fetchPayload('articles', params);
  return data.docs[0] ? transformPayloadArticle(data.docs[0]) : null;
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
        { description: { like: query } },
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
    depth: 1, // Include relations
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
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    layout: doc.layout || [], // Bloques de contenido (Opción 2)
    author: doc.author ? doc.author.name : 'Revista Bífido',
    publishedAt: doc.publishedAt,
    featuredImage: doc.featuredImage?.url || '/images/placeholder-article.jpg',
    // Section derived directly from the author (character)
    section: doc.author?.slug || 'general',
    characterId: doc.author?.slug || '',
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
    title: doc.name,
    isFeatured: doc.isFeatured || false,
    date: doc.date,
    time: doc.date ? new Date(doc.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '',
    location: doc.locationType === 'virtual' ? 'Virtual' : (doc.locationType === 'hybrid' ? 'Híbrido' : 'Presencial'),
    address: doc.address || '',
    city: doc.city || '',
    virtualLink: doc.virtualLink,
    description: doc.description,
    category: doc.category || 'other',
    otherCategoryName: doc.otherCategoryName,
    price: {
      isFree: doc.isFree,
      amount: doc.priceAmount,
      currency: 'COP'
    },
    ticketLink: doc.ticketLink,
    // Prioritize constructed URL
    image: doc.featuredImage?.url || '/images/placeholder-article.jpg',
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
