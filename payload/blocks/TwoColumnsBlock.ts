import type { Block } from 'payload';

export const TwoColumnsBlock: Block = {
    slug: 'twoColumnsBlock',
    labels: {
        singular: 'Dos Columnas (Imagen + Texto)',
        plural: 'Bloques de Dos Columnas',
    },
    imageURL: '/thumbnails/twocolumns.svg',
    imageAltText: 'Miniatura del bloque',
    fields: [
        {
            name: 'imagePosition',
            label: '¿Dónde va la imagen?',
            type: 'select',
            defaultValue: 'left',
            options: [
                { label: 'Imagen a la izquierda', value: 'left' },
                { label: 'Imagen a la derecha', value: 'right' },
            ],
        },
        {
            name: 'image',
            label: 'Imagen',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'imageCaption',
            label: 'Leyenda de la imagen (opcional)',
            type: 'text',
        },
        {
            name: 'text',
            label: 'Texto de la columna',
            type: 'textarea',
            required: true,
            admin: {
                description: 'El texto que aparecerá al lado de la imagen.',
            },
        },
        {
            name: 'columnRatio',
            label: 'Proporción de columnas',
            type: 'select',
            defaultValue: '50-50',
            options: [
                { label: '50% / 50%', value: '50-50' },
                { label: '40% imagen / 60% texto', value: '40-60' },
                { label: '60% imagen / 40% texto', value: '60-40' },
            ],
        },
    ],
};

