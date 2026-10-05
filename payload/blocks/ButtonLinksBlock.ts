import type { Block } from 'payload';

export const ButtonLinksBlock: Block = {
    slug: 'buttonLinksBlock',
    labels: {
        singular: 'Botones / Enlaces',
        plural: 'Bloques de Botones',
    },
    imageURL: '/thumbnails/buttons.svg',
    imageAltText: 'Miniatura del bloque de botones',
    fields: [
        {
            name: 'buttons',
            label: 'Botones',
            type: 'array',
            minRows: 1,
            labels: {
                singular: 'Botón',
                plural: 'Botones',
            },
            fields: [
                {
                    name: 'platform',
                    label: 'Plataforma',
                    type: 'select',
                    defaultValue: 'website',
                    options: [
                        { label: 'Sitio Web / Link General', value: 'website' },
                        { label: 'Spotify', value: 'spotify' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'Vimeo', value: 'vimeo' },
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'TikTok', value: 'tiktok' },
                        { label: 'SoundCloud', value: 'soundcloud' },
                        { label: 'X / Twitter', value: 'twitter' },
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Apple Music', value: 'apple' },
                    ],
                    required: true,
                },
                {
                    name: 'color',
                    label: 'Color del Botón',
                    type: 'text',
                    required: false,
                    admin: {
                        components: {
                            Field: '@/payload/components/ColorPicker#ColorPicker'
                        }
                    }
                },
                {
                    name: 'label',
                    label: 'Texto del Botón',
                    type: 'text',
                    required: true,
                    defaultValue: 'Escuchar',
                },
                {
                    name: 'url',
                    label: 'URL',
                    type: 'text',
                    required: true,
                },
            ]
        }
    ],
};
