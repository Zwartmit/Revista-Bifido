import type { Field } from 'payload';

export const flipCardFields: Field = {
    type: 'collapsible',
    label: 'Efecto 3D Flip (Giro interactivo)',
    admin: {
        initCollapsed: true,
        description: 'Permite girar la tarjeta en 3D mediante el botón "Girar ↺" revelando texto o imagen al reverso, permitiendo además ampliar la imagen con la lupa.',
    },
    fields: [
        {
            name: 'enableFlip',
            label: 'Activar efecto voltear (3D Flip)',
            type: 'checkbox',
            defaultValue: false,
        },
        {
            name: 'flipContentType',
            label: '¿Qué mostrar al voltear?',
            type: 'radio',
            defaultValue: 'text',
            options: [
                { label: 'Texto (Cita, anécdota o descripción)', value: 'text' },
                { label: 'Otra imagen (Foto alternativa)', value: 'image' },
            ],
            admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enableFlip),
            },
        },
        {
            name: 'flipTitle',
            label: 'Título al reverso (opcional)',
            type: 'text',
            admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enableFlip && siblingData?.flipContentType === 'text'),
            },
        },
        {
            name: 'flipText',
            label: 'Texto del reverso',
            type: 'textarea',
            admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enableFlip && siblingData?.flipContentType === 'text'),
                description: 'Texto que se leerá al girar la tarjeta.',
            },
        },
        {
            name: 'flipImage',
            label: 'Segunda imagen (Reverso)',
            type: 'upload',
            relationTo: 'media',
            admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enableFlip && siblingData?.flipContentType === 'image'),
                description: 'Imagen alternativa que aparecerá al girar en 3D.',
            },
        },
        {
            name: 'flipImageCaption',
            label: 'Leyenda de la segunda imagen (opcional)',
            type: 'text',
            admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enableFlip && siblingData?.flipContentType === 'image'),
            },
        },
    ],
};
