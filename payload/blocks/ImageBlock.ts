import type { Block } from 'payload';

export const ImageBlock: Block = {
    slug: 'imageBlock',
    labels: {
        singular: 'Imagen',
        plural: 'Bloques de Imagen',
    },
    imageURL: '/thumbnails/image.svg',
    imageAltText: 'Miniatura del bloque',
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
        {
            name: 'alignment',
            label: 'Alineación',
            type: 'select',
            defaultValue: 'center',
            options: [
                { label: 'Izquierda', value: 'left' },
                { label: 'Centro', value: 'center' },
                { label: 'Derecha', value: 'right' },
                { label: 'Ancho completo', value: 'full' },
            ],
        },
        {
            name: 'size',
            label: 'Tamaño',
            type: 'select',
            defaultValue: 'medium',
            options: [
                { label: 'Pequeño (40%)', value: 'small' },
                { label: 'Mediano (60%)', value: 'medium' },
                { label: 'Grande (80%)', value: 'large' },
                { label: 'Completo (100%)', value: 'full' },
            ],
        },
    ],
};

