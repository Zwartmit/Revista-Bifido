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
            admin: {
                description: 'La frase o cita que se mostrará en grande.',
            },
        },
        {
            name: 'attribution',
            label: 'Atribución (¿quién lo dijo?)',
            type: 'text',
            admin: {
                description: 'Nombre de la persona o fuente. Aparece debajo de la cita.',
            },
        },
    ],
};

