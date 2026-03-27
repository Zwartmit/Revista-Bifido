import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mercado',
};

export default function MercadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
