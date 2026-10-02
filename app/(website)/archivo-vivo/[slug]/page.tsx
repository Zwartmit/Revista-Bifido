import { redirect } from 'next/navigation';

export default function ArchivoVivoRedirect() {
    // Redirigimos a la página de El Parche, donde vive el Archivo Vivo
    redirect('/elparche');
}
