import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
    slug: 'categories',
    labels: {
        singular: 'Categoría',
        plural: 'Categorías',
    },
    admin: {
        useAsTitle: 'name',
        description: 'Categorías para clasificar los artículos (ej. Noticias, Entrevistas, Opinión).',
        hidden: true, // Ocultar del menú lateral (se gestionará desde Artículos)
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            label: 'Nombre de la Categoría',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            label: 'Slug (URL)',
            type: 'text',
            unique: true,
            index: true,
            admin: {
                hidden: true, // Ocultar completamente de la interfaz
            },
            hooks: {
                beforeValidate: [
                    ({ value, originalDoc, data }) => {
                        if (!value && data?.name) {
                            return data.name
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)+/g, '');
                        }
                        if (value && typeof value === 'string') {
                            return value
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)+/g, '');
                        }
                        return value;
                    },
                ],
            },
        },
    ],
};
