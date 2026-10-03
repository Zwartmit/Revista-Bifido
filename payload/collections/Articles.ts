import type { CollectionConfig } from 'payload';
import { RichTextBlock } from '../blocks/RichTextBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { VideoBlock } from '../blocks/VideoBlock';
import { TwoColumnsBlock } from '../blocks/TwoColumnsBlock';
import { GalleryBlock } from '../blocks/GalleryBlock';
import { PullQuoteBlock } from '../blocks/PullQuoteBlock';
import { SeparatorBlock } from '../blocks/SeparatorBlock';

export const Articles: CollectionConfig = {
    slug: 'articles',
    labels: {
        singular: 'Artículo',
        plural: 'Artículos',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'author', 'publishedAt', 'status', 'featured'],
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
                    admin: {
                        style: { flex: 2 }
                    },
                },
                {
                    name: 'featuredImage',
                    label: 'Imagen Destacada',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                    admin: {
                        style: { flex: 1 }
                    },
                },
                {
                    name: 'author',
                    label: 'Personaje',
                    type: 'relationship',
                    relationTo: 'characters',
                    required: true,
                    admin: {
                        style: { flex: 1 },
                        description: 'Personaje de Bífido que publica este artículo',
                    },
                },
                {
                    name: 'categories',
                    label: 'Categorías',
                    type: 'relationship',
                    relationTo: 'categories',
                    hasMany: true,
                    admin: {
                        style: { flex: 1 },
                        description: 'Clasifica este artículo (ej. Noticias, Opinión)',
                    },
                },
            ],
        },

        // ── ROW 2: Fecha + Estado + Destacado + Destacado del Personaje ──
        {
            type: 'row',
            fields: [
                {
                    name: 'publishedAt',
                    label: 'Fecha de Publicación',
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
                    label: 'Destacado',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        width: '25%',
                        description: 'Mostrar en secciones destacadas de la página de inicio',
                    },
                },
                {
                    name: 'characterFeatured',
                    label: 'Destacado del Personaje',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        width: '25%',
                        description: 'Mostrar como el artículo principal gigante en la página del personaje.',
                    },
                },
            ],
        },

        // ── ROW 3: Extracto Web + Extracto Redes Sociales (lado a lado) ──
        {
            type: 'row',
            fields: [
                {
                    name: 'excerpt',
                    label: 'Extracto Web',
                    type: 'textarea',
                    required: true,
                    admin: {
                        width: '50%',
                        description: 'Descripción corta que aparece en las tarjetas y grillas de la página',
                    },
                },
                {
                    name: 'socialExcerpt',
                    label: 'Extracto Redes Sociales',
                    type: 'textarea',
                    required: false,
                    admin: {
                        width: '50%',
                        description: 'Para previsualizaciones en WhatsApp, Twitter, Facebook. Si lo dejas vacío, usará el Extracto Web.',
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
                description: 'Se genera automáticamente desde el título si lo dejas en blanco.',
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
            label: 'Contenido (Bloques)',
            type: 'blocks',
            required: true,
            admin: {
                description: 'Construye el contenido del artículo agregando y reordenando bloques.',
            },
            blocks: [
                RichTextBlock,
                ImageBlock,
                VideoBlock,
                TwoColumnsBlock,
                GalleryBlock,
                PullQuoteBlock,
                SeparatorBlock,
            ],
        },
    ],
};
