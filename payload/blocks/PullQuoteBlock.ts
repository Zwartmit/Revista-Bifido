import type { Block } from 'payload';

export const PullQuoteBlock: Block = {
    slug: 'pullQuoteBlock',
    labels: {
        singular: 'Cita Destacada',
        plural: 'Citas Destacadas',
    },
    imageURL: '/thumbnails/quote.svg',
    imageAltText: 'Miniatura del bloque',
    fields: [
        {
            name: 'quote',
            label: 'Cita',
            type: 'textarea',
            required: true,
        },
        {
            name: 'attribution',
            label: 'Atribución (¿quién lo dijo?)',
            type: 'text',
        },
    ],
};

