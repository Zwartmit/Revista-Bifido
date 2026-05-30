import type { CollectionConfig } from 'payload';

export const LiveArchive: CollectionConfig = {
    slug: 'live-archive',
    labels: {
        singular: 'Archivo vivo',
        plural: 'Archivo vivo',
    },
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            unique: true,
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
            hooks: {
                beforeValidate: [
                    ({ value, data }) => {
                        if (data?.name) {
                            return data.name
                                .toLowerCase()
                                .trim()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)+/g, '');
                        }
                        return value;
                    },
                ],
            },
        },
        {
            name: 'lema',
            label: 'Lema',
            type: 'textarea',
        },
        {
            name: 'biography',
            label: 'Biografía',
            type: 'textarea',
        },
        {
            name: 'profession',
            label: 'Profesión',
            type: 'text',
        },
        {
            name: 'profileImage',
            label: 'Imagen de perfil',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'model3d',
            label: 'Modelo 3D (.glb)',
            type: 'upload',
            relationTo: 'media',
            admin: {
                description: 'Sube el archivo .glb del personaje para la visualización interactiva.',
            },
        },
        {
            name: 'identifierImage',
            label: 'Identificador',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'email',
            label: 'Correo electrónico',
            type: 'email',
        },
        {
            name: 'photos',
            label: 'Fotos',
            type: 'array',
            fields: [
                {
                    name: 'image',
                    label: 'Imagen',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                }
            ]
        },
        {
            name: 'location',
            label: 'Ubicación',
            type: 'text',
        },
        {
            name: 'characteristics',
            label: 'Características, gustos o aficiones (Máximo 3)',
            type: 'array',
            maxRows: 3,
            labels: {
                singular: 'Atributo',
                plural: 'Atributos',
            },
            fields: [
                {
                    name: 'text',
                    label: 'Texto',
                    type: 'text',
                    required: true,
                },
            ],
        },
        {
            name: 'socialMedia',
            label: 'Redes sociales',
            type: 'group',
            fields: [
                {
                    name: 'twitter',
                    label: 'Twitter',
                    type: 'text',
                },
                {
                    name: 'instagram',
                    label: 'Instagram',
                    type: 'text',
                },
                {
                    name: 'facebook',
                    label: 'Facebook',
                    type: 'text',
                },
                {
                    name: 'website',
                    label: 'Sitio web',
                    type: 'text',
                },
            ],
        },
    ],
};
