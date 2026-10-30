import type { CollectionConfig } from 'payload';
import { RichTextBlock } from '../blocks/RichTextBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { VideoBlock } from '../blocks/VideoBlock';
import { TwoColumnsBlock } from '../blocks/TwoColumnsBlock';
import { GalleryBlock } from '../blocks/GalleryBlock';
import { PullQuoteBlock } from '../blocks/PullQuoteBlock';
import { SeparatorBlock } from '../blocks/SeparatorBlock';
import { ButtonLinksBlock } from '../blocks/ButtonLinksBlock';

// Mapa de fallback con los personajes conocidos del sistema (ID / Slug -> slug)
const CHARACTER_ID_TO_SLUG: Record<string, string> = {
    '1': 'punkibri',
    '2': 'anika',
    '3': 'mordaz',
    '4': 'malandra',
    '5': 'incendia',
    '6': 'incendia',
    punkibri: 'punkibri',
    anika: 'anika',
    mordaz: 'mordaz',
    malandra: 'malandra',
    incendia: 'incendia',
};

async function resolveCharacterSlug(author: any, payloadInstance?: any): Promise<string | null> {
    if (!author) return null;

    // 1. Si ya es un objeto y tiene slug válido
    if (typeof author === 'object' && typeof author.slug === 'string' && author.slug) {
        return author.slug;
    }

    // 2. Extraer el identificador (puede ser number, string o author.id)
    const authorId = typeof author === 'object' ? author.id : author;
    if (authorId === undefined || authorId === null || authorId === '') return null;

    const key = String(authorId).toLowerCase();

    // 3. Fallback directo si está en el mapa de personajes conocidos
    if (CHARACTER_ID_TO_SLUG[key]) {
        return CHARACTER_ID_TO_SLUG[key];
    }

    // 4. Si el id no es puramente numérico, podría ser ya el slug
    if (typeof authorId === 'string' && isNaN(Number(authorId))) {
        return authorId;
    }

    // 5. Si tenemos la instancia de payload en el contexto del request, buscar en la colección characters
    if (payloadInstance?.findByID) {
        try {
            const character = await payloadInstance.findByID({
                collection: 'characters',
                id: authorId,
                depth: 0,
            });
            if (character?.slug) {
                return character.slug;
            }
        } catch (err) {
            console.error('Error al resolver slug del personaje en preview:', err);
        }
    }

    // 6. Fallback por fetch a la API local
    try {
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
        const res = await fetch(`${serverURL}/api/characters/${encodeURIComponent(String(authorId))}?depth=0`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });
        if (res.ok) {
            const charData = await res.json();
            if (charData?.slug) {
                return charData.slug;
            }
        }
    } catch {
        // silencioso
    }

    return null;
}

