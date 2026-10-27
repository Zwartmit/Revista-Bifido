import type { Field } from 'payload';

export const flipCardFields: Field = {
    type: 'collapsible',
    label: 'Efecto 3D Flip (Volteo al pasar el cursor)',
    admin: {
        initCollapsed: true,
        description: 'Permite que la imagen gire en 3D al pasar el cursor (o pulsar en móvil) revelando texto u otra imagen al reverso.',
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
                description: 'Texto que se leerá cuando el lector pase el ratón sobre la imagen.',
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
