import type { Metadata } from 'next';
import { Inter, Bebas_Neue, Anton, Outfit } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
// import BackToHome from '@/components/BackToHome';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-googlesans',
});

const jackInput = localFont({
  src: '../../app/fonts/JackInput.woff2',
  variable: '--font-jack',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Revista Bífido',
    default: 'Revista Bífido - Periodismo crudo para sensibilidades frágiles',
  },
  description: 'Revista digital, cultural, alternativa e independiente',
  keywords: ['periodismo', 'cultura', 'activismo', 'medio ambiente', 'diversidad', 'género'],
  icons: {
    icon: [
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon.ico' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${bebas.variable} ${jackInput.variable} ${anton.variable} ${outfit.variable}`}>
      <body className="bg-black text-white font-sans antialiased flex flex-col min-h-[100dvh]">
        <Header />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        {/* <BackToHome /> */}
      </body>
    </html>
  );
}
