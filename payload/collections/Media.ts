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
                    // En operaciones de borrado masivo, el id puede llegar como string. 
                    // Lo convertimos a número para evitar que la base de datos falle al comparar.
                    const docId = typeof id === 'string' ? parseInt(id, 10) : id;
                    if (isNaN(docId as number)) return;

                    // Check Articles
                    const articles = await req.payload.find({ collection: 'articles', where: { featuredImage: { equals: docId } }, limit: 1 });
                    if (articles.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen se usa en el artículo "${articles.docs[0].title}"`, 400);

                    // Check Characters
                    const characters = await req.payload.find({ collection: 'characters', where: { or: [{ image: { equals: docId } }, { model3d: { equals: docId } }] }, limit: 1 });
                    if (characters.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen/modelo se usa en el personaje "${characters.docs[0].name}"`, 400);

                    // Check Events
                    const events = await req.payload.find({ collection: 'events', where: { or: [{ featuredImage: { equals: docId } }, { 'gallery.image': { equals: docId } }] }, limit: 1 });
                    if (events.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen se usa en el evento "${events.docs[0].name}"`, 400);

                    // Check Products
                    const products = await req.payload.find({ collection: 'products', where: { or: [{ featuredImage: { equals: docId } }, { 'gallery.image': { equals: docId } }] }, limit: 1 });
                    if (products.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen se usa en el producto "${products.docs[0].name}"`, 400);

                    // Check Live Archive (Archivo Vivo)
                    const liveArchives = await req.payload.find({ collection: 'live-archive', where: { or: [{ profileImage: { equals: docId } }, { identifierImage: { equals: docId } }, { model3d: { equals: docId } }, { 'photos.image': { equals: docId } }] }, limit: 1 });
                    if (liveArchives.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen/modelo se usa en el Archivo Vivo "${liveArchives.docs[0].name}"`, 400);

                    // Check Sections
                    const sections = await req.payload.find({ collection: 'sections', where: { bannerImage: { equals: docId } }, limit: 1 });
                    if (sections.totalDocs > 0) throw new APIError(`No se puede eliminar: Esta imagen se usa en la sección "${sections.docs[0].name}"`, 400);

                } catch (err) {
                    // Solo lanzamos el error si es nuestro propio APIError de validación (400)
                    if (err instanceof APIError && err.status === 400) {
                        throw err;
                    }
                    // Si es un error interno de la DB, lo ignoramos para no bloquear el borrado masivo
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
        mimeTypes: [
            'image/*',
            'model/gltf-binary',
            'model/gltf+json',
        ],
    },
    fields: [],
};
