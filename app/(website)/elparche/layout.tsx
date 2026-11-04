import { Metadata } from 'next';
import { pageMetadata, ogCard } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'El Parche',
  description: 'Conoce a la manada de Bífido: cinco personajes, cinco voces y sus publicaciones. Y al Archivo Vivo: las personas detrás de la revista.',
  path: '/elparche',
  image: ogCard('parche', undefined, 'Cinco voces. Una manada. Y el Archivo Vivo: las personas detrás de Revista Bífido.'),
});

export default function ElParcheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
