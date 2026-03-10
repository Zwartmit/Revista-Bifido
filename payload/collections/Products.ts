import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
    slug: 'products',
    labels: {
        singular: 'Producto',
        plural: 'Productos',
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'price', 'category', 'available'],
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
            type: 'richText',
            required: true,
        },
        {
            name: 'price',
            label: 'Precio',
            type: 'number',
            required: true,
        },
        {
            name: 'currency',
            label: 'Moneda',
            type: 'text',
            defaultValue: 'COP',
        },
        {
            name: 'featuredImage',
            label: 'Imagen Destacada',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'gallery',
            label: 'Galería',
            type: 'array',
            fields: [
                {
                    name: 'image',
                    label: 'Imagen',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
        {
            name: 'category',
            label: 'Categoría',
            type: 'select',
            required: true,
            options: [
                {
                    label: 'Merchandising',
                    value: 'merchandising',
                },
                {
                    label: 'Arte',
                    value: 'art',
                },
                {
                    label: 'Publicaciones',
                    value: 'publications',
                },
                {
                    label: 'Música',
                    value: 'music',
                },
                {
                    label: 'Otro',
                    value: 'other',
                },
            ],
        },
        {
            name: 'stock',
            label: 'Inventario',
            type: 'group',
            fields: [
                {
                    name: 'available',
                    label: 'Disponible',
                    type: 'checkbox',
                    defaultValue: true,
                },
                {
                    name: 'quantity',
                    label: 'Cantidad',
                    type: 'number',
                    admin: {
                        description: 'Dejar vacío para inventario ilimitado',
                    },
                },
            ],
        },
        {
            name: 'seller',
            label: 'Vendedor',
            type: 'group',
            fields: [
                {
                    name: 'name',
                    label: 'Nombre',
                    type: 'text',
                },
                {
                    name: 'contact',
                    label: 'Contacto',
                    type: 'text',
                },
            ],
        },
        {
            name: 'purchaseLink',
            label: 'Enlace de Compra',
            type: 'text',
            admin: {
                description: 'Enlace para comprar o contactar al vendedor',
            },
        },
        {
            name: 'tags',
            label: 'Etiquetas',
            type: 'array',
            fields: [
                {
                    name: 'tag',
                    label: 'Etiqueta',
                    type: 'text',
                },
            ],
        },
    ],
};
