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
                const sections = await req.payload.find({
                    collection: 'sections',
                    where: { character: { equals: id } },
                    limit: 1,
                });
                if (sections.totalDocs > 0) {
                    throw new APIError(`No se puede eliminar: Este personaje está asignado a la sección "${sections.docs[0].name}"`, 400);
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
            label: 'Color Favorito',
            type: 'text',
        },
        {
            name: 'image',
            label: 'Imagen',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'colors',
            label: 'Colores',
            type: 'group',
            fields: [
                {
                    name: 'primary',
                    label: 'Primario',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'secondary',
                    label: 'Secundario',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'dark',
                    label: 'Oscuro',
                    type: 'text',
                    required: true,
                },
            ],
        },
        {
            name: 'position3D',
            label: 'Posición 3D',
            type: 'group',
            admin: {
                description: 'Posición 3D para escena interactiva',
            },
            fields: [
                {
                    name: 'x',
                    label: 'X',
                    type: 'number',
                    required: true,
                    defaultValue: 0,
                },
                {
                    name: 'y',
                    label: 'Y',
                    type: 'number',
                    required: true,
                    defaultValue: 0,
                },
                {
                    name: 'z',
                    label: 'Z',
                    type: 'number',
                    required: true,
                    defaultValue: 0,
                },
            ],
        },
    ],
};
