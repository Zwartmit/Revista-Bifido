import { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contáctanos',
  description: '¿Tienes una historia que contar? Escríbenos o síguenos en redes: Revista Bífido está aquí para escuchar.',
  path: '/contactanos',
});

export default function ContactanosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
