import { notFound } from 'next/navigation';

// Esta ruta ya no tiene propósito: los miembros del Archivo Vivo
// se abren como modal directamente desde el buscador global o desde /elparche.
export default async function ArchivoVivoPage() {
    notFound();
}
