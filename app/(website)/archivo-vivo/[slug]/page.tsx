import { redirect } from 'next/navigation';

export default function ArchivoVivoRedirect({ params }: { params: { slug: string } }) {
    // Redirigimos a la página de El Parche con el parámetro para abrir el modal automáticamente
    redirect(`/elparche?member=${params.slug}`);
}
