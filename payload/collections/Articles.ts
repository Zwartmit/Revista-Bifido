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
            admin: {
                description: 'Versión amigable para URL del título',
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
