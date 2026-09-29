import type { Block } from 'payload';

export const SeparatorBlock: Block = {
    slug: 'separatorBlock',
    labels: {
        singular: 'Separador',
        plural: 'Separadores',
    },
    fields: [
        {
            name: 'style',
            label: 'Estilo',
            type: 'select',
            defaultValue: 'line',
            options: [
                { label: 'Línea', value: 'line' },
                { label: 'Espacio en blanco', value: 'space' },
                { label: 'Tres puntos (···)', value: 'dots' },
            ],
        },
    ],
};
