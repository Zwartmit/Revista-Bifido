/**
 * Paleta de colores por personaje.
 * Centralizada aquí para no depender de la DB.
 * Los mismos valores están definidos como tokens en tailwind.config.ts.
 */
export const CHARACTER_COLORS: Record<string, { primary: string; secondary: string; dark: string }> = {
  malandra: { primary: '#9333ea', secondary: '#84cc16', dark: '#6b21a8' }, // Purple & Lime
  incendia: { primary: '#f97316', secondary: '#a855f7', dark: '#c2410c' }, // Orange & Purple
  mordaz: { primary: '#ef4444', secondary: '#eab308', dark: '#991b1b' }, // Red & Gold
  punkibri: { primary: '#22c55e', secondary: '#eab308', dark: '#166534' }, // Green & Yellow
  anika: { primary: '#00A89E', secondary: '#a855f7', dark: '#007a73' }, // Teal & Purple
};

/** Helper para obtener los colores de un personaje por su slug */
export function getCharacterColors(slug: string) {
  return CHARACTER_COLORS[slug] ?? { primary: '#b8ff00', secondary: '#a8d900', dark: '#8ab800' };
}
