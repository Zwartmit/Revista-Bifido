import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
    slug: 'users',
    labels: {
        singular: 'Usuario',
        plural: 'Usuarios',
    },
    auth: true,
    admin: {
        useAsTitle: 'email',
    },
    fields: [
        {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            required: true,
        },
        {
            name: 'role',
            label: 'Rol',
            type: 'select',
            required: true,
            defaultValue: 'editor',
            options: [
                {
                    label: 'Administrador',
                    value: 'admin',
                },
                {
                    label: 'Editor',
                    value: 'editor',
                },
                {
                    label: 'Autor',
                    value: 'author',
                },
            ],
        },
    ],
};
