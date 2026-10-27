import { getArticleBySlug, getArticleBySlugForPreview, getCharacterBySlug, getCharacterById } from '@/lib/api';
import ArticleClient from './ArticleClient';
import { notFound, redirect } from 'next/navigation';
import { draftMode } from 'next/headers';
import { Metadata } from 'next';
import nextDynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';

// Importación dinámica para no cargar el SDK de live preview en producción normal
const PreviewArticleClient = nextDynamic(() => import('./PreviewArticleClient'));

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: { params: Promise<{ slug: string; article: string }> }): Promise<Metadata> {
    const { slug, article } = await params;
    const articleData = await getArticleBySlug(article) || await getArticleBySlugForPreview(article);
    
    // If article doesn't exist, return fallback
    if (!articleData) {
        return { title: 'Artículo | Revista Bífido' };
    }

    return {
        title: articleData.title,
        description: articleData.socialExcerpt || articleData.excerpt,
        openGraph: {
            title: articleData.title,
            description: articleData.socialExcerpt || articleData.excerpt,
        }
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; article: string }> }) {
    const { slug, article } = await params;
    const { isEnabled: isPreview } = await draftMode();

    // En modo preview, obtener el artículo sin filtro de status para ver borradores
    const articleData = isPreview
        ? await getArticleBySlugForPreview(article)
        : await getArticleBySlug(article);

    let character = await getCharacterBySlug(slug);

    // Si slug no es el slug del personaje (ej. si vino un número o ID como "5"),
    // buscar por ID o por la sección del artículo y redirigir a la URL canónica con el nombre del personaje.
    if (!character) {
        const charById = await getCharacterById(slug);
        if (charById?.slug) {
            redirect(`/${charById.slug}/articulos/${article}`);
        }
        if (articleData?.section && articleData.section !== 'general' && articleData.section !== slug) {
            redirect(`/${articleData.section}/articulos/${article}`);
        }
    }

    // En modo normal, verificar que el artículo pertenece al personaje
    if (!articleData || !character) notFound();
    if (!isPreview && articleData.section !== slug && articleData.section !== 'general') {
        redirect(`/${articleData.section}/articulos/${article}`);
    }

    // Modo Live Preview: el iframe del admin actualiza el artículo en tiempo real
    if (isPreview) {
        return (
            <PreviewArticleClient
                initialArticle={articleData}
                character={character}
                serverURL={SERVER_URL}
            />
        );
    }

    return <ArticleClient article={articleData} character={character} />;
}
