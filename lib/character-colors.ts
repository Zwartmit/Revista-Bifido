/**
 * Paleta de colores por personaje.
 * Centralizada aquí para no depender de la DB.
 * Los mismos valores están definidos como tokens en tailwind.config.ts.
 */
export const CHARACTER_COLORS: Record<string, { primary: string; secondary: string; dark: string }> = {
  malandra: { primary: '#f6daa3', secondary: '#ffeed0', dark: '#d6ba83' },
  incendia: { primary: '#FF9800', secondary: '#FFB74D', dark: '#F57C00' },
  mordaz: { primary: '#FF6B6B', secondary: '#FF8E8E', dark: '#D32F2F' },
  punkibri: { primary: '#4CAF50', secondary: '#81C784', dark: '#388E3C' },
  anika: { primary: '#a372b3', secondary: '#b88bc8', dark: '#8b5a9a' },
};

/** Helper para obtener los colores de un personaje por su slug */
export function getCharacterColors(slug: string) {
  return CHARACTER_COLORS[slug] ?? { primary: '#b8ff00', secondary: '#a8d900', dark: '#8ab800' };
}
