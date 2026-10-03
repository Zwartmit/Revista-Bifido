import type { Block } from 'payload';

export const SeparatorBlock: Block = {
    slug: 'separatorBlock',
    labels: {
        singular: 'Separador',
        plural: 'Separadores',
    },
    imageURL: '/thumbnails/separator.svg',
    imageAltText: 'Miniatura del bloque',
    fields: [
        {
            name: 'style',
            label: 'Estilo',
            type: 'select',
            defaultValue: 'line',
            options: [
                { label: 'Línea', value: 'line' },
                { label: 'Espacio en blanco', value: 'space' },
                { label: 'Tres puntos', value: 'dots' },
                { label: 'Línea difuminada', value: 'fade' },
            ],
        },
    ],
};

