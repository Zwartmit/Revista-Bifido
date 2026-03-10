import type { CollectionConfig } from 'payload';
import { APIError } from 'payload';

export const Sections: CollectionConfig = {
    slug: 'sections',
    labels: {
        singular: 'Sección',
        plural: 'Secciones',
    },
    hooks: {
        beforeDelete: [
            async ({ req, id }) => {
                const articles = await req.payload.find({
                    collection: 'articles',
                    where: { section: { equals: id } },
                    limit: 1,
                });
                if (articles.totalDocs > 0) {
                    throw new APIError(`No se puede eliminar: Esta sección contiene artículos (ej. "${articles.docs[0].title}")`, 400);
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
            name: 'description',
            label: 'Descripción',
            type: 'textarea',
            required: true,
        },
        {
            name: 'mascot',
            label: 'Mascota',
            type: 'relationship',
            relationTo: 'mascots',
            required: true,
        },
        {
            name: 'bannerImage',
            label: 'Imagen de Banner',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'primaryColor',
            label: 'Color Primario',
            type: 'text',
            required: true,
            admin: {
                description: 'Código de color Hex (ej. #FF5733)',
            },
        },
    ],
};
