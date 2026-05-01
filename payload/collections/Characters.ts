import type { CollectionConfig } from 'payload';
import { APIError } from 'payload';

export const Characters: CollectionConfig = {
    slug: 'characters',
    labels: {
        singular: 'Personaje',
        plural: 'Personajes',
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
                    throw new APIError(`No se puede eliminar: Este personaje es autor de artículos publicados (ej. "${articles.docs[0].title}")`, 400);
                }
            },
        ],
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug', 'age'],
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
                description: 'Se genera automáticamente a partir del nombre',
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
            name: 'description',
            label: 'Descripción',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Descripción corta que aparece en las tarjetas y previsualizaciones',
            },
        },
        {
            name: 'biography',
            label: 'Biografía',
            type: 'richText',
            admin: {
                description: 'Biografía extendida para la página del personaje',
            },
        },
        {
            name: 'religion',
            label: 'Religión',
            type: 'text',
        },
        {
            name: 'age',
            label: 'Edad',
            type: 'text',
        },
        {
            name: 'favoriteColor',
            label: 'Color favorito',
            type: 'text',
        },
        {
            name: 'image',
            label: 'Imagen',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
    ],
};
