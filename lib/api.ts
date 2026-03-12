'use server';

// API Service para integración con Payload CMS usando Server Actions
import { getPayload } from 'payload';
import configPromise from '@/payload/payload.config';

/**
 * Obtener instancia de Payload (Internal)
 */
async function getPayloadClient() {
  return await getPayload({
    config: configPromise,
  });
}

/**
 * Obtener todos los artículos
 */
export async function getArticles(limit?: number) {
  const payload = await getPayloadClient();
  const data = await payload.find({
    collection: 'articles',
    sort: '-publishedAt',
    limit: limit || 10,
    where: {
      status: {
        equals: 'published',
      },
    }
  });
  return data.docs.map(transformPayloadArticle);
}

/**
 * Obtener un artículo por su slug
 */
export async function getArticleBySlug(slug: string) {
  const payload = await getPayloadClient();
  const data = await payload.find({
    collection: 'articles',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });
  return data.docs[0] ? transformPayloadArticle(data.docs[0]) : null;
}

/**
 * Obtener artículos por sección
 */
export async function getArticlesBySection(sectionSlug: string) {
  const payload = await getPayloadClient();
  const data = await payload.find({
    collection: 'articles',
    where: {
      'section.slug': {
        equals: sectionSlug,
      },
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
  });
  return data.docs.map(transformPayloadArticle);
}

/**
 * Obtener todas los personajes
 */
export async function getMascots() {
  const payload = await getPayloadClient();
  const data = await payload.find({
    collection: 'mascots',
    limit: 100,
  });
  return data.docs.map(transformPayloadMascot);
}

/**
 * Obtener un personaje por su slug
 */
export async function getMascotBySlug(slug: string) {
  const payload = await getPayloadClient();
  const data = await payload.find({
    collection: 'mascots',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });
  return data.docs[0] ? transformPayloadMascot(data.docs[0]) : null;
}

/**
 * Obtener todas las secciones
 */
export async function getSections() {
  const payload = await getPayloadClient();
  const data = await payload.find({
    collection: 'sections',
    limit: 100,
  });
  return data.docs;
}

/**
 * Buscar artículos
 */
export async function searchArticles(query: string) {
  const payload = await getPayloadClient();
  const data = await payload.find({
    collection: 'articles',
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
  });
  return data.docs.map(transformPayloadArticle);
}

/**
 * Obtener todos los eventos
 */
export async function getEvents() {
  const payload = await getPayloadClient();
  const data = await payload.find({
    collection: 'events',
    sort: 'date',
    limit: 50,
    depth: 1,
  });
  return data.docs.map(transformPayloadEvent);
}

/**
 * Obtener un evento por su slug
 */
export async function getEventBySlug(slug: string) {
  const payload = await getPayloadClient();
  const data = await payload.find({
    collection: 'events',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 1,
  });
  return data.docs[0] ? transformPayloadEvent(data.docs[0]) : null;
}

/**
 * Obtener todos los autores (equipo)
 */
export async function getAuthors() {
  const payload = await getPayloadClient();
  const data = await payload.find({
    collection: 'authors',
    limit: 100,
  });
  return data.docs.map(transformPayloadAuthor);
}

// Transformadores de datos (Payload -> Frontend Interface)

function transformPayloadArticle(doc: any) {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content, // RichText JSON
    author: doc.author ? (typeof doc.author === 'object' ? doc.author.name : 'Revista Bífido') : 'Revista Bífido',
    publishedAt: doc.publishedAt,
    featuredImage: doc.featuredImage?.filename ? `/media/${doc.featuredImage.filename}` : (doc.featuredImage?.url || '/images/placeholder-article.jpg'),
    section: doc.section?.slug || 'general',
    mascotId: doc.section?.mascot?.slug || '',
  };
}

function transformPayloadMascot(doc: any) {
  return {
    id: doc.slug,
    name: doc.name,
    section: doc.slug,
    slug: doc.slug,
    description: doc.description,
    religion: doc.religion,
    age: doc.age,
    favoriteColor: doc.favoriteColor,
    image: doc.image?.filename ? `/media/${doc.image.filename}` : (doc.image?.url || '/images/placeholder.png'),
    color: {
      primary: doc.colorPrimary || '#000000',
      secondary: doc.colorSecondary || '#ffffff',
      dark: doc.colorDark || '#000000',
    },
    position: [0, 0, 0] as [number, number, number],
  };
}

function transformPayloadEvent(doc: any) {
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
    image: doc.featuredImage?.filename ? `/media/${doc.featuredImage.filename}` : (doc.featuredImage?.url || '/images/placeholder-article.jpg'),
    gallery: doc.gallery?.map((item: any) => ({
      id: item.id,
      url: item.image?.filename ? `/media/${item.image.filename}` : (item.image?.url || ''),
      alt: item.image?.alt || ''
    })) || [],
  };
}

function transformPayloadAuthor(doc: any) {
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
