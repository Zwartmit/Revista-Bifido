import type { Block } from 'payload';
import { flipCardFields } from './flipFields';

export const GalleryBlock: Block = {
    slug: 'galleryBlock',
    labels: {
        singular: 'Galería de Imágenes',
        plural: 'Galerías de Imágenes',
    },
    imageURL: '/thumbnails/gallery.svg',
    imageAltText: 'Miniatura del bloque',
    fields: [
        {
            type: 'row',
            fields: [
                {
                    name: 'layout',
                    label: 'Disposición',
                    type: 'select',
                    defaultValue: 'grid',
                    options: [
                        { label: 'Cuadrícula (2 columnas)', value: 'grid' },
                        { label: 'Cuadrícula (3 columnas)', value: 'grid-3' },
                        { label: 'Mosaico (Flujo natural según tamaño de cada imagen)', value: 'masonry' },
                    ],
                    admin: {
                        width: '34%',
                        description: 'Elige si prefieres cuadrícula uniforme o mosaico tipo revista.',
                    },
                },
                {
                    name: 'aspectRatio',
                    label: 'Proporción del marco',
                    type: 'select',
                    defaultValue: 'square',
                    options: [
                        { label: 'Cuadrada (1:1) — Ideal arte, logos e Instagram', value: 'square' },
                        { label: 'Horizontal panorámica (16:9)', value: 'landscape' },
                        { label: 'Horizontal clásica (4:3)', value: 'classic' },
                        { label: 'Vertical (3:4) — Retratos y afiches', value: 'portrait' },
                        { label: 'Proporción natural (sin caja fija)', value: 'natural' },
                    ],
                    admin: {
                        width: '33%',
                        condition: (_, siblingData) => siblingData?.layout !== 'masonry',
                        description: 'Forma de las tarjetas en cuadrícula.',
                    },
                },
                {
                    name: 'imageFit',
                    label: 'Ajuste de la imagen',
                    type: 'select',
                    defaultValue: 'contain',
                    options: [
                        { label: 'Completa sin recortar (Contener)', value: 'contain' },
                        { label: 'Llenar marco (Recortar excedentes)', value: 'cover' },
                    ],
                    admin: {
                        width: '33%',
                        condition: (_, siblingData) => siblingData?.layout !== 'masonry' && siblingData?.aspectRatio !== 'natural',
                        description: 'Evita cortes usando "Completa sin recortar".',
                    },
                },
            ],
        },
        {
            name: 'images',
            label: 'Imágenes',
            type: 'array',
            required: true,
            labels: {
                singular: 'Imagen',
                plural: 'Imágenes',
            },
            fields: [
                {
                    name: 'image',
                    label: 'Imagen',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'caption',
                    label: 'Leyenda (opcional)',
                    type: 'text',
                },
                flipCardFields,
            ],
        },
    ],
};
