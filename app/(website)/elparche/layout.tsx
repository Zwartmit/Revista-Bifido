import { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'El Parche',
  description: 'Conoce a la manada de Bífido: cinco personajes, cinco voces y sus publicaciones.',
  path: '/elparche',
});

export default function ElParcheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
