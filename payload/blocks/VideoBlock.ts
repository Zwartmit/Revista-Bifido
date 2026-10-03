import type { Block } from 'payload';

export const VideoBlock: Block = {
    slug: 'videoBlock',
    labels: {
        singular: 'Video (YouTube / Vimeo)',
        plural: 'Bloques de Video',
    },
    imageURL: '/thumbnails/video.svg',
    imageAltText: 'Miniatura del bloque',
    fields: [
        {
            name: 'url',
            label: 'URL del Video',
            type: 'text',
            required: true,
            admin: {
                description: 'Pega el enlace completo del video de YouTube o Vimeo (ej: https://www.youtube.com/watch?v=xxx)',
            },
        },
        {
            name: 'caption',
            label: 'Pie de video (opcional)',
            type: 'text',
        },
    ],
};

