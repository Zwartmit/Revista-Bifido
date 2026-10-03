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
            ],
        },
    ],
};
