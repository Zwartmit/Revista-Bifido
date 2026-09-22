import type { CollectionConfig } from 'payload';

export const Articles: CollectionConfig = {
    slug: 'articles',
    labels: {
        singular: 'Artículo',
        plural: 'Artículos',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'author', 'publishedAt', 'status', 'featured'],
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role as string),
        update: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role as string),
        delete: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role as string),
    },
    fields: [
        {
            name: 'title',
            label: 'Título',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            required: true,
            unique: true,
            hooks: {
                beforeValidate: [
                    ({ data, value }) => {
                        // Si el slug está vacío y hay un título, generar el slug
                        if ((!value || value === '') && data?.title) {
                            return data.title
                                .normalize('NFD') // Quitar tildes
                                .replace(/[\u0300-\u036f]/g, '')
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales por guiones
                                .replace(/(^-|-$)+/g, ''); // Quitar guiones al principio o al final
                        }
                        // Si ya tiene valor, limpiarlo de todas formas
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
            admin: {
                description: 'Se genera automáticamente desde el título si lo dejas en blanco.',
            },
        },
        {
            name: 'excerpt',
            label: 'Extracto',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Descripción corta para previsualizaciones y redes sociales',
            },
        },
        {
            name: 'content',
            label: 'Contenido',
            type: 'richText',
            required: true,
        },
        {
            name: 'featuredImage',
            label: 'Imagen Destacada',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'author',
            label: 'Personaje',
            type: 'relationship',
            relationTo: 'characters',
            required: true,
            admin: {
                description: 'Personaje de Bífido que publica este artículo',
            },
        },
        {
            name: 'featured',
            label: 'Destacado',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                description: 'Mostrar este artículo en secciones destacadas de la página de inicio',
            },
        },
        {
            name: 'tags',
            label: 'Etiquetas',
            type: 'array',
            labels: {
                singular: 'Etiqueta',
                plural: 'Etiquetas',
            },
            fields: [
                {
                    name: 'tag',
                    label: 'Etiqueta',
                    type: 'text',
                },
            ],
        },
        {
            name: 'status',
            label: 'Estado',
            type: 'select',
            required: true,
            defaultValue: 'draft',
            options: [
                {
                    label: 'Borrador',
                    value: 'draft',
                },
                {
                    label: 'Publicado',
                    value: 'published',
                },
                {
                    label: 'Archivado',
                    value: 'archived',
                },
            ],
        },
        {
            name: 'publishedAt',
            label: 'Fecha de Publicación',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'seo',
            label: 'SEO',
            type: 'group',
            fields: [
                {
                    name: 'metaTitle',
                    label: 'Meta Título',
                    type: 'text',
                },
                {
                    name: 'metaDescription',
                    label: 'Meta Descripción',
                    type: 'textarea',
                },
                {
                    name: 'keywords',
                    label: 'Palabras Clave',
                    type: 'text',
                },
            ],
        },
    ],
};
