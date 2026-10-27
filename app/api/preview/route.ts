import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Ruta de activación del modo preview de Next.js.
 * 
 * Es llamada por el panel admin de Payload cuando se abre el Live Preview.
 * Activa el Draft Mode de Next.js y redirige a la URL del artículo.
 * 
 * Uso desde Payload: /api/preview?url=/incendia/articulos/mi-articulo&secret=PREVIEW_SECRET
 */
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const secret = searchParams.get('secret');
    const url = searchParams.get('url');

    const expectedSecret = process.env.PAYLOAD_PREVIEW_SECRET || process.env.PAYLOAD_SECRET || '';

    // Verificar el secret para evitar acceso no autorizado
    if (secret !== expectedSecret) {
        return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }

    if (!url) {
        return NextResponse.json({ message: 'URL requerida' }, { status: 400 });
    }

    // Activar el Draft Mode de Next.js — esto hace que draftMode().isEnabled sea true
    const draft = await draftMode();
    draft.enable();

    // Redirigir a la URL del artículo (con Draft Mode activo el page.tsx usará PreviewArticleClient)
    redirect(url);
}

/**
 * Ruta para desactivar el modo preview.
 */
export async function DELETE(req: NextRequest) {
    const draft = await draftMode();
    draft.disable();
    return NextResponse.json({ message: 'Preview desactivado' });
}
