# Guía de Integración con CMS Headless

Esta guía explica cómo integrar la plataforma de Revista Bífido con un CMS Headless (Strapi, Sanity, Contentful, etc.).

## Opción Recomendada: Strapi

Strapi es un CMS headless open-source que se integra perfectamente con Next.js.

### 1. Instalación de Strapi

```bash
# En la carpeta raíz del proyecto
npx create-strapi-app@latest bifido-cms --quickstart
```

### 2. Estructura de Contenidos en Strapi

#### Collection Type: Article

Campos necesarios:
- `title` (Text) - Título del artículo
- `slug` (UID) - URL amigable (auto-generado desde title)
- `excerpt` (Text) - Extracto corto
- `content` (Rich Text) - Contenido completo
- `author` (Text) - Nombre del autor
- `publishedAt` (DateTime) - Fecha de publicación
- `featuredImage` (Media) - Imagen destacada
- `section` (Relation) - Relación con Section
- `mascot` (Relation) - Relación con Mascot

#### Collection Type: Mascot

Campos necesarios:
- `name` (Text) - Nombre del personaje
- `section` (Text) - Nombre de la sección
- `slug` (UID) - URL amigable
- `description` (Text) - Descripción
- `religion` (Text) - Religión
- `age` (Text) - Edad
- `favoriteColor` (Text) - Color favorito
- `image` (Media) - Imagen del personaje
- `colorPrimary` (Text) - Color primario (hex)
- `colorSecondary` (Text) - Color secundario (hex)
- `colorDark` (Text) - Color oscuro (hex)

#### Collection Type: Section

Campos necesarios:
- `name` (Text) - Nombre de la sección
- `slug` (UID) - URL amigable
- `description` (Text) - Descripción
- `mascot` (Relation) - Relación con Mascot

### 3. Configuración de API en Next.js

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=tu-token-aqui
```

### 4. Crear Servicio de API

Crear archivo `lib/api.ts`:

```typescript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchAPI(endpoint: string, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, mergedOptions);

  if (!res.ok) {
    throw new Error(`API call failed: ${res.status}`);
  }

  return res.json();
}

export async function getArticles() {
  const data = await fetchAPI('/articles?populate=*');
  return data.data;
}

export async function getArticleBySlug(slug: string) {
  const data = await fetchAPI(`/articles?filters[slug][$eq]=${slug}&populate=*`);
  return data.data[0];
}

export async function getArticlesBySection(section: string) {
  const data = await fetchAPI(`/articles?filters[section][slug][$eq]=${section}&populate=*`);
  return data.data;
}

export async function getMascots() {
  const data = await fetchAPI('/mascots?populate=*');
  return data.data;
}
```

### 5. Actualizar Páginas para Usar el CMS

#### Ejemplo: Página de Inicio

```typescript
// app/page.tsx
import { getArticles } from '@/lib/api';

export default async function Home() {
  const articles = await getArticles();
  
  return (
    // ... tu código existente
  );
}
```

#### Ejemplo: Página de Sección

```typescript
// app/[section]/page.tsx
import { getArticlesBySection } from '@/lib/api';

export default async function SectionPage({ params }: { params: { section: string } }) {
  const articles = await getArticlesBySection(params.section);
  
  return (
    // ... tu código existente
  );
}
```

### 6. Configuración de Permisos en Strapi

1. Ir a Settings > Users & Permissions > Roles
2. Seleccionar "Public"
3. Habilitar permisos de lectura (find, findOne) para:
   - Article
   - Mascot
   - Section

### 7. Generación Estática (Recomendado para SEO)

```typescript
// app/[section]/[slug]/page.tsx
export async function generateStaticParams() {
  const articles = await getArticles();
  
  return articles.map((article: any) => ({
    section: article.attributes.section.data.attributes.slug,
    slug: article.attributes.slug,
  }));
}
```

## Alternativa: Sanity

Si prefieres usar Sanity:

### 1. Instalación

```bash
npm install @sanity/client @sanity/image-url
```

### 2. Configuración

```typescript
// lib/sanity.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'tu-project-id',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
```

### 3. Schemas en Sanity

Crear schemas para Article, Mascot y Section siguiendo la estructura mencionada arriba.

## Alternativa: Contentful

Si prefieres usar Contentful:

### 1. Instalación

```bash
npm install contentful
```

### 2. Configuración

```typescript
// lib/contentful.ts
import { createClient } from 'contentful';

export const client = createClient({
  space: 'tu-space-id',
  accessToken: 'tu-access-token',
});
```

## Revalidación de Contenido

Para mantener el contenido actualizado con ISR (Incremental Static Regeneration):

```typescript
export const revalidate = 60; // Revalidar cada 60 segundos
```

## Webhooks

Configurar webhooks en tu CMS para revalidar páginas cuando se publique nuevo contenido:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.json();
  const { slug, section } = body;

  try {
    await revalidatePath(`/${section}/${slug}`);
    return Response.json({ revalidated: true });
  } catch (err) {
    return Response.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
```

## Próximos Pasos

1. Elegir tu CMS preferido (Strapi recomendado)
2. Configurar los content types según la estructura
3. Migrar los datos de ejemplo al CMS
4. Actualizar las páginas para consumir la API
5. Configurar webhooks para revalidación automática
6. Implementar caché y optimizaciones
