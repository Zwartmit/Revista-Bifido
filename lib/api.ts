// API Service para integración con Payload CMS
import qs from 'qs';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

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
    return data || { docs: [] };
  } catch (error) {
    console.error(`Network or fetch error while requesting ${collection}:`, error);
    // En producción (Netlify), si la URL de payload no está configurada o el backend está dormido, 
    // devolver un arreglo vacío previene un volcado 500 (Server Component Crash).
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
 * Obtener artículos por sección
 */
export async function getArticlesBySection(sectionSlug: string) {
  const params = {
    where: {
      'section.slug': {
        equals: sectionSlug,
      },
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
  };
  const data = await fetchPayload('articles', params);
  return data.docs.map(transformPayloadArticle);
}

/**
 * Obtener todas los personajes
 */
export async function getCharacters() {
  const data = await fetchPayload('characters');
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
 * Obtener todas las secciones
 */
export async function getSections() {
  const data = await fetchPayload('sections');
  return data.docs;
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
  if (!query || query.trim() === '') return { articles: [], events: [], characters: [] };
  
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
        { shortDescription: { like: query } },
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

  try {
    const [articlesRes, eventsRes, charactersRes] = await Promise.all([
      fetchPayload('articles', articleParams),
      fetchPayload('events', eventParams),
      fetchPayload('characters', characterParams)
    ]).catch((e) => {
      console.warn("One or more search endpoints failed, returning empty arrays", e);
      return [{docs:[]}, {docs:[]}, {docs:[]}];
    });

    return {
      articles: articlesRes?.docs ? articlesRes.docs.map(transformPayloadArticle) : [],
      events: eventsRes?.docs ? eventsRes.docs.map(transformPayloadEvent) : [],
      characters: charactersRes?.docs ? charactersRes.docs.map(transformPayloadCharacter) : []
    };
  } catch (error) {
    console.error('Error en globalSearch:', error);
    return { articles: [], events: [], characters: [] };
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
 * Obtener todos los autores (equipo)
 */
export async function getAuthors() {
  const data = await fetchPayload('authors');
  return data.docs.map(transformPayloadAuthor);
}

// Transformadores de datos (Payload -> Frontend Interface)

export function transformPayloadArticle(doc: any) {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content, // RichText JSON
    author: doc.author ? doc.author.name : 'Revista Bífido',
    publishedAt: doc.publishedAt,
    // Prioritize constructed URL because staticURL config might be missing/broken in Media collection
    featuredImage: doc.featuredImage?.filename ? `/media/${doc.featuredImage.filename}` : (doc.featuredImage?.url || '/images/placeholder-article.jpg'),
    section: doc.section?.slug || 'general',
    // characterId can be derived if sections are related to characters
    characterId: doc.section?.character?.slug || '',
  };
}

export function transformPayloadCharacter(doc: any) {
  return {
    id: doc.slug,
    name: doc.name,
    section: doc.slug, // Assuming character slug matches section slug usually
    slug: doc.slug,
    description: doc.description,
    religion: doc.religion,
    age: doc.age,
    favoriteColor: doc.favoriteColor,
    image: doc.image?.filename ? `/media/${doc.image.filename}` : (doc.image?.url || '/images/placeholder.png'),
    color: {
      // Mocked colors or accessed if added to schema
      primary: doc.colorPrimary || '#000000',
      secondary: doc.colorSecondary || '#ffffff',
      dark: doc.colorDark || '#000000',
    },
    position: [0, 0, 0] as [number, number, number],
  };
}

export function transformPayloadEvent(doc: any) {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.name,
    date: doc.date,
    time: doc.date ? new Date(doc.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '',
    location: doc.location?.type === 'virtual' ? 'Virtual' : (doc.location?.type === 'hybrid' ? 'Híbrido' : (doc.location?.city || 'Presencial')),
    address: doc.location?.address || '',
    virtualLink: doc.location?.virtualLink,
    shortDescription: doc.shortDescription || '',
    description: doc.description,
    category: doc.category ? (doc.category === 'workshop' ? 'Taller' : doc.category === 'concert' ? 'Concierto' : 'Evento') : 'Evento',
    price: doc.price,
    ticketLink: doc.ticketLink,
    organizer: doc.organizer,
    status: doc.status || 'upcoming',
    // Prioritize constructed URL
    image: doc.featuredImage?.filename ? `/media/${doc.featuredImage.filename}` : (doc.featuredImage?.url || '/images/placeholder-article.jpg'),
    gallery: doc.gallery?.map((item: any) => ({
      id: item.id,
      url: item.image?.filename ? `/media/${item.image.filename}` : (item.image?.url || ''),
      alt: item.image?.alt || ''
    })) || [],
  };
}

export function transformPayloadAuthor(doc: any) {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    biography: doc.biography,
    profileImage: doc.profileImage?.filename ? `/media/${doc.profileImage.filename}` : (doc.profileImage?.url || '/images/placeholder-author.jpg'),
    email: doc.email,
    socialMedia: doc.socialMedia || {},
  };
}
