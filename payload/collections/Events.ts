import type { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
    slug: 'events',
    labels: {
        singular: 'Evento',
        plural: 'Eventos',
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'date', 'category', 'locationType'],
    },
    hooks: {
        // Se removió el hook afterChange porque ahora usamos validate para prevenir el guardado y mostrar el aviso
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'row',
            fields: [
                {
                    name: 'name',
                    label: 'Nombre',
                    type: 'text',
                    required: true,
                    admin: { width: '100%' },
                },
            ]
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'category',
                    label: 'Categoría',
                    type: 'select',
                    required: true,
                    admin: { width: '50%' },
                    options: [
                        { label: 'Concierto', value: 'concert' },
                        { label: 'Taller', value: 'workshop' },
                        { label: 'Charla', value: 'talk' },
                        { label: 'Festival', value: 'festival' },
                        { label: 'Exposición', value: 'exhibition' },
                        { label: 'Otro', value: 'other' },
                    ],
                },
                {
                    name: 'otherCategoryName',
                    label: 'Nombre de la categoría personalizada',
                    type: 'text',
                    admin: {
                        width: '50%',
                        condition: (_, siblingData) => siblingData?.category === 'other',
                    },
                    validate: (value, { siblingData }) => {
                        if (siblingData?.category === 'other' && !value) {
                            return 'Por favor ingresa el nombre de la categoría.';
                        }
                        return true;
                    },
                },
            ],
        },
        {
            name: 'isFeatured',
            label: '¿Destacar este evento?',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Solo puede haber un evento destacado a la vez.',
            },
            validate: async (value, { req, id }) => {
                if (value && req && req.payload) {
                    const featuredEvents = await req.payload.find({
                        collection: 'events',
                        where: {
                            isFeatured: { equals: true },
                            ...(id ? { id: { not_equals: id } } : {}),
                        },
                        limit: 1,
                    });

                    if (featuredEvents.docs.length > 0) {
                        return `Recuerda que ya tienes destacado "${featuredEvents.docs[0].name}".`;
                    }
                }
                return true;
            },
        },
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            unique: true,
            admin: {
                position: 'sidebar',
                readOnly: true,
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
                                .replace(/[^a-z0-9 -]/g, '')
                                .replace(/\s+/g, '-')
                                .replace(/-+/g, '-');
                        }
                        return value;
                    }
                ]
            }
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'date',
                    label: 'Fecha y hora',
                    type: 'date',
                    required: true,
                    admin: {
                        date: {
                            pickerAppearance: 'dayAndTime',
                        },
                        width: '50%',
                    },
                },
                {
                    name: 'locationType',
                    label: 'Tipo de ubicación',
                    type: 'select',
                    required: true,
                    admin: { width: '50%' },
                    options: [
                        { label: 'Presencial', value: 'physical' },
                        { label: 'Virtual', value: 'virtual' },
                        { label: 'Híbrido', value: 'hybrid' },
                    ],
                },
            ],
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'address',
                    label: 'Dirección',
                    type: 'text',
                    admin: {
                        width: '50%',
                        condition: (_, siblingData) => siblingData?.locationType === 'physical' || siblingData?.locationType === 'hybrid',
                    },
                    validate: (value, { siblingData }) => {
                        if ((siblingData?.locationType === 'physical' || siblingData?.locationType === 'hybrid') && !value) {
                            return 'La dirección es obligatoria.';
                        }
                        return true;
                    },
                },
                {
                    name: 'city',
                    label: 'Ciudad',
                    type: 'text',
                    admin: {
                        width: '50%',
                        condition: (_, siblingData) => siblingData?.locationType === 'physical' || siblingData?.locationType === 'hybrid',
                    },
                    validate: (value, { siblingData }) => {
                        if ((siblingData?.locationType === 'physical' || siblingData?.locationType === 'hybrid') && !value) {
                            return 'La ciudad es obligatoria.';
                        }
                        return true;
                    },
                },
            ],
        },
        {
            name: 'virtualLink',
            label: 'Link de transmisión',
            type: 'text',
            admin: {
                condition: (_, siblingData) => siblingData?.locationType === 'virtual' || siblingData?.locationType === 'hybrid',
            },
            validate: (value, { siblingData }) => {
                if ((siblingData?.locationType === 'virtual' || siblingData?.locationType === 'hybrid') && !value) {
                    return 'El link de transmisión es obligatorio.';
                }
                return true;
            },
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'ticketLink',
                    label: 'Link de registro/compra',
                    type: 'text',
                    required: true,
                    admin: { width: '50%' },
                },
                {
                    name: 'isFree',
                    label: '¿Es gratis?',
                    type: 'checkbox',
                    defaultValue: true,
                    admin: { width: '50%' },
                },
            ],
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'priceAmount',
                    label: 'Valor',
                    type: 'number',
                    admin: {
                        width: '100%',
                        condition: (_, siblingData) => !siblingData?.isFree,
                    },
                    validate: (value, { siblingData }) => {
                        if (!siblingData?.isFree && (value === null || value === undefined)) {
                            return 'El valor es obligatorio si no es gratis.';
                        }
                        return true;
                    },
                },
            ],
        },
        {
            name: 'featuredImage',
            label: 'Imagen destacada',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'description',
            label: 'Descripción',
            type: 'textarea',
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

    ],
};
