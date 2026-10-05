import type { CollectionConfig } from 'payload';

export const EventModalities: CollectionConfig = {
    slug: 'event-modalities',
    labels: {
        singular: 'Modalidad de Evento',
        plural: 'Modalidades de Eventos',
    },
    admin: {
        useAsTitle: 'name',
        description: 'Modalidades para los eventos (ej. Presencial, Virtual, Híbrido).',
        hidden: true, // Ocultar del menú lateral
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            label: 'Nombre de la Modalidad',
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
                hidden: true,
            },
            hooks: {
                beforeValidate: [
                    ({ value, data }) => {
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
