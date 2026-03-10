import type { CollectionConfig } from 'payload';
import { APIError } from 'payload';

export const Authors: CollectionConfig = {
    slug: 'authors',
    labels: {
        singular: 'Autor',
        plural: 'Autores',
    },
    hooks: {
        beforeDelete: [
            async ({ req, id }) => {
                const articles = await req.payload.find({
                    collection: 'articles',
                    where: { author: { equals: id } },
                    limit: 1,
                });
                if (articles.totalDocs > 0) {
                    throw new APIError(`No se puede eliminar: Este autor tiene artículos publicados (ej. "${articles.docs[0].title}")`, 400);
                }
            },
        ],
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
            required: true,
            unique: true,
        },
        {
            name: 'biography',
            label: 'Biografía',
            type: 'textarea',
        },
        {
            name: 'profileImage',
            label: 'Imagen de Perfil',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'email',
            label: 'Correo Electrónico',
            type: 'email',
        },
        {
            name: 'socialMedia',
            label: 'Redes Sociales',
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
                    label: 'Sitio Web',
                    type: 'text',
                },
            ],
        },
    ],
};
