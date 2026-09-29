import type { Block } from 'payload';
import { lexicalEditor, BoldFeature, ItalicFeature, UnderlineFeature, StrikethroughFeature, SubscriptFeature, SuperscriptFeature, InlineCodeFeature, LinkFeature, OrderedListFeature, UnorderedListFeature, ChecklistFeature, HeadingFeature, BlockquoteFeature, ParagraphFeature, UploadFeature, HorizontalRuleFeature, IndentFeature } from '@payloadcms/richtext-lexical';

export const RichTextBlock: Block = {
    slug: 'richTextBlock',
    labels: {
        singular: 'Texto Enriquecido',
        plural: 'Bloques de Texto',
    },
    fields: [
        {
            name: 'content',
            label: 'Contenido',
            type: 'richText',
            required: true,
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                    ...defaultFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
                    ParagraphFeature(),
                    BoldFeature(),
                    ItalicFeature(),
                    UnderlineFeature(),
                    StrikethroughFeature(),
                    SubscriptFeature(),
                    SuperscriptFeature(),
                    InlineCodeFeature(),
                    IndentFeature(),
                    OrderedListFeature(),
                    UnorderedListFeature(),
                    ChecklistFeature(),
                    BlockquoteFeature(),
                    HorizontalRuleFeature(),
                    LinkFeature({ enabledCollections: ['media'] }),
                    UploadFeature({
                        collections: {
                            media: {
                                fields: [
                                    {
                                        name: 'caption',
                                        label: 'Leyenda',
                                        type: 'text',
                                    },
                                    {
                                        name: 'alignment',
                                        label: 'Alineación',
                                        type: 'select',
                                        defaultValue: 'center',
                                        options: [
                                            { label: 'Izquierda', value: 'left' },
                                            { label: 'Centro', value: 'center' },
                                            { label: 'Derecha', value: 'right' },
                                        ],
                                    },
                                ],
                            },
                        },
                    }),
                ],
            }),
        },
    ],
};
