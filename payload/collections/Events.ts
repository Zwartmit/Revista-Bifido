import type { CollectionConfig } from 'payload';
import { RichTextBlock } from '../blocks/RichTextBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { VideoBlock } from '../blocks/VideoBlock';
import { GalleryBlock } from '../blocks/GalleryBlock';
import { TwoColumnsBlock } from '../blocks/TwoColumnsBlock';
import { PullQuoteBlock } from '../blocks/PullQuoteBlock';
import { SeparatorBlock } from '../blocks/SeparatorBlock';
import { ButtonLinksBlock } from '../blocks/ButtonLinksBlock';

export const Events: CollectionConfig = {
    slug: 'events',
    labels: {
        singular: 'Evento',
        plural: 'Eventos',
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'date', 'category', 'locationType', 'isFeatured'],
    },
    access: {
        read: () => true,
    },
    fields: [
        // ── ROW 1: Nombre (grande) + Imagen destacada ──
        {
            type: 'row',
            fields: [
                {
                    name: 'name',
                    label: 'Nombre del Evento',
                    type: 'text',
                    required: true,
                    admin: { style: { flex: 2 } },
                },
                {
                    name: 'featuredImage',
                    label: 'Imagen Destacada',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                    admin: { style: { flex: 1 } },
                },
            ],
        },

        // ── ROW 2: Categoría + Tipo de ubicación + ¿Destacado? ──
        {
            type: 'row',
            fields: [
                {
                    name: 'category',
                    label: 'Categoría',
                    type: 'relationship',
                    relationTo: 'event-categories',
                    hasMany: false,
                    required: true,
                    admin: { style: { flex: 1 } },
                },
                {
                    name: 'locationType',
                    label: 'Modalidad',
                    type: 'relationship',
                    relationTo: 'event-modalities',
                    hasMany: false,
                    required: true,
                    admin: { style: { flex: 1 } },
                },
                {
                    name: 'isFeatured',
                    label: '¿Destacar?',
                    type: 'checkbox',
                    defaultValue: false,
                },
            ],
        },

        // ── ROW 3: Fecha y hora + Link tickets + ¿Es gratis? ──
        {
            type: 'row',
            fields: [
                {
                    name: 'date',
                    label: 'Fecha y hora',
                    type: 'date',
                    required: true,
                    admin: {
                        style: { flex: 1 },
                        date: { pickerAppearance: 'dayAndTime' },
                    },
                },
                {
                    name: 'ticketLink',
                    label: 'Link de registro / compra',
                    type: 'text',
                    required: true,
                    admin: { style: { flex: 1 } },
                },
                {
                    name: 'isFree',
                    label: '¿Es gratis?',
                    type: 'checkbox',
                    defaultValue: true,
                    admin: { style: { flex: 0.5 } },
                },
                {
                    name: 'priceAmount',
                    label: 'Valor',
                    type: 'number',
                    admin: {
                        style: { flex: 0.5 },
                        condition: (_, siblingData) => !siblingData?.isFree,
                    },
                    validate: (value: any, { siblingData }: any) => {
                        if (!siblingData?.isFree && (value === null || value === undefined)) {
                            return 'El valor es obligatorio si no es gratis.';
                        }
                        return true;
                    },
                },
            ],
        },

        // ── ROW 4: Dirección + Ciudad (solo si es presencial o híbrido) ──
        {
            type: 'row',
            fields: [
                {
                    name: 'address',
                    label: 'Dirección',
                    type: 'text',
                    admin: { style: { flex: 1 } },
                },
                {
                    name: 'city',
                    label: 'Ciudad',
                    type: 'text',
                    admin: { style: { flex: 1 } },
                },
                {
                    name: 'virtualLink',
                    label: 'Link de transmisión',
                    type: 'text',
                    admin: { style: { flex: 1 } },
                },
            ],
        },

        // ── ROW 5: Extracto Web + Extracto Redes Sociales (lado a lado) ──
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

        // ── Slug (oculto, se autogenera) ──
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
                    ({ value, data }) => {
                        if (data?.name) {
                            return data.name
                                .toLowerCase()
                                .trim()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .replace(/[^a-z0-9 -]/g, '')
                                .replace(/\s+/g, '-')
                                .replace(/-+/g, '-');
                        }
                        return value;
                    },
                ],
            },
        },

        // ── Contenido enriquecido (bloques) ── ocupa todo el ancho ──
        {
            name: 'layout',
            label: 'Contenido (Bloques)',
            type: 'blocks',
            admin: {
                description: 'Agrega secciones de texto, imágenes, videos y galerías al evento.',
            },
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
    ],
};
