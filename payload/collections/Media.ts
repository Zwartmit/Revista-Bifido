import type { CollectionConfig } from 'payload';
import { APIError } from 'payload';
import path from 'path';

export const Media: CollectionConfig = {
    slug: 'media',
    labels: {
        singular: 'Archivo',
        plural: 'Multimedia',
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role as string),
        update: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role as string),
        delete: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role as string),
    },
    hooks: {
        beforeDelete: [
            async ({ req, id }) => {
                try {
                    // Check Articles
                    const articles = await req.payload.find({
                        collection: 'articles',
                        where: { featuredImage: { equals: id } },
                        limit: 1,
                    });
                    if (articles.totalDocs > 0) {
                        throw new APIError(`No se puede eliminar: Esta imagen se usa en el artículo "${articles.docs[0].title}"`, 400);
                    }

                    // Check Characters
                    const characters = await req.payload.find({
                        collection: 'characters',
                        where: { image: { equals: id } },
                        limit: 1,
                    });
                    if (characters.totalDocs > 0) {
                        throw new APIError(`No se puede eliminar: Esta imagen es la charactera "${characters.docs[0].name}"`, 400);
                    }

                    // Check Events
                    const events = await req.payload.find({
                        collection: 'events',
                        where: { featuredImage: { equals: id } },
                        limit: 1,
                    });
                    if (events.totalDocs > 0) {
                        throw new APIError(`No se puede eliminar: Esta imagen es portada del evento "${events.docs[0].name}"`, 400);
                    }

                    // Check Products
                    const products = await req.payload.find({
                        collection: 'products',
                        where: { featuredImage: { equals: id } },
                        limit: 1,
                    });
                    if (products.totalDocs > 0) {
                        throw new APIError(`No se puede eliminar: Esta imagen es portada del producto "${products.docs[0].name}"`, 400);
                    }
                } catch (err) {
                    // Re-throw APIErrors directly
                    if (err instanceof APIError) throw err;
                    // Log other errors and allow delete (or block if critical)
                    req.payload.logger.error(err);
                }
            },
        ],
    },
    upload: {
        staticDir: path.resolve(process.cwd(), 'public/media'),
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                position: 'centre',
            },
            {
                name: 'card',
                width: 768,
                height: 1024,
                position: 'centre',
            },
            {
                name: 'tablet',
                width: 1024,
                height: undefined,
                position: 'centre',
            },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
    },
    fields: [],
};
