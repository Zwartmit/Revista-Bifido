'use client';

import { useLivePreview } from '@payloadcms/live-preview-react';
import ArticleClient from './ArticleClient';
import { transformPayloadArticle } from '@/lib/api';

interface PreviewArticleClientProps {
    initialArticle: any;
    character: any;
    serverURL: string;
}

/**
 * Componente de Live Preview para artículos.
 * 
 * Usa el hook `useLivePreview` de Payload, que escucha los mensajes
 * postMessage enviados por el panel admin mientras se edita el artículo.
 * Los datos del formulario se transforman igual que en la API REST,
 * para que el render sea idéntico al artículo publicado.
 */
export default function PreviewArticleClient({ initialArticle, character, serverURL }: PreviewArticleClientProps) {
    const { data } = useLivePreview({
        initialData: initialArticle,
        serverURL,
        depth: 2,
    });

    // Transformar los datos crudos de Payload al formato que espera ArticleClient
    const article = data ? transformPayloadArticle(data) : initialArticle;

    return <ArticleClient article={article} character={character} />;
}
