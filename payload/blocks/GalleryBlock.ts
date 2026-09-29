import type { Block } from 'payload';

export const GalleryBlock: Block = {
    slug: 'galleryBlock',
    labels: {
        singular: 'Galería de Imágenes',
        plural: 'Galerías de Imágenes',
    },
    fields: [
        {
            name: 'images',
            label: 'Imágenes',
            type: 'array',
            required: true,
            minRows: 2,
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
            ],
        },
        {
            name: 'layout',
            label: 'Disposición',
            type: 'select',
            defaultValue: 'grid',
            options: [
                { label: 'Cuadrícula (2 columnas)', value: 'grid' },
                { label: 'Cuadrícula (3 columnas)', value: 'grid-3' },
                { label: 'Mosaico', value: 'masonry' },
            ],
        },
    ],
};
