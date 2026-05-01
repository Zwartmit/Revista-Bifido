import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { es } from '@payloadcms/translations/languages/es';
// import { Logo } from './components/Logo';
// import { Icon } from './components/Icon';

// Collections
import { Articles } from './collections/Articles';
import { Sections } from './collections/Sections';
import { Characters } from './collections/Characters';
import { LiveArchive } from './collections/LiveArchive';
import { Events } from './collections/Events';
import { Products } from './collections/Products';
import { Media } from './collections/Media';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
        // components: {
        //     graphics: {
        //         Logo,
        //         Icon,
        //     },
        // },
    },
    i18n: {
        supportedLanguages: { es },
        fallbackLanguage: 'es',
    },
    collections: [
        Users,
        Articles,
        Sections,
        Characters,
        LiveArchive,
        Events,
        Products,
        Media,
    ],
    editor: lexicalEditor({}),
    secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URI || 'postgresql://postgres:admin@localhost:5432/revista-bifido',
        },
    }),
    sharp,
});
