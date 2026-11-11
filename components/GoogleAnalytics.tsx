import Script from 'next/script';
import { CONSENT_KEY } from '@/lib/analytics';

/**
 * Google Analytics 4 directo (gtag.js) con Consent Mode v2.
 * - El ID de medición sale de NEXT_PUBLIC_GA_ID (por defecto, el de Revista Bífido).
 * - Solo se carga en producción, para no contaminar las estadísticas con visitas de desarrollo.
 * - Vive en el layout del sitio público, así que el panel /admin de Payload no se mide.
 * - Consent Mode: antes de cargar gtag.js todo el almacenamiento queda DENEGADO; si la persona ya había
 *   aceptado en una visita anterior solo se reactiva la analítica. El banner (CookieConsent) actualiza el estado.
 * - Los eventos personalizados se envían con track() de lib/analytics.ts (gtag('event', ...)).
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-4P7WPVYVF0';
const ENABLED = process.env.NODE_ENV === 'production' && Boolean(GA_ID);

export default function GoogleAnalytics() {
  if (!ENABLED) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
try{if(localStorage.getItem('${CONSENT_KEY}')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}
gtag('js',new Date());
gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
