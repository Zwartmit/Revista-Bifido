import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import BackToHome from '@/components/BackToHome';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'Revista Bífido - Periodismo crudo para sensibilidades frágiles',
  description: 'Revista digital, cultural, alternativa e independiente',
  keywords: ['periodismo', 'cultura', 'activismo', 'medio ambiente', 'diversidad', 'género'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${bebas.variable}`}>
      <body className="bg-bifido-black text-white font-sans antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <BackToHome />
      </body>
    </html>
  );
}
