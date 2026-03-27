import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contáctanos',
};

export default function ContactanosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
