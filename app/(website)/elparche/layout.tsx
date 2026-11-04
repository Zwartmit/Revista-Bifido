import { Metadata } from 'next';
import { pageMetadata, PARCHE_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'El Parche',
  description: 'Conoce a la manada de Bífido: cinco personajes, cinco voces y sus publicaciones. Y al Archivo Vivo: las personas detrás de la revista.',
  path: '/elparche',
  image: PARCHE_OG_IMAGE,
});

export default function ElParcheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