export const Articles: CollectionConfig = {
    slug: 'articles',
    labels: {
        singular: 'Artículo',
        plural: 'Artículos',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'author', 'publishedAt', 'status', 'featured'],
        // Botón "Ver en sitio": abre el artículo publicado en nueva pestaña (activa draftMode si es borrador)
        preview: async (doc, { req }) => {
            const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
            const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET || process.env.PAYLOAD_SECRET || '';
            const authorSlug = await resolveCharacterSlug(doc?.author, req?.payload);
            const articleSlug = doc?.slug;
            if (articleSlug && authorSlug) {
                const articleUrl = `/${authorSlug}/articulos/${articleSlug}`;
                if (doc?.status === 'draft' && previewSecret) {
                    return `${serverURL}/api/preview?secret=${previewSecret}&url=${encodeURIComponent(articleUrl)}`;
                }
                return `${serverURL}${articleUrl}`;
            }
            return null;
        },
        // Live Preview: iframe dentro del admin con cambios en tiempo real
        livePreview: {
            url: async ({ data, req, payload }) => {
                const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
                const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET || process.env.PAYLOAD_SECRET || '';
                const authorSlug = await resolveCharacterSlug(data?.author, req?.payload || payload);
                const articleSlug = data?.slug || (typeof data?.title === 'string'
                    ? data.title
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '')
                    : null);
                if (!authorSlug || !articleSlug) return `${serverURL}/`;
                const articleUrl = `/${authorSlug}/articulos/${articleSlug}`;
                return `${serverURL}/api/preview?secret=${previewSecret}&url=${encodeURIComponent(articleUrl)}`;
            },
        },
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role as string),
        update: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role as string),
        delete: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role as string),
    },
    fields: [
        // ── ROW 1: Título (izquierda) + Imagen, Personaje, Categorías (derecha) ──
        {
            type: 'row',
            fields: [
                {
                    name: 'title',
                    label: 'Título',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'featuredImage',
                    label: 'Portada',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'author',
                    label: 'Personaje',
                    type: 'relationship',
                    relationTo: 'characters',
                    required: true,
                },
                {
                    name: 'categories',
                    label: 'Categorías',
                    type: 'relationship',
                    relationTo: 'categories',
                    hasMany: true,
                },
            ],
        },

        // ── ROW 2: Fecha + Estado + Destacado + Destacado del Personaje ──
        {
            type: 'row',
            fields: [
                {
                    name: 'publishedAt',
                    label: 'Fecha de publicación',
                    type: 'date',
                    hooks: {
                        beforeChange: [
                            ({ data, value }) => {
                                if (data?.status === 'published' && !value) {
                                    return new Date().toISOString();
                                }
                                return value;
                            },
                        ],
                    },
                    admin: {
                        width: '25%',
                        date: {
                            pickerAppearance: 'dayAndTime',
                        },
                    },
                },
                {
                    name: 'status',
                    label: 'Estado',
                    type: 'select',
                    required: true,
                    defaultValue: 'draft',
                    options: [
                        {
                            label: 'Borrador',
                            value: 'draft',
                        },
                        {
                            label: 'Publicado',
                            value: 'published',
                        },
                        {
                            label: 'Archivado',
                            value: 'archived',
                        },
                    ],
                    admin: {
                        width: '25%',
                    },
                },
                {
                    name: 'featured',
                    label: 'Destacar en home',
                    type: 'checkbox',
                    defaultValue: false,
                },
                {
                    name: 'characterFeatured',
                    label: 'Destacar en personaje',
                    type: 'checkbox',
                    defaultValue: false,
                },
            ],
        },

        // ── ROW 3: Extracto Web + Extracto Redes Sociales (lado a lado) ──
        {
            type: 'row',
            fields: [
                {
                    name: 'excerpt',
                    label: 'Extracto web',
                    type: 'textarea',
                    required: true,
                    admin: {
                        width: '50%',
                        description: 'Descripción corta que aparece en las tarjetas y grillas de la página',
                    },
                },
                {
                    name: 'socialExcerpt',
                    label: 'Extracto redes sociales',
                    type: 'textarea',
                    required: false,
                    admin: {
                        width: '50%',
                        description: 'Para previsualizaciones al compartir. Si se deja vacío, usará el extracto web.',
                    },
                },
            ],
        },

        // ── SLUG (oculto, se autogenera) ──
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            unique: true,
            index: true,
            admin: {
                hidden: true,
            },
            hooks: {
                beforeValidate: [
                    ({ data, value }) => {
                        if ((!value || value === '') && data?.title) {
                            return data.title
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)+/g, '');
                        }
                        if (value && typeof value === 'string') {
                            return value
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)+/g, '');
                        }
                        return value;
                    },
                ],
            },
        },

        // ── CONTENIDO (bloques) — ocupa todo el ancho ──
        {
            name: 'layout',
            label: 'Contenido del artículo',
            type: 'blocks',
            required: true,
            blocks: [
                RichTextBlock,
                ImageBlock,
                VideoBlock,
                TwoColumnsBlock,
                GalleryBlock,
                PullQuoteBlock,
                SeparatorBlock,
                ButtonLinksBlock,
            ],
        },

        // ── BOTÓN Y CONTROLES DE VISTA PREVIA INFERIOR ──
        {
            name: 'bottomPreviewToggle',
            type: 'ui',
            admin: {
                components: {
                    Field: '@/payload/components/BottomPreviewToggle#BottomPreviewToggle',
                },
            },
        },
    ],
};
