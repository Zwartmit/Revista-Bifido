import type { Metadata } from 'next';
import { Bebas_Neue, Anton, Outfit } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import './character-landings.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import JsonLd from '@/components/JsonLd';
import { GtmScript, GtmNoScript } from '@/components/GoogleTagManager';
import CookieConsent from '@/components/CookieConsent';
import AnalyticsEvents from '@/components/AnalyticsEvents';
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SOCIAL_PROFILES, DEFAULT_OG_IMAGE } from '@/lib/seo';
// import BackToHome from '@/components/BackToHome';

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
  // Sin metadataBase Next resolvía las imágenes sociales contra el dominio *.vercel.app (404)
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} - ${SITE_TAGLINE}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['periodismo', 'cultura', 'activismo', 'medio ambiente', 'diversidad', 'género'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    locale: 'es_CO',
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
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
    <html lang="es" suppressHydrationWarning className={`${bebas.variable} ${jackInput.variable} ${anton.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning className="bg-black text-white font-sans antialiased flex flex-col min-h-[100dvh]">
        <GtmNoScript />
        <GtmScript />
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/favicon/apple-touch-icon.png`, sameAs: SOCIAL_PROFILES },
            { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, description: SITE_DESCRIPTION, inLanguage: 'es', publisher: { '@id': `${SITE_URL}/#organization` } },
          ],
        }} />
        <Header />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <CookieConsent />
        <AnalyticsEvents />
        {/* <BackToHome /> */}
      </body>
    </html>
  );
}
