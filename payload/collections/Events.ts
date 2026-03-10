import type { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
    slug: 'events',
    labels: {
        singular: 'Evento',
        plural: 'Eventos',
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'date', 'location', 'status'],
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
            name: 'shortDescription',
            label: 'Descripción Corta',
            type: 'textarea',
            required: false,
            admin: {
                description: 'Resumen para la tarjeta del evento',
            },
        },
        {
            name: 'description',
            label: 'Descripción Completa',
            type: 'textarea',
            required: true,
        },
        {
            name: 'date',
            label: 'Fecha',
            type: 'date',
            required: true,
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },

        {
            name: 'location',
            label: 'Ubicación',
            type: 'group',
            fields: [
                {
                    name: 'type',
                    label: 'Tipo',
                    type: 'select',
                    required: true,
                    options: [
                        {
                            label: 'Físico',
                            value: 'physical',
                        },
                        {
                            label: 'Virtual',
                            value: 'virtual',
                        },
                        {
                            label: 'Híbrido',
                            value: 'hybrid',
                        },
                    ],
                },
                {
                    name: 'address',
                    label: 'Dirección',
                    type: 'text',
                },
                {
                    name: 'city',
                    label: 'Ciudad',
                    type: 'text',
                },
                {
                    name: 'virtualLink',
                    label: 'Enlace Virtual',
                    type: 'text',
                },
            ],
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
            name: 'price',
            label: 'Precio',
            type: 'group',
            fields: [
                {
                    name: 'isFree',
                    label: 'Es Gratis',
                    type: 'checkbox',
                    defaultValue: true,
                },
                {
                    name: 'amount',
                    label: 'Monto',
                    type: 'number',
                },
                {
                    name: 'currency',
                    label: 'Moneda',
                    type: 'text',
                    defaultValue: 'COP',
                },
            ],
        },
        {
            name: 'ticketLink',
            label: 'Enlace de Entradas',
            type: 'text',
            admin: {
                description: 'Enlace para comprar entradas o registrarse',
            },
        },
        {
            name: 'organizer',
            label: 'Organizador',
            type: 'text',
        },
        {
            name: 'category',
            label: 'Categoría',
            type: 'select',
            options: [
                {
                    label: 'Concierto',
                    value: 'concert',
                },
                {
                    label: 'Taller',
                    value: 'workshop',
                },
                {
                    label: 'Charla',
                    value: 'talk',
                },
                {
                    label: 'Festival',
                    value: 'festival',
                },
                {
                    label: 'Exposición',
                    value: 'exhibition',
                },
                {
                    label: 'Otro',
                    value: 'other',
                },
            ],
        },
        {
            name: 'status',
            label: 'Estado',
            type: 'select',
            required: true,
            defaultValue: 'upcoming',
            options: [
                {
                    label: 'Próximo',
                    value: 'upcoming',
                },
                {
                    label: 'En Curso',
                    value: 'ongoing',
                },
                {
                    label: 'Finalizado',
                    value: 'finished',
                },
                {
                    label: 'Cancelado',
                    value: 'cancelled',
                },
            ],
        },
    ],
};
