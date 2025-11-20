// API Service para integración con CMS Headless
// Este archivo contiene funciones para consumir la API del CMS

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Función genérica para hacer llamadas a la API del CMS
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const res = await fetch(`${STRAPI_URL}/api${endpoint}`, mergedOptions);

    if (!res.ok) {
      throw new Error(`API call failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Obtener todos los artículos
 */
export async function getArticles(limit?: number) {
  const limitQuery = limit ? `&pagination[limit]=${limit}` : '';
  const data = await fetchAPI(`/articles?populate=*&sort=publishedAt:desc${limitQuery}`);
  return data.data;
}

/**
 * Obtener un artículo por su slug
 */
export async function getArticleBySlug(slug: string) {
  const data = await fetchAPI(`/articles?filters[slug][$eq]=${slug}&populate=*`);
  return data.data[0];
}

/**
 * Obtener artículos por sección
 */
export async function getArticlesBySection(sectionSlug: string) {
  const data = await fetchAPI(
    `/articles?filters[section][slug][$eq]=${sectionSlug}&populate=*&sort=publishedAt:desc`
  );
  return data.data;
}

/**
 * Obtener todas los personajes
 */
export async function getMascots() {
  const data = await fetchAPI('/mascots?populate=*');
  return data.data;
}

/**
 * Obtener un personaje por su slug
 */
export async function getMascotBySlug(slug: string) {
  const data = await fetchAPI(`/mascots?filters[slug][$eq]=${slug}&populate=*`);
  return data.data[0];
}

/**
 * Obtener todas las secciones
 */
export async function getSections() {
  const data = await fetchAPI('/sections?populate=*');
  return data.data;
}

/**
 * Buscar artículos
 */
export async function searchArticles(query: string) {
  const data = await fetchAPI(
    `/articles?filters[$or][0][title][$containsi]=${query}&filters[$or][1][excerpt][$containsi]=${query}&populate=*`
  );
  return data.data;
}

/**
 * Enviar formulario de contacto
 */
export async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  // Esta función dependerá de cómo configures el endpoint de contacto
  // Puede ser un plugin de Strapi o un endpoint personalizado
  const data = await fetchAPI('/contact-submissions', {
    method: 'POST',
    body: JSON.stringify({ data: formData }),
  });
  return data;
}

// Tipos de transformación para Strapi
export function transformStrapiArticle(strapiArticle: any) {
  return {
    id: strapiArticle.id,
    slug: strapiArticle.attributes.slug,
    title: strapiArticle.attributes.title,
    excerpt: strapiArticle.attributes.excerpt,
    content: strapiArticle.attributes.content,
    author: strapiArticle.attributes.author,
    publishedAt: strapiArticle.attributes.publishedAt,
    featuredImage: strapiArticle.attributes.featuredImage?.data?.attributes?.url || '/images/placeholder-article.jpg',
    section: strapiArticle.attributes.section?.data?.attributes?.slug || '',
    mascotId: strapiArticle.attributes.mascot?.data?.attributes?.slug || '',
  };
}

export function transformStrapiMascot(strapiMascot: any) {
  return {
    id: strapiMascot.attributes.slug,
    name: strapiMascot.attributes.name,
    section: strapiMascot.attributes.section,
    slug: strapiMascot.attributes.slug,
    description: strapiMascot.attributes.description,
    religion: strapiMascot.attributes.religion,
    age: strapiMascot.attributes.age,
    favoriteColor: strapiMascot.attributes.favoriteColor,
    image: strapiMascot.attributes.image?.data?.attributes?.url || '/images/placeholder.png',
    color: {
      primary: strapiMascot.attributes.colorPrimary,
      secondary: strapiMascot.attributes.colorSecondary,
      dark: strapiMascot.attributes.colorDark,
    },
    position: [0, 0, 0] as [number, number, number], // Esto se puede configurar en el CMS
  };
}
