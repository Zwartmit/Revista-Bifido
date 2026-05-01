# Revista Bífido

Plataforma web de **Revista Bífido** — periodismo crudo para sensibilidades frágiles. Construida con una estética visual disruptiva y de alto impacto editorial, combinando elementos de *glitch / broadcast* con *collage urbano*.

El proyecto opera como un **monorepo full-stack**: el frontend (Next.js App Router) y el CMS headless (Payload CMS v3) conviven en el mismo repositorio, compartiendo modelos de datos y la misma instancia de servidor.

---

## Stack tecnológico

| Capa              | Tecnología                                                                      |
| ----------------- | -------------------------------------------------------------------------------- |
| Framework         | [Next.js 15](https://nextjs.org/) — App Router                                     |
| CMS               | [Payload CMS v3](https://payloadcms.com/) — headless, embebido                     |
| Base de datos     | PostgreSQL (local o Neon)                                                        |
| ORM / Migraciones | Drizzle ORM (via Payload)                                                        |
| Estilos           | [Tailwind CSS](https://tailwindcss.com/) + tokens personalizados                    |
| Animaciones       | [GSAP](https://gsap.com/) + ScrollTrigger + `@gsap/react`                         |
| 3D / WebGL        | [Three.js](https://threejs.org/) · `@react-three/fiber` · `@react-three/drei` |
| Iconos            | [Lucide React](https://lucide.dev/) · [React Icons](https://react-icons.github.io/)   |
| Lenguaje          | TypeScript                                                                       |

---

## Inicio rápido

### Prerrequisitos

- Node.js v18+
- PostgreSQL (local o instancia en la nube como [Neon](https://neon.tech/))

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales
```

### Variables de entorno

| Variable                   | Descripción                                                  |
| -------------------------- | ------------------------------------------------------------- |
| `PAYLOAD_SECRET`         | Clave secreta para Payload CMS (JWT, cifrado)                 |
| `DATABASE_URI`           | Connection string de PostgreSQL                               |
| `NEXT_PUBLIC_SERVER_URL` | URL pública del servidor (default:`http://localhost:3000`) |

### Comandos

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar build compilado
npm run lint     # Validación ESLint
```

- **Sitio web:** `http://localhost:3000`
- **Panel admin:** `http://localhost:3000/admin`

---

## Arquitectura del proyecto

```
Revista-Bifido/
├── app/                          # Next.js App Router
│   ├── (payload)/                # Rutas internas de Payload CMS
│   │   ├── admin/                # Panel de administración (/admin)
│   │   └── api/                  # API handlers de Payload
│   ├── (website)/                # Grupo de rutas públicas del sitio
│   │   ├── layout.tsx            # Layout global (Header + Footer)
│   │   ├── page.tsx              # Home (/)
│   │   ├── HomeClient.tsx        # Componente cliente de la home
│   │   ├── globals.css           # Estilos globales del sitio
│   │   ├── [slug]/               # Rutas dinámicas por personaje
│   │   │   ├── page.tsx          # Landing informativa (/malandra)
│   │   │   ├── CharacterLandingClient.tsx
│   │   │   └── articulos/        # Feed de contenido
│   │   │       ├── page.tsx      # /malandra/articulos
│   │   │       ├── SectionClient.tsx   # Fallback genérico
│   │   │       ├── characters/   # Layouts por personaje
│   │   │       │   ├── MalandraPage.tsx
│   │   │       │   ├── IncendiaPage.tsx
│   │   │       │   ├── MordazPage.tsx
│   │   │       │   ├── AnikaPage.tsx
│   │   │       │   └── PunkibriPage.tsx
│   │   │       └── [article]/    # Artículo individual
│   │   │           ├── page.tsx  # /malandra/articulos/mi-nota
│   │   │           └── ArticleClient.tsx
│   │   ├── elparche/             # Hub de personajes (/elparche)
│   │   ├── eventos/              # Agenda de eventos (/eventos)
│   │   ├── contactanos/          # Contacto (/contactanos)
│   │   ├── mercado/              # Tienda (/mercado) [WIP]
│   │   └── not-found.tsx         # Página 404 personalizada
│   ├── api/
│   │   └── [...slug]/            # API catchall de Payload
│   └── fonts/                    # Fuentes locales (next/font)
│
├── components/                   # Componentes reutilizables
│   ├── Header.tsx                # Navegación principal (desktop + mobile)
│   ├── Footer.tsx                # Pie de página con La Manada
│   ├── ArticleCard.tsx           # Tarjeta de artículo
│   ├── GlobalSearchOverlay.tsx   # Overlay de búsqueda global
│   ├── FluidSimulation.tsx       # Simulación de fluido WebGL (home)
│   ├── ScrollToTop.tsx           # Botón volver arriba
│   ├── BackToHome.tsx            # Link de regreso al inicio
│   └── PlaceholderImage.tsx      # Imagen de placeholder
│
├── lib/                          # Lógica de negocio y utilidades
│   ├── api.ts                    # Funciones de acceso a Payload CMS
│   │                             #   getCharacters, getCharacterBySlug,
│   │                             #   getArticlesByCharacter, getArticleBySlug,
│   │                             #   getEvents, getLiveArchiveMembers
│   ├── character-colors.ts       # Paleta de colores centralizada por personaje
│   │                             #   CHARACTER_COLORS, getCharacterColors(slug)
│   ├── characters.ts             # Datos estáticos de personajes (fallback del CMS)
│   ├── payload.ts                # Inicializador del cliente de Payload
│   └── utils.ts                  # Helpers generales (formatDate, etc.)
│
├── payload/                      # Configuración de Payload CMS
│   ├── payload.config.ts         # Config principal (DB, colecciones, admin)
│   └── collections/              # Esquemas de colecciones
│       ├── Characters.ts         # Personajes (nombre, slug, descripción, bio...)
│       ├── Articles.ts           # Artículos (título, contenido, author → Character)
│       ├── Events.ts             # Eventos (título, fecha, lugar, imagen)
│       ├── LiveArchive.ts        # Miembros del equipo / archivo vivo
│       ├── Media.ts              # Gestión de archivos multimedia
│       ├── Products.ts           # Productos para el mercado
│       └── Users.ts              # Usuarios del panel admin
│
├── types/                        # Tipos e interfaces TypeScript
│   └── index.ts                  # Character, Article
│
├── public/                       # Archivos estáticos
│   ├── personajes/               # Imágenes PNG de los personajes
│   ├── icons/                    # Logos, SVGs, íconos de la UI
│   ├── backgrounds/              # Fondos y texturas
│   ├── hero/                     # Imágenes hero de la home
│   ├── favicon/                  # Variantes del favicon
│   └── media/                    # Uploads de Payload CMS
│
├── Diagramación/                 # PDFs de referencia de diseño editorial
├── tailwind.config.ts            # Tokens de diseño: colores, fuentes, animaciones
├── next.config.js                # Config de Next.js (dominios de imágenes, etc.)
└── tsconfig.json                 # Configuración de TypeScript
```

---

## Arquitectura de contenido

### Personajes (La Manada)

Los 5 personajes son el eje central del modelo de contenido. Cada uno tiene:

| Campo                                   | Fuente                                                       |
| --------------------------------------- | ------------------------------------------------------------ |
| Nombre, Slug, Descripción, Biografía  | Payload CMS (colección `Characters`)                      |
| Religión, Edad, Color favorito, Imagen | Payload CMS                                                  |
| Paleta de colores del UI                | `lib/character-colors.ts` (estático, desacoplado del CMS) |

> **Fallback:** Si Payload CMS no responde, `lib/characters.ts` provee datos estáticos de solo lectura para todos los personajes.

### Artículos

Los artículos se relacionan directamente con el personaje que los escribe (`author → Characters`).

### Rutas de personaje

Cada personaje tiene **dos páginas distintas**:

| Ruta                            | Propósito                                                       |
| ------------------------------- | ---------------------------------------------------------------- |
| `/{slug}`                     | Landing informativa: quién es, ficha técnica, CTA al contenido |
| `/{slug}/articulos`           | Feed editorial: artículos, podcasts, publicaciones              |
| `/{slug}/articulos/{article}` | Artículo individual                                             |

---

## Sistema de colores

Los colores de cada personaje están centralizados en `lib/character-colors.ts` y **no se almacenan en la base de datos**. Esto garantiza consistencia entre el CMS, el frontend y `tailwind.config.ts`.

| Personaje | Primary     | Dark        |
| --------- | ----------- | ----------- |
| Malandra  | `#f6daa3` | `#d6ba83` |
| Incendia  | `#FF9800` | `#F57C00` |
| Mordaz    | `#FF6B6B` | `#D32F2F` |
| Punkibrí | `#4CAF50` | `#388E3C` |
| Anika     | `#a372b3` | `#8b5a9a` |

---

## Convenciones de desarrollo

- Las páginas server-side usan `export const dynamic = 'force-dynamic'` donde se accede al CMS.
- Los componentes visuales son `'use client'` con animaciones en `useEffect` via GSAP.
- Los datos de color **nunca** deben leerse desde `character.color` — siempre usar `getCharacterColors(slug)`.
- Los links a contenido de personajes siguen el patrón `/{slug}/articulos`, nunca `/{slug}` directamente para artículos.

---

## Licencia

Este proyecto es de uso privado y comercial de sus autores. Queda prohibida la copia, distribución o cualquier uso sin autorización expresa de sus propietarios.
