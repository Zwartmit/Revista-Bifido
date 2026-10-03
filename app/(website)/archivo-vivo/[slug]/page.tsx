import { redirect } from 'next/navigation';

export default async function ArchivoVivoRedirect({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Redirigimos a la página de El Parche con el parámetro para abrir el modal automáticamente
    redirect(`/elparche?member=${slug}`);
}
