/** Utilidades de analítica (Google Tag Manager / GA4 + Consent Mode v2). Todo es seguro en el servidor y sin GTM. */

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const CONSENT_KEY = 'bifido-consent-v1';
export const OPEN_CONSENT_EVENT = 'bifido:open-consent';

export type ConsentChoice = 'granted' | 'denied';

/** gtag() necesita recibir el objeto `arguments` (no un array) para que GTM lo interprete. */
export function gtag(..._args: unknown[]): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/** Registra un evento personalizado en el dataLayer (GA4 lo recoge desde GTM). */
export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function getStoredConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

/** Guarda la elección y actualiza Consent Mode. Solo la analítica puede activarse: nunca publicidad. */
export function setConsent(choice: ConsentChoice): void {
  try { window.localStorage.setItem(CONSENT_KEY, choice); } catch { /* sin almacenamiento */ }
  gtag('consent', 'update', {
    analytics_storage: choice,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}
