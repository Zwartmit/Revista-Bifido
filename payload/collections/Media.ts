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
        // beforeDelete: [
        //     async ({ req, id }) => {
        //         try {
        //             // Check Articles
        //             const articles = await req.payload.find({ collection: 'articles', where: { featuredImage: { equals: id } }, limit: 1 });
        //             if (articles.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen se usa en el artículo "${articles.docs[0].title}"`, 400);
        //
        //             // Check Characters
        //             const characters = await req.payload.find({ collection: 'characters', where: { or: [{ image: { equals: id } }, { model3d: { equals: id } }] }, limit: 1 });
        //             if (characters.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen/modelo se usa en el personaje "${characters.docs[0].name}"`, 400);
        //
        //             // Check Events
        //             const events = await req.payload.find({ collection: 'events', where: { or: [{ featuredImage: { equals: id } }, { 'gallery.image': { equals: id } }] }, limit: 1 });
        //             if (events.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen se usa en el evento "${events.docs[0].name}"`, 400);
        //
        //             // Check Products
        //             const products = await req.payload.find({ collection: 'products', where: { or: [{ featuredImage: { equals: id } }, { 'gallery.image': { equals: id } }] }, limit: 1 });
        //             if (products.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen se usa en el producto "${products.docs[0].name}"`, 400);
        //
        //             // Check Live Archive (Archivo Vivo)
        //             const liveArchives = await req.payload.find({ collection: 'live-archive', where: { or: [{ profileImage: { equals: id } }, { identifierImage: { equals: id } }, { model3d: { equals: id } }, { 'photos.image': { equals: id } }] }, limit: 1 });
        //             if (liveArchives.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen/modelo se usa en el Archivo Vivo "${liveArchives.docs[0].name}"`, 400);
        //
        //             // Check Sections
        //             const sections = await req.payload.find({ collection: 'sections', where: { bannerImage: { equals: id } }, limit: 1 });
        //             if (sections.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen se usa en la sección "${sections.docs[0].name}"`, 400);
        //
        //         } catch (err) {
        //             if (err instanceof APIError) throw err;
        //             req.payload.logger.error(err);
        //         }
        //     },
        // ],
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
        mimeTypes: [
            'image/*',
            'model/gltf-binary',
            'model/gltf+json',
        ],
    },
    fields: [],
};
