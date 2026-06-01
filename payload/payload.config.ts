import { buildConfig } from 'payload';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { es } from '@payloadcms/translations/languages/es';
// import { Logo } from './components/Logo';
// import { Icon } from './components/Icon';

// Collections
import { Articles } from './collections/Articles';

import { Characters } from './collections/Characters';
import { LiveArchive } from './collections/LiveArchive';
import { Events } from './collections/Events';
import { Products } from './collections/Products';
import { Media } from './collections/Media';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const plugins = [];

plugins.push(
    s3Storage({
        enabled: !!process.env.S3_ENDPOINT,
        collections: {
            media: {
                generateFileURL: ({ filename, prefix }) => {
                    return `${process.env.S3_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`;
                },
            },
        },
        bucket: process.env.S3_BUCKET as string || '',
        config: {
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID as string || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string || '',
            },
            region: process.env.S3_REGION || 'auto',
            endpoint: process.env.S3_ENDPOINT as string || '',
        },
    })
);

export default buildConfig({
    admin: {
        user: Users.slug,
        meta: {
            titleSuffix: '| Revista Bífido',
            icons: [
                {
                    rel: 'icon',
                    type: 'image/png',
                    url: '/favicon/favicon-96x96.png',
                },
                {
                    rel: 'icon',
                    type: 'image/svg+xml',
                    url: '/favicon/favicon.svg',
                },
                {
                    rel: 'apple-touch-icon',
                    url: '/favicon/apple-touch-icon.png',
                },
            ],
        },
        components: {
            graphics: {
                Logo: {
                    path: '@/payload/components/Logo#Logo',
                },
                Icon: {
                    path: '@/payload/components/Icon#Icon',
                },
            },
            logout: {
                Button: {
                    path: '@/payload/components/LogoutButton#LogoutButton',
                },
            },
            providers: [
                '@/payload/components/PasswordToggleProvider#PasswordToggleProvider',
            ],
        },
    },
    i18n: {
        supportedLanguages: { es },
        fallbackLanguage: 'es',
    },
    collections: [
        Users,
        Articles,
        Characters,
        LiveArchive,
        Events,
        Products,
        Media,
    ],
    plugins,
    editor: lexicalEditor({}),
    secret: process.env.PAYLOAD_SECRET as string,
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URI || 'postgresql://postgres:admin@localhost:5432/revista-bifido',
        },
    }),
    sharp,
    ...(process.env.SMTP_USER
        ? {
              email: nodemailerAdapter({
                  defaultFromAddress: process.env.SMTP_USER,
                  defaultFromName: 'Revista Bífido',
                  transportOptions: {
                      host: 'smtp.gmail.com',
                      port: 587,
                      auth: {
                          user: process.env.SMTP_USER,
                          pass: process.env.SMTP_PASS,
                      },
                  },
              }),
          }
        : {}),
});
