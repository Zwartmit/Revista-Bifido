import Script from 'next/script';
import { CONSENT_KEY } from '@/lib/analytics';

/**
 * Google Tag Manager (contenedor que gestiona Google Analytics 4) con Consent Mode v2.
 * - El ID se toma de NEXT_PUBLIC_GTM_ID (con el contenedor de Revista Bífido como valor por defecto).
 * - Solo se carga en producción, para no contaminar las estadísticas con visitas de desarrollo.
 * - Vive en el layout del sitio público, así que el panel /admin de Payload no se mide.
 * - Consent Mode: antes de cargar GTM todo el almacenamiento queda DENEGADO; si la persona ya había
 *   aceptado en una visita anterior, solo se reactiva la analítica. El banner (CookieConsent) actualiza el estado.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-M664QSXP';
const ENABLED = process.env.NODE_ENV === 'production' && Boolean(GTM_ID);

const consentBootstrap = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
try{if(localStorage.getItem('${CONSENT_KEY}')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`;

export function GtmScript() {
  if (!ENABLED) return null;
  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`${consentBootstrap}
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

export function GtmNoScript() {
  if (!ENABLED) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
